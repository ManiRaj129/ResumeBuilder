const express= require("express");
const nodemailer=require("nodemailer");
const router= express.Router();

const transporter= nodemailer.createTransport({
  service:"Gmail",
  auth:{
     user: "resumebuilder577@gmail.com",
     pass: "ghvlvrrqgzssrudr",
  },
});

//4-digit otp
function genOtp(){
    return Math.floor(1000+ Math.random()* 9000).toString();
}

router.post("/", async (req, res) => {
 const {email} = req.body;
 const otp = genOtp();
 const data={};
 try{
    await transporter.sendMail({
        from: `"ResumeReady" <resumebuilder577@gmail.com>`,
        to: email,
        subject: "ResumeReady verification OTP",
        html: 
        `
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; border: 3px solid #189ab4; border-radius: 12px; background-color: white; padding: 20px;">
            <tr>
                <td style="text-align: center; padding-bottom: 16px;">
                    <p style="font-weight: bold; font-size: 24px; color: #005177;">
                        Greetings from the ResumeReady Team!
                    </p>
                </td>
            </tr>
            <tr>
                <td style="text-align: center; color: #000000;">
                    <p>Thanks for creating an account! Here's your one-time OTP:</p>
                </td>
            </tr>
            <tr>
                <td style="text-align: center; padding: 10px;">
                    <p style="font-weight: bold; font-size: 32px; color: #189ab4;">
                        ${otp}
                    </p>
                </td>
            </tr>
            <tr>
                <td style="text-align: center; color: #000000;">
                    <p>Don't share it with anyone else!</p>
                </td>
            </tr>
            <tr>
                <td style="padding: 20px;"></td>
            </tr>
            <tr>
                <td style="text-align: center; padding: 10px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #005177; padding: 8px; border-radius: 12px; margin: 0 auto; table-layout: fixed; width: auto;">
                        <tr>
                            <td style="padding-right: 10px; vertical-align: middle;">
                                <img src="data:image/png;base64,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" alt="ResumeReady" style="width: 40px;">
                            </td>
                            <td style="color: white; vertical-align: middle;">
                                Ready To Improve Your Resumes.
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
        `
    });
    console.log(`OTP for ${email}: ${otp}`);
    data.OTP=otp;
    res.status(200);
    res.send(data);
 }catch(err){
   console.error(err);
   res.status(500);
   res.send(data);
 }
});

module.exports=router;