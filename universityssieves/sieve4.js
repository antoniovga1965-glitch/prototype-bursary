const crosslogicalcheck = (extracteddata, formdata) => {
    const flags = [];
    let riskpoints = 0;

    // Name consistency
    const names = [];
    if(extracteddata.uni_birthcert?.fullname) names.push({doc:'uni_birthcert', name: extracteddata.uni_birthcert.fullname});
    if(extracteddata.uni_admission?.fullname) names.push({doc:'uni_admission', name: extracteddata.uni_admission.fullname});
    if(extracteddata.uni_kcse?.fullname) names.push({doc:'uni_kcse', name: extracteddata.uni_kcse.fullname});
    if(extracteddata.uni_fee?.fullname) names.push({doc:'uni_fee', name: extracteddata.uni_fee.fullname});

    for(let i = 1; i < names.length; i++){
        const base = names[0].name.toLowerCase();
        const compare = names[i].name.toLowerCase();
        if(!base.includes(compare.split(' ')[0].toLowerCase())){
            flags.push({ reason: `Name mismatch — ${names[0].doc} says "${names[0].name}" but ${names[i].doc} says "${names[i].name}"` });
            riskpoints += 30;
        }
    }

    // Age check
    if(formdata.uni_dob){
        const birthyear = new Date(formdata.uni_dob).getFullYear();
        const currentyear = new Date().getFullYear();
        const age = currentyear - birthyear;

        if(age < 17){
            flags.push({ reason: `Too young for university — born ${birthyear}, age ${age}` });
            riskpoints += 15;
        }
        if(age > 30){
            flags.push({ reason: `Age suspicious for university student — born ${birthyear}, age ${age}` });
            riskpoints += 15;
        }
    }

    // GPA check
    if(extracteddata.uni_transcript){
        const gpa = parseFloat(extracteddata.uni_transcript?.GPA);
        if(isNaN(gpa) || gpa < 0 || gpa > 4.0){
            flags.push({ reason: `Invalid GPA detected` });
            riskpoints += 20;
        }
    }

    // Admission number check
    if(extracteddata.uni_admission?.admission_no && formdata.uni_regnumber){
        const docAdmno = extracteddata.uni_admission.admission_no.toString().trim();
        const formAdmno = formdata.uni_regnumber.toString().trim();
        if(docAdmno !== formAdmno){
            flags.push({ reason: `Admission number mismatch — document says "${docAdmno}" but form says "${formAdmno}"` });
            riskpoints += 20;
        }
    }

    // Income score
    let incomeScore = 0;
    if(extracteddata.uni_income_proof){
        const keywords = extracteddata.uni_income_proof.keywords_found || [];
        const povertywords = ['poor','needy','casual','unemployed','subsistence','low income','peasant'];
        const matches = keywords.filter(k => povertywords.includes(k.toLowerCase()));
        incomeScore = matches.length > 0 ? 5 : 0;
    }

    return { flags, riskpoints, incomeScore };
}

module.exports = crosslogicalcheck;