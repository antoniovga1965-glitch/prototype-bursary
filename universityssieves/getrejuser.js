const express = require('express');
const prisma = require('../prisma/client');
const router = express.Router();
const adminjwt = require('../adminmiddleware');
const verifyjwt = require('../middleware');


router.get('/registeredusers', verifyjwt, adminjwt, async (req, res) => {
    try {
        const response = await prisma.registered_users.findMany({
            orderBy: { created_at: 'desc' },
        })
        return res.status(200).json({ message: response });
    } catch (error) {
        return res.status(500).json({ message: 'SOMETHING WENT WRONG' });

    }
})


router.get('/totalusers', verifyjwt, adminjwt, async (req, res) => {
    try {
        const total = await prisma.secondary_applications.count();
        const results = total;
        return res.status(200).json({ message: results });

    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }
})


router.get('/pending', verifyjwt, adminjwt, async (req, res) => {
    try {
        const total = await prisma.secondary_applications.count({
            where: { status: 'pending' }
        });
        const results = total;
        return res.status(200).json({ message: results });

    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }


})


router.get('/universityrejected', verifyjwt, adminjwt, async (req, res) => {
    try {
        const total = await prisma.secondary_applications.count({
            where: { status: 'rejected' }
        });
        const results = total;
        return res.status(200).json({ message: results });

    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }
})

router.get('/rejected', verifyjwt, adminjwt, async (req, res) => {
    try {
        const total = await prisma.university_applications.count({
            where: { status: 'rejected' }
        });
        const results = total;
        return res.status(200).json({ message: results });

    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }
})
router.post('/setbudget', verifyjwt, adminjwt, async (req, res) => {
    const { SETBUDGET, BUDGETEDCOUNTY, YEARFINANCIAL } = req.body;
    try {
        const setbudget = await prisma.budget.create({
            data: {
                SETBUDGET: SETBUDGET,
                BUDGETEDCOUNTY: BUDGETEDCOUNTY,
                YEARFINANCIAL: YEARFINANCIAL,

            },
        });
        return res.status(200).json({ message: `Honourable you have succesfully set ${SETBUDGET} for ${BUDGETEDCOUNTY} for financial year ${YEARFINANCIAL}` })

    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'something went wrong try again' })

    }
})


router.get('/logoutadmin', verifyjwt, adminjwt, (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            sameSite: "lax",
            secure: true,
        })
        return res.status(200).json({ message: 'youve been logged out succesfully' })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Something went wrong try again' })
    }
})


router.get('/universitytable', verifyjwt, adminjwt, async (req, res) => {
    try {
        const response = await prisma.university_applications.findMany();
        return res.status(200).json({ message: response });
    } catch (error) {
        return res.status(500).json({ message: 'something went wrong try again' });
    }
})

router.get('/secondarydiplay', verifyjwt, adminjwt, async (req, res) => {
    try {
        const response = await prisma.secondary_applications.findMany();
        return res.status(200).json({ message: response });
    } catch (error) {
        return res.status(500).json({ message: 'something went wrong try again' });
    }
});


router.get('/genderchart', verifyjwt, adminjwt, async (req, res) => {
    try {
        const genderchart = await prisma.secondary_applications.findMany();
        let male = 0;
        let female = 0;

        genderchart.forEach(applicant => {
            const ocr = JSON.parse(applicant.ocr_data || {});
            const sex = ocr.sec_birthcertfile?.sex?.toLowerCase();
            if (sex === 'male') {
                male++
            } else if (sex === 'female') {
                female++
            }
        })

        return res.status(200).json({ male, female });

    } catch (error) {

        return res.status(500).json({ message: "Something went wrong" });
    }
})




router.get('/status', verifyjwt, adminjwt, async (req, res) => {
    try {
        const status = await prisma.secondary_applications.findMany();
        let manual_review = 0;
        let approved = 0;
        let rejected = 0;

        status.forEach(applicant => {
            if (applicant.status === 'manual_review') {
                manual_review++;
            }
            else if (applicant.status === "approved") {
                approved++;
            }
            else if (applicant.status === 'rejected') {
                rejected++;
            }
        })

        return res.status(200).json({ manual_review, approved, rejected });

    } catch (error) {

        return res.status(500).json({ message: "Something went wrong" });
    }
})



  router.get('/fraudgraph', verifyjwt, adminjwt, async (req, res) => {
    try {
        const status = await prisma.secondary_applications.findMany();

        let name_mismatch = 0;
        let admission_mismatch = 0;
        let school_changed = 0

        status.forEach(applicant => {
            const flags = JSON.parse(applicant.flags || '[]');

            flags.forEach(flag => {
                const reason = flag.reason?.toLowerCase() || '';

                if (reason.includes('name mismatch')) name_mismatch++;
                if (reason.includes('admission number')) admission_mismatch++;
                if (reason.includes('school changed')) school_changed++;

            })
            
        })
        return res.status(200).json({name_mismatch,admission_mismatch,school_changed});
    } catch (error) {
        return res.status(500).json({message:'something went wrong'});
    }
})
    
router.get('/overtime', verifyjwt, adminjwt, async (req, res) => {
    const apps = await prisma.secondary_applications.findMany({
        orderBy: { created_at: 'asc' }
    });

    const monthly = {};
    apps.forEach(app => {
        const month = new Date(app.created_at)
            .toLocaleString('default', { month: 'short', year: 'numeric' });
        monthly[month] = (monthly[month] || 0) + 1;
    });

    return res.status(200).json({
        labels: Object.keys(monthly),
        data: Object.values(monthly)
    });
});

router.get('/searchuni', verifyjwt, adminjwt, async (req, res) => {
    try {
        const query = req.query.s;
        const results = await prisma.university_applications.findMany({
            where: {
                OR: [
                    { uni_fullname: { contains: query, mode: 'insensitive' } },
                    { uni_institution: { contains: query, mode: 'insensitive' } },
                    { uni_regnumber: { contains: query, mode: 'insensitive' } },
                ]
            }
        });
        return res.status(200).json({ message: results });
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }
});

module.exports = router;