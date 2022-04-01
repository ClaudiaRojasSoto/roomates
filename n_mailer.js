const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "chileinfoclub@gmail.com",
    pass: "2022@infoclub",
  },
});

//Función Async con método try/Catch/throw que enviaría un correo electrónico a los roommates cuando se registre un nuevo gasto.
const enviar = async (nombre, descripcion, monto, correos) => {
  let mailOptions = {
    from: "chileinfoclub@gmail.com",
    to: ["claudiarojassoto@gmail.com"],
    subject: `Gasto agregado`,
    html: `<h3>Se registra un gasto de ${nombre}. La descripción es: ${descripcion}, por un monto de $.${monto}</h3>`,
  };
  try {
    const result = await transporter.enviarMail(mailOptions);
  } catch (e) {
    throw e;
  }
};

module.exports = { enviar };

