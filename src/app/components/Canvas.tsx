"use client";

import React, { useRef, useState, useEffect, MouseEvent } from 'react';
import { Tool } from '../interfaces';
import { Settings } from './Settings';

const Canvas = () => {
    // Referencia al elemento <canvas> para acceder al contexto 2D
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    // Estado para manejar si el usuario está dibujando actualmente
    const [drawing, setDrawing] = useState(false);

    // Estado para manejar la herramienta seleccionada (pencil, eraser, text, image)
    const [tool, setTool] = useState<Tool>('pencil');

    // Estado para manejar las cajas de texto añadidas al canvas
    const [textBoxes, setTextBoxes] = useState<{ x: number, y: number, text: string }[]>([]);

    // Estado para manejar el color seleccionado para dibujar
    const [color, setColor] = useState<string>('#000000');

    // Estado para manejar la imagen cargada en el canvas
    const [image, setImage] = useState<HTMLImageElement | null>(null);

    // Inicia el dibujo o añade texto/imágenes según la herramienta seleccionada
    const startDrawing = ({ nativeEvent }: MouseEvent<HTMLCanvasElement>) => {
        if (tool === 'pencil' || tool === 'eraser') {
            // Si la herramienta es lápiz o borrador, empieza a dibujar
            const { offsetX, offsetY } = nativeEvent;
            const ctx = canvasRef.current?.getContext('2d');
            if (ctx) {
                if (tool === 'eraser') {
                    // Modo de borrado usando destination-out
                    ctx.globalCompositeOperation = 'destination-out';
                    ctx.lineWidth = 20; // Tamaño del borrador
                } else {
                    // Modo de dibujo normal
                    ctx.globalCompositeOperation = 'source-over';
                    ctx.lineWidth = 4; // Tamaño del lápiz
                    ctx.strokeStyle = color; // Color del lápiz
                }
                // Inicia una nueva línea de dibujo
                ctx.beginPath();
                ctx.moveTo(offsetX, offsetY);
                setDrawing(true);
            }
        } else if (tool === 'text') {
            // Si la herramienta es texto, agrega una nueva caja de texto
            const { offsetX, offsetY } = nativeEvent;
            const text = prompt('Enter text:'); // Solicita el texto al usuario
            if (text) {
                setTextBoxes([...textBoxes, { x: offsetX, y: offsetY, text }]);
            }
        } else if (tool === 'image') {
            // Si la herramienta es imagen, dibuja la imagen cargada en el canvas
            const { offsetX, offsetY } = nativeEvent;
            if (image) {
                const ctx = canvasRef.current?.getContext('2d');
                if (ctx) {
                    ctx.drawImage(image, offsetX, offsetY, 100, 100); // Dibuja la imagen con un tamaño de 100x100
                }
            }
        }
    };

    // Dibuja en el canvas cuando el mouse se mueve y se está dibujando
    const draw = ({ nativeEvent }: MouseEvent<HTMLCanvasElement>) => {
        if (!drawing) return;
        const { offsetX, offsetY } = nativeEvent;
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
            ctx.lineTo(offsetX, offsetY);
            ctx.stroke(); // Continúa el dibujo de la línea
        }
    };

    // Finaliza el dibujo cuando se suelta el botón del mouse
    const stopDrawing = () => {
        if (drawing) {
            const ctx = canvasRef.current?.getContext('2d');
            if (ctx) {
                ctx.closePath(); // Cierra la línea de dibujo
                ctx.globalCompositeOperation = 'source-over'; // Restablece la operación de composición
            }
            setDrawing(false);
        }
    };

    // Maneja la carga de imágenes y las almacena en el estado
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const img = new Image();
            img.onload = () => setImage(img); // Guarda la imagen en el estado cuando esté lista
            img.src = URL.createObjectURL(file); // Crea una URL temporal para la imagen cargada
        }
    };

    // Inicializa el canvas con un fondo blanco al cargar el componente
    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.fillStyle = '#fff'; // Establece el color de fondo
                ctx.fillRect(0, 0, canvas.width, canvas.height); // Rellena todo el canvas con el color de fondo
            }
        }
    }, []);

    // Redibuja el contenido del canvas cuando cambian las cajas de texto o la imagen
    useEffect(() => {
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
            ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height); // Limpia el canvas
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, canvasRef.current!.width, canvasRef.current!.height); // Rellena el canvas con el color de fondo

            // Dibuja todas las cajas de texto en el canvas
            textBoxes.forEach(({ x, y, text }) => {
                ctx.font = '20px Arial'; // Establece la fuente para el texto
                ctx.fillStyle = '#000'; // Color del texto
                ctx.fillText(text, x, y); // Dibuja el texto en la posición especificada
            });

            // Dibuja la imagen cargada si existe
            if (image) {
                ctx.drawImage(image, 50, 50, 100, 100); // Dibuja la imagen en una posición fija
            }
        }
    }, [textBoxes, image]);

    return (
        <div>
            <Settings 
                tool={tool}
                setTool={setTool}
                color={color}
                setColor={setColor}
                handleImageUpload={handleImageUpload} 
            />
            <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                width={450}
                height={300}
                style={{ backgroundColor: 'white' }}
            />
        </div>
    );
}

export default Canvas;
