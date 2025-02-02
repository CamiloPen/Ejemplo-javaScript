iniciarDB()

const menu = document.getElementById("menuPrincipal")
const forms = document.querySelectorAll("form")
let mostrar = document.getElementById("busqueda")
let dineroMov = document.getElementById("dinero")
let pass = document.getElementById("buscarContraseña")
let recibos = document.getElementById("pago")
let vistaForm = ""
let dbCuentas = obtenerDatos("cuentas")
let dbMovimiento = obtenerDatos("movimientos")
let cuentaEncontrada = ""
let tipoMovimiento = ""
let desc = ""

menu.classList.add("ver")

function toggle(esconder, esconder2) {
    esconder.classList.toggle("ver")
    esconder2.classList.toggle("ver")
}

function mostrarOpcion(boton){
    if (dbCuentas.length == 0) {
        alert("No hay cuentas registradas")
    } else {
        tipoMovimiento = boton.target.getAttribute("id")
        const titulos = document.querySelectorAll(".movimiento")
        titulos.forEach(titulo => {
            titulo.innerText = tipoMovimiento.toLocaleUpperCase()
        })
        
        switch (tipoMovimiento) {
            case "consignar":
                pass.setAttribute("style", "display: none;")
                dineroMov.setAttribute("placeholder", "Por favor digite la cantidad a consignar")
                desc = "Consignación a la cuenta"
                break;
            case "retirar":
                dineroMov.setAttribute("placeholder", "Por favor digite la cantidad a retirar")
                desc = "Retiro a la cuenta"
                break;
            case "pagar":
                recibos.classList.add("ver")
                dineroMov.setAttribute("placeholder", "Por favor digite la cantidad a pagar")
                break;
            default:
                break
        }

        toggle(mostrar, menu)
    }
}

function limpiar() {
    document.querySelectorAll("input").forEach(input => {
        if (input.type != "button") {
            input.value = ""
        } 
    })
}

//////////////// USUARIOS /////////////////////////////

function registrar() {
    let numCuenta = dbCuentas.length +1
    const form = new FormData(document.getElementById("registarCuenta"))
    const documento = form.get("documento")
    const nombre = form.get("nombre")
    const contraseña = form.get("contraseña")

    if (documento == "" || nombre == "" || contraseña == "") {
        alert("Por favor no deje espacios en blanco")
    } else {
        dbCuentas.push({numCuenta, documento, nombre, contraseña, saldo: 0})
        alert("Su numero de cuenta es: " + numCuenta)
        toggle(document.getElementById("registarCuenta"), menu)
    }
    limpiar()
    agregarDatos(dbCuentas, "cuentas")
    dbCuentas = obtenerDatos("cuentas")
}

function buscar() {
    const form = new FormData(mostrar)
    const cuentaBuscar = form.get("cuenta")
    vistaForm = document.getElementById("transaccion")

    if (tipoMovimiento == "consignar") {
        let mensaje = "Numero de cuenta no existe"
        dbCuentas.find(cuenta => {
            if (cuenta.numCuenta == cuentaBuscar){
                mensaje = false
                cuentaEncontrada = cuenta
                toggle(mostrar, vistaForm)
            }
        })
        if (mensaje != false) {
            alert(mensaje)
        }
    } else {
        const contraseñaBuscar = pass.value
        let mensaje = "N° de cuenta y contraseña no coinciden"
        dbCuentas.find( cuenta => {
            if (cuenta.numCuenta == cuentaBuscar && cuenta.contraseña == contraseñaBuscar){
                cuentaEncontrada = cuenta
                mensaje = false
                if (tipoMovimiento == "lista") {
                    vistaForm = document.getElementById("listaMovimientos")
                    listaMovimientos()
                }
                toggle(mostrar, vistaForm)
            }
        })
        if (mensaje != false) {
            alert(mensaje)
        }
    }
    
    
}

////////////////// TRANSACCIONES ///////////////////

function transaccion() {
    let mensaje = true
    let dinero = Number(dineroMov.value)
    if (dinero < 1) {
        alert("Ingresó un valor equivocado")
    } else {
        if (tipoMovimiento == "consignar") {
            cuentaEncontrada.saldo += dinero
            console.log(cuentaEncontrada.saldo)
        } else {
            if ((cuentaEncontrada.saldo - dinero) < 0) {
                alert("Saldo insuficiente")
                mensaje = false
            } else {
                if (tipoMovimiento == "pagar") {
                    let datos = new FormData(vistaForm) 
                    desc = `Pagó recibo de: ${datos.get("recibo")} Referencia: ${datos.get("numRef")}`
                }
                cuentaEncontrada.saldo -= dinero
            }
        }
        if (mensaje) {
            alert("Transaccion exitosa")
            registrarMovimiento(cuentaEncontrada.numCuenta, tipoMovimiento, dinero, cuentaEncontrada.saldo, desc)
        }
        toggle(menu, vistaForm)
    }
    recibos.classList.remove("ver")
    pass.removeAttribute("style")
    limpiar()
}

////////////////////////////// MOVIMIENTOS ///////////////////////

function registrarMovimiento(numCuenta, tipo, dinero, saldo, desc) {
    let numRef = dbMovimiento.length + 1
    dbMovimiento.push({numRef, numCuenta, tipo, dinero, saldo, desc})
    numRef += 1
    agregarDatos(dbMovimiento, "movimientos")
    agregarDatos(dbCuentas, "cuentas")
    dbMovimiento = obtenerDatos("movimientos")
}

function listaMovimientos() {
    let tabla = document.getElementById("tabla")
    let lista = `<tr>
                <th>N° Transaccion</th>
                <th>Tipo de movimiento</th>
                <th>Cantidad</th>
                <th>Saldo</th>
                <th>Descripción</th>
                </tr>`
    dbMovimiento.forEach( movimiento => {
        if (movimiento.numCuenta == cuentaEncontrada.numCuenta) {
            lista += `<tr>
                <th>${movimiento.numRef}</td>
                <td>${movimiento.tipo}</td>
                <td>${movimiento.dinero}</td>
                <td>${movimiento.saldo}</td>
                <td>${movimiento.desc}</td>
            </tr>`
        }
    })
    tabla.innerHTML = lista
}

/////////////////////// INDEXED DB //////////////////////////

function iniciarDB() {
    let request = indexedDB.open("dbBanco", 1);  

    request.onupgradeneeded = function(event) {
        let db = event.target.result;
        let cuentas = db.createObjectStore("cuentas", { keyPath: "numCuenta" });
        let movimientos = db.createObjectStore("movimientos", { keyPath: "numRef" });
    };

    request.onsuccess = function(event) {
        let db = event.target.result;
        console.log("Base de datos abierta exitosamente");
    };

    request.onerror = function(event) {
        console.log("Error al abrir la base de datos", event);
    };
}

function agregarDatos(dataList, table) {
    let request = indexedDB.open("dbBanco", 1);

    request.onsuccess = function(event) {
        let db = event.target.result;
        let transaction = db.transaction([table], "readwrite");
        let store = transaction.objectStore(table);

        dataList.forEach(item => {
            let request = store.put(item); 

            request.onsuccess = function() {
                console.log("Item agregado o actualizado correctamente");
            };

            request.onerror = function(event) {
                console.log("Error al agregar o actualizar el Item:", event);
            };
        });
    };

    request.onerror = function(event) {
        console.log("Error al abrir la base de datos:", event);
    };
}

function obtenerDatos(table) {
    let request = indexedDB.open("dbBanco", 1); 
    let dataList = []
    request.onsuccess = function(event) {
        let db = event.target.result;
        let transaction = db.transaction([table], "readonly");
        let data = transaction.objectStore(table);

        let cursorRequest = data.openCursor();

        cursorRequest.onsuccess = function(event) {
            let cursor = event.target.result;

            if (cursor) {
                dataList.push(cursor.value); 
                cursor.continue();
            } else {
                console.log("Datos obtenidos");
            }
        };

        cursorRequest.onerror = function(event) {
            console.log("Error al obtener los datos:", event);
        };
    };

    request.onerror = function(event) {
        console.log("Error al abrir la base de datos:", event);
    };

    return dataList
}