import { useEffect, useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';


function FruitBasket({ gameId }) {
    // Referencias para la lógica del juego (no provocan re-renderizado)
    const canvasRef = useRef(null);
    const scoreRef = useRef(0);
    const livesRef = useRef(3); 
    const playerXRef = useRef(250);
    const shakeRef = useRef(0);
    const scoreSavedRef = useRef(false);
    const basketImgRef = useRef(null);
    const bgImgRef = useRef(null);
    const badImgRef = useRef(null);
    const goodFruitImagesRef = useRef([]);
    const animationFrameIdRef = useRef(null);
    const drawRef = useRef(null);
    const navigate = useNavigate();
    
    // Estados para la interfaz
    const startTimeRef = useRef(Date.now());
    const [gameState, setGameState] = useState('START');
    const isPausedRef = useRef(false);
    const [isPaused, setIsPaused] = useState(false);

    // Ocultar scrollbar al entrar al juego
    useEffect(() => {
        document.body.classList.add('game-active');

            return () => {
                document.body.classList.remove('game-active');
            };
    }, []);

    // Función para enviar los datos al Backend 
    const saveScore = async () => {
        const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);

        const matchData = {
            score: scoreRef.current,
            durationSeconds: duration,
            userId: parseInt(localStorage.getItem('userId')), 
            gameId: parseInt(gameId)
        };

        console.log("Enviando partida a la DB...", matchData);

        try {
            const response = await fetch("http://localhost:8080/api/matches", {
                method: "POST",
                headers: { "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                 },
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
        scoreSavedRef.current = false;
        startTimeRef.current = Date.now();
        setGameState('START');
    };

    useEffect(() => {
    const basketImg = new Image();
    basketImg.src = "/assets/cesta.png";
    basketImgRef.current = basketImg;

    const bgImg = new Image();
    bgImg.src = "/assets/bosque.jpg";
    bgImgRef.current = bgImg;

    const badImg = new Image();
    badImg.src = "/assets/manzanaPodrida.png";
    badImgRef.current = badImg;

    const fruitDefinitions = [
        { name: "Manzana", src: "/assets/manzana.png",  points: 1 },
        { name: "Platano", src: "/assets/platano.png",  points: 2 },
        { name: "Fresa",   src: "/assets/fresa.png",    points: 2 },
        { name: "Pina",    src: "/assets/pina.png",     points: 5 }
    ];

    goodFruitImagesRef.current = fruitDefinitions.map(fruitDef => {
        const img = new Image();
        img.src = fruitDef.src;
        img.dataset.points = fruitDef.points;
        return img;
    });
    }, []); 

    useEffect(() => {
        if (gameState !== "PLAYING") return;
        if (isPausedRef.current) return; 

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        //Variables de físicas
        const objWidth = 50;
        const objHeight = 50;
        const playerWidth = 130;
        const playerHeight = 80;
        
        let y = -objHeight;
        let x = Math.random() * (canvas.width - objWidth);
        let objType = "good";
        let currentGoodFruitImage = goodFruitImagesRef.current[0];

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
                    const randomIndex = Math.floor(Math.random() * goodFruitImagesRef.current.length);
                    currentGoodFruitImage = goodFruitImagesRef.current[randomIndex];
                }
            }

        function draw() {
            //Pausa del juego
            if (isPausedRef.current) return;
            //Limpiar canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            //Guardo el estado original de la pantalla
            ctx.save();

            //Animación de sacudida al perder una vida
            if (shakeRef.current > 0) {
                ctx.translate((Math.random() - 0.5) * shakeRef.current, (Math.random() - 0.5) * shakeRef.current);
                shakeRef.current *= 0.9; 
            }

            //Fondo
            if (bgImgRef.current) {
                ctx.drawImage(bgImgRef.current, 0, 0, canvas.width, canvas.height);
            }

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
                    color = defaultColor; 
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


            //Movimiento y física
            const speed = 10; //Cesta
            if (keys.ArrowLeft) playerXRef.current -= speed;
            if (keys.ArrowRight) playerXRef.current += speed;
            playerXRef.current = Math.max(0, Math.min(playerXRef.current, canvas.width - playerWidth));

            //Frutas y cesta
            if (objType === "good") {
                if (currentGoodFruitImage) {
                    ctx.drawImage(currentGoodFruitImage, x, y, objWidth, objHeight);
                }
            } else if (badImgRef.current) {
                ctx.drawImage(badImgRef.current, x, y, objWidth, objHeight);
            }

            const playerY = canvas.height - playerHeight;
            if (basketImgRef.current) {
                ctx.drawImage(basketImgRef.current, playerXRef.current, playerY, playerWidth, playerHeight);
            }

            //Ui y animaciones
            scoreScale += (1 - scoreScale) * 0.15;
            scoreFlash *= 0.92;
            drawText("Score: " + scoreRef.current, 30, 50, scoreScale, scoreFlash, "#FFD700");
            
            const heartsX = canvas.width - 30;
            const heartEmoji = "❤️";

            for(let i = 0; i < livesRef.current; i++) {

                drawText(heartEmoji, heartsX - (i * 45), 50, 1, 0, "red", "right");

            }

            //Gravedad y colisiones
            y += 3.5 + (scoreRef.current * 0.05);

            // Suelo
            if (y > canvas.height) {
                if (objType === "good") {
                    livesRef.current--;
                    shakeRef.current = 15;
                }
                
                if (livesRef.current <= 0) {

                if (!scoreSavedRef.current) {
                    scoreSavedRef.current = true;
                    saveScore();
                }
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
                    shakeRef.current = 20;

                    if (livesRef.current <= 0) {

                    if (!scoreSavedRef.current) {
                        scoreSavedRef.current = true;
                        saveScore();
                    }
                    setGameState('GAMEOVER');
                    return;
                }
                }
                resetObject();
            }

            ctx.restore();

            if (gameState === "PLAYING") { 

                
                animationFrameIdRef.current = requestAnimationFrame(draw);
            }
        }

        drawRef.current = draw;

        // Manejo de teclado
        const handleKeyDown = (e) => {
            if (e.key === "ArrowLeft" || e.key === "ArrowRight") keys[e.key] = true;
            if (e.key === "Escape") {
                isPausedRef.current = !isPausedRef.current;
                setIsPaused(isPausedRef.current);
                if (!isPausedRef.current) {
                    // Reanudamos: volvemos a arrancar el bucle
                    animationFrameIdRef.current = requestAnimationFrame(draw);
                }
            }
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
            cancelAnimationFrame(animationFrameIdRef.current);
        };

    }, [gameState]);

    // Renderizado del Canvas
    return (
        <div className="game-container" style={{ position: 'relative', width: '800px', margin: '0 auto' }}>
    
    {/* Pantalla de Inicio / Instrucciones */}
    {gameState === 'START' && (
      <div className="game-overlay">
        <h1 className="game-title-section">FRUIT BASKET</h1>
        
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
        <div style={{ display: 'flex', gap: '15px' }}>
            <button className="start-button" onClick={handleRestart}>
                REINTENTAR
            </button>
            <button 
                className="start-button" 
                style={{ backgroundColor: '#57606f' }} 
                onClick={() => navigate('/home')}
            >
                SALIR
            </button>
            </div>
        </div>
        )}

    {/* Menú de pausa */}
        {isPaused && (
            <div className="game-overlay">
                <h2 style={{ fontSize: "48px", color: "#FFD700" }}>⏸ PAUSA</h2>
                <p style={{ fontSize: "18px", color: "#aaa", marginBottom: "20px" }}>
                    Puntuación actual: {scoreRef.current}
                </p>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button 
                        className="start-button"
                        onClick={() => {
                            isPausedRef.current = false;
                            setIsPaused(false);
                            // Reanudamos el bucle desde el botón
                            animationFrameIdRef.current = requestAnimationFrame(drawRef.current);
                        }}
                    >
                        ▶ CONTINUAR
                    </button>
                    <button 
                        className="start-button"
                        style={{ backgroundColor: '#57606f' }}
                        onClick={() => navigate('/home')}
                    >
                        🏠 SALIR
                    </button>
                </div>
                <p style={{ fontSize: "14px", color: "#666", marginTop: "15px" }}>
                    Pulsa ESC para continuar
                </p>
            </div>
        )}   
    </div>

       
);
}

export default FruitBasket;