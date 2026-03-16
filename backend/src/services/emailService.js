import nodemailer from "nodemailer";

let transporter;

async function initTransporter() {
  if (transporter) return transporter;
  
  // For development, we use ethereal to create a test account
  let testAccount = await nodemailer.createTestAccount();
  transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });
  return transporter;
}

export async function sendAssignmentNotificationEmail(studentEmail, studentName, assignmentTitle, facultyName) {
  try {
    const t = await initTransporter();
    
    const info = await t.sendMail({
      from: '"Academic Validator" <noreply@academicvalidator.com>',
      to: studentEmail,
      subject: `New Assignment Created: ${assignmentTitle}`,
      text: `Hello ${studentName},\n\nA new assignment "${assignmentTitle}" has been assigned to you by ${facultyName}.\nPlease check your dashboard for more details.\n\nBest,\nAcademic Validator Team`,
      html: `<p>Hello ${studentName},</p><p>A new assignment <b>"${assignmentTitle}"</b> has been assigned to you by ${facultyName}.</p><p>Please check your dashboard for more details.</p>`,
    });
    
    console.log("Message sent to %s: %s", studentEmail, info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Error sending email", error);
  }
}
