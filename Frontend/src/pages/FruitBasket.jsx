import { useEffect, useState, useRef } from "react";

function FruitBasket({ gameId }) {
    // Referencias para la lógica del juego (no provocan re-renderizado)
    const canvasRef = useRef(null);
    const scoreRef = useRef(0);
    const livesRef = useRef(3); 
    const playerXRef = useRef(250);
    const shakeRef = useRef(0);
    
    // Estados para la interfaz
    const [startTime] = useState(Date.now());
    const [gameState, setGameState] = useState('START');

    // Función para enviar los datos a tu Backend en Spring Boot
    const saveScore = async () => {
        const duration = Math.floor((Date.now() - startTime) / 1000);

        const matchData = {
            score: scoreRef.current,
            durationSeconds: duration,
            userId: 1, // ID temporal hasta implementar el Login
            gameId: parseInt(gameId)
        };

        console.log("Enviando partida a la DB...", matchData);

        try {
            const response = await fetch("http://localhost:8080/api/matches", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(matchData),
            });

            if (response.ok) {
                const result = await response.json();
                console.log("Partida guardada con ID:", result.id);
            } else {
                console.error("Error en la respuesta del servidor");
            }
        } catch (error) {
            console.error("Error de red:", error);
        }
    };

    // Reiniciar el juego
    const handleRestart = () => {
        scoreRef.current = 0;
        livesRef.current = 3;
        setGameState('START');
    };

    useEffect(() => {
        if (gameState !== "PLAYING") return; // Si el juego terminó, o si estamos en la pantalla de inicio, no hacemos nada.

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        //Carga de los recursos
        const basketImg = new Image();
        basketImg.src = "/assets/cesta.png";
        let basketLoaded = false;
        basketImg.onload = () => { basketLoaded = true; };

        const bgImg = new Image();
        bgImg.src = "/assets/bosque.jpg"; 
        let bgLoaded = false;
        bgImg.onload = () => { bgLoaded = true; };

        const badImg = new Image();
        badImg.src = "/assets/manzanaPodrida.png";
        let badLoaded = false;
        badImg.onload = () => { badLoaded = true; };

        const fruitDefinitions = [
            { name: "Manzana", src: "/assets/manzana.png", points: 1 },
            { name: "Platano", src: "/assets/platano.png", points: 1 },
            { name: "Fresa",   src: "/assets/fresa.png",   points: 2 },
            { name: "Pina",    src: "/assets/pina.png",    points: 5 }
        ];

        const goodFruitImages = fruitDefinitions.map(fruitDef => {
            const img = new Image();
            img.src = fruitDef.src;
            img.dataset.points = fruitDef.points; 
            return img;
        });

        //Variables de físicas
        const objWidth = 50;
        const objHeight = 50;
        const playerWidth = 130;
        const playerHeight = 80;
        
        let y = -objHeight;
        let x = Math.random() * (canvas.width - objWidth);
        let objType = "good";
        let currentGoodFruitImage = goodFruitImages[0];
        let animationFrameId;

        const keys = { ArrowLeft: false, ArrowRight: false };

        let scoreScale = 1;      
        let scoreFlash = 0;

        function resetObject() {
                y = -objHeight;
                x = Math.random() * (canvas.width - objWidth);
                if (Math.random() < 0.2) {
                    objType = "bad";
                } else {
                    objType = "good";
                    const randomIndex = Math.floor(Math.random() * goodFruitImages.length);
                    currentGoodFruitImage = goodFruitImages[randomIndex];
                }
            }

        
        //Bucle principal draw();
        function draw() {
            // 1. Limpiar pantalla
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            //Guardo el estado original de la pantall
            ctx.save();

            //Animación de sacudida al perder una vida
            if (shakeRef.current > 0) {
                ctx.translate((Math.random() - 0.5) * shakeRef.current, (Math.random() - 0.5) * shakeRef.current);
                shakeRef.current *= 0.9; 
            }

            // 2. Fondo
            if (bgLoaded) {
                ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
            }

            // 3. Función drawtext
            const drawText = (text, xPos, yPos, scale = 1, flash = 0, defaultColor = "white", align = "left") => {
                ctx.save();
                ctx.textAlign = align;
                ctx.translate(xPos, yPos); 
                ctx.scale(scale, scale);
                ctx.font = "bold 40px VT323, Arial";
                ctx.strokeStyle = "black";
                ctx.lineWidth = 6;

                //Brillo
                let color;
                if (flash > 0.1) {
                    color = `rgb(255, 255, ${200 + (55 * (1 - flash))})`;
                } else {
                    color = defaultColor; //Usamos el color base si no hay flash
                }

                if (flash > 0.1) {
                    ctx.shadowColor = "rgba(255, 215, 0, " + (flash * 0.8) + ")";
                    ctx.shadowBlur = 20 * flash;
                }

                ctx.strokeText(text, 0, 0);
                ctx.fillStyle = color;
                ctx.fillText(text, 0, 0);
                ctx.restore(); 
            };


            // 4. Movimiento y físicas
            const speed = 5;
            if (keys.ArrowLeft) playerXRef.current -= speed;
            if (keys.ArrowRight) playerXRef.current += speed;
            playerXRef.current = Math.max(0, Math.min(playerXRef.current, canvas.width - playerWidth));

            // 5. Dibujar frutas y cesta
            if (objType === "good") {
                if (currentGoodFruitImage) {
                    ctx.drawImage(currentGoodFruitImage, x, y, objWidth, objHeight);
                }
            } else if (badLoaded) {
                ctx.drawImage(badImg, x, y, objWidth, objHeight);
            }

            const playerY = canvas.height - playerHeight;
            if (basketLoaded) {
                ctx.drawImage(basketImg, playerXRef.current, playerY, playerWidth, playerHeight);
            }

            // 6. DIBUJAR UI Y ANIMACIONES (Siempre al final para que queden por encima)
            scoreScale += (1 - scoreScale) * 0.15;
            scoreFlash *= 0.92;
            drawText("Score: " + scoreRef.current, 30, 50, scoreScale, scoreFlash, "#FFD700");
            
            const heartsX = canvas.width - 30;
            const heartEmoji = "❤️";

            for(let i = 0; i < livesRef.current; i++) {

                drawText(heartEmoji, heartsX - (i * 45), 50, 1, 0, "red", "right");

            }

            // 7. LÓGICA DE GRAVEDAD Y COLISIONES
            y += 1.5 + (scoreRef.current * 0.02);

            // Suelo
            if (y > canvas.height) {
                if (objType === "good") {
                    livesRef.current--;
                    shakeRef.current = 15;
                }
                
                if (livesRef.current <= 0) { 
                    saveScore(); 
                    setGameState('GAMEOVER'); 
                    return; 
                }
                resetObject();
            }

            // Colisión cesta
            if (
                y + objHeight >= playerY &&
                y <= playerY + playerHeight &&
                x + objWidth > playerXRef.current &&
                x < playerXRef.current + playerWidth
            ) {
                if (objType === "good") {
                    const pointsToAdd = parseInt(currentGoodFruitImage.dataset.points) || 1;
                    scoreRef.current += pointsToAdd;
                    scoreScale = 1.5;
                    scoreFlash = 1;
                } else {
                    livesRef.current--;      // <--- Aquí
                    shakeRef.current = 20;

                    if (livesRef.current <= 0) { 
                        saveScore(); 
                        setGameState('GAMEOVER'); // ¡Corregido aquí también!
                        return; 
                    }
                }
                resetObject();
            }

            ctx.restore();

            // Siguiente frame
            if (gameState === "PLAYING") { // Ya no necesitamos && !isGameOver

                
                animationFrameId = requestAnimationFrame(draw);
            }
        }

        // Manejo de teclado
        const handleKeyDown = (e) => {
            if (e.key === "ArrowLeft" || e.key === "ArrowRight") keys[e.key] = true;
        };
        const handleKeyUp = (e) => {
            if (e.key === "ArrowLeft" || e.key === "ArrowRight") keys[e.key] = false;
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        draw();

        // Limpieza al desmontar
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
            cancelAnimationFrame(animationFrameId);
        };

    }, [gameState]);

    // Renderizado del Canvas
    return (
        <div className="game-container" style={{ position: 'relative', width: '800px', margin: '0 auto' }}>
    
    {/* Pantalla de Inicio / Instrucciones */}
    {gameState === 'START' && (
      <div className="game-overlay">
        <h1>FRUIT BASKET</h1>
        
        <div className="instructions">
          <p>⬅️ ➡️ Usa las flechas para moverte</p>
          <hr />
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li>🍎 Manzana: +1 pts</li>
            <li>🍌 Plátano: +2 pts</li>
            <li>🍓Fresa: +2 pts</li>
            <li>🍍Piña: +5 pts</li>
            <li>🐛 <strong>¡Cuidado!</strong> No cojas los gusanos</li>
          </ul>
        </div>

        <button className="start-button" onClick={() => setGameState('PLAYING')}>
          ¡PULSA PARA EMPEZAR!
        </button>
      </div>
    )}

    {/* El Canvas del juego */}
    <canvas ref={canvasRef} width={800} height={600} />

    {/* Pantalla de Game Over (Opcional) */}
    {gameState === 'GAMEOVER' && (
       <div className="game-overlay">
            <h2 style={{ fontSize: "48px", color: "#ff4444" }}>GAME OVER</h2>
            <p style={{ fontSize: "24px" }}>Puntuación: {scoreRef.current}</p>
            <button className="start-button" onClick={handleRestart}>
                VOLVER A INTENTAR
            </button>
        </div>
    )}
    </div>
);
}

export default FruitBasket;