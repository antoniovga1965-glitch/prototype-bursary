const {Resend} = require('resend');

function getresend() {
    return new Resend(process.env.RESENDAPI)
}
module.exports=getresend;