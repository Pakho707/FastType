const showPopup = () => {
    document.querySelector(".popupBackground").classList.add("active")
}

const hidePopup = () => {
    document.querySelector(".popupBackground").classList.remove("active")
}

const initPopup = () => {
    const bg = document.querySelector(".popupBackground")
    document.querySelector(".zonePartage button").addEventListener("click", showPopup)
    bg.addEventListener("click", (e) => {
        if (e.target === bg) hidePopup()
    })
}