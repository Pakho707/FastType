const display = {
    score: (s, t) => document.querySelector(SELECTORS.score).innerText = `${s} / ${t}`,
    chrono: (ms) => document.querySelector(SELECTORS.chrono).innerText = formatTime(ms),
    proposition: (txt) => document.querySelector(SELECTORS.proposition).innerText = txt,
    stats: (percent, speed, mode) => {
        const el = document.querySelector(SELECTORS.stats)
        el.innerHTML = `
            <p>✅ Taux de réussite : <strong>${percent}%</strong></p>
            <p>⚡ Vitesse : <strong>${speed} ${mode}/min</strong></p>
        `
        el.style.display = "block"
    }
}

const sendEmail = (name, email, score, total, time, mode, speed, percent) => {
    const timeStr = formatTimeText(time)
    const subj = "Partage du score FastType"
    const body = 
        `Salut, c'est ${name} !%0D%0A%0D%0A` +
        `Je viens de terminer une partie sur FastType avec les resultats suivants :%0D%0A%0D%0A` +
        `Mode de jeu : ${mode}%0D%0A` +
        `Taux de reussite : ${percent}%%0D%0A` +
        `Temps : ${timeStr}%0D%0A` +
        `Vitesse moyenne : ${speed} ${mode} par minute%0D%0A%0D%0A` +
        `Essaie de battre mon score !`
    
    window.open(`mailto:${email}?subject=${subj}&body=${body}`)
}

function lancerJeu() {
    initPopup()

    let state = {
        score: 0,
        idx: 0,
        items: pickRandom(listeMots, CONFIG.itemsPerGame),
        mode: "mots",
        time: 0,
        started: false,
        startTime: 0,
        interval: null
    }

    const btn = document.getElementById("btnValiderMot")
    const input = document.getElementById("inputEcriture")
    const radios = document.querySelectorAll(SELECTORS.radios)

    display.proposition(state.items[0])

    const startTimer = () => {
        if (state.started) return
        state.started = true
        state.startTime = Date.now()
        radios.forEach(r => r.disabled = true)
        state.interval = setInterval(() => {
            state.time = Date.now() - state.startTime
            display.chrono(state.time)
        }, CONFIG.chronoTick)
    }

    input.addEventListener("input", () => input.value.length && startTimer())
    input.addEventListener("keypress", (e) => e.key === "Enter" && (e.preventDefault(), btn.click()))

    radios.forEach(r => {
        r.addEventListener("change", (e) => {
            if (state.idx > 0 || state.started) {
                document.getElementById(state.mode === "mots" ? "mots" : "phrases").checked = true
                return
            }
            
            if (e.target.value === "1") {
                state.items = pickRandom(listeMots, CONFIG.itemsPerGame)
                state.mode = "mots"
            } else {
                state.items = pickRandom(listePhrases, CONFIG.itemsPerGame)
                state.mode = "phrases"
            }
            display.proposition(state.items[0])
        })
    })

    btn.addEventListener("click", () => {
        startTimer()
        
        if (input.value === state.items[state.idx]) state.score++
        state.idx++
        display.score(state.score, state.idx)
        input.value = ''

        if (state.items[state.idx]) {
            display.proposition(state.items[state.idx])
        } else {
            clearInterval(state.interval)
            state.time = Date.now() - state.startTime
            display.chrono(state.time)
            display.proposition("Le jeu est fini")
            btn.disabled = true
            
            const speed = calcSpeed(state.score, state.time)
            const percent = calcPercent(state.score, state.idx)
            display.stats(percent, speed, state.mode)
            
            addRestartBtn(() => {
                state = {
                    score: 0,
                    idx: 0,
                    items: state.mode === "mots" 
                        ? pickRandom(listeMots, CONFIG.itemsPerGame)
                        : pickRandom(listePhrases, CONFIG.itemsPerGame),
                    mode: state.mode,
                    time: 0,
                    started: false,
                    startTime: 0,
                    interval: null
                }
                
                input.value = ''
                btn.disabled = false
                clearInterval(state.interval)
                display.chrono(0)
                document.querySelector(SELECTORS.stats).style.display = "none"
                radios.forEach(r => r.disabled = false)
                display.proposition(state.items[0])
                display.score(0, 0)
                input.focus()
                document.getElementById("btnRelancerJeu")?.remove()
            })
        }
    })

    const addRestartBtn = (callback) => {
        if (document.getElementById("btnRelancerJeu")) return
        const restart = document.createElement("button")
        restart.id = "btnRelancerJeu"
        restart.innerText = "Relancer le jeu"
        btn.parentNode.insertBefore(restart, btn.nextSibling)
        restart.addEventListener("click", callback)
    }

    document.querySelector(SELECTORS.form).addEventListener("submit", (e) => {
        e.preventDefault()
        
        const nameField = document.getElementById("nom")
        const emailField = document.getElementById("email")
        const name = nameField.value
        const email = emailField.value
        
        clearError(nameField)
        clearError(emailField)
        
        let valid = true
        if (!validateName(name)) {
            showError(nameField, "Le nom doit contenir au moins 2 caractères.")
            valid = false
        }
        if (!validateEmail(email)) {
            showError(emailField, "L'email n'est pas valide.")
            valid = false
        }
        
        if (valid) {
            const speed = calcSpeed(state.score, state.time)
            const percent = calcPercent(state.score, state.idx)
            sendEmail(name, email, state.score, state.idx, state.time, state.mode, speed, percent)
        }
    })

    document.getElementById("nom").addEventListener("input", function() { clearError(this) })
    document.getElementById("email").addEventListener("input", function() { clearError(this) })

    display.score(0, 0)
    display.chrono(0)
}