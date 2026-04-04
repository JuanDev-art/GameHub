import React, { useEffect, useState, useRef } from 'react';

// Constantes de física 
const gravity = 0.5;
const jumpForce = -12; 
const groundY = 450;
const obstacleSpeed = 5; 

function Crocodile({ gameId }) {
    // 1. PRIMERO: Estados y Referencias
    const [gameState, setGameState] = useState('START');
    const canvasRef = useRef(null);
    const scoreRef = useRef(0);
    const cocoYRef = useRef(groundY);
    const cocoVelocityRef = useRef(0);
    const obstacleXRef = useRef(800);
    // Referencias para guardar los arrays de imágenes
    const runImgsRef = useRef([]);
    const jumpImgsRef = useRef([]);
    const deathImgsRef = useRef([]);
    // Estado para saber qué "fotograma" de la animación toca dibujar
    const [animationFrame, setAnimationFrame] = useState(0);

    // 2. SEGUNDO: Funciones de control
    const startGame = () => {
        cocoYRef.current = groundY;
        cocoVelocityRef.current = 0;
        obstacleXRef.current = 800;
        scoreRef.current = 0;
        setGameState('PLAYING');
    };

    // 3. TERCERO: El motor del juego
    useEffect(() => {
        if (gameState !== "PLAYING") return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        let animationFrameId;

        const handleKeyDown = (e) => {
            if (e.key === " ") {
                e.preventDefault(); // Evita que la página haga scroll al saltar
                if (cocoYRef.current >= groundY) {
                    cocoVelocityRef.current = jumpForce;
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Física del personaje
            cocoVelocityRef.current += gravity;
            cocoYRef.current += cocoVelocityRef.current;

            if (cocoYRef.current > groundY) {
                cocoYRef.current = groundY;
                cocoVelocityRef.current = 0;
            }

            // Movimiento del obstáculo
            obstacleXRef.current -= obstacleSpeed;
            if (obstacleXRef.current < -50) {
                obstacleXRef.current = 800;
                scoreRef.current += 1;
            }

            // Lógica de Colisión (AABB)
            const cocoRight = 50 + 40;
            const cocoBottom = cocoYRef.current + 50;
            const obsLeft = obstacleXRef.current;
            const obsTop = groundY + 10;
            const obsBottom = groundY + 50;

            if (cocoRight > obsLeft && 50 < (obsLeft + 40) && 
                cocoBottom > obsTop && cocoYRef.current < obsBottom) {
                setGameState('GAMEOVER');
                return;
            }

            // Dibujo
            ctx.fillStyle = "#2ecc71"; // Cocodrilo
            ctx.fillRect(50, cocoYRef.current, 50, 50);

            ctx.fillStyle = "#8B4513"; // Obstáculo
            ctx.fillRect(obstacleXRef.current, groundY + 10, 40, 40);

            animationFrameId = requestAnimationFrame(draw);
        }

        draw();

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            cancelAnimationFrame(animationFrameId);
        };
    }, [gameState]);

    return (
        <div className="game-wrapper" style={{ position: 'relative', width: '800px', margin: '20px auto' }}>
            <h2 style={{ textAlign: 'center' }}>Crocodile Run</h2>
            
            {/* Contenedor relativo para que el overlay funcione */}
            <div style={{ position: 'relative', width: '800px', height: '600px' }}>
                
                {gameState !== 'PLAYING' && (
                    <div style={{
                        position: 'absolute',
                        top: 0, left: 0, width: '100%', height: '100%',
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        display: 'flex', flexDirection: 'column',
                        justifyContent: 'center', alignItems: 'center',
                        color: 'white', zIndex: 10
                    }}>
                        {gameState === 'START' ? (
                            <>
                                <h1>Crocodile Run</h1>
                                <button onClick={startGame} style={buttonStyle}>¡EMPEZAR!</button>
                            </>
                        ) : (
                            <>
                                <h1>¡HAS CAÍDO!</h1>
                                <p style={{ fontSize: '24px' }}>Puntos: {scoreRef.current}</p>
                                <button onClick={startGame} style={buttonStyle}>REINTENTAR</button>
                                <button onClick={() => window.location.reload()} style={{...buttonStyle, backgroundColor: '#666'}}>SALIR</button>
                            </>
                        )}
                    </div>
                )}

                <canvas 
                    ref={canvasRef} 
                    width={800} height={600} 
                    style={{ backgroundColor: '#ccffff', display: 'block', borderRadius: '8px' }}
                />
            </div>
        </div>
    );
}

const buttonStyle = {
    padding: '15px 30px',
    fontSize: '20px',
    cursor: 'pointer',
    backgroundColor: '#2ecc71',
    border: 'none',
    color: 'white',
    borderRadius: '5px',
    margin: '10px'
};

export default Crocodile;