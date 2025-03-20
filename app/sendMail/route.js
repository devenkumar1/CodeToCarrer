import transporter from "@/lib/nodemailer";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email, name } = await req.json();
    console.log(email,name)
    const welcomeEmail = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to CodeToCareer</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    table {
      border-spacing: 0;
    }
    td {
      padding: 0;
    }
    img {
      border: 0;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #f4f4f4;
      padding: 20px 0;
    }
    .main {
      background-color: #ffffff;
      margin: 0 auto;
      width: 100%;
      max-width: 600px;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    .header {
      padding: 20px;
      background-color: #2f7df4;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      color: #ffffff;
    }
    .content {
      padding: 20px;
      text-align: left;
    }
    .content h2 {
      font-size: 20px;
      margin-bottom: 10px;
      color: #333333;
    }
    .content p {
      font-size: 14px;
      line-height: 1.6;
      color: #555555;
    }
    .cta {
      margin-top: 20px;
      text-align: center;
    }
    .cta a {
      background-color: #2f7df4;
      color: #ffffff;
      padding: 12px 24px;
      font-size: 14px;
      font-weight: bold;
      text-decoration: none;
      border-radius: 5px;
      display: inline-block;
    }
    .footer {
      padding: 20px;
      font-size: 12px;
      text-align: center;
      color: #999999;
    }
    @media screen and (max-width: 600px) {
      .content {
        padding: 15px;
      }
      .cta a {
        padding: 10px 20px;
        font-size: 13px;
      }
    }
  </style>
</head>
<body>
  <table class="wrapper" width="100%" cellspacing="0" cellpadding="0">
    <tr>
      <td>
        <table class="main" width="100%" cellspacing="0" cellpadding="0">
          <!-- Header -->
          <tr>
            <td class="header">
              <h1>Welcome to CodeToCareer! </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td class="content">
              <h2>Hi <b>{${name}}</b>,</h2>
              <p>
                We are excited to welcome you to <strong>CodeToCareer</strong>!
                Our mission is to help you transform your coding journey into a successful career.
              </p>
              <p>
                With our <b>AI Mentor</b>, <b>Code Reviews</b>, <b>Personalized Roadmaps</b>,
                and a growing community of learners, you are in the right place to
                elevate your skills and achieve your goals.
              </p>
              <p>
                Start exploring your journey with CodeToCareer and make the most of the
                available resources designed just for you.
              </p>

             

              <p>
                If you have any questions or need assistance, feel free to reach out to our
                support team anytime.
              </p>

              <p>
                Best Regards, <br />
                <strong>The CodeToCareer Team</strong> 💻
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="footer">
              © 2025 CodeToCareer. All Rights Reserved.<br />
             
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
    await transporter.sendMail({
      from: '"CodeToCareer" <erenyeager58.sj@gmail.com>',
      to: email,
      subject: "Welcome to CodeToCareer",
      html: welcomeEmail,
    });
    console.log("Email sent succesfully");
    return NextResponse.json(
      { success: true, message: "Message sent Successfully" },
      { status: 200 }
    );
  } catch (e) {
    console.error("Error sending the email");
    return NextResponse.json(
      { sucess: false, message: "Message not sent" },
      { status: 500 }
    );
  }
}
