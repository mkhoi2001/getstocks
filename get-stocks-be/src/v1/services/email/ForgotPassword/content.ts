export const contentForgotPasswordEn = (data: { token: string; appName: string }) => {
  return `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css">
        <!-- Font Family -->
        <link rel="preconnect" href="https://fonts.gstatic.com">
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css?family=Montserrat:400,500,600,700,800&amp;display=swap"
            rel="stylesheet">
        <link
            href="https://fonts.googleapis.com/css?family=Rubik:300,300i,400,400i,500,500i,700,700i,900,900i&amp;display=swap"
            rel="stylesheet">
        <style>
            * {
                margin: 0;
                padding: 0;
            }
    
            body {
                background-color: #f1f1f1;
            }
    
            html {
                font-family: "Montserrat", sans-serif, "Roboto", sans-serif;
                box-sizing: border-box;
            }
    
            p {
                font-size: 16px;
            }
    
            .email-container {
                padding-bottom: 10rem;
            }
    
            .text {
                margin: 1rem 0;
            }
    
    
            .email-body {
                margin: 0 auto;
                border-radius: 0.2rem;
                border: 2px solid rgba(175, 168, 168, 0.473);
                max-width: 40rem;
                /* height: 20rem; */
                background-color: #fff;
                padding: 4rem;
            }
    
            .btn-verify {
                display: inline-block;
                padding: 18px 20px;
                background-color: #1890ff;
                border-radius: 3px;
                text-decoration: none;
                color: #fff;
                font-weight: 600;
                font-size: 16px;
    
            }
    
            .email-btn {
                width: 100%;
                margin-bottom: 3rem;
                text-align: center;
            }
    
            .text-email {
                color: #1890ff;
                text-decoration: underline;
                font-weight: 600;
                font-size: 20px;
    
            }
    
            .note {
                font-size: 12px;
                color: #706f6f;
            }
    
            .username {
                color: #000;
                font-weight: 700;
                font-size: 16px;
            }
        </style>
    </head>
    
    <body>
        <div class="email-container">
          
            <div class="email-body">
                <p class="text">Reset your ${data.appName} password</p>
                <p style="margin: 1rem 0 1rem 0;">We heard that you lost your password. Sorry about that!</p>
                <p class="text">But don’t worry! You can use the following token to reset your password:</p>
                <div class="email-btn"><div class="btn-verify">${data.token}</div></div>
                <p class="text" style="line-height: 1.4rem;"> If you don’t use this token within 3 hours, it will expire
               </p>
                <p class="text">Thanks,</p>
                <p class="note">You're receiving this email because a password reset was requested for your account.</p>
            </div>
        </div>
    </body>
    
    </html>`
}

export default { contentForgotPasswordEn }
