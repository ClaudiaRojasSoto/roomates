const http = require("http");

//Instalación de dependencias
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const url = require("url");
const { agregarRoommate, guardarUsuario, reset } = require("./roomate.js");
const { enviar } = require("./n_mailer");
const { agregarGasto, modificarGasto, actualizarGasto } = require("./cuentas");


//Levanta servidor local
http
    .createServer((req, res) => {
        if (req.url == "/" && req.method == "GET") {
            res.setHeader("content-type", "text/html");
            res.end(fs.readFileSync("index.html", "utf8"));
        }

        if (req.url.startsWith("/roommate") && req.method == "POST") {
            agregarRoommate()
                .then(async (usuario) => {
                    guardarUsuario(usuario);
                    res.end(JSON.stringify(usuario, null, 1));
                })
                .catch((e) => {
                    res.statusCode = 500;//Códigos de estatus http en manejo de errores
                    res.end();
                    console.log("Error en registrar usuario", e);
                });
        }

        if (req.url.startsWith("/deleteUser") && req.method == "DELETE") {
            agregarRoommate()
                .then(async (usuario) => {
                    reset(usuario);
                    res.end(JSON.stringify(usuario, null, 1));
                })
                .catch((e) => {//Códigos de estatus http en manejo de errores
                    res.statusCode = 500;
                    res.end();
                    console.log("Error en borrar usuario", e);
                });
        }


        //El método GET llama a todos los usuarios registrados (en el servidor)
        if (req.url.startsWith("/roommates") && req.method == "GET") {
            res.setHeader("content-type", "application/json");
            res.end(fs.readFileSync("roommates.json", "utf8"));
        }
        let gastosJSON = JSON.parse(fs.readFileSync("gastos.json", "utf8"));
        let gastos = gastosJSON.gastos;


        //El método GET llama a todos los gastos registrados (en el servidor)
        if (req.url.startsWith("/gastos") && req.method == "GET") {
            res.end(JSON.stringify(gastosJSON, null, 1));
        }

        //El método POST recibe el payload con la data del  gasto y la almacena en gastos.json
        if (req.url.startsWith("/gasto") && req.method == "POST") {
            let body;
            req.on("data", (payload) => {
                body = JSON.parse(payload);
            });
            req.on("end", () => {
                gasto = {
                    id: uuidv4().slice(30),
                    roommate: body.roommate,
                    descripcion: body.descripcion,
                    monto: body.monto,
                };
                gastos.push(gasto);
                agregarGasto(body);
                fs.writeFileSync("gastos.json", JSON.stringify(gastosJSON, null, 1));
                res.end();
            });
        }


        //El método PUT recibe el payload de la consulta y modifica gastos.json
        if (req.url.startsWith("/gasto") && req.method == "PUT") {
            let body;
            const { id } = url.parse(req.url, true).query; // La Const id almacena el id con query
            req.on("data", (payload) => {
                body = JSON.parse(payload);
                body.id = id;
            });

            req.on("end", () => {
                modificarGasto(body);
                gastosJSON.gastos = gastos.map((g) => {
                    if (g.id == body.id) {
                        return body;
                    }
                    return g;
                });
                fs.writeFileSync("gastos.json", JSON.stringify(gastosJSON, null, 1));
                res.end();
            });
        }
       
        //El método DELETE recibe el id perteneciente al gasto (query string) eliminando el historial de gastos.json
        if (req.url.startsWith("/gasto") && req.method == "DELETE") {
            const { id } = url.parse(req.url, true).query;
            gastosJSON.gastos = gastos.filter((g) => g.id !== id);
            fs.writeFileSync("gastos.json", JSON.stringify(gastosJSON, null, 1));
            res.end();
        }
    })
    .listen(3000, console.log("Servidor escuchando en el puerto 3000"));
