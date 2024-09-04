"use client";

import React, { useRef, useState, useEffect, MouseEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEraser, faPencilAlt, faTextHeight } from '@fortawesome/free-solid-svg-icons';

type Tool = 'pencil' | 'text' | 'eraser';

export default function Canvas() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [drawing, setDrawing] = useState(false);
    const [tool, setTool] = useState<Tool>('pencil');
    const [textBoxes, setTextBoxes] = useState<{ x: number, y: number, text: string }[]>([]);
    const [drawings, setDrawings] = useState<{ x: number, y: number, type: 'line' | 'path', path: { x: number, y: number }[] }[]>([]);

    const startDrawing = ({ nativeEvent }: MouseEvent<HTMLCanvasElement>) => {
        if (tool === 'pencil' || tool === 'eraser') {
            const { offsetX, offsetY } = nativeEvent;
            const ctx = canvasRef.current?.getContext('2d');
            if (ctx) {
                if (tool === 'eraser') {
                    ctx.globalCompositeOperation = 'destination-out';
                    ctx.lineWidth = 20;
                    ctx.strokeStyle = 'rgba(0,0,0,1)';
                } else {
                    ctx.globalCompositeOperation = 'source-over';
                    ctx.lineWidth = 4;
                    ctx.strokeStyle = 'rgba(0,0,0,1)';
                }
                ctx.beginPath();
                ctx.moveTo(offsetX, offsetY);
                setDrawing(true);

                setDrawings(prev => [...prev, { x: offsetX, y: offsetY, type: 'path', path: [{ x: offsetX, y: offsetY }] }]);
            }
        } else if (tool === 'text') {
            const { offsetX, offsetY } = nativeEvent;
            const text = prompt('Enter text:');
            if (text) {
                setTextBoxes([...textBoxes, { x: offsetX, y: offsetY, text }]);
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

            setDrawings(prev => {
                const lastPath = prev[prev.length - 1];
                if (lastPath) {
                    lastPath.path.push({ x: offsetX, y: offsetY });
                }
                return [...prev.slice(0, -1), lastPath];
            });
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

    const redrawCanvas = () => {
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
            ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);

            ctx.globalCompositeOperation = 'source-over';
            drawings.forEach(({ path }) => {
                ctx.beginPath();
                ctx.moveTo(path[0].x, path[0].y);
                path.forEach(({ x, y }) => ctx.lineTo(x, y));
                ctx.stroke();
            });

            textBoxes.forEach(({ x, y, text }) => {
                ctx.font = '20px Arial';
                ctx.fillStyle = '#000';
                ctx.fillText(text, x, y);
            });
        }
    };

    useEffect(() => {
        redrawCanvas();
    }, [textBoxes, drawings]);

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

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', height: '3.5rem', backgroundColor: '#ccc', padding: '0.3rem' }}>
                <button onClick={() => setTool('pencil')} style={tool === 'pencil' ? { backgroundColor: 'white', border: '3px solid gray', width: '2.2rem', height: '2.5rem' } : { backgroundColor: 'white', border: '1px solid gray', width: '2.2rem', height: '2.5rem' }}>
                    <FontAwesomeIcon icon={faPencilAlt} style={{ fontSize: '1.5rem', color: 'black' }} />
                </button>
                <button onClick={() => setTool('text')} style={tool === 'text' ? { backgroundColor: 'white', border: '3px solid gray', width: '2.2rem', height: '2.5rem', marginInline: '0.2rem' } : { backgroundColor: 'white', border: '1px solid gray', width: '2.2rem', height: '2.5rem', marginInline: '0.2rem' }}>
                    <FontAwesomeIcon icon={faTextHeight} style={{ fontSize: '1.5rem', color: 'white', border: '1px solid darkblue', height: '1.3rem', marginTop: 0.5 }} />
                </button>
                <button onClick={() => setTool('eraser')} style={tool === 'eraser' ? { backgroundColor: 'white', border: '3px solid gray', width: '2.2rem', height: '2.5rem' } : { backgroundColor: 'white', border: '1px solid gray', width: '2.2rem', height: '2.5rem' }}>
                    <FontAwesomeIcon icon={faEraser} style={{ fontSize: '1.5rem', color: 'black', marginTop: 0.5 }} />
                </button>
            </div>

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
