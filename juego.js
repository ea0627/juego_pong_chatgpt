// Variables de la pelota
let pelotaX = 300;
let pelotaY = 200;
let velocidadPelotaX = 5;
let velocidadPelotaY = 5;
let diametro = 20;
let radio = diametro / 2;

// Raquetas
let jugadorX = 10;
let jugadorY = 150;
let cpuX = 580;
let cpuY = 150;
let anchoRaqueta = 10;
let altoRaqueta = 100;

// Puntuación
let puntosJugador = 0;
let puntosCPU = 0;

// IA con error
let errorCPU = 0;

// Sonido
let sonidoRebote;
let sonidoGolJugador;

function preload() {
  sonidoRebote = loadSound('./point.wav');
  sonidoGol = loadSound('/gol.wav'); // sonido para cualquier gol
}

function setup() {
  createCanvas(600, 400);
}

function draw() {
  background(0);

  // Dibujo y lógica
  dibujarPelota();
  moverPelota();
  verificarBordes();

  dibujarRaquetas();
  moverRaquetaJugador();
  moverRaquetaCPU();

  verificarColisionRaqueta(jugadorX, jugadorY);
  verificarColisionRaqueta(cpuX, cpuY);

  mostrarPuntuacion();
}

function dibujarPelota() {
  fill(255);
  circle(pelotaX, pelotaY, diametro);
}

function moverPelota() {
  pelotaX += velocidadPelotaX;
  pelotaY += velocidadPelotaY;
}

function verificarBordes() {
  // Rebote en el techo y el suelo
  if (pelotaY - radio < 0 || pelotaY + radio > height) {
    velocidadPelotaY *= -1;
  }

  // Gol del CPU
  if (pelotaX - radio < 0) {
    puntosCPU++;
    if (sonidoGol && sonidoGol.isLoaded()) {
      sonidoGol.play(); // Gol de la CPU
    }
    reiniciarPelota();
  }

  // Gol del jugador
  if (pelotaX + radio > width) {
    puntosJugador++;
    if (sonidoGol && sonidoGol.isLoaded()) {
      sonidoGol.play(); // Gol del jugador
    }
    reiniciarPelota();
  }
}

function dibujarRaquetas() {
  fill(255);
  rect(jugadorX, jugadorY, anchoRaqueta, altoRaqueta);
  rect(cpuX, cpuY, anchoRaqueta, altoRaqueta);
}

function moverRaquetaJugador() {
  if (keyIsDown(UP_ARROW)) {
    jugadorY -= 7;
  }
  if (keyIsDown(DOWN_ARROW)) {
    jugadorY += 7;
  }

  // Limitar dentro del canvas
  jugadorY = constrain(jugadorY, 0, height - altoRaqueta);
}

function moverRaquetaCPU() {
  let centroRaqueta = cpuY + altoRaqueta / 2;
  let velocidadCPU = 4;

  if (centroRaqueta < pelotaY - errorCPU) {
    cpuY += velocidadCPU;
  } else if (centroRaqueta > pelotaY + errorCPU) {
    cpuY -= velocidadCPU;
  }

  // Cambiar el error cada segundo
  if (frameCount % 60 === 0) {
    errorCPU = random(10, 50);
  }

  // Limitar dentro del canvas
  cpuY = constrain(cpuY, 0, height - altoRaqueta);
}

function verificarColisionRaqueta(x, y) {
  if (
    pelotaX - radio < x + anchoRaqueta &&
    pelotaX + radio > x &&
    pelotaY + radio > y &&
    pelotaY - radio < y + altoRaqueta
  ) {
    velocidadPelotaX *= -1;

    if (sonidoRebote && sonidoRebote.isLoaded()) {
      sonidoRebote.play();
    }
  }
}

function reiniciarPelota() {
  pelotaX = width / 2;
  pelotaY = height / 2;
  velocidadPelotaX *= -1;
}

function mostrarPuntuacion() {
  fill(255);
  textSize(20);
  textAlign(CENTER, TOP);
  text(`${puntosJugador} - ${puntosCPU}`, width / 2, 10);
}