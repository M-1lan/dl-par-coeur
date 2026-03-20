const solutions = {
    constant: ["1", "1/1", "1/0!"],
    x: ["1", "1/1", "1/1!"],
    x2: ["0.5", "0,5", "1/2", "1/2!"],
    xn: ["1/n!"],
    reste: ["n"]
};

function checkInputByEvent(event) {
    console.log("Blur")
    const input = event.target;
    if (input.value == "") {
        input.value = 1
    }
    checkFraction(input)
}

function getFractionValue(input) {
    const parent = input.parentNode

    if (!parent.classList.contains("frac")) {
        console.error(input)
        console.error("Le parent de cet élément n'est pas une fraction.")
    } else {
        var numerateur;
        var denominateur;

        parent.childNodes.forEach(sibling => {
            if (sibling.nodeType == 1){
                if (sibling.classList.contains("numerateur")) {
                    numerateur = sibling
                } else if (sibling.classList.contains("denominateur")) {
                    denominateur = sibling
                }
            }
        })

        var numerateurValue = numerateur.value.replace(" ", "")
        var denominateurValue = denominateur.value.replace(" ", "")

        if (denominateur.classList.contains("hide") || denominateurValue == "") {
            return numerateurValue
        }

        if (!denominateur.classList.contains("hide") && numerateurValue == "") {
            numerateurValue = "1"
        }

        return numerateurValue + "/" + denominateurValue
    }
}

function checkFraction(input) {
    console.log("Vérification pour")
    console.log(input)
    const key = input.dataset.key;
    const validValues = solutions[key];
    var value

    if (key != "reste") {
        const parent = input.parentNode
        
        value = getFractionValue(input) ?? ""
        
        console.log("validValues : " +validValues)
        
        if (validValues.includes(value)) {
            parent.childNodes.forEach(sibling => {
                if (sibling.nodeType == 1){
                    if (sibling.classList.contains("numerateur")
                            || sibling.classList.contains("denominateur")) {
                        sibling.classList.add("succes")
                        sibling.classList.remove("echec")
                    }
                }
            })
        
        } else if (value == "") {
            parent.childNodes.forEach(sibling => {
                if (sibling.nodeType == 1){
                    if (sibling.classList.contains("numerateur")
                            || sibling.classList.contains("denominateur")) {
                        sibling.classList.remove("succes")
                        sibling.classList.remove("echec")
                    }
                }
            })
        } else {
            parent.childNodes.forEach(sibling => {
                if (sibling.nodeType == 1){
                    if (sibling.classList.contains("numerateur")
                            || sibling.classList.contains("denominateur")) {
                        sibling.classList.remove("succes")
                        sibling.classList.add("echec")
                    }
                }
            })
        }
    } else {
        // key == reste
        value = input.value
        if (validValues.includes(value)) {
            input.classList.add("succes")
            input.classList.remove("echec")
        } else if (value == "") {
            input.classList.remove("succes")
            input.classList.remove("echec")
        } else {
            input.classList.remove("succes")
            input.classList.add("echec")
        }
    }
    
    console.log("Fin de vérif")
}

function checkFracDeletion(event) {
    const input = event.target
    const value = input.value.trim()

    if (event.key == "Backspace"
            && input.selectionStart == 0
            && input.classList.contains("denominateur")
            && value == ""
        ) {
        event.preventDefault()

        input.parentNode.childNodes.forEach(sibling => {
            if (sibling.nodeType == 1) {
                if (sibling.classList.contains("hideable")) {sibling.classList.add("hide")}

                if (sibling.classList.contains("numerateur")) {
                    sibling.selectionStart = sibling.value.length
                    sibling.selectionEnd = sibling.value.length
                }
            }
            
        })
    } else if (event.key == "Backspace"
            && input.selectionStart == 0
            && input.classList.contains("denominateur")
        ) {
        event.preventDefault()
        input.parentNode.childNodes.forEach(sibling => {
            if (sibling.nodeType == 1) {
                if (sibling.classList.contains("numerateur")) {
                    sibling.selectionStart = sibling.value.length
                    sibling.selectionEnd = sibling.value.length
                    sibling.value = sibling.value.substring(0, sibling.value.length - 1)
                }
            }
            
        })
    }
    checkFraction(input)
}

function checkFracCreation(event) {
    const input = event.target
    const value = input.value.trim()

    if (input.classList.contains("numerateur") && value.indexOf("/") > -1) {
        const before = value.substring(0, value.indexOf("/"))
        const after = value.substring(value.indexOf("/") + 1)

        input.value = before
        input.parentNode.childNodes.forEach(sibling => {
            if (sibling.nodeType == 1) {
                sibling.classList.remove("hide")

                if (sibling.classList.contains("denominateur")) {
                    sibling.value = after
                    sibling.selectionStart = 0
                    sibling.selectionEnd = 0
                }
            }
            
        })
    }

    checkFraction(input)
}

// Attacher le onBlur à tous les inputs
document.querySelectorAll("input").forEach(input => {
    input.addEventListener("blur", checkInputByEvent);
    input.addEventListener("keydown", checkFracDeletion)
    input.addEventListener("keyup", checkFracCreation)
});