import React, { useEffect, useState, useRef } from 'react';

const gravity = 0.5;
const jumpForce = -12; 
const groundY = 450;
const obstacleSpeed = 5;
const cocoX = 200; 

function Crocodile() {
    const [gameState, setGameState] = useState('START');
    const canvasRef = useRef(null);
    const scoreRef = useRef(0);
    const cocoYRef = useRef(groundY);
    const cocoVelocityRef = useRef(0);
    const isDyingRef = useRef(false);
    const obstacleXRef = useRef(800);
    const frameCountRef = useRef(0);
    const bgImgRef = useRef(null);
    const bgXRef = useRef(0);
    const bgSpeed = 2; 

    // Arrays de imágenes
    const runImgsRef = useRef([]);
    const jumpImgsRef = useRef([]);
    const deathImgsRef = useRef([]);
    const logImgRef = useRef(null);
    const rockImgRef = useRef(null);
    const currentObstacleType = useRef('log');

    const startGame = () => {
        isDyingRef.current = false;
        cocoYRef.current = groundY;
        cocoVelocityRef.current = 0;
        obstacleXRef.current = 800;
        scoreRef.current = 0;
        frameCountRef.current = 0; // Resetear contador de frames
        setGameState('PLAYING');
    };

    //Carga de assets
    useEffect(() => {
        const loadSet = (name, count) => {
            const imgs = [];
            for (let i = 1; i <= count; i++) {
                const img = new Image();
                
                img.src = `/assets/sprites/${name} (${i}).png`;
                imgs.push(img);
            }
            return imgs;
        };

        runImgsRef.current = loadSet('Run', 8);
        jumpImgsRef.current = loadSet('Jump', 12);
        deathImgsRef.current = loadSet('Dead', 8);

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

    // 2. MOTOR DEL JUEGO
    useEffect(() => {
        if (gameState !== "PLAYING") return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        let animationFrameId;

        const handleKeyDown = (e) => {
            if (e.key === " " || e.key === "ArrowUp") {
                e.preventDefault();
                if (cocoYRef.current >= groundY) {
                    cocoVelocityRef.current = jumpForce;
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        const draw = () => {
            // Limpiar canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Solo movemos el fondo si NO está muriendo
            if (bgImgRef.current && !isDyingRef.current) {
                bgXRef.current -= bgSpeed;
            if (bgXRef.current <= -canvas.width) {
                bgXRef.current = 0;
                }
        }
            // Dibujamos el fondo SIEMPRE (para que no se quede la pantalla en negro al morir)
            if (bgImgRef.current) {
                ctx.drawImage(bgImgRef.current, bgXRef.current, 0, canvas.width, canvas.height);
                ctx.drawImage(bgImgRef.current, bgXRef.current + canvas.width, 0, canvas.width, canvas.height);
            }

            // Física
            cocoVelocityRef.current += gravity;
            cocoYRef.current += cocoVelocityRef.current;

            if (cocoYRef.current > groundY) {
                cocoYRef.current = groundY;
                cocoVelocityRef.current = 0;
            }

            //Obstáculos sólo se mueven si el cocodrilo está vivo
            if (!isDyingRef.current) {
                obstacleXRef.current -= obstacleSpeed;
            if (obstacleXRef.current < -50) {
                obstacleXRef.current = 800;
                scoreRef.current += 1;
                currentObstacleType.current = Math.random() > 0.5 ? 'log' : 'rock';
                }
            }

            //Colisiones
            const cocoHitbox = { x: cocoX + 10, y: cocoYRef.current + 5, w: 30, h: 45 };
            const obsHitbox = { x: obstacleXRef.current + 5, y: groundY + 15, w: 30, h: 30 };

            if (!isDyingRef.current && 
                cocoHitbox.x < obsHitbox.x + obsHitbox.w &&
                cocoHitbox.x + cocoHitbox.w > obsHitbox.x &&
                cocoHitbox.y < obsHitbox.y + obsHitbox.h &&
                cocoHitbox.y + cocoHitbox.h > obsHitbox.y) {
                
                isDyingRef.current = true;
                frameCountRef.current = 0; 
            }

            //Dibujo de cocodrilo
            let currentSprites = runImgsRef.current;

            if (isDyingRef.current) {
                currentSprites = deathImgsRef.current;
            } else if (cocoYRef.current < groundY) {
                currentSprites = jumpImgsRef.current;
            }

            let frameIndex = 0;
            if (currentSprites && currentSprites.length > 0) {
                // El módulo (%) se hace con la cantidad total de frames de ESA animación
                frameIndex = Math.floor(frameCountRef.current / 6) % currentSprites.length;

                // Si terminó la animación de muerte, Game Over real
                if (isDyingRef.current && frameIndex === currentSprites.length - 1) {
                    setGameState('GAMEOVER');
                    return; 
                    }
            }

            const currentImg = (currentSprites && currentSprites.length > 0) ? currentSprites[frameIndex] : null;

            if (currentImg && currentImg.complete && currentImg.naturalWidth !== 0) {
                ctx.drawImage(currentImg, cocoX, cocoYRef.current, 60, 60);
            } else {
                ctx.fillStyle = "#2ecc71"; 
                ctx.fillRect(cocoX, cocoYRef.current, 50, 50);
            }

            //Dibujo de obstáculo
            const obsImg = currentObstacleType.current === 'log' ? logImgRef.current : rockImgRef.current;
            if (obsImg && obsImg.complete && obsImg.naturalWidth !== 0) {
                ctx.drawImage(obsImg, obstacleXRef.current, groundY + 10, 40, 40);
            } else {
                ctx.fillStyle = currentObstacleType.current === 'log' ? "#8B4513" : "#7f8c8d";
                ctx.fillRect(obstacleXRef.current, groundY + 10, 40, 40);
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
        <div style={{ width: '800px', margin: '20px auto', fontFamily: 'Arial' }}>
            <h2 style={{ textAlign: 'center' }}>Crocodile Run</h2>
            <div style={{ position: 'relative', width: '800px', height: '600px' }}>
                
                {gameState !== 'PLAYING' && (
                    <div style={overlayStyle}>
                        {gameState === 'START' ? (
                            <>
                                <h1>¡Bienvenido a GameHub!</h1>
                                <p>Presiona Espacio para Saltar</p>
                                <button onClick={startGame} style={buttonStyle}>¡EMPEZAR!</button>
                            </>
                        ) : (
                            <>
                                <h1 style={{ color: '#ff4757' }}>¡GAMEOVER!</h1>
                                <p style={{ fontSize: '24px' }}>Puntos: {scoreRef.current}</p>
                                <button onClick={startGame} style={buttonStyle}>REINTENTAR</button>
                                <button onClick={() => window.location.reload()} style={{...buttonStyle, backgroundColor: '#57606f'}}>SALIR</button>
                            </>
                        )}
                    </div>
                )}

                <canvas 
                    ref={canvasRef} 
                    width={800} height={600} 
                    style={{ backgroundColor: '#ccffff', display: 'block', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}
                />
            </div>
        </div>
    );
}

export default Crocodile;