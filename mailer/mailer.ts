import nodemailer from "nodemailer";

//configuracion del transportador de mail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "nickswilliamapi@gmail.com",
    pass: "ecmxbuazxptrsfhs",
  },
  from: "nickswilliamapi@gmail.com",
});

//funcion para enviar correo

export const sendEmail = async (to: string, code: string): Promise<void> => {
  try {
    //configuracion de detalles para el correo electrónico
    const mailOptions = {
      from: '"Nicks-API" nickswilliamapi@gmail.com',
      to,
      subject: "Código de verificación para ingresar a la cuenta",
      text: `Bienvenid@, este es tu código de acceso para ingresar a la cuenta: 
            Código: ${code}
            `,
    };

    //enviar el correo electrónico
    await transporter.sendMail(mailOptions);
    console.log("Correo electrónico enviado");
  } catch (error) {
    console.error("Error al enviar el correo electrónico", error);
  }
};
