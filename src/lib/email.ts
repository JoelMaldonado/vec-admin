import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendPasswordResetEmail(email: string, name: string, code: string) {
  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: email,
    subject: 'Código para restablecer tu contraseña - VEC Admin',
    html: `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Restablecer contraseña</title>
</head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border-radius:16px;border:1px solid #e2e8f0;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background-color:#2563eb;padding:32px;text-align:center;">
              <div style="display:inline-flex;align-items:center;justify-content:center;width:56px;height:56px;background:rgba(255,255,255,0.2);border-radius:12px;margin-bottom:12px;">
                <span style="color:#ffffff;font-size:22px;font-weight:700;">VEC</span>
              </div>
              <p style="margin:0;color:rgba(255,255,255,0.85);font-size:14px;">Vida en Cristo &mdash; Sistema de Administración</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px 32px;">
              <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0f172a;">Restablecer contraseña</h1>
              <p style="margin:0 0 24px;font-size:15px;color:#475569;">Hola <strong>${name}</strong>, recibimos una solicitud para restablecer tu contraseña.</p>
              <p style="margin:0 0 16px;font-size:14px;color:#64748b;">Usa el siguiente código de verificación. Expira en <strong>15 minutos</strong>.</p>
              <!-- Code box -->
              <div style="background:#f1f5f9;border:2px solid #e2e8f0;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;">
                <span style="font-size:36px;font-weight:800;letter-spacing:12px;color:#1e293b;font-family:monospace;">${code}</span>
              </div>
              <p style="margin:0;font-size:13px;color:#94a3b8;">Si no solicitaste este código, puedes ignorar este mensaje. Tu contraseña no cambiará.</p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#f8fafc;border-top:1px solid #e2e8f0;padding:20px 32px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#94a3b8;">Iglesia Vida en Cristo &copy; ${new Date().getFullYear()}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim(),
  })

  if (error) throw new Error(`Error al enviar email: ${error.message}`)
}
