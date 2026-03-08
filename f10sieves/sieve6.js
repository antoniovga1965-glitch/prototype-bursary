const prisma = require('../prisma/client');

const multiyear = async (applicant_id, formdata, extracteddata) => {
    const flags = [];
    let riskpoints = 0;

   
    const previousapps = await prisma.secondary_applications.findMany({
        where: { applicant_id: applicant_id },
        orderBy: { created_at: 'desc' }
    });

    if(previousapps.length === 0) return { flags, riskpoints };

    const lastapp = previousapps[0];


    if(lastapp.sec_form === formdata.sec_form){
        flags.push({ reason: `Repeated same form — ${formdata.sec_form} submitted last year and this year` });
        riskpoints += 25;
    }

    if(lastapp.sec_schoolname !== formdata.sec_schoolname){
        flags.push({ reason: `School changed — previously ${lastapp.sec_schoolname} now ${formdata.sec_schoolname}` });
        riskpoints += 15;
    }

    if(!lastapp.has_death_cert && extracteddata.sec_death){
        const deathdate = new Date(extracteddata.sec_death?.date_of_death);
        const lastapplydate = new Date(lastapp.created_at);
        if(deathdate < lastapplydate){
            flags.push({ reason: `Parent death cert appeared but death date ${extracteddata.sec_death?.date_of_death} was before last application — why not submitted then?` });
            riskpoints += 35;
        }
    }

    
    if(lastapp.sec_income && formdata.sec_income){
        const lastincome = parseInt(lastapp.sec_income);
        const currentincome = parseInt(formdata.sec_income);
        if(lastincome > 0 && currentincome > 0){
            const drop = ((lastincome - currentincome) / lastincome) * 100;
            if(drop > 70){
                flags.push({ reason: `Income dropped ${drop.toFixed(0)}% — from KES ${lastincome} to KES ${currentincome}` });
                riskpoints += 30;
            }
        }
    }


    const samebirtcert = await prisma.secondary_applications.findFirst({
        where:{
            sec_birthcert: formdata.sec_birthcert,
            NOT: { applicant_id: applicant_id }
        }
    });
    if(samebirtcert){
        flags.push({ reason: `Birth certificate entry number ${formdata.sec_birthcert} already used under a different account` });
        riskpoints += 60;
    }

    return { flags, riskpoints };
};

module.exports =multiyear ;