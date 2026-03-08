export function login() {
const login = document.getElementById('login');
const sign_up = document.getElementById('sign-up');

const loginform = document.getElementById('loginform');
const registrationform = document.getElementById('registrationform');
const herosection = document.getElementById('herosection');
const whyussection = document.getElementById('whyussection');
const howitworkssection = document.getElementById('howitworkssection');
const applynow = document.getElementById('applynow');
const signuplink =document.getElementById('signuplink');

signuplink.addEventListener('click',()=>{
    loginform.classList.add('hidden');
    herosection.classList.add('hidden');
    whyussection.classList.add('hidden');
    howitworkssection.classList.add('hidden')
    registrationform.classList.remove('hidden');
})

applynow.addEventListener('click',()=>{
 loginform.classList.remove('hidden');
    herosection.classList.add('hidden');
    whyussection.classList.add('hidden');
    howitworkssection.classList.add('hidden');
    registrationform.classList.add('hidden');
})



loginform.addEventListener('submit',(e)=>{
    e.preventDefault();

})

registrationform.addEventListener('submit',(e)=>{
    e.preventDefault();

})

login.addEventListener('click',()=>{
    loginform.classList.remove('hidden');
    herosection.classList.add('hidden');
    whyussection.classList.add('hidden');
    howitworkssection.classList.add('hidden')
    registrationform.classList.add('hidden');
})

sign_up.addEventListener('click',()=>{
    loginform.classList.add('hidden');
    herosection.classList.add('hidden');
    whyussection.classList.add('hidden');
    howitworkssection.classList.add('hidden')
    registrationform.classList.remove('hidden');
})


const loginemail = document.getElementById('loginemail');
const loginpassword  =document.getElementById('loginpassword');
const loginbtn = document.getElementById('loginbtn');
const loginresults = document.getElementById('loginresults');
console.log('loginemail:', document.getElementById('loginemail'));
console.log('loginpassword:', document.getElementById('loginpassword'));
console.log('loginbtn:', document.getElementById('loginbtn'));
console.log('loginresults:', document.getElementById('loginresults'));

loginbtn.addEventListener('click',()=>{
    const EMAILLOGIN = loginemail.value.trim();
    const PASSWORDLOGIN = loginpassword.value.trim();

    if(!EMAILLOGIN||!PASSWORDLOGIN){
        loginresults.textContent = 'Please fill in the fields with your login credentials to log in';
        setTimeout(() => {
            loginresults.classList.add('hidden');
        }, 4000);
        return;
    }
    fetch('/loginroute/login', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    credentials: 'include',
    body: JSON.stringify({EMAILLOGIN, PASSWORDLOGIN})
})
.then(res => res.json())
.then(data => {
    loginresults.textContent = data.message;

    if(data.message.includes('succesfully')){
        return fetch('/loginroute/me', {credentials: 'include'});
    }
    return null; 
})
.then(res => {
    if(!res) return null; 
    return res.json();
})
.then(data => {
    if(!data) return; 
    setTimeout(() => {
        if(data.role === 'admin') window.location.href = '/admin.html';
        else if(data.role === 'student') window.location.href = '/student.html';
    }, 2000);
})
.catch(err => {
    loginresults.textContent = err.message;
})

})
}