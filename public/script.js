import { login }from './javascript/login.js';


import {register} from './javascript/register.js';


import {passwordreset} from './javascript/resetpassword.js';


import {handleLogout} from './javascript/student.js';

import { secondaryappy } from './javascript/secondary.js';


import {university } from './javascript/universityapplicans.js';

import { getregistereduser } from './javascript/admin.js';

 

 if(document.getElementById('savebudget'))getregistereduser();

if(document.getElementById('uni_submit'))university();
if(document.getElementById('sec_submit'))secondaryappy();
if(document.getElementById('regbutton')) register();
if(document.getElementById('loginbtn')) login();
if(document.getElementById('submitbtn')) passwordreset();
if(document.getElementById('logoutstudent')) handleLogout();
