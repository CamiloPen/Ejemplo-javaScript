const menu = document.getElementById("menuPrincipal")
const botones = document.querySelectorAll(".busqueda")
const forms = document.querySelectorAll("form")
const registrar = document.getElementById("registrar")
const btnRegistrar = document.getElementById("btnRegistrar")
const transaccion = document.getElementById("transaccion")
const btnBuscar = document.getElementById("btnBuscar")
let tipoMovimiento = ""
let mostrar = document.getElementById("registarCuenta")
const dbCuentas = []
const dbMovimiento = []
let cuenta = {}

menu.classList.add("ver")

botones.forEach(boton => {
    boton.addEventListener("click", () => {
        if (dbCuentas.length == 0) {
            alert("No hay cuentas registradas")
        } else {
            const classBoton = boton.getAttribute("class")
            tipoMovimiento = boton.getAttribute("id")
            forms.forEach(form => {
                const idForm = form.getAttribute("id")
                if (classBoton == idForm) {
                    const titulos = document.querySelectorAll(".movimiento")
                    titulos.forEach(titulo => {
                        titulo.innerText = tipoMovimiento.toLocaleUpperCase()
                    })
                    mostrar = form

                    let pass = document.getElementById("buscarContraseña")
                    if (tipoMovimiento == "consignar") {
                        pass.setAttribute("style", "display: none;")
                    } else {
                        pass.removeAttribute("style")
                    }
                    
                    toggle(form, menu)
                    console.log(tipoMovimiento)
                } 
            })
        }
    })
});

function toggle(esconder, esconder2) {
    esconder.classList.toggle("ver")
    esconder2.classList.toggle("ver")
}

let numCuenta = dbCuentas.length +1
let numRef = dbMovimiento.length + 1
let desc = ""

registrar.addEventListener("click", () => {
    toggle(mostrar, menu)
})

//////////////// USUARIOS /////////////////////////////

btnRegistrar.addEventListener("click", () => {
    const form = new FormData(mostrar)
    const documento = form.get("documento")
    const nombre = form.get("nombre")
    const contraseña = form.get("contraseña")

    if (documento == "" || nombre == "" || contraseña == "") {
        alert("Por favor no deje espacios en blanco")
    } else {
        dbCuentas.push({numCuenta, documento, nombre, contraseña, saldo: 0})
        alert("Su numero de cuenta es: " + numCuenta)
        numCuenta ++
        toggle(mostrar, menu)
    }
})

btnBuscar.addEventListener("click", () => {
    const form = new FormData(mostrar)
    const cuentaBuscar = form.get("cuenta")
    if (tipoMovimiento == "consignar") {
        cuenta = dbCuentas.find(cuenta => {
            if (cuenta.numCuenta == cuentaBuscar){
                toggle(mostrar, transaccion)
            } else {
                alert("Numero de cuenta no existe")
            }
        })
    } else {
        const contraseñaBuscar = form.get("buscarContraseña")
        cuenta = dbCuentas.find(cuenta => {
            if (cuenta.numCuenta == cuentaBuscar && cuenta.contraseña == contraseñaBuscar){
                toggle(mostrar, transaccion)
            } else {
                alert("El número de cuenta o contraseña no coinciden")
            }
        })
    }
})

////////////////// TRANSACCIONES ///////////////////


function consignar(opc) {
    let buscador = ""
    let buscar = 0
    
    if (opc == "1") {
        buscador = "cuenta"
    } else if (opc == "2") {
        buscador = "documento"
    } else {
        alert("Opción incorrecta")
        return false
    }
    
    const busqueda = Number(prompt("Por favor digite el número de " + buscador))
    for (let i in dbCuentas){
        if (opc == "1") {
            buscar = dbCuentas[i].cuenta
        } else if (opc == "2") {
            buscar = dbCuentas[i].documento
        }
        
        if (buscar == busqueda) {
            const dinero = Number(prompt("Por favor ingrese la cantidad a consignar"))
            dbCuentas[i].saldo += dinero
            desc = "Consignación a cuenta"
            registrarMovimiento(dbCuentas[i].cuenta, "consignacion", dinero, dbCuentas[i].saldo, desc)
            return true
        }
    };

    alert("No se encontro ese número de " + buscador)
    return false
}

function descuento(movimiento){
    exito = false
    let mensaje = "Por favor ingrese la cantidad a retirar"

    cliente = log("cuenta")

    if (movimiento == "pagos") {
        const servicio = menuServicios()
        if (servicio.servicio == 1) {
            desc = "energia"
        } else if (servicio.servicio == 2) {
            desc = "agua"
        } else if (servicio.servicio == 3) {
            desc = "gas"
        } else {
            alert("Opción incorrecta")
            return exito
        }
        mensaje = "Digite el valor a pagar"
        desc = "Pagó un recibo de " + desc + " Ref: " + servicio.referencia
    } else {
        desc = "Retiro en efectivo"
    }

    if (cliente != false) {
        const dinero = Number(prompt(mensaje))
        if (cliente.saldo < dinero) {
            alert("Saldo insuficiente")
            exito = false
        } else {
            cliente.saldo -= dinero
            registrarMovimiento(cliente.cuenta, movimiento, dinero, cliente.saldo, desc)
            exito = true
        }
    }

    return exito
}

////////////////////////////// MOVIMIENTOS ///////////////////////

function registrarMovimiento(cuenta, tipo, dinero, saldo, desc) {
    dbMovimiento.push({numRef, cuenta, tipo, dinero, saldo, desc})
    numRef += 1
}

function listaMovimientos() {
    cliente = log("cuenta")
    let lista = ""

    if (cliente != false) {
        for (let i in dbMovimiento){
            if (dbMovimiento[i].cuenta == cliente.cuenta) {
                lista += `${dbMovimiento[i].numRef} | ${dbMovimiento[i].cuenta} | ${dbMovimiento[i].tipo} | ${dbMovimiento[i].dinero} | ${dbMovimiento[i].saldo} | ${dbMovimiento[i].desc}
`
            }
        }
    }
    return lista
}