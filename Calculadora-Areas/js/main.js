function menu() {
    return opc = prompt("1.Area de un rectangulo.\n2.Area de un triangulo.\n3.Area de un circulo.\n4.Area de un rombo.\n5.Salir\nElija una opción (1-5)")
}

function areaCirculo() {
    const radio = prompt("Area del Circulo\nPor favor digite el radio del circulo")
    return resultado = 3.1416 * radio * radio
}

function areas(figura) {
    let base = 0
    let altura = 0
    let mensaje1 = "base"
    let mensaje2 = "altura"

    if (figura == "rombo") {
        mensaje1 = "diagonal 1"
        mensaje2 = "diagonal 2"
    }
    base = prompt("Area del " + figura + "\nPor favor digite " + mensaje1 + " del " + figura)
    altura = prompt("Area del " + figura + "\nPor favor digite " + mensaje2 + " del " + figura)
    resultado = base * altura

    if (figura == "triangulo") {
        resultado /= 2
    }

    return resultado
}

alert("BIENVENIDO\nCALCULADORA DE AREAS")
while (true) {
    const opc = menu()
    let resultado = 0
    switch (opc) {
        case "1":
            resultado = areas("rectangulo")
            alert("El area del rectangulo es: " + resultado)
            break
        case "2":
            resultado = areas("triangulo")
            alert("El area del triangulo es: " + resultado)
            break
        case "3":
            resultado = areaCirculo()
            alert("El area del Circulo es: " + resultado)
            break
        case "4":
            resultado = areas("rombo")
            alert("El area del rombo es: " + resultado)
            break
        case "5":
            alert("Gracias por usar el programa")
            break
        default:
            alert("Opción incorrecta")
            break
    }

    if (opc == "5"){break}
}