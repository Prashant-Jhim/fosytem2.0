import { NextResponse } from 'next/server'

const sgMail = require('@sendgrid/mail')
export  async function POST(req,res){
    const Details = await req.json()
    sgMail.setApiKey(process.env.NEXT_PUBLIC_SENDGRIDAPI)
    const msg = {
      to: Details.Email, // Change to your recipient
      from: 'prashantjhim2023@gmail.com', // Change to your verified sender
      subject: `Verification Email for ${Details.Name}`,
      text: 'Verify',
      html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
      <div style="margin:50px auto;width:70%;padding:20px 0">
        <div style="border-bottom:1px solid #eee">
          <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">FOSystem2.0 Service</a>
        </div>
        <p style="font-size:1.1em">Hi,</p>
        <p>Thank you for choosing FOSystem2.0 Service. Use the following link to complete your Sign Up procedures. link is valid for 5 minutes</p>

        <a href = ${Details.url + "/verify/" + Details.id}>Verify The Account</a>
        
        <p style="font-size:0.9em;">Regards,<br />ChatAPP Service</p>
        <hr style="border:none;border-top:1px solid #eee" />
        <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
          <p>FOSystem2.0 Service</p>
          <p>Prashant Jhim</p>
          <p>Canada</p>
        </div>
      </div>
    </div>`,
    }
   const mail = await  sgMail.send(msg)
   return await NextResponse.json({status:true,mail})
}