const SELECTORS = {
    score: ".zoneScore span",
    chrono: ".zoneChrono span",
    proposition: ".zoneProposition",
    stats: ".zoneStats",
    btnValidate: "#btnValiderMot",
    input: "#inputEcriture",
    radios: ".optionSource input",
    form: "form"
}

const CONFIG = {
    chronoTick: 10,
    minNameLength: 2,
    itemsPerGame: 10
}

const REGEX_EMAIL = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,}$/i