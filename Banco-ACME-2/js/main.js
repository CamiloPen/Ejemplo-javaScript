const menu = document.getElementById("menuPrincipal")
const botones = document.querySelectorAll("input[type = 'button']")
const forms = document.querySelectorAll("form")
let tipoMovimiento = ""
let mostrar = ""
initDB()
numCuenta = 1

menu.classList.add("ver")

botones.forEach(boton => {
    boton.addEventListener("click", () => {
        const classBoton = boton.getAttribute("class")
        tipoMovimiento = boton.getAttribute("id")
        forms.forEach(form => {
            const idForm = form.getAttribute("id")
            if (classBoton == idForm) {
                const titulo = document.getElementById("movimiento")
                switch (tipoMovimiento) {
                    case "consignar":
                        titulo.innerText = "Consignar"
                        break;
                    case "retirar":
                        titulo.innerText = "Retirar"
                        break;
                    case "pagar":
                        titulo.innerText = "Pagar"
                        break;
                    case "lista":
                        titulo.innerText = "Lista"
                        break;
                    default:
                        break;
                }
                mostrar = form
                console.log(mostrar.outerHTML)
                toggle(form, menu)
            } 
        })
    })
});

function toggle(esconder, esconder2) {
    esconder.classList.toggle("ver")
    esconder2.classList.toggle("ver")
    console.log(tipoMovimiento)
}

btnRegistrar.addEventListener("click", () => {
    const formCuenta = document.querySelector("#registarCuenta") 
    const form = new FormData(formCuenta)
    registarCuenta(numCuenta, form.get("documento"), form.get("nombre"), form.get("contraseña"))
    numCuenta ++
    toggle(formCuenta, menu)
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
            const nuevoProducto = {cuenta, documento, nombre, contraseña, saldo: 0}
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

