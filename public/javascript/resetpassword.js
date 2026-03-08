export function passwordreset() {
   const resetpassword = document.getElementById('resetpassword');
const  resetcontainer = document.getElementById('resetcontainer');
const emailreset = document.getElementById('passwordreset');
const passwordresetresults = document.getElementById('passwordresetresults');
const submitbtn = document.getElementById('submitbtn');


resetpassword.addEventListener('click',()=>{
    resetcontainer.classList.remove('hidden');
})
submitbtn.addEventListener('click',()=>{
const RESETPASSWORD = emailreset.value.trim();
if(RESETPASSWORD===""){
    passwordresetresults.textContent ='Please enter your email first'

    setTimeout(() => {
      passwordresetresults.classList.add('hidden')
    }, 3000);
    return;
}

fetch('/emailsend/resetpassword',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({RESETPASSWORD})
})
.then(res=>res.json())
.then(data=>{
passwordresetresults.textContent = data.message;

setTimeout(() => {
    resetcontainer.classList.add('hidden');
}, 5000);
})
.catch(err=>{
passwordresetresults.textContent = err.message;
})

}) 
}

