const dbCuentas = []
const dbMovimiento = []
let numCuenta = 1
let numRef = 1
let ciclo = true
let exito = false
let desc = ""

alert("¡Bienvenido a Acme Bank!");

while (ciclo == true) {
    const opc = menuPrincipal()
    switch (opc) {
        case "1":
            alert("Registro")
            if (registrar()) {
                alert("Registro exitoso el numero de cuenta es: " + numCuenta)
                numCuenta += 1
            };
            break;
        case "2":
            alert("Consignar Dinero")
            if (consignar(menuConsignar(), dbCuentas)) {
                alert("Consignacion exitosa")
            } else {
                alert("Consignacion fallida")
            }
            break;
        case "3":
            alert("Retirar Dinero")
            if (descuento("retirar", dbCuentas)) {
                alert("Retiro exitoso")
            } else {
                alert("Retiro fallido")
            }
            break;
        case "4":
            alert("Retirar Dinero")
            if (descuento("pagos", dbCuentas)) {
                alert("Pago exitoso")
            } else {
                alert("Pago fallido")
            }
            break;
        case "5":
            alert("lista de Movimientos")
            listaMovimientos()
            break;
        case "6":
            alert(("Gracias Por Preferir nuestro banco"))
            ciclo = false
            break;
        default:
            alert("Opción incorrecta")
            break;
    }
}

/////////////////////////// MENUS ////////////////////////

function menuPrincipal(){
    return prompt(
        `1. Crear una cuenta
         2. Consignar dinero
         3. Retirar dinero
         4. Pagar servicios 
         5. Lista de movimientos
         6. Salir
         Por favor elija una opción (1-6)`)
}

function menuConsignar() {
    return prompt(
        `Para consignar por favor seleccione

         1.Número de cuenta
         2.Número de documento`
    )
}

function menuServicios() {
    return {servicio: prompt(
        `Escriba el servicio a pagar
        1.Energía
        2.Agua
        3.Gas`), referencia: prompt("Ingrese el número de referencia")}
}

//////////////// USUARIOS /////////////////////////////

function registrar() {
    dbCuentas.push({
        cuenta: numCuenta,
        documento: prompt("Por favor digite el número de documento").toLowerCase(),
        nombre: prompt("Por favor escriba su nombre"),
        contraseña: prompt("Por ingrese una contraseña"),
        saldo: 0,
    })
    return numCuenta
}

////////////////// TRANSACCIONES ///////////////////

function consignar(opc, dbCuentas) {
    let buscador = ""

    if (opc == "1") {
        buscador = "cuenta"
    } else if (opc == "2") {
        buscador = "documento"
    }

    if (buscador == "") {
        alert("Opción incorrecta")
        return exito
    } else {
        const busqueda = prompt("Por favor digite el número de " + buscador)
        for (let i in dbCuentas){
            if (dbCuentas[i].cuenta == busqueda) {
                const dinero = Number(prompt("Por favor ingrese la cantidad a consignar"))
                dbCuentas[i].saldo += dinero
                desc = "Consignación a cuenta"
                exito = true
                registrarMovimiento(dbCuentas[i].cuenta, "consignacion", dinero, dbCuentas[i].saldo, desc)
                break
            } else {
                console.log(dbCuentas[i].buscador)
                alert("No se encontro ese número de " + buscador)
            }
        };
        return exito
    }
}

function descuento(movimiento, dbCuentas){
    const busqueda = prompt("Por favor digite el número de cuenta")
    let mensaje = "Por favor ingrese la cantidad a retirar"
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
            return false
        }
        mensaje = "Digite el valor a pagar"
        desc = "Pagó un recibo de " + desc + " Ref: " + servicio.referencia
    } else {
        desc = "Retiro en efectivo"
    }

    for (let i in dbCuentas){
        if (dbCuentas[i].cuenta == busqueda) {
            const dinero = Number(prompt(mensaje))
            if (dbCuentas[i].saldo < dinero) {
                alert("Saldo insuficiente")
                exito = false
            } else {
                dbCuentas[i].saldo -= dinero
                registrarMovimiento(dbCuentas[i].cuenta, movimiento, dinero, dbCuentas[i].saldo, desc)
                exito = true
            }
            
        } else {
            alert("No se encontro ese número de cuenta")
        }
    };
    
    return exito
}

////////////////////////////// MOVIMIENTOS ///////////////////////

function registrarMovimiento(cuenta, tipo, dinero, saldo, desc) {
    dbMovimiento.push({cuenta, tipo, dinero, saldo, desc})
}

function listaMovimientos() {
    const busqueda = prompt("Por favor digite el número de cuenta")
    for (let i in dbMovimiento){
        if (dbMovimiento[i].cuenta == busqueda) {
            alert(dbMovimiento[i])
        }
    }
}