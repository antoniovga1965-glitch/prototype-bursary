const prisma = require('../prisma/client');

const multiyear = async (applicant_id, formdata, extracteddata) => {
    const flags = [];
    let riskpoints = 0;

    const previousapps = await prisma.university_applications.findMany({
        where: { applicant_id: applicant_id },
        orderBy: { created_at: 'desc' }
    });

    if(previousapps.length === 0) return { flags, riskpoints };

    const lastapp = previousapps[0];

    if(lastapp.uni_year === formdata.uni_year){
        flags.push({ reason: `Repeated same year — ${formdata.uni_year} submitted last year and this year` });
        riskpoints += 25;
    }

    
    if(lastapp.uni_institution !== formdata.uni_institution){
        flags.push({ reason: `Institution changed — previously ${lastapp.uni_institution} now ${formdata.uni_institution}` });
        riskpoints += 15;
    }



   
    if(lastapp.uni_income && formdata.uni_income){
        const lastincome = parseInt(lastapp.uni_income);
        const currentincome = parseInt(formdata.uni_income);
        if(lastincome > 0 && currentincome > 0){
            const drop = ((lastincome - currentincome) / lastincome) * 100;
            if(drop > 70){
                flags.push({ reason: `Income dropped ${drop.toFixed(0)}% — from KES ${lastincome} to KES ${currentincome}` });
                riskpoints += 30;
            }
        }
    }

    
    const samenationalid = await prisma.university_applications.findFirst({
        where:{
            uni_nationalid: formdata.uni_nationalid,
            NOT: { applicant_id: applicant_id }
        }
    });
    if(samenationalid){
        flags.push({ reason: `National ID ${formdata.uni_nationalid} already used under a different account` });
        riskpoints += 60;
    }

    return { flags, riskpoints };
};

module.exports = multiyear;