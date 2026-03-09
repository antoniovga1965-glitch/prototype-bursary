const express = require('express');
const app =express();
const port =3000;
const cookieparse = require('cookie-parser');
const cors = require('cors');

app.use(cookieparse());

app.use(cors())
app.use(express.static('public'));
app.use(express.json());

const registerroute = require('./logins/register');
app.use('/registerroute',registerroute);


const loginroute = require('./logins/login');
app.use('/loginroute',loginroute);


const emailsend = require('./helpers/sendemail');
app.use('/emailsend',emailsend);

const studentlogout = require('./helpers/logout');
app.use('/studentlogout',studentlogout);

const adminroute = require('./admin');
app.use('/admin', adminroute);

const secondaryapplication = require('./f10sieves/sieve1');
app.use('/secondaryapplication', secondaryapplication);

const uniapplication = require('./universityssieves/sieve1');
app.use('/uniapplication',uniapplication);

const getusers = require('./universityssieves/getrejuser');
app.use('/getusers',getusers);



app.listen(port,()=>{
    console.log(`Your app is live at http://localhost:${port}`)
})
