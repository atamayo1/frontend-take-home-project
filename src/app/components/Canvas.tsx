"use client";

import React, { useRef, useState, useEffect, MouseEvent } from 'react';
import { Tool } from '../interfaces';
import { Settings } from './Settings';

export default function Canvas() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [drawing, setDrawing] = useState(false);
    const [tool, setTool] = useState<Tool>('pencil');
    const [textBoxes, setTextBoxes] = useState<{ x: number, y: number, text: string }[]>([]);
    const [color, setColor] = useState<string>('#000000');
    const [image, setImage] = useState<HTMLImageElement | null>(null);

    const startDrawing = ({ nativeEvent }: MouseEvent<HTMLCanvasElement>) => {
        if (tool === 'pencil' || tool === 'eraser') {
            const { offsetX, offsetY } = nativeEvent;
            const ctx = canvasRef.current?.getContext('2d');
            if (ctx) {
                if (tool === 'eraser') {
                    ctx.globalCompositeOperation = 'destination-out';
                    ctx.lineWidth = 20;
                } else {
                    ctx.globalCompositeOperation = 'source-over';
                    ctx.lineWidth = 4;
                    ctx.strokeStyle = color;
                }
                ctx.beginPath();
                ctx.moveTo(offsetX, offsetY);
                setDrawing(true);
            }
        } else if (tool === 'text') {
            const { offsetX, offsetY } = nativeEvent;
            const text = prompt('Enter text:');
            if (text) {
                setTextBoxes([...textBoxes, { x: offsetX, y: offsetY, text }]);
            }
        } else if (tool === 'image') {
            const { offsetX, offsetY } = nativeEvent;
            if (image) {
                const ctx = canvasRef.current?.getContext('2d');
                if (ctx) {
                    ctx.drawImage(image, offsetX, offsetY, 100, 100);
                }
            }
        }
    };

    const draw = ({ nativeEvent }: MouseEvent<HTMLCanvasElement>) => {
        if (!drawing) return;
        const { offsetX, offsetY } = nativeEvent;
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
            ctx.lineTo(offsetX, offsetY);
            ctx.stroke();
        }
    };

    const stopDrawing = () => {
        if (drawing) {
            const ctx = canvasRef.current?.getContext('2d');
            if (ctx) {
                ctx.closePath();
                ctx.globalCompositeOperation = 'source-over';
            }
            setDrawing(false);
        }
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const img = new Image();
            img.onload = () => setImage(img);
            img.src = URL.createObjectURL(file);
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.fillStyle = '#fff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
        }
    }, []);

    useEffect(() => {
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
            ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);

            textBoxes.forEach(({ x, y, text }) => {
                ctx.font = '20px Arial';
                ctx.fillStyle = '#000';
                ctx.fillText(text, x, y);
            });

            if (image) {
                ctx.drawImage(image, 50, 50, 100, 100);
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
