const logiccheck  = (extracteddata,formdata)=>{
    const flags= [];
    let riskpoints = 0;


     const names = [];
    if(extracteddata.sec_birthcertfile?.fullname) names.push({doc:'Birth Certificate', name: extracteddata.sec_birthcertfile.fullname});
    if(extracteddata.sec_admission?.fullname) names.push({doc:'Admission Letter', name: extracteddata.sec_admission.fullname});
    if(extracteddata.sec_kcse?.fullname) names.push({doc:'KCPE Results', name: extracteddata.sec_kcse.fullname});
    if(extracteddata.sec_fee?.fullname) names.push({doc:'Fee Statement', name: extracteddata.sec_fee.fullname});


      for(let i = 1; i < names.length; i++){
        const base = names[0].name.toLowerCase();
        const compare = names[i].name.toLowerCase();
        if(!base.includes(compare.split(' ')[0].toLowerCase())){
            flags.push({ reason: `Name mismatch — ${names[0].doc} says "${names[0].name}" but ${names[i].doc} says "${names[i].name}"` });
            riskpoints += 30;
        }
    }

    if(formdata.sec_dob && formdata.sec_form){
    const birthyear = new Date(formdata.sec_dob).getFullYear();
    const currentyear = new Date().getFullYear();
    const age = currentyear - birthyear;
    const form = parseInt(formdata.sec_form.replace(/\D/g, ''));

    if(age < 15){
        flags.push({ reason: `Too young for secondary school — born ${birthyear}, age ${age}` });
        riskpoints += 40;
    }
    if(age > 22){
        flags.push({ reason: `Age suspicious for secondary school — born ${birthyear}, age ${age}` });
        riskpoints += 23;
    }
}


    if(extracteddata.sec_kcse){
    const k = extracteddata.sec_kcse;
    const validGrades = ['A','A-','B+','B','B-','C+','C','C-','D+','D','D-','E'];
    
    const gradesToCheck = [k.english, k.kiswahili, k.mathematics, k.science, k.social_studies];
    const invalidGrades = gradesToCheck.filter(g => g && !validGrades.includes(g.trim()));
    
    if(invalidGrades.length > 0){
        flags.push({ reason: `Invalid KCPE grades detected — ${invalidGrades.join(', ')}` });
        riskpoints += 35;
    }

    if(k.exam_year){
        const year = parseInt(k.exam_year);
        if(year < 2010 || year > new Date().getFullYear()){
            flags.push({ reason: `KCPE exam year suspicious — ${year}` });
            riskpoints += 20;
        }
    }
}
    

      if(extracteddata.sec_admission?.admission_no && formdata.sec_admno){
        const docAdmno = extracteddata.sec_admission.admission_no.toString().trim();
        const formAdmno = formdata.sec_admno.toString().trim();
        if(docAdmno !== formAdmno){
            flags.push({ reason: `Admission number mismatch — document says "${docAdmno}" but form says "${formAdmno}"` });
            riskpoints += 20;
        }
    }

     if(extracteddata.sec_death?.date_of_death){
        const deathdate = new Date(extracteddata.sec_death.date_of_death);
        const today = new Date();
        const applicantDob = new Date(formdata.sec_dob);

        if(deathdate > today){
            flags.push({ reason: 'Death certificate date is in the future — impossible' });
            riskpoints += 50;
        }
        if(deathdate < applicantDob){
            flags.push({ reason: 'Parent died before applicant was born — impossible' });
            riskpoints += 50;
        }
    
    }
       let incomeScore = 0;
       if(extracteddata.sec_income_proof){
        const keywords = extracteddata.sec_income_proof.keywords_found || [];
        const povertywords = ['poor','needy','casual','unemployed','subsistence','low income','peasant'];
        const matches = keywords.filter(k => povertywords.includes(k.toLowerCase()));
        incomeScore = matches.length > 0 ? 5 : 0;
    }

     return { flags, riskpoints, incomeScore };
}
 module.exports = logiccheck