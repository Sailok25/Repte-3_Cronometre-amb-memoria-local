let myInterval;
let arrayTemps = [];
let tempsAnterior = 0;
let contadorVolta = 1;

// Inicialització dels botons || Sempre el crono apareix nomes amb el botons 'PLAY'
document.getElementById("play").style.display = "block";
document.getElementById("pausa").style.display = "none";
document.getElementById("stop").style.display = "none";
document.getElementById("volta").style.display = "none";

// Converteix el temps en mil·lisegons totals || Format (minuts:segons.milisegons)
function convertirAMilisegons(temps) {
    const [minuts, segons] = temps.split(':');
    const [segonsEnters, milisegons] = segons.split('.');
    const totalMilisegons = (parseInt(minuts) * 6000) + (parseInt(segonsEnters) * 100) + parseInt(milisegons);
    return totalMilisegons;
}

// Converteix els mil·lisegons en una cadena minuts:segons.milisegons
function convertirAString(milisegons) {
    const minuts = Math.floor(milisegons / 6000);
    const segonsTotal = ((milisegons % 6000) / 100).toFixed(2);
    const segons = segonsTotal < 10 ? '0' + segonsTotal : segonsTotal;
    return `${minuts}:${segons}`;
}

// Incrementa el cronòmetre cada 10 ms i actualitza el temps a la pantalla
function cronometre() {
    let agafarTemps = document.getElementById('temps').getElementsByTagName('p')[0].innerHTML;
    let milisegundos = convertirAMilisegons(agafarTemps) + 1;
    let temps = convertirAString(milisegundos);
    document.getElementById('temps').getElementsByTagName('p')[0].innerHTML = temps;
}

// Inicia el cronòmetre i mostra nomes els botons 'pause' i 'flag'
function play_cronometre() {
    myInterval = setInterval(cronometre, 10);
    document.getElementById("play").style.display = "none";
    document.getElementById("pausa").style.display = "block";
    document.getElementById("volta").style.display = "block";
    document.getElementById("stop").style.display = "none"; 
}

// Pausa el cronòmetre i mostra nomes els botons 'play' i 'stop'
function pause_cronometre() {
    clearInterval(myInterval);
    document.getElementById("pausa").style.display = "none";
    document.getElementById("play").style.display = "block";
    document.getElementById("stop").style.display = "block"; 
    document.getElementById("volta").style.display = "none"; 
}

// Para el cronòmetre, borre el temps que hi havia i el posa a 0 || També neteja l'emmagatzematge local
function stop_cronometre() {
    clearInterval(myInterval);
    document.getElementById('temps').getElementsByTagName('p')[0].innerHTML = "00:00.00";
    document.getElementById("play").style.display = "block";
    document.getElementById("pausa").style.display = "none";
    document.getElementById("stop").style.display = "none";
    document.getElementById("volta").style.display = "none";

    arrayTemps = [];
    tempsAnterior = 0;
    contadorVolta = 1;
    localStorage.clear();
    llegir_dades();
}

// Cride a la funció 'guardar_dades'
function flag_cronometre() {
    guardar_dades();
}

// Guarda el temps actual al localStorage i calcula la diferència amb la volta anterior || Crida la funció 'llegir_dades'
function guardar_dades() {
    let temps = document.getElementById('temps').getElementsByTagName('p')[0].innerHTML;
    let tempsActual = convertirAMilisegons(temps);

    // Calcula la diferència respecte al temps anterior
    let diferencia = tempsActual - tempsAnterior;
    tempsAnterior = tempsActual;

    let diferenciaString = "+" + convertirAString(diferencia);
    let tempsString = convertirAString(tempsActual);

    const volta = document.createElement('div');
    volta.classList.add('volta');

    const numeroVolta = document.createElement('p');
    numeroVolta.textContent = contadorVolta.toString().padStart(2, '0');

    const diferentiaTemps = document.createElement('p');
    diferentiaTemps.textContent = diferenciaString;

    const tempsAcumulat = document.createElement('p');
    tempsAcumulat.textContent = tempsString;

    volta.appendChild(numeroVolta);
    volta.appendChild(diferentiaTemps);
    volta.appendChild(tempsAcumulat);

    document.getElementById("text").appendChild(volta);

    contadorVolta++;

    arrayTemps.push({
        numero: numeroVolta.textContent,
        diferencia: diferenciaString,
        temps: tempsString
    });
    localStorage.setItem("Temps", JSON.stringify(arrayTemps));
}

// Llegeix i mostra les dades emmagatzemades de les voltes
function llegir_dades() {
    document.getElementById("text").innerHTML = '';
    arrayTemps.forEach((registre) => {
        const volta = document.createElement('div');
        volta.classList.add('volta');

        const numeroVolta = document.createElement('p');
        numeroVolta.textContent = registre.numero;

        const diferentiaTemps = document.createElement('p');
        diferentiaTemps.textContent = registre.diferencia;

        const tempsAcumulat = document.createElement('p');
        tempsAcumulat.textContent = registre.temps;

        volta.appendChild(numeroVolta);
        volta.appendChild(diferentiaTemps);
        volta.appendChild(tempsAcumulat);

        document.getElementById("text").appendChild(volta);
    });
}

// Càrrega les dades inicials en iniciar la pàgina
window.onload = function() {
    const dadesGuardades = localStorage.getItem("Temps");
    if (dadesGuardades) {
        arrayTemps = JSON.parse(dadesGuardades);
        llegir_dades();
    }
};