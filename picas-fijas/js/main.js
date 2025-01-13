function random() {
    while (true) {
        let num = Math.floor(Math.random() * 9999).toString();
        if (num.length == 4){
            num = comprobar(num)
            if (num) {
                return num
            }
        }
    }
}

function comprobar(num) {
    let repetido = false
    for (let i = 0; i <= 3; i++) {
        const contador = num.search(num[i])
        if (contador != i){
            repetido = true
        }
    }
    if (repetido == false){
        return num
    }
}

const numFijo = random()
while (true) {
    let fijas = 0
    let picas = 0
    console.log(numFijo)
    let numero = prompt("Digite un número de 4 digitos distintos")
    if (numero.length > 3) {
        numero = comprobar(numero)
        if (numero == numFijo) {
            alert("Felicitaciones el numero es: " + numFijo)
            break
        } else {
            for (let i = 0; i <= 3; i++) {
                if (numFijo[i] == numero[i]) {
                    fijas += 1
                } else if (numFijo.search(numero[i]) != -1) {
                    picas += 1
                }
            }
        }
        alert("Su numero es: " + numero + "\nTiene " + fijas + " fijas" + "\nTiene " + picas + " picas")
    } else {
        alert("Por favor dijete 4 digitos distintos")
    }
    if (numero === undefined){
        alert("Por favor dijete 4 digitos distintos")
    }
}