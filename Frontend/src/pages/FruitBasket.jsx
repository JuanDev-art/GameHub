import { useEffect, useState, useRef } from "react";

function FruitBasket({ gameId }) {
    // Referencias para la lógica del juego (no provocan re-renderizado)
    const canvasRef = useRef(null);
    const scoreRef = useRef(0);
    const livesRef = useRef(3); 
    const playerXRef = useRef(250);
    
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
                console.log("✅ Partida guardada con ID:", result.id);
            } else {
                console.error("❌ Error en la respuesta del servidor");
            }
        } catch (error) {
            console.error("❌ Error de red:", error);
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

        // --- CARGA DE RECURSOS ---
        const basketImg = new Image();
        basketImg.src = "/cesta.png";
        let basketLoaded = false;
        basketImg.onload = () => { basketLoaded = true; };

        const bgImg = new Image();
        bgImg.src = "/bosque.jpg"; 
        let bgLoaded = false;
        bgImg.onload = () => { bgLoaded = true; };

        const badImg = new Image();
        badImg.src = "/manzanaPodrida.png";
        let badLoaded = false;
        badImg.onload = () => { badLoaded = true; };

        const fruitDefinitions = [
            { name: "Manzana", src: "/manzana.png", points: 1 },
            { name: "Platano", src: "/platano.png", points: 1 },
            { name: "Fresa",   src: "/fresa.png",   points: 2 },
            { name: "Pina",    src: "/pina.png",    points: 5 }
        ];

        const goodFruitImages = fruitDefinitions.map(fruitDef => {
            const img = new Image();
            img.src = fruitDef.src;
            img.dataset.points = fruitDef.points; 
            return img;
        });

        // --- VARIABLES DE FÍSICAS ---
        const objWidth = 50;
        const objHeight = 50;
        const playerWidth = 100;
        const playerHeight = 60;
        
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

            // 2. DIBUJAR FONDO (Siempre lo primero)
            if (bgLoaded) {
                ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
            }

            // 3. DEFINIR FUNCIÓN DRAWTEXT (Debe estar declarada antes de usarse)
            const drawText = (text, xPos, yPos, scale = 1, flash = 0) => {
                ctx.save();
                ctx.translate(xPos, yPos); 
                ctx.scale(scale, scale);
                ctx.font = "bold 24px VT323, Arial";
                ctx.strokeStyle = "black";
                ctx.lineWidth = 4;
                const color = flash > 0 ? `rgb(255, 255, ${200 + (55 * (1 - flash))})` : "white";
                if (flash > 0) {
                    ctx.shadowColor = "rgba(255, 215, 0, " + flash + ")";
                    ctx.shadowBlur = 15 * flash;
                }
                ctx.strokeText(text, 0, 0);
                ctx.fillStyle = color;
                ctx.fillText(text, 0, 0);
                ctx.restore(); 
            };

            // 4. MOVIMIENTO Y FÍSICAS
            const speed = 5;
            if (keys.ArrowLeft) playerXRef.current -= speed;
            if (keys.ArrowRight) playerXRef.current += speed;
            playerXRef.current = Math.max(0, Math.min(playerXRef.current, canvas.width - playerWidth));

            // 5. DIBUJAR FRUTAS Y CESTA
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
            drawText("Score: " + scoreRef.current, 20, 40, scoreScale, scoreFlash);
            drawText("Lives: " + livesRef.current, canvas.width - 130, 40, 1, 0);

            // 7. LÓGICA DE GRAVEDAD Y COLISIONES
            y += 1.5 + (scoreRef.current * 0.02);

            // Suelo
            if (y > canvas.height) {
                if (objType === "good") livesRef.current--;
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
                    livesRef.current--;
                    if (livesRef.current <= 0) { 
                        saveScore(); 
                        setGameState('GAMEOVER'); // ¡Corregido aquí también!
                        return; 
                    }
                }
                resetObject();
            }

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
            <li>🚫 <strong>¡Cuidado!</strong> No cojas manzanas mordidas</li>
          </ul>
        </div>

        <button className="start-button" onClick={() => setGameState('PLAYING')}>
          PULSA PARA EMPEZAR
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