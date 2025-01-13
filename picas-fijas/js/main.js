let numFijo = Math.floor(Math.random() * 9999);
console.log(numFijo)
let numero = prompt("Digite un número de 4 digitos")
let fijas = 0
let picas = 0

for (let i = 0; i < 4; i++) {
    if (numero[i] == numFijo[i]){
        fijas += 1
    }
}

console.log(fijas)