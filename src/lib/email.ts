import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.mailtrap.io",
  port: parseInt(process.env.SMTP_PORT || "2525"),
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },
});

export async function sendWelcomeEmail(to: string, name: string, planName: string) {
  const mailOptions = {
    from: '"VyaNexus Team" <noreply@vyanexus.com.br>',
    to,
    subject: "Bem-vindo ao VyaNexus - Sua infraestrutura está pronta!",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; rounded: 20px;">
        <h1 style="color: #2563eb; font-weight: 900; letter-spacing: -0.05em;">VyaNexus</h1>
        <p style="font-size: 18px; font-weight: bold; color: #111827;">Olá, ${name}!</p>
        <p style="color: #4b5563; line-height: 1.6;">
          Sua assinatura do plano <strong>${planName}</strong> foi confirmada com sucesso. 
          Sua infraestrutura de alta performance já está provisionada e pronta para escala.
        </p>
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 12px; margin: 20px 0;">
          <p style="margin: 0; font-size: 14px; font-weight: bold; color: #6b7280; text-transform: uppercase;">Próximos Passos:</p>
          <ul style="color: #374151; padding-left: 20px;">
            <li>Acesse seu <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="color: #2563eb; font-weight: bold;">VyaPanel</a></li>
            <li>Configure seus domínios</li>
            <li>Comece o upload para o VyaCloud</li>
          </ul>
        </div>
        <p style="font-size: 12px; color: #9ca3af; margin-top: 40px;">
          Este é um e-mail automático. Não responda a este endereço.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[Email] Boas-vindas enviado para: ${to}`);
    return true;
  } catch (error) {
    console.error("[Email Error]:", error);
    return false;
  }
}
