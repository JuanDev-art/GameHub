import React, { useEffect, useState, useRef } from 'react';

const gravity = 0.5;
const jumpForce = -13; 
const groundY = 380;
const obstacleSpeed = 4;
const cocoX = 200; 

function Crocodile({ gameId }) {
    const [gameState, setGameState] = useState('START');
    const [startTime, setStartTime] = useState(Date.now())
    const canvasRef = useRef(null);
    const scoreRef = useRef(0);
    const cocoYRef = useRef(groundY);
    const cocoVelocityRef = useRef(0);
    const jumpCountRef = useRef(0);
    const isDyingRef = useRef(false);
    const frameCountRef = useRef(0);
    const bgImgRef = useRef(null);
    const bgXRef = useRef(0);
    const bgSpeed = 1.2;
    const obstaclesRef = useRef([]);
    const nextObstacleTimerRef = useRef(0); 

    // Arrays de imágenes
    const runImgsRef = useRef([]);
    const jumpImgsRef = useRef([]);
    const deathImgsRef = useRef([]);
    const logImgRef = useRef(null);
    const rockImgRef = useRef(null);
    const birdImgsRef = useRef([]);

    // Función para enviar los datos al Backend 
    const saveScore = async () => {
        const duration = Math.floor((Date.now() - startTime) / 1000);

        const  matchData = {
            score: scoreRef.current,
            durationSeconds: duration,
            userId: 1, //Temporal hasta que implemente el login
            gameId: parseInt(gameId)
        };

        console.log("Enviando partida de Crocodile a la DB...", matchData);

        try {
            const response = await fetch("http://localhost:8080/api/matches", {

                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(matchData),

            });

            if (response.ok) {

                const result = await response.json();
                console.log("Partida guardada: ", result.id);
            } else {
                console.log("Error al guardar la partida");
            }
        } catch {
            console.log("Error de red", error);
        }
    };

    const startGame = () => {
        isDyingRef.current = false;
        cocoYRef.current = groundY;
        cocoVelocityRef.current = 0;
        jumpCountRef.current = 0;
        obstaclesRef.current = [];
        nextObstacleTimerRef.current = 0;
        scoreRef.current = 0;
        frameCountRef.current = 0;
        setStartTime(Date.now());
        setGameState('PLAYING');
    };

    //Carga de assets
    useEffect(() => {
        const loadSet = (name, count) => {
            const imgs = [];
            const isBird = name === 'Bird';
    
    const start = isBird ? 0 : 1;
    const limit = isBird ? count - 1 : count;

    for (let i = start; i <= limit; i++) {
            const img = new Image();
        
            if (isBird) {
                
                const num = i.toString().padStart(2, '0');
                img.src = `/assets/sprites/${name}_${num}.png`;
            } else {
                
                img.src = `/assets/sprites/${name} (${i}).png`;
            }
        
            imgs.push(img);
        }
            return imgs;
        };

        runImgsRef.current = loadSet('Run', 8);
        jumpImgsRef.current = loadSet('Jump', 12);
        deathImgsRef.current = loadSet('Dead', 8);
        birdImgsRef.current = loadSet('Bird', 11);

        const imgLog = new Image();
        imgLog.src = "/assets/trunkMedium.png"; 
        imgLog.onload = () => { logImgRef.current = imgLog; };

        const imgRock = new Image();
        imgRock.src = "/assets/roca.png"; 
        imgRock.onload = () => { rockImgRef.current = imgRock; };

        const imgBg = new Image();
        imgBg.src = "/assets/fondo.webp";
        imgBg.onload = () => { bgImgRef.current = imgBg; };
    }, []);

    //Motor del juego
    useEffect(() => {
        if (gameState !== "PLAYING") return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        let animationFrameId;

        const handleKeyDown = (e) => {
            if (e.key === " " || e.key === "ArrowUp") {
                e.preventDefault();

                if (jumpCountRef.current < 2) {
                    cocoVelocityRef.current = jumpForce;
                    jumpCountRef.current++;
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        const draw = () => {
            //Limpiar canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        
            const visualGroundLine = 550;
        
            //Fondo y física
            if (bgImgRef.current && !isDyingRef.current) {
        bgXRef.current -= bgSpeed;
        if (bgXRef.current <= -canvas.width) bgXRef.current = 0;
            }
            if (bgImgRef.current) {
                ctx.drawImage(bgImgRef.current, bgXRef.current, 0, canvas.width, canvas.height);
                ctx.drawImage(bgImgRef.current, bgXRef.current + canvas.width, 0, canvas.width, canvas.height);
            }
        
            cocoVelocityRef.current += gravity;
            cocoYRef.current += cocoVelocityRef.current;

            if (cocoYRef.current > groundY) {
                cocoYRef.current = groundY;
                cocoVelocityRef.current = 0;
                jumpCountRef.current = 0;
            }
        
            //Gestión de obstáculos
            nextObstacleTimerRef.current--;
            if (nextObstacleTimerRef.current <= 0 && !isDyingRef.current) {
        
        const patterns = [
            [{ type: 'log', x: 800, y: 430, w: 40, h: 40 }],

            [{ type: 'log', x: 800, y: 430, w: 40, h: 40 }, 
             { type: 'bird', x: 800, y: 330, w: 40, h: 30 }],
            
            [{ type: 'log', x: 800, y: 430, w: 40, h: 40 }, 
             { type: 'log', x: 860, y: 430, w: 40, h: 40 }],
            
            [{ type: 'bird', x: 800, y: 330, w: 50, h: 40 }]
        ];

        const selectedPattern = patterns[Math.floor(Math.random() * patterns.length)];
        selectedPattern.forEach(obj => obstaclesRef.current.push(obj));

        nextObstacleTimerRef.current = 100 + Math.random() * 50; 
            }
        
        // Movemos, dibujamos y comprobamos colisiones de cada obstáculo en el array
        obstaclesRef.current.forEach((obs) => {
    
        if (!isDyingRef.current) obs.x -= obstacleSpeed;

        const logImg = logImgRef.current;
        const rockImg = rockImgRef.current;
        const birdSprites = birdImgsRef.current;

        if (obs.type === 'log' && logImg && logImg.complete) {
            ctx.drawImage(logImg, obs.x, obs.y, obs.w, obs.h);
        } else if (obs.type === 'rock' && rockImg && rockImg.complete) {
            ctx.drawImage(rockImg, obs.x, obs.y, obs.w, obs.h);
        } else if (obs.type === 'bird' && birdSprites && birdSprites.length > 0) {
            // Calcular frame del pájaro
            const frameIndexBird = Math.floor(frameCountRef.current / 4) % birdSprites.length;
            const currentBirdImg = birdSprites[frameIndexBird];

            if (currentBirdImg && currentBirdImg.complete) {
                ctx.save(); 
                ctx.translate(obs.x + obs.w, 0); 
                ctx.scale(-1, 1); 
                ctx.drawImage(currentBirdImg, 0, obs.y, obs.w, obs.h);
                ctx.restore(); 
            }
        } else {
            // Cuadrados de colores por si la imagen aún no ha cargado
            ctx.fillStyle = obs.type === 'bird' ? "#ff4757" : "#8B4513";
            ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
        }

        const obsHitbox = { x: obs.x + 5, y: obs.y + 5, w: obs.w - 10, h: obs.h - 10 };
        const cocoHitbox = { x: cocoX + 20, y: cocoYRef.current + 15, w: 50, h: 70 };

        if (!isDyingRef.current && 
            cocoHitbox.x < obsHitbox.x + obsHitbox.w &&
            cocoHitbox.x + cocoHitbox.w > obsHitbox.x &&
            cocoHitbox.y < obsHitbox.y + obsHitbox.h &&
            cocoHitbox.y + cocoHitbox.h > obsHitbox.y) {
            isDyingRef.current = true;
            frameCountRef.current = 0; 
            }
        });
        
            // Limpiar obstáculos fuera de pantalla
            obstaclesRef.current = obstaclesRef.current.filter(obs => {
        if (obs.x < -100) { scoreRef.current += 1; return false; }
        return true;
            });
        
            let currentSprites = runImgsRef.current;
            if (isDyingRef.current) { currentSprites = deathImgsRef.current; } 
            else if (cocoYRef.current < groundY) { currentSprites = jumpImgsRef.current; }
        
            let frameIndex = 0;
            if (currentSprites && currentSprites.length > 0) {
        frameIndex = Math.floor(frameCountRef.current / 6) % currentSprites.length;
        if (isDyingRef.current && frameIndex === currentSprites.length - 1) {
            saveScore();
            setGameState('GAMEOVER');
            return; 
        }
            }
        
            const currentImg = (currentSprites && currentSprites.length > 0) ? currentSprites[frameIndex] : null;
            if (currentImg && currentImg.complete && currentImg.naturalWidth !== 0) {
        
        ctx.drawImage(currentImg, cocoX, cocoYRef.current, 90, 90);
            } else {
        ctx.fillStyle = "#2ecc71"; 
        ctx.fillRect(cocoX, cocoYRef.current, 80, 80);
            }
        
            frameCountRef.current++;
            animationFrameId = requestAnimationFrame(draw);

            };

        draw();

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            cancelAnimationFrame(animationFrameId);
        };
    }, [gameState]);

    // Estilos internos
    const overlayStyle = {
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center', color: 'white', zIndex: 10,
        borderRadius: '8px'
    };

    const buttonStyle = {
        padding: '12px 24px', fontSize: '18px', cursor: 'pointer',
        backgroundColor: '#2ecc71', border: 'none', color: 'white',
        borderRadius: '5px', margin: '10px', fontWeight: 'bold'
    };

    return (
        <div className="game-container" style={{ position: 'relative', width: '800px', margin: '20px auto' }}>
    
            {/* Pantalla de Inicio / Instrucciones */}
            {gameState === 'START' && (
        <div className="game-overlay">
            <h1 className="game-title-section">¡CROCODILE RUN!</h1>
        
        <div className="instructions">
            <p style={{ fontSize: '18px', fontWeight: 'bold' }}>
            ⌨️ Barra Espaciadora / Flecha Arriba
            </p>
             <p style={{ fontSize: '16px', color: '#2ecc71', marginTop: '-10px' }}>
            para saltar
            </p>
          <hr />
          <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left' }}>
            <li style={{ marginBottom: '8px' }}>🪵 <strong>Troncos:</strong> ¡No los pises!</li>
            <li style={{ marginBottom: '8px' }}>🦅 <strong>Pájaros:</strong> ¡Salta o esquiva!</li>
            <li>🏆 <strong>Meta:</strong> ¡Sobrevive todo lo que puedas!</li>
          </ul>
        </div>

        <button className="start-button" onClick={startGame}>
          ¡EMPEZAR!
        </button>
      </div>
    )}

    {/* El Canvas del juego */}
    <canvas 
      ref={canvasRef} 
      width={800} 
      height={600} 
      style={{ 
        backgroundColor: '#ccffff', 
        display: 'block', 
        borderRadius: '8px', 
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)' 
      }}
    />

    {/* Pantalla de Game Over */}
    {gameState === 'GAMEOVER' && (
      <div className="game-overlay">
        <h1 style={{ color: '#ff4757', fontSize: '48px' }}>¡GAMEOVER!</h1>
        <p style={{ fontSize: '24px' }}>Puntos conseguidos: {scoreRef.current}</p>
        
        <div style={{ display: 'flex', gap: '15px' }}>
          <button className="start-button" onClick={startGame}>
            REINTENTAR
          </button>
          <button 
            className="start-button" 
            style={{ backgroundColor: '#57606f' }} 
            onClick={() => window.location.reload()}
          >
            SALIR
          </button>
        </div>
      </div>
    )}
    </div>
    );
}

export default Crocodile;