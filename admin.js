const express = require('express');
const router = express.Router();
const prisma = require('./prisma/client');
const verifyjwt = require('./middleware');
const adminjwt = require('./adminmiddleware');



router.get('/application/:id', verifyjwt, adminjwt, async(req, res) => {
    await prisma.admin_logs.create({
        data:{
            admin_id: req.user.id,
            action: 'viewed',
            target_id: parseInt(req.params.id),
            ip_address: req.ip
        }
    });
    const application = await prisma.secondary_applications.findUnique({
        where: { id: parseInt(req.params.id) }
    });
    return res.status(200).json({ application });
});


router.get('/applications', verifyjwt, adminjwt, async(req, res) => {
    const applications = await prisma.secondary_applications.findMany({
        orderBy: { created_at: 'desc' }
    });
    return res.status(200).json({ applications });
});


router.post('/override', verifyjwt, adminjwt, async(req, res) => {
    const { application_id, new_status, reason } = req.body;

    if(!reason){
        return res.status(422).json({ message: 'You must provide a reason for override' });
    }

    const pendingoverride = await prisma.admin_logs.findFirst({
        where:{
            target_id: application_id,
            action: 'override_requested',
            admin_id: { not: req.user.id }
        }
    });

    if(!pendingoverride){
        await prisma.admin_logs.create({
            data:{
                admin_id: req.user.id,
                action: 'override_requested',
                target_id: application_id,
                reason,
                ip_address: req.ip
            }
        });
        return res.status(200).json({ message: 'Override requested — waiting for second admin approval' });
    }

    await prisma.secondary_applications.update({
        where: { id: application_id },
        data: { status: new_status }
    });

    await prisma.admin_logs.create({
        data:{
            admin_id: req.user.id,
            action: 'override_approved',
            target_id: application_id,
            reason,
            ip_address: req.ip
        }
    });

    return res.status(200).json({ message: 'Override executed and logged permanently' });
});

router.get('/audittrail', verifyjwt, adminjwt, async(req, res) => {
    const logs = await prisma.admin_logs.findMany({
        orderBy: { created_at: 'desc' },
        take: 100
    });
    return res.status(200).json({ logs });
});



module.exports = router