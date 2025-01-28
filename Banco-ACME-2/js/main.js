const menu = document.getElementById("menuPrincipal")
const crear = document.getElementById("crear")
const consignar = document.getElementById("consignar")
const retirar = document.getElementById("retirar")
const pagar = document.getElementById("pagar")
const lista = document.getElementById("lista")
const btnRegistrar = document.getElementById("btnRegistrar")
const btnBuscar = document.getElementById("btnBuscar")
const btnContinuar = document.getElementById("btnContinuar")

const formCuenta = document.querySelector("#registarCuenta")
const busqueda = document.querySelector("#busqueda")
const retiro = document.querySelector("#retiro")
numCuenta = 1

menu.setAttribute('style', 'display: flex;')

function toggle(esconder) {
    esconder.setAttribute("style", "display: flex")
    menu.toggleAttribute('style')
}

crear.addEventListener("click", () =>{
    toggle(formCuenta)
})

consignar.addEventListener("click", () =>{
    toggle(busqueda)
})

retirar.addEventListener("click", () =>{
    toggle(busqueda)
})

pagar.addEventListener("click", () =>{
    toggle(busqueda)
})

lista.addEventListener("click", () =>{
    toggle(busqueda)
})

btnRegistrar.addEventListener("click", () => {
    const form = new FormData(formCuenta)
    registarCuenta(numCuenta, form.get("documento"), form.get("nombre"), form.get("contraseña"))
    numCuenta ++
    formCuenta.toggleAttribute('style')
    menu.setAttribute("style", "display: flex")
}) 

function initDB() {
    const openDB = window.indexedDB.open("bancoDB", 1)

    openDB.onupgradeneeded = (init) => {
        let bancoDB = init.target.result

        bancoDB.onerror = () => {
            console.error("Error cargando la base de datos.")
        }

        let cuentas = bancoDB.createObjectStore("cuentas", {keyPath: "id", autoIncrement: true})
        cuentas.createIndex("cuenta", "cuenta", {unique: true})

        let movimientos = bancoDB.createObjectStore("movimientos", {keyPath: "id", autoIncrement: true})
        movimientos.createIndex("numRef", "numRef", {unique: true})
    }

    openDB.onerror = () => console.error("Error abriendo la base de datos")

    openDB.onsuccess = () => {
        console.log("Base de datos abierta")
    }
}

function registarCuenta(cuenta, documento, nombre, contraseña) {
    const openDB = window.indexedDB.open("bancoDB", 1)

    openDB.onsuccess = () => {
        let inventarioDB = openDB.result
        const transaction = inventarioDB.transaction(["cuentas"], "readwrite")
        const cuentaStore = transaction.objectStore("cuentas")

        if (documento == "" || nombre == "" || contraseña == "") {
            alert("Por favor no deje espacios en blanco")
        } else {
            const nuevoProducto = {cuenta, documento, nombre, contraseña}
            const agregarRequest = cuentaStore.add(nuevoProducto)

            agregarRequest.onsuccess = () => {
                console.log("Cuenta agregada correctamente")
                alert("Cuenta agregada correctamente")
            }

            agregarRequest.onerror= (error) => {
                if (error.target.error.name == "ConstraintError")
                    console.log("Error: El número de cuenta ya esta registrado.")
                else
                    console.log("Error desconocido.", error.target.error.name)
            }
        }        
    }
}

function obtenerTodosProductos() {
    const openDB = window.indexedDB.open("inventario", 1)

    openDB.onsuccess = () => {
        let inventarioDB = openDB.result
        const transaction = inventarioDB.transaction(["productos"], "readwrite")
        const productoStore = transaction.objectStore("productos")


    }
}

initDB()