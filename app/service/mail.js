const nodemailer = require("nodemailer");
let facade = require('gamecloud')
let CoreOfBase = facade.CoreOfBase

class mail extends facade.Service
{
     /**
     * 构造函数
     * @param {CoreOfBase} core
     */
    constructor(core) {
        super(core);
    }

    /**
     * 发送邮件
     */
    async send(params) {
        let {addr, subject, content, html} = params;
        let testAccount = {
            user: this.core.options.mail.user,
            pass: this.core.options.mail.pass,
        };
      
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
          host: this.core.options.mail.host,
          port: this.core.options.mail.port,
          secure: false, // true for 465, false for other ports
          auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass // generated ethereal password
          }
        });
      
        // send mail with defined transport object
        let info = await transporter.sendMail({
          from: `"Vallnet CRM" <${this.core.options.mail.user}>`, // sender address
          to: addr, // list of receivers
          subject: subject, // Subject line
          text: content, // plain text body
          html: html, // html body
        });
      
        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      
        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    }
}

module.exports = mail;
