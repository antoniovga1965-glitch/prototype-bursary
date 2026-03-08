export function handleLogout() {
    
const logoutstudent = document.getElementById('logoutstudent');
console.log('logoutstudent:', document.getElementById('logoutstudent'));

logoutstudent.addEventListener('click',()=>{
    fetch('/studentlogout/logout',{
        method:'GET',
        credentials:'include',
    })
    .then(res=>res.json())
    .then(data=>{
        window.location.href = '/index.html'
        
    })
    .catch(err=>{
        console.log(err);
        
    })
})




const startapplication = document.getElementById('startapplication');
const applicationtype = document.getElementById('applicationtype');

startapplication.addEventListener('click',()=>{
applicationtype.scrollIntoView({behavior:'smooth'})
})

const secondaryapplication = document.getElementById('secondaryapplication');
const universityapplicant = document.getElementById('universityapplicant');
const secondaryform = document.getElementById('secondaryform');
const universityform = document.getElementById('universityform');



secondaryapplication.addEventListener('click',()=>{
secondaryform.classList.remove('hidden');
universityform.classList.add('hidden');
})

universityapplicant.addEventListener('click',()=>{
universityform.classList.remove('hidden');
secondaryform.classList.add('hidden');
})


}

