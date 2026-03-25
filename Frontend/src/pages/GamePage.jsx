import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useRef } from "react";

function GamePage() {

    const {id} = useParams();
    const [game, setGame] = useState(null);
    const canvasRef = useRef(null);
    const scoreRef = useRef(0);
    const livesRef = useRef(3); //3 vidas
    const playerXRef = useRef(250);
    const [isGameOver, setIsGameOver] = useState(false);

    useEffect(() => {

        fetch(`http://localhost:8080/api/games/${id}`)
        .then(response => response.json())
        .then(data => {
            setGame(data);
        });

    }, [id]);

    useEffect(() => {
        if (!game || isGameOver) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        // 1. Cesta
        const basketImg = new Image();
        basketImg.src = "/cesta.png";
        let basketLoaded = false;
        basketImg.onload = () => { basketLoaded = true; }

        // 2. Manzana mala
        const badImg = new Image();
        badImg.src = "/manzanaPodrida.png";
        let badLoaded = false;
        badImg.onload = () => { badLoaded = true; }

        // 3. Estructura de frutas (CORREGIDO: Rutas con / al principio)
        const fruitDefinitions = [
            { name: "Manzana", src: "/manzana.png", points: 1 },
            { name: "Platano", src: "/platano.png", points: 1 },
            { name: "Fresa",   src: "/fresa.png",   points: 2 },
            { name: "Pina",    src: "/pina.png",    points: 5 }
        ];

        // 4. Carga de imágenes de frutas
        const goodFruitImages = fruitDefinitions.map(fruitDef => {
            const img = new Image();
            img.src = fruitDef.src;
            img.dataset.points = fruitDef.points; 
            return img;
        });

        // Dimensiones
        const objWidth = 50;
        const objHeight = 50;
        const playerWidth = 100;
        const playerHeight = 60;
        
        let y = -objHeight;
        let x = Math.random() * (canvas.width - objWidth);
        let objType = "good";
        let animationFrameId;

        // Empezamos con la primera fruta del array
        let currentGoodFruitImage = goodFruitImages[0];

        const keys = { ArrowLeft: false, ArrowRight: false };
        
        function draw() {
            // Limpiar fondo
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Movimiento
            const speed = 7;
            if (keys.ArrowLeft) playerXRef.current -= speed;
            if (keys.ArrowRight) playerXRef.current += speed;
            playerXRef.current = Math.max(0, Math.min(playerXRef.current, canvas.width - playerWidth));

            // DIBUJAR OBJETO
            if (objType === "good") {
                // Dibujamos la fruta actual si existe
                if (currentGoodFruitImage) {
                    ctx.drawImage(currentGoodFruitImage, x, y, objWidth, objHeight);
                }
            } else {
                if (badLoaded) {
                    ctx.drawImage(badImg, x, y, objWidth, objHeight);
                } else {
                    ctx.fillStyle = "#e74c3c";
                    ctx.fillRect(x, y, objWidth, objHeight);
                }
            }
        
            // DIBUJAR CESTA
            const playerY = canvas.height - playerHeight;
            if (basketLoaded) {
                ctx.drawImage(basketImg, playerXRef.current, playerY, playerWidth, playerHeight);
            } else {
                ctx.fillStyle = "black";
                ctx.fillRect(playerXRef.current, playerY, playerWidth, playerHeight);
            }

            // TEXTOS
            const drawText = (text, xP, yP) => {
                ctx.font = "bold 20px Arial";
                ctx.textAlign = "left";
                ctx.strokeStyle = "black";
                ctx.lineWidth = 4;
                ctx.strokeText(text, xP, yP);
                ctx.fillStyle = "white";
                ctx.fillText(text, xP, yP);
            };

            drawText("Score: " + scoreRef.current, 10, 30);
            drawText("Lives: " + livesRef.current, canvas.width - 110, 30);
            
            // Lógica de caída
            y += 1 + (scoreRef.current * 0.05);

            // Suelo
            if (y > canvas.height) {
                if (objType === "good") livesRef.current--;
                if (livesRef.current <= 0) { setIsGameOver(true); return; }
                resetObject();
            }

            // Colisión
            if (
                y + objHeight >= playerY &&
                y <= playerY + playerHeight &&
                x + objWidth > playerXRef.current &&
                x < playerXRef.current + playerWidth
            ) {
                if (objType === "good") {
                    const pointsToAdd = parseInt(currentGoodFruitImage.dataset.points) || 1;
                    scoreRef.current += pointsToAdd;
                } else {
                    livesRef.current--;
                    if (livesRef.current <= 0) { setIsGameOver(true); return; }
                }
                resetObject();
            }

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

            animationFrameId = requestAnimationFrame(draw);
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

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp); // LIMPIEZA AÑADIDA
            cancelAnimationFrame(animationFrameId);
        };

    }, [game, isGameOver]);

    //Reiniciar los valores cuando el jugador pierde.
    const handleRestart = () => {
        scoreRef.current = 0;
        livesRef.current = 3;
        setIsGameOver(false);
    };

    if (!game) {
            return <p>Cargando...</p>
    }

    if(isGameOver) {
        return (
            <div style = {{ textAlign: "center", marginTop: "50px" }}>
                <h2>Game over</h2>
                <p>Tu puntuación final ha sido: <strong>{scoreRef.current}</strong></p>
                <button
                    onClick={handleRestart}
                    style={{padding: "10px 20px", fontSize: "16px", cursor: "pointer"}}>

                        Volver a jugar
                    </button>
                    
            </div>
        );

    }

    return (
        <div>
            <h1>{game.name}</h1>
            <p>{game.description}</p>
            <p>Dificultad: {game.difficulty}</p>
        <canvas
            ref={canvasRef}
            width={600}
            height={400}
            style={{ 
                border: "5px solid #3e2723", 
                display: "block",
                margin: "0 auto",
                backgroundImage: "url('/bosque.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "bottom" 
            }}
        ></canvas>
        </div>
    );
}

export default GamePage;