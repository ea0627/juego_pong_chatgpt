let enMenu = true; // Arrancamos en menú

let fondoCancha;
let imagenPelota;

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
let diametro = 40;
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
    // Cargar imágenes
    fondoCancha = loadImage("fondo.jpg"); // Imagen de fondo del tablero
    imagenPelota = loadImage("pelota.png"); // Imagen realista de pelota de tenis

    // Cargar sonidos
    sonidoRebote = loadSound("point.wav");
    sonidoGol = loadSound("gol.wav");
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
    imageMode(CENTER);
    noLoop();
}

function draw() {
    image(fondoCancha, width / 2, height / 2, width, height); // Fondo cancha
    fill(0, 0, 0, 80); // Capa oscura encima para contraste
    noStroke();
    rect(0, 0, width, height);

    if (enMenu) {
        textSize(32);
        fill(255);
        textAlign(CENTER, CENTER);
        text("Elige dificultad para comenzar:\n\n1 - Fácil\n2 - Medio\n3 - Difícil", width/2, height/2);
    } else {
        // Dibujo y lógica normal del juego
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
            noLoop();
        }
    }
}

function dibujarPelota() {
    image(imagenPelota, pelotaX, pelotaY, diametro, diametro);
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
  // Color según dificultad
  let colorDificultad;
  if (dificultad === "facil") {
    colorDificultad = color(0, 255, 0); // verde
  } else if (dificultad === "medio") {
    colorDificultad = color(255, 255, 0); // amarillo
  } else if (dificultad === "dificil") {
    colorDificultad = color(255, 0, 0); // rojo
  } else {
    colorDificultad = color(255); // blanco por defecto
  }

  // Mostrar dificultad en color
  fill(colorDificultad);
  textSize(20);
  textAlign(LEFT, TOP);
  text(`Dificultad: ${dificultad.toUpperCase()}`, 10, 10);

  // Mostrar puntuación en blanco centrado
  fill(255);
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
  if (enMenu) {
    if (key === '1') {
      establecerDificultad("facil");
      enMenu = false;
      loop();
    } else if (key === '2') {
      establecerDificultad("medio");
      enMenu = false;
      loop();
    } else if (key === '3') {
      establecerDificultad("dificil");
      enMenu = false;
      loop();
    }
  } else {
    if (juegoTerminado && (key === 'r' || key === 'R')) {
      puntosJugador = 0;
      puntosCPU = 0;
      juegoTerminado = false;
      mensajeFinal = "";
      reiniciarPelota();
      loop();
    }
  }

  console.log("Tecla presionada:", key);
}