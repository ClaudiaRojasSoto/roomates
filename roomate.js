const axios = require("axios");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");


//Mediante el método file system se manipulan los archivos en el servidor y se capturan errores (try/catch)
const agregarRoommate = async () => {
  try {
    const { data } = await axios.get("https://randomuser.me/api/");
    const usuario = data.results[0];
    const user = {
      id: uuidv4().slice(30),//Genera un uuid de 6 dígitos para  los usuarios agregados (roommates)
      nombre: `${usuario.name.first} ${usuario.name.last}`,
      debe: 0,
      recibe: 0,
      correo: usuario.email,
    };
    return user;
  } catch (e) {
    throw e;
  }
};

//Guarda al usuario haciendo un push a roommates.json
const guardarUsuario = (usuario) => {
  const roommatesJSON = JSON.parse(fs.readFileSync("roommates.json", "utf8"));
  roommatesJSON.roommates.push(usuario);
  fs.writeFileSync("roommates.json", JSON.stringify(roommatesJSON));
};

// Función de pruebas con reset
const reset = (usuario) => {
  const roommatesJSON = JSON.parse(fs.readFileSync("roommates.json", "utf8"));
  const gastosJSON = JSON.parse(fs.readFileSync("gastos.json", "utf8"));
  roommatesJSON.roommates.length = 0;
  gastosJSON.gastos.length = 0;

  fs.writeFileSync("roommates.json", JSON.stringify(roommatesJSON));
  fs.writeFileSync("gastos.json", JSON.stringify(gastosJSON));
};

module.exports = { agregarRoommate, guardarUsuario, reset };
