let dificultad = "medio"; // por defecto
let velocidadBasePelota = 5;
let errorMin = 10;
let errorMax = 50;


// Variebles del juego
let juegoTerminado = false;
let mensajeFinal = "";


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

function establecerDificultad(nivel) {
  dificultad = nivel;

  if (nivel === "facil") {
    velocidadBasePelota = 4;
    errorMin = 30;
    errorMax = 60;
  } else if (nivel === "medio") {
    velocidadBasePelota = 5;
    errorMin = 15;
    errorMax = 40;
  } else if (nivel === "dificil") {
    velocidadBasePelota = 6;
    errorMin = 5;
    errorMax = 20;
  }

  // Reinicia pelota con la nueva velocidad
  velocidadPelotaX = velocidadBasePelota * (Math.random() < 0.5 ? -1 : 1);
  velocidadPelotaY = velocidadBasePelota * (Math.random() < 0.5 ? -1 : 1);
}

function setup() {
  createCanvas(600, 400);
  establecerDificultad("medio");
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

  if (juegoTerminado) {
  fill(mensajeFinal === "¡Ganaste!" ? "lime" : "red");
  textSize(48);
  textAlign(CENTER, CENTER);
  text(mensajeFinal, width / 2, height / 2);
  textSize(20);
  text("Presiona R para reiniciar", width / 2, height / 2 + 50);
  noLoop(); // Detiene el juego
    }
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
  if (pelotaY - radio < 0 || pelotaY + radio > height) {
    velocidadPelotaY *= -1;
  }

  if (pelotaX - radio < 0) {
    puntosCPU++;
    if (sonidoGol && sonidoGol.isLoaded()) {
      sonidoGol.play();
    }
    reiniciarPelota();
  }

  if (pelotaX + radio > width) {
    puntosJugador++;
    if (sonidoGol && sonidoGol.isLoaded()) {
      sonidoGol.play();
    }
    mostrarGol = true;
    tiempoGol = millis();
    reiniciarPelota();
  }

  // Verifica victoria o derrota
  if (puntosJugador >= 5) {
    juegoTerminado = true;
    mensajeFinal = "¡Ganaste!";
  }

  if (puntosCPU >= 5) {
    juegoTerminado = true;
    mensajeFinal = "Perdiste...";
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

  // Genera error dinámico cada segundo (60 frames aprox)
  if (frameCount % 60 === 0) {
    errorCPU = random(errorMin, errorMax);
  }

  // Evita que la raqueta se salga del canvas
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

function establecerDificultad(nivel) {
  dificultad = nivel;

  if (nivel === "facil") {
    velocidadBasePelota = 4;
    errorMin = 30;
    errorMax = 60;
  } else if (nivel === "medio") {
    velocidadBasePelota = 5;
    errorMin = 15;
    errorMax = 40;
  } else if (nivel === "dificil") {
    velocidadBasePelota = 6;
    errorMin = 5;
    errorMax = 20;
  }

  // Reiniciar velocidades con nueva dificultad
  velocidadPelotaX = velocidadBasePelota * (Math.random() < 0.5 ? -1 : 1);
  velocidadPelotaY = velocidadBasePelota * (Math.random() < 0.5 ? -1 : 1);
}


function keyPressed() {
  if (juegoTerminado && (key === 'r' || key === 'R')) {
    puntosJugador = 0;
    puntosCPU = 0;
    juegoTerminado = false;
    mensajeFinal = "";
    loop();
    reiniciarPelota();
  }

  // Cambiar dificultad en vivo
  if (key === '1') {
    establecerDificultad("facil");
    console.log("Dificultad: fácil");
  } else if (key === '2') {
    establecerDificultad("medio");
    console.log("Dificultad: medio");
  } else if (key === '3') {
    establecerDificultad("dificil");
    console.log("Dificultad: difícil");
  }

  console.log("Tecla presionada:", key);
}
