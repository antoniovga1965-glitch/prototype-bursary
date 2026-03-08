const express = require('express');
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const router = express.Router();
const z = require('zod');
const limit = require('express-rate-limit');
const prisma = require('../prisma/client');
const verifyjwt = require('../middleware');



const registerSchemas = z.object({
    REGISTERNAME: z.string().min(1, 'Fill in the fields with your names'),
    REGISTEREMAIL: z.string().email('fill the email field with proper email format'),
    PHONENO: z.string().min(9, 'Enter your phone number'),
    REGPASS1: z.string().regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, 'min of 8 characters one uppercase ,one lowercase and one number')
})


const regschemas = (req, res, next) => {
    const results = registerSchemas.safeParse(req.body);
    if (!results.success) {
        return res.status(422).json({ message: 'Please fill the fields with correct inputs' })
    }
    next();
}

const registorlimitor = limit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: { message: 'Too many login attempts try again later' }
})

router.post('/register',verifyjwt,registorlimitor, regschemas, async (req, res) => {
    const { REGISTERNAME, REGISTEREMAIL, PHONENO, REGPASS1 } = req.body;
    try {

        const existinguser = await prisma.registered_users.findUnique({
            where: { REGISTEREMAIL: REGISTEREMAIL },
        })

        if (existinguser) {
            return res.status(201).json({ message: 'user already exist' })
        }

        const hashedpassword = await bcrypt.hash(REGPASS1, 12)

        const savetodb = await prisma.registered_users.create({
            data: {
                REGISTERNAME: REGISTERNAME,
                REGISTEREMAIL: REGISTEREMAIL,
                PHONENO: PHONENO,
                REGPASS1: hashedpassword,
            }
        })
        return res.status(201).json({ message: `Dear${REGISTERNAME} you have been succesfuly registered in smart bursary sytem` });

    } catch (error) {
        console.error(error);

        return res.status(500).json({ message: `something went wrong check and try again` });

    }
})
module.exports = router;