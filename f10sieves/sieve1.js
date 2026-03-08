const express = require('express');
const multer = require('multer');
const router = express.Router();
const jwt = require('jsonwebtoken');
const prisma = require('../prisma/client');
const z = require('zod');
const limit = require('express-rate-limit');
const verifyjwt = require('../middleware');
const crypto = require('crypto');
const templatevalidation = require('./sieve4');

const logiccheck = require('../logins/sieve5');
const multiyear = require('./sieve6');
const googlegemini = require('./sieve3')

const secondaryschemas = z.object({
    sec_fullname: z.string().min(1, 'Fill in with your full name'),
    sec_dob: z.string().regex(/^(200[5-9]|201[0-9]|202[0-9])-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/, 'Date of birth must start from 2005'),
    sec_birthcert: z.string().regex(/^[A-Z]\d{10}$/, 'Please enter correct entry number'),
    personalemail: z.string().email('Fill in with valid email address'),
    sec_phone: z.string().min(9, 'Enter your correct phone number'),
    sec_schoolname: z.string().min(1, 'Enter your school name'),
    sec_email: z.string().email('enter your secondary school email'),
    sec_admno: z.string().regex(/^\d{4,6}$/, 'Enter the correct admission format'),
    sec_form: z.enum(['Form 1', 'Form 2', 'Form 3', 'Form 4'], {
        message: 'Please select your form'
    }),
    sec_grade:z.enum(['A', 'B', 'C', 'D'], {
        message: 'Please select your grade'
    }),
    sec_guardian: z.string().min(1, 'fill in your guardians name'),
    sec_county: z.string().min(1, 'Enter your county'),
    sec_subcounty: z.string().min(1, 'Enter your subcounty'),
    sec_declaration: z.string().refine(val => val === 'true', { message: 'You must accept the declaration' })
})

const limitapplication = limit({
    windowMs: 30 * 60 * 1000,
    max: 1000,
    message: { message: 'Too many application coming from this Ip...try again later' },
});


const verifysecschemas = (req, res, next) => {
    const results = secondaryschemas.safeParse(req.body);
    if (!results.success) {
        return res.status(422).json({ message: 'Failed to validate your input fields...Recheck and try again' });
    }
    next();
}



const Documents = [
    { name: "sec_birthcertfile", maxCount: 1 },
    { name: "sec_admission", maxCount: 1 },
    { name: "sec_results", maxCount: 1 },
    { name: "sec_fee", maxCount: 1 },
    { name: "sec_death", maxCount: 1 },
    { name: "sec_kcpe", maxCount: 1 },
    { name: "sec_income_proof", maxCount: 1 },

]

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
            cb(null, true)
        } else {
            cb(new Error('we only accepts images'))
        }
    }
})

router.post('/secondaryapplicant', verifyjwt,limitapplication, upload.fields(Documents), verifysecschemas, async (req, res) => {
    const { sec_fullname, sec_dob, sec_birthcert, personalemail, sec_phone, sec_schoolname, sec_email, sec_admno,
        sec_form, sec_grade, sec_guardian, sec_income, sec_county, sec_subcounty } = req.body

    if (!sec_fullname || !sec_dob || !sec_birthcert || !personalemail || !sec_phone || !sec_schoolname || !sec_email || !sec_admno || !sec_form
        || !sec_grade || !sec_guardian || !sec_income || !sec_county || !sec_subcounty
    ) {
        return res.status(401).json({ message: 'please fill in this fields first' });
    } else if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(401).json({ message: 'please uplaod the files ' });
    }


    try {


        // sieve 2 templatevalidation

        const templateflags = await templatevalidation(req.files);
        if (templateflags.length > 0) {
            return res.status(422).json({ message: 'File template validation failed they seem suspiscous' });
        }


        // sieve 3 googlegemini extraction
        const extracteddata = await googlegemini(req.files);
        const allFailed = Object.values(extracteddata).every(doc => doc.error);
        if (allFailed) {
            return res.status(422).json({ message: 'Failed to read your documents — please upload clearer images and try again' });
        }

        // Check if some documents failed
        const faileddoc = Object.entries(extracteddata).filter(([key, doc]) => doc.error);
        if (faileddoc.length > 0) {
            return res.status(422).json({
                message: 'Some documents could not be read clearly',
                failed: faileddoc.map(([key]) => key)
            });
        }

        //  Logical Cross-Checks sieve4
        const { flags, riskpoints, incomeScore } = logiccheck(extracteddata, req.body);

        const { flags: multiyearflags, riskpoints: multiyearpoints } = await multiyear(req.user.id, req.body, extracteddata);

        const totalriskpoints = riskpoints + multiyearpoints;
        const allflags = [...flags, ...multiyearflags];
        let status;
        if (totalriskpoints <= 20) {
            status = 'approved';
        } else if (totalriskpoints <= 59) {
            status = 'manual_review';
        } else {
            status = 'rejected';
        }

        const randomaudit = Math.random() < 0.10;
        if (randomaudit && status === 'approved') {
            status = 'manual_review';
            allflags.push({ reason: 'Selected for random audit — standard procedure' });
        }


          const files = req.files;
        for (const fieldname of Object.keys(files)) {
            const file = files[fieldname][0];

            const hashdocuments = crypto.createHash('sha256').update(file.buffer).digest('hex');
            const duplicatefile = await prisma.files.findUnique({
                where: { hashedfile: hashdocuments }
            })

            if (duplicatefile) {
                return res.status(409).json({ message: `Duplicate detected ${fieldname} already in our system` });
            }
            await prisma.files.create({
                data: {
                    hashedfile: hashdocuments,
                    document: fieldname,
                    applicant_Id: req.user.id,
                }

            })
        }

        await prisma.secondary_applications.create({
            data: {
                applicant_id: req.user.id,
                sec_fullname,
                sec_dob,
                sec_birthcert,
                personalemail,
                sec_phone,
                sec_schoolname,
                sec_email,
                sec_admno,
                sec_form,
                sec_grade,
                sec_guardian,
                sec_income,
                sec_county,
                sec_subcounty,
                ocr_data: JSON.stringify(extracteddata),
                flags: JSON.stringify(allflags),
                riskpoints: totalriskpoints,
                incomeScore,
                status,
                has_death_cert: !!extracteddata.sec_death,
                death_cert_no: extracteddata.sec_death?.death_cert_no || null,

            }
        })
        return res.status(201).json({
            message: status === 'approved' ? 'Application submitted successfully' :
                status === 'manual_review' ? 'Application under review' :
                    'Application rejected',
            status,
            riskpoints: totalriskpoints,
            breakdown: {
                document_check: allflags.filter(f => f.field),
                logic_flags: flags,
                multiyear_flags: multiyearflags,
                random_audit: randomaudit,
                income_score: incomeScore,
                final_score: totalriskpoints,
                decision_basis: totalriskpoints <= 20 ? 'All checks passed' :
                    totalriskpoints <= 59 ? 'Some inconsistencies found — human review needed' :
                        'Multiple fraud indicators detected'
            },
            flags: allflags.length > 0 ? allflags.map(f => ({
                issue: f.reason,
                impact: 'This flag contributed to your risk score'
            })) : undefined
        });


    }

    catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'something went wrong try again' })
    }
})

module.exports = router;