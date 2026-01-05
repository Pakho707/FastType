const validateName = (name) => name?.length >= CONFIG.minNameLength
const validateEmail = (email) => REGEX_EMAIL.test(email)

const showError = (field, msg) => {
    field.style.borderColor = "#ff006e"
    field.style.boxShadow = "0 0 15px rgba(255, 0, 110, 0.5)"
    
    const prev = field.parentNode.querySelector(".erreur-message")
    if (prev) prev.remove()
    
    const err = document.createElement("div")
    err.className = "erreur-message"
    err.innerText = msg
    Object.assign(err.style, {
        color: "#ff006e",
        fontSize: "14px",
        marginTop: "5px",
        fontWeight: "500"
    })
    field.parentNode.insertBefore(err, field.nextSibling)
}

const clearError = (field) => {
    field.style.borderColor = ""
    field.style.boxShadow = ""
    const err = field.parentNode.querySelector(".erreur-message")
    if (err) err.remove()
}