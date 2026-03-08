

export function getregistereduser() {

    const registeredusers = document.getElementById('registeredusers');

    async function getusers() {
        fetch('/getusers/registeredusers', {
            method: 'GET',
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => {

                registeredusers.innerHTML = "";

                data.message.forEach(applicant => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
            <td>${applicant.REGISTERNAME}</td>
            <td>${applicant.REGISTEREMAIL}</td>
              <td>${applicant.PHONENO}</td>
              <td>${applicant.created_at}</td>

              

            `
                    registeredusers.appendChild(row)

                });
            })
            .catch(err => {
                registeredusers.textContent = err.message;
            })
    }
    getusers();



    async function gettotal() {
        const totalapplicants = document.getElementById('totalapplicants');

        fetch('/getusers/totalusers', {
            method: 'GET',
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => {
                totalapplicants.textContent = data.message;
            })
            .catch(err => {
                totalapplicants.textContent = err.message;
            })
    }
    gettotal();


    async function getpending() {
        const pendingapplicants = document.getElementById('pendingapplicants');

        fetch('/getusers/pending', {
            method: 'GET',
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => {
                pendingapplicants.textContent = data.message;
            })
            .catch(err => {
                pendingapplicants.textContent = err.message;
            })
    }
    getpending();


    async function getrej() {
        const rejected = document.getElementById('rejected');

        fetch('/getusers/rejected', {
            method: 'GET',
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => {
                rejected.textContent = `${data.message} University applicant`;
            })
            .catch(err => {
                rejected.textContent = err.message;
            })
    }
    getrej();



    async function getunirej() {
        const unirejected = document.getElementById('unirejected');

        fetch('/getusers/universityrejected', {
            method: 'GET',
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => {
                unirejected.innerHTML = `${data.message} secondary applicant`;
            })
            .catch(err => {
                unirejected.textContent = err.message;
            })
    }
    getunirej();



    const setbudget = document.getElementById('setbudget');
    const budgetedcounty = document.getElementById('budgetedcounty');
    const financialyear = document.getElementById('financialyear');
    const savebudget = document.getElementById('savebudget');
    const resultsforsetbudget = document.getElementById('resultsforsetbudget');


    savebudget.addEventListener('click', () => {
        const SETBUDGET = setbudget.value.trim();
        const BUDGETEDCOUNTY = budgetedcounty.value.trim();
        const YEARFINANCIAL = financialyear.value

        if (!SETBUDGET || !BUDGETEDCOUNTY || !YEARFINANCIAL) {
            resultsforsetbudget.textContent = 'Please honourable set your budget first';
            setTimeout(() => {
                resultsforsetbudget.classList.add('hidden');
            }, 3000);
            return;
        }

        fetch('/getusers/setbudget', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ SETBUDGET, BUDGETEDCOUNTY, YEARFINANCIAL }),
        })
            .then(res => res.json())
            .then(data => {
                resultsforsetbudget.textContent = data.message;
            })
            .catch(err => {
                resultsforsetbudget.textContent = err.message;
            })
    })




    const logout = document.getElementById('logout');

    logout.addEventListener('click', () => {
        fetch('/getusers/logoutadmin', {
            method: 'GET',
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => {

                setTimeout(() => {
                    window.location.href = "/index.html";
                }, 2000);
            })
            .then(err => {
                console.log(err);
            })
    })


    const universityapplicants = document.getElementById('universityapplicants');

    async function unitable() {
        fetch('/getusers/universitytable', {
            method: 'GET',
            credentials: 'include',
        })
            .then(res => res.json())

            .then(data => {


                universityapplicants.innerHTML = "";
                data.message.forEach(applicant => {
                    const row = document.createElement('tr');

                    let flags;
                    try {
                        flags = typeof applicant.flags === 'string'
                            ? JSON.parse(applicant.flags)
                            : applicant.flags || [];
                    } catch (e) {
                        flags = [];
                    }

                    const flagsHTML = flags.length > 0
                        ? flags.map(f => `<span style="color:red;display:block;">⚠ ${f.reason}</span>`).join('')
                        : '<span style="color:green;">✓ No flags</span>';

                    row.innerHTML = `
               <td> ${applicant.uni_fullname}</td>
                             <td>  ${applicant.uni_institution}</td>
                             <td>   ${applicant.uni_regnumber}</td>
                             <td>    ${applicant.uni_county}</td>
                              <td>    ${applicant.uni_gpa}</td>
                          <td>         ${applicant.status}</td>
                               <td>         ${flagsHTML}</td>
                                 <td>    ${applicant.updated_at}</td>
                `
                    universityapplicants.appendChild(row)
                });

            })
            .catch(err => {
                console.log(err);

            })
    }
    unitable();


    async function dislaysec(params) {
        fetch('/getusers/secondarydiplay', {
            method: 'GET',
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => {

                console.log(data);

                secondaryapplicants.innerHTML = "";
                data.message.forEach(applicant => {
                    const row = document.createElement('tr');

                    let flags;
                    try {
                        flags = typeof applicant.flags === 'string'
                            ? JSON.parse(applicant.flags)
                            : applicant.flags || [];
                    } catch (e) {
                        flags = [];
                    }

                    const flagsHTML = flags.length > 0
                        ? flags.map(f => `<span style="color:red;display:block;">⚠ ${f.reason}</span>`).join('')
                        : '<span style="color:green;">✓ No flags</span>';


                    const ocr = JSON.parse(applicant.ocr_data || '{}');
                    const sex = ocr.sec_birthcertfile?.sex || 'Unknown';

                    const results = JSON.parse(applicant.ocr_data || '{}');
                    const amountrequested = ocr.sec_fee?.fee_balance || 'Unknown';


                    row.innerHTML = `
                   


    <td>${applicant.sec_fullname}</td>
     <td>${applicant.sec_schoolname}</td>
      <td>${applicant.sec_admno}</td>
       <td>${applicant.sec_county}</td>
        <td>${applicant.sec_grade}</td>
         <td>${amountrequested}</td>
         <td>${applicant.status}</td>
          
           <td>${sex}</td>
           <td>${flagsHTML}</td>
            <td>${applicant.updated_at}</td>
           

    `
                    secondaryapplicants.appendChild(row);
                });
            })
    }
    dislaysec();


    const gender = document.getElementById('genderPieChart').getContext('2d');


    async function genderchart() {

        fetch('/getusers/genderchart', {
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => {
                new Chart(gender, {
                    type: 'doughnut',
                    data: {
                        labels: ['male', 'female'],
                        datasets: [{
                            data: [data.male, data.female],
                            backgroundColor: ['#3b82f6', '#ec4899'],
                        }]
                    },
                    options: {
                        plugins: {
                            legend: {
                                position: 'bottom',
                                labels: {

                                    font: { size: 14 },
                                    padding: 20,
                                }

                            }
                        }
                    }
                })

            })

            .catch(err => {
                console.log(err);

            })




    }
    genderchart();



    const status = document.getElementById('status').getContext('2d');
    async function showstatus() {
        fetch('/getusers/status', {
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                new Chart(status, {
                    type: 'bar',

                    data: {
                        labels: ['manual_review', 'rejected', 'approved'],

                        datasets: [{
                            data: [data.manual_review, data.rejected, data.approved],
                            backgroundColor: ['#3b54f6', '#ec4899', '#4858ec'],
                            label: 'Applications',
                        }]
                    },
                    options: {
                        plugins: {
                            legend: {
                                position: 'bottom',
                                labels: {

                                    font: { size: 14 },
                                    padding: 20,
                                }

                            }
                        }
                    }
                })

            }).catch(err => {
                console.log(err);
            })
    }
    showstatus();


    const fraud = document.getElementById('fraud').getContext('2d');

    async function detectedfraud() {
        fetch('/getusers/fraudgraph', {
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                new Chart(fraud, {
                    type: 'bar',

                    data: {
                        labels: ['admission_mismatch', 'name_mismatch', 'school_changed'],

                        datasets: [{
                            data: [data.admission_mismatch, data.name_mismatch, data.school_changed],
                            backgroundColor: ['#3bf6ce', '#c46293', '#cb48ec'],
                            label: 'Fraud detected',
                        }]
                    },
                    options: {
                        plugins: {
                            legend: {
                                position: 'bottom',
                                labels: {

                                    font: { size: 14 },
                                    padding: 20,
                                }

                            }
                        }
                    }
                })

            }).catch(err => {
                console.log(err);
            })

    }
    detectedfraud();



    const overtimegraph = document.getElementById('overtimegraph').getContext('2d');

    async function overtime() {
        fetch('/getusers/overtime', {
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                new Chart(overtimegraph, {
                    type: 'line',

                    data: {
                        labels: data.labels,

                        datasets: [{
                            label: 'Applications over time',
                            data: data.data,
                            backgroundColor: '#3bf6ce',
                            borderColor: '#3bf6ce',
                            tension: 0.4,
                        }]
                    },
                    options: {
                        plugins: {
                            legend: {
                                position: 'bottom',
                                labels: {

                                    font: { size: 14 },
                                    padding: 20,
                                }

                            }
                        }
                    }
                })

            }).catch(err => {
                console.log(err);
            })
    }
    overtime();

    const searchuniinput = document.getElementById('searchuniinput');

    searchuniinput.addEventListener('input', () => {
        const query = searchuniinput.value;
        if (!query) {
            return;
        }

        fetch(`/getusers/searchuni?s=${query}`, {
            method: 'GET',
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                secondaryapplicants.innerHTML = "";

                data.message.forEach(applicant => {
                    const row = document.createElement('tr');

                    const ocr = JSON.parse(applicant.ocr_data || '{}');
                    const sex = ocr.sec_birthcertfile?.sex || 'Unknown';
                    const amountrequested = ocr.sec_fee?.fee_balance || 'N/A';

                    let flags;
                    try {
                        flags = typeof applicant.flags === 'string'
                            ? JSON.parse(applicant.flags)
                            : applicant.flags || [];
                    } catch (e) { flags = []; }

                    const flagsHTML = flags.length > 0
                        ? flags.map(f => `<span style="color:red;display:block;">⚠ ${f.reason}</span>`).join('')
                        : '<span style="color:green;">✓ No flags</span>';

                    row.innerHTML = `
        <td>${applicant.sec_fullname}</td>
        <td>${applicant.sec_schoolname}</td>
        <td>${applicant.sec_admno}</td>
        <td>${applicant.sec_county}</td>
        <td>${applicant.sec_grade}</td>
        <td>${amountrequested}</td>
        <td>${applicant.status}</td>
        <td>${sex}</td>
        <td>${flagsHTML}</td>
        <td>${applicant.updated_at}</td>
    `;
                    secondaryapplicants.appendChild(row);
                });


            }).catch(err => {
                console.log(err);
            })
    })
}