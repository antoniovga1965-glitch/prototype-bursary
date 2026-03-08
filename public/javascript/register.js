export function register() {
    const registername  =document.getElementById('registername');
    const regemail = document.getElementById('regemail');
    const regphoneno = document.getElementById('regphoneno');
    const regpassword1 = document.getElementById('regpassword1');
    const regpassword2  =document.getElementById('regpassword2');
    const regbutton  =document.getElementById('regbutton');
    const loginlink = document.getElementById('loginlink');
    const regresults = document.getElementById('regresults');


    loginlink.addEventListener('click',()=>{
     loginform.classList.remove('hidden');
    herosection.classList.add('hidden');
    whyussection.classList.add('hidden');
    howitworkssection.classList.add('hidden')
    registrationform.classList.add('hidden');
    })

    regbutton.addEventListener('click',()=>{
        const REGISTERNAME = registername.value.trim();
        const REGISTEREMAIL =regemail.value.trim();
        const REGPASS1 = regpassword1.value.trim();
        const REGPASS2 = regpassword2.value.trim();
        const PHONENO = regphoneno.value.trim();

        if(REGPASS1!==REGPASS2){
            regresults.classList.remove('hidden');
             regresults.textContent = 'Password doesnt match check and try again';
             setTimeout(() => {
               regresults.classList.add('hidden'); 
             }, 3000);
             return;
        }
        if(!REGISTERNAME||!REGISTEREMAIL||!REGPASS1||!REGPASS2||!PHONENO){
            regresults.textContent = 'PLease fill in the inputs with your details';
            regresults.classList.remove('hidden');
            setTimeout(() => {
               regresults.classList.add('hidden'); 
             }, 3000);
             return;
        }

        fetch('/registerroute/register',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({REGISTERNAME,REGISTEREMAIL,PHONENO,REGPASS1}),
        })
        .then(res=>res.json())
        .then(data=>{
            regresults.classList.remove('hidden');
            regresults.textContent=data.message;

            setTimeout(() => {
                if(data.message.includes('you have been succesfuly registered in smart bursary sytem')){
                window.location.href = '/student.html';
            }else{
                 window.location.href = '/index.html'; 
            }
            },3000);
            
            
        })
        .catch(err=>{
               regresults.textContent=err.message;
               setTimeout(() => {
                regresults.classList.add('hidden');
               }, 4000);
        })
        setTimeout(() => {
            registername.value="";
            regemail.value="";
            regpassword1.value="";
            regpassword2.value="";
        }, 5000);
    })
    
}