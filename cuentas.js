const fs = require("fs");

const agregarGasto = (body) => {
  let roommateView = JSON.parse(fs.readFileSync("roommates.json", "utf8"));
  let roommateData = roommateView.roommates;
  let roommateCount = roommateData.length;

  roommateData.map((e) => {
    if (e.nombre == body.roommate) {
      let recibe = body.monto / roommateCount;
      e.recibe += parseFloat(recibe.toFixed(2));
    } else if (e.nombre !== body.roommate) {
      let debe = body.monto / roommateCount;
      e.debe += parseFloat(debe.toFixed(2));
    }

    fs.writeFileSync("roommates.json", JSON.stringify(roommateView, null, 1));
  });
};

//Función paramodificar las cuentas correspondientes a los gastos realizados por los roommates
const modificarGasto = (body) => {
  let roommateView = JSON.parse(fs.readFileSync("roommates.json", "utf8"));
  let roommateData = roommateView.roommates;
  let roommateCount = roommateData.length;
  const gastosJSON = JSON.parse(fs.readFileSync("gastos.json", "utf8"));
  gastosJSON.gastos.map((g) => {
    roommateData.map((e) => {
      if (e.nombre == body.roommate) {
        let recibe;
        recibe = body.monto / roommateCount;
        e.recibe = parseFloat(recibe.toFixed(2));
      } else if (e.nombre !== body.roommate) {
        let nuevoConteo = roommateCount - 1;
        let nuevoGasto = g.monto / roommateCount;
        console.log(nuevoGasto);
        let debe;
        debe = nuevoGasto;
        e.debe = parseFloat(debe.toFixed(2));
      }
    });
    fs.writeFileSync("roommates.json", JSON.stringify(roommateView, null, 1));
  });
};

module.exports = { agregarGasto, modificarGasto };