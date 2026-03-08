export function secondaryappy() {
    


// Personal Details
const secFullname = document.getElementById('sec_fullname');
const secDob = document.getElementById('sec_dob');
const secBirthcert = document.getElementById('sec_birthcert');
const personalEmail = document.getElementById('personalemail');
const secPhone = document.getElementById('sec_phone');

// School Information
const secSchoolname = document.getElementById('sec_schoolname');
const secSchoolEmail = document.getElementById('sec_email');
const secAdmno = document.getElementById('sec_admno');
const secForm = document.getElementById('sec_form');
const secGrade = document.getElementById('sec_grade');

// Financial Information
const secGuardian = document.getElementById('sec_guardian');
const secIncome = document.getElementById('sec_income');
const secCounty = document.getElementById('sec_county');
const secSubcounty = document.getElementById('sec_subcounty');

// Documents Upload
const secBirthcertFile = document.getElementById('sec_birthcertfile');
const secResults = document.getElementById('sec_results');
const secAdmission = document.getElementById('sec_admission');
const secFee = document.getElementById('sec_fee');
const secDeath = document.getElementById('sec_death');
const seckcpe = document.getElementById('sec_kcpe');
const secIncomeProof = document.getElementById('sec_income_proof');

// Declaration
const secDeclaration = document.getElementById('sec_declaration');

// Submit Button & Result Display
const secSubmit = document.getElementById('sec_submit');
const secResultsDisplay = document.getElementById('secresults');


const secondaryform = document.getElementById('secondaryform');
const universityform = document.getElementById('universityform');



secondaryform.addEventListener('submit', (e) => {
    e.preventDefault();
})

universityform.addEventListener('submit', (e) => {
    e.preventDefault();
})

console.log(secSubmit)



secSubmit.addEventListener('click',() => {
    console.log('secSubmit:', secSubmit);
    console.log('sec_income:', secIncome.value);
console.log('sec_form:', secForm.value);
console.log('sec_grade:', secGrade.value);

    const formdata = new FormData();

    // Personal Information
    formdata.append('sec_fullname', secFullname.value.trim());
    formdata.append('sec_dob', secDob.value.trim());
    formdata.append('sec_birthcert', secBirthcert.value.trim());
    formdata.append('personalemail', personalEmail.value.trim());
    formdata.append('sec_phone', secPhone.value.trim());

    // School Information
    formdata.append('sec_schoolname', secSchoolname.value.trim());
    formdata.append('sec_email', secSchoolEmail.value.trim());
    formdata.append('sec_admno', secAdmno.value.trim());
    formdata.append('sec_form', secForm.value.trim());
    formdata.append('sec_grade', secGrade.value.trim());

    // Financial Information
    formdata.append('sec_guardian', secGuardian.value.trim());
    formdata.append('sec_income', secIncome.value.trim());
    formdata.append('sec_county', secCounty.value.trim());
    formdata.append('sec_subcounty', secSubcounty.value.trim());
    formdata.append('sec_declaration', secDeclaration.checked);

    // Documents — files use [0] not .value
    formdata.append('sec_birthcertfile', secBirthcertFile.files[0]);
    formdata.append('sec_results', secResults.files[0]);
    formdata.append('sec_admission', secAdmission.files[0]);
    formdata.append('sec_fee', secFee.files[0]);
    if (secDeath.files[0]) {
        formdata.append('sec_death', secDeath.files[0]);
    }

    formdata.append('sec_kcpe', seckcpe.files[0]);

    if (secIncomeProof.files[0]) {
        formdata.append('sec_income_proof', secIncomeProof.files[0]);
    }


secSubmit.disabled = true;
secSubmit.textContent = '⏳ Submitting... please wait';
secResultsDisplay.textContent = '';

    fetch('/secondaryapplication/secondaryapplicant', {
        method: 'POST',
        credentials: 'include',
        body: formdata,

    }).then(res => res.json())
        .then(data => {
                secSubmit.disabled = false;
        secSubmit.textContent = 'Submit Application';
            secResultsDisplay.textContent = data.message;
        })
        .catch(err => {
              secSubmit.disabled = false;
        secSubmit.textContent = 'Submit Application';
            secResultsDisplay.textContent = err.message;
        })

})




}