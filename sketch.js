let anchoCampo = 800;
let altoCampo = 400;

let raquetaAncho = 10;
let raquetaAlto = 100;
let raquetaJugadorY;
let raquetaComputadoraY;

let bolaX, bolaY, bolaDia = 20;
let velocidadBolaX = 5;
let velocidadBolaY = 3;
let velocidadMaxima = 10; // Velocidad máxima de la bola
let anguloRotacion = 0; // Ángulo de rotación de la bola

let puntajeJugador = 0;
let puntajeComputadora = 0;

let imagenFondo;
let imagenRaquetaJugador;
let imagenRaquetaComputadora;
let imagenBola;

function preload() {
    imagenFondo = loadImage('fondo1.png'); // Carga la imagen de fondo
    imagenRaquetaJugador = loadImage('barra1.png'); // Carga la imagen de la raqueta del jugador
    imagenRaquetaComputadora = loadImage('barra2.png'); // Carga la imagen de la raqueta de la computadora
    imagenBola = loadImage('bola.png'); // Carga la imagen de la bola
}

function setup() {
    createCanvas(anchoCampo, altoCampo);
    raquetaJugadorY = height / 2 - raquetaAlto / 2;
    raquetaComputadoraY = height / 2 - raquetaAlto / 2;
    bolaX = width / 2;
    bolaY = height / 2;
}

function draw() {
    // Dibujar la imagen de fondo
    image(imagenFondo, 0, 0, width, height);

    // Dibujar marcos
    fill(color("#e3e4e5"));
    rect(0, 0, width, 10); // Marco superior
    rect(0, height - 10, width, 10); // Marco inferior

    // Dibujar raquetas
    image(imagenRaquetaJugador, 0, raquetaJugadorY, raquetaAncho, raquetaAlto);
    image(imagenRaquetaComputadora, width - raquetaAncho, raquetaComputadoraY, raquetaAncho, raquetaAlto);

    // Dibujar bola con rotación
    push();
    translate(bolaX, bolaY);
    rotate(anguloRotacion);
    imageMode(CENTER);
    image(imagenBola, 0, 0, bolaDia, bolaDia);
    pop();

    // Dibujar puntaje
    textSize(32);
    textAlign(CENTER, TOP);
    fill(color("#e3e4e5"));
    text(puntajeJugador, width / 4, 20);
    text(puntajeComputadora, 3 * width / 4, 20);

    // Movimiento de la bola
    bolaX += velocidadBolaX;
    bolaY += velocidadBolaY;

    // Actualizar el ángulo de rotación en función de la velocidad
    anguloRotacion += sqrt(velocidadBolaX * velocidadBolaX + velocidadBolaY * velocidadBolaY) / 10;

    // Rebote en los marcos superior e inferior
    if (bolaY < 10 + bolaDia / 2 || bolaY > height - 10 - bolaDia / 2) {
        velocidadBolaY *= -1;
    }

    // Rebote en las raquetas
    if (bolaX < raquetaAncho && bolaY > raquetaJugadorY && bolaY < raquetaJugadorY + raquetaAlto) {
        ajustarAngulo(bolaY, raquetaJugadorY + raquetaAlto / 2);
        velocidadBolaX *= -1;
    }
    if (bolaX > width - raquetaAncho && bolaY > raquetaComputadoraY && bolaY < raquetaComputadoraY + raquetaAlto) {
        ajustarAngulo(bolaY, raquetaComputadoraY + raquetaAlto / 2);
        velocidadBolaX *= -1;
    }

    // Movimiento de la raqueta del jugador
    if (keyIsDown(UP_ARROW)) {
        raquetaJugadorY -= 5;
    }
    if (keyIsDown(DOWN_ARROW)) {
        raquetaJugadorY += 5;
    }

    // Restricción de movimiento de la raqueta del jugador
    raquetaJugadorY = constrain(raquetaJugadorY, 10, height - 10 - raquetaAlto);

    // Movimiento de la raqueta de la computadora
    if (bolaY < raquetaComputadoraY + raquetaAlto / 2) {
        raquetaComputadoraY -= 4;
    }
    if (bolaY > raquetaComputadoraY + raquetaAlto / 2) {
        raquetaComputadoraY += 4;
    }

    // Restricción de movimiento de la raqueta de la computadora
    raquetaComputadoraY = constrain(raquetaComputadoraY, 10, height - 10 - raquetaAlto);

    // Reiniciar la bola si se sale del campo
    if (bolaX < 0) {
        puntajeComputadora++;
        narrarMarcador();
        reiniciarBola();
    }
    if (bolaX > width) {
        puntajeJugador++;
        narrarMarcador();
        reiniciarBola();
    }
}

function ajustarAngulo(bolaY, raquetaCentroY) {
    let distanciaCentro = (bolaY - raquetaCentroY) / (raquetaAlto / 2); // -1 a 1
    let angulo = distanciaCentro * PI / 3; // Rango de ángulo entre -PI/3 y PI/3
    let velocidad = sqrt(velocidadBolaX * velocidadBolaX + velocidadBolaY * velocidadBolaY); // Magnitud de la velocidad
    velocidadBolaY = velocidad * sin(angulo);
    velocidadBolaY = constrain(velocidadBolaY, -velocidadMaxima, velocidadMaxima); // Limita la velocidad máxima
}

function reiniciarBola() {
    bolaX = width / 2;
    bolaY = height / 2;
    velocidadBolaX = 5; // Reiniciar velocidad de la bola en el eje X
    velocidadBolaY = 3; // Reiniciar velocidad de la bola en el eje Y
    anguloRotacion = 0; // Reiniciar el ángulo de rotación
}

function narrarMarcador() {
    let mensaje = `Jugador ${puntajeJugador}, Computadora ${puntajeComputadora}`;
    let narrador = new SpeechSynthesisUtterance(mensaje);
    
    // Configurar voz específica
    let voices = window.speechSynthesis.getVoices();
    narrador.voice = voices.find(voice => voice.lang === 'es-ES') || voices[0];
    
    window.speechSynthesis.speak(narrador);
}
