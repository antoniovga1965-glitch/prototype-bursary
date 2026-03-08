export function university() {

    const uni_fullname = document.getElementById('uni_fullname');
    const uni_dob = document.getElementById('uni_dob');
    const uni_nationalid = document.getElementById('uni_nationalid');
    const uni_email = document.getElementById('uni_email');
    const uni_phone = document.getElementById('uni_phone');

    const uni_institution = document.getElementById('uni_institution');
    const uni_regnumber = document.getElementById('uni_regnumber');
    const uni_course = document.getElementById('uni_course');
    const uni_year = document.getElementById('uni_year');
    const uni_gpa = document.getElementById('uni_gpa');
    const Tertiary_email = document.getElementById('Tertiary_email');

    const uni_guardian = document.getElementById('uni_guardian');
    const uni_income = document.getElementById('uni_income');
    const uni_county = document.getElementById('uni_county');
    const uni_subcounty = document.getElementById('uni_subcounty');
    const uni_ward = document.getElementById('uni_ward');

    const uni_birthcert = document.getElementById('uni_birthcert');
    const uni_nationalidfile = document.getElementById('uni_nationalidfile');
    const uni_admission = document.getElementById('uni_admission');
    const uni_transcript = document.getElementById('uni_transcript');
    const uni_kcse = document.getElementById('uni_kcse');
    const uni_kcpe = document.getElementById('uni_kcpe');
    const uni_fee = document.getElementById('uni_fee');
    const uni_income_proof = document.getElementById('uni_income_proof');

    const uni_declaration = document.getElementById('uni_declaration');
    const uni_submit = document.getElementById('uni_submit');
    const uniresults = document.getElementById('uniresults');

    uni_submit.addEventListener('click', () => {

        const formData = new FormData();
        

        formData.append('uni_fullname', uni_fullname.value.trim());
        formData.append('uni_dob', uni_dob.value.trim());
        formData.append('uni_nationalid', uni_nationalid.value.trim());
        formData.append('uni_email', uni_email.value.trim());
        formData.append('uni_phone', uni_phone.value.trim());

        formData.append('uni_institution', uni_institution.value.trim());
        formData.append('uni_regnumber', uni_regnumber.value.trim());
        formData.append('uni_course', uni_course.value.trim());
        formData.append('uni_year', uni_year.value.trim());
        formData.append('uni_gpa', uni_gpa.value.trim());
        formData.append('Tertiary_email', Tertiary_email.value.trim());

        formData.append('uni_guardian', uni_guardian.value.trim());
        formData.append('uni_income', uni_income.value.trim());
        formData.append('uni_county', uni_county.value.trim());
        formData.append('uni_subcounty', uni_subcounty.value.trim());
        formData.append('uni_ward', uni_ward.value.trim());


        
        


        // Files
        formData.append('uni_birthcert', uni_birthcert.files[0]);
        formData.append('uni_nationalidfile', uni_nationalidfile.files[0]);
        formData.append('uni_admission', uni_admission.files[0]);
        formData.append('uni_transcript', uni_transcript.files[0]);
        formData.append('uni_kcse', uni_kcse.files[0]);
        formData.append('uni_kcpe', uni_kcpe.files[0]);
        formData.append('uni_fee', uni_fee.files[0]);
        formData.append('uni_income_proof', uni_income_proof.files[0]);

        formData.append('uni_declaration', uni_declaration.checked);
 
         // Check all text fields
console.log('uni_fullname:', document.getElementById('uni_fullname')?.value);
console.log('uni_dob:', document.getElementById('uni_dob')?.value);
console.log('uni_nationalid:', document.getElementById('uni_nationalid')?.value);
console.log('uni_email:', document.getElementById('uni_email')?.value);
console.log('uni_phone:', document.getElementById('uni_phone')?.value);
console.log('uni_institution:', document.getElementById('uni_institution')?.value);
console.log('uni_regnumber:', document.getElementById('uni_regnumber')?.value);
console.log('uni_course:', document.getElementById('uni_course')?.value);
console.log('uni_year:', document.getElementById('uni_year')?.value);
console.log('uni_gpa:', document.getElementById('uni_gpa')?.value);
console.log('Tertiary_email:', document.getElementById('Tertiary_email')?.value);
console.log('uni_guardian:', document.getElementById('uni_guardian')?.value);
console.log('uni_income:', document.getElementById('uni_income')?.value);
console.log('uni_county:', document.getElementById('uni_county')?.value);
console.log('uni_subcounty:', document.getElementById('uni_subcounty')?.value);
console.log('uni_ward:', document.getElementById('uni_ward')?.value);
console.log('uni_declaration:', document.getElementById('uni_declaration')?.checked);



    fetch('/uniapplication/universityapp',{
        method:'POST',
        credentials:'include',
        body:formData,
    })
    .then(res=>res.json())
    .then(data=>{
        uniresults.textContent = data.message;
    }).catch(err=>{
        uniresults.textContent = err.message;
    })

   })
}