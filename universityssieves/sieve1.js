const express = require('express');
const multer = require('multer');
const router = express.Router();
const jwt = require('jsonwebtoken');
const prisma = require('../prisma/client');
const z = require('zod');
const limit = require('express-rate-limit');
const verifyjwt = require('../middleware');
const crypto = require('crypto');
const templatevalidation = require('./sieve2');
const googlegemini  = require('./sieve3');
const logiccheck = require('./sieve4');
const multiyearcheck = require('./sieve6');

const universityschemas = z.object({
    uni_fullname: z.string().min(1, 'Please enter your names'),
    uni_dob: z.string().regex(/^(200[5-9]|201[0-9]|202[0-9])-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/, 'Date of birth must start from 2005'),
    uni_nationalid: z.string().min(9, 'your Id No?'),
    uni_email: z.string().email('Fill in with valid email address'),
    uni_phone: z.string().min(9, 'Enter your correct phone number'),
    uni_institution: z.string().min(1, 'Enter your instituition details'),
    uni_regnumber: z.string().regex(/^[A-Z]{3}\/\d{4,6}\/\d{2,4}$/, 'Enter valid email address'),
    uni_course: z.string().min(1, 'course name'),
    uni_year: z.enum(['Year 1', 'Year 2', 'Year 3', 'Year 4'], {
        message: 'Please select your Year of study'
    }),
    uni_gpa:z.enum(['GPA 2.0', 'GPA 2.5', 'GPA 3.0', 'GPA 3.5'], {
        message: 'Please select your Year of study'
    }),
    Tertiary_email:z.string().email('Fill in with valid email address'),
    uni_guardian:z.string().min(1, 'Please enter your guardian names'),
    uni_county:z.string().min(1, 'county name'),
    uni_subcounty:z.string().min(1, 'subcounty name'),
    uni_ward:z.string().min(1, 'subcounty name'),
    uni_income: z.enum(['Below 10000', '20000-40000', '50000-70000', 'Over 80000']),
    uni_declaration: z.string().refine(val => val === 'true', 'You must accept the declaration'),
})

const limitapplication = limit({
    windowMs: 30 * 60 * 1000,
    max:200,
    message: { message: 'Too many application coming from this Ip...try again later' },
});


const verifyunischemas = (req, res, next) => {
    const results = universityschemas.safeParse(req.body);
    if (!results.success) {
        return res.status(422).json({ message: 'Failed to validate your input fields...Recheck and try again' });
    }
    next();
}


const Documents = [
    { name: "uni_birthcert", maxCount: 1 },
    { name: "uni_nationalidfile", maxCount: 1 },
    { name: "uni_admission", maxCount: 1 },
    { name: "uni_transcript", maxCount: 1 },
    { name: "uni_kcse", maxCount: 1 },
     { name: "uni_kcpe", maxCount: 1 },
    { name: "uni_fee", maxCount: 1 },
    { name: "uni_income_proof", maxCount: 1 },

];

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


router.post('/universityapp', verifyjwt,limitapplication, upload.fields(Documents), verifyunischemas, async (req, res)=>{
 const {uni_fullname,uni_dob,uni_nationalid, uni_email,uni_phone,uni_institution, 
    uni_year,uni_ward,uni_income,uni_subcounty,uni_county, uni_gpa, uni_guardian,Tertiary_email,uni_course,uni_regnumber}=req.body;

if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(401).json({ message: 'please uplaod the files ' });
    }
     try {
        
         // sieve2
    const templateflags = await templatevalidation(req.files);
        if (templateflags.length > 0) {
            return res.status(422).json({ message: 'File template validation failed they seem suspiscous' });
        }

      
        // sieve3

         const extracteddata = await googlegemini(req.files);
        const allFailed = Object.values(extracteddata).every(doc => doc.error);
        if (allFailed) {
            return res.status(422).json({ message: 'Failed to read your documents — wait for  AI token to reset' });
        }
         
        // if some failed
         const faileddoc = Object.entries(extracteddata).filter(([key, doc]) => doc.error);
        if (faileddoc.length > 0) {
            return res.status(422).json({
                message: 'Some documents could not be read clearly',
                failed: faileddoc.map(([key]) => key)
            });
        };

        const { flags, riskpoints, incomeScore } = logiccheck(extracteddata, req.body);

        const { flags: multiyearflags, riskpoints: multiyearpoints } = await multiyearcheck(req.user.id, req.body, extracteddata);

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
            const duplicatefile = await prisma.unifiles.findUnique({
                where: { hashedfile: hashdocuments }
            })

            if (duplicatefile) {
                return res.status(409).json({ message: `Duplicate detected ${fieldname} already in our system` });
            }
            await prisma.unifiles.create({
                data: {
                    hashedfile: hashdocuments,
                    document: fieldname,
                    applicant_Id: req.user.id,
                }

            })
        }
        await prisma.university_applications.create({
            data: {
                 applicant_id: req.user.id,
        uni_fullname,
        uni_dob,
        uni_nationalid,
        uni_email,
        uni_phone,
        uni_institution,
        uni_regnumber,
        uni_course,
        uni_year,
        uni_gpa,
        tertiary_email: Tertiary_email, 
        uni_guardian,
        uni_income,
        uni_county,
        uni_subcounty,
        uni_ward,
        ocr_data: JSON.stringify(extracteddata),
        flags: JSON.stringify(allflags),
        riskpoints: totalriskpoints,
        incomeScore,
        status,
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

    
     } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'something went wrong try again' })
    
     }
    }
    
)
module.exports =router;
