"use client";
import { Button } from "@repo/ui/button";
import { useRef, useEffect } from "react";

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Resize to full screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // 🔵 Set background color
    // ctx.fillStyle = 'rgba(18,18,18,255)'; 
    canvas.style.backgroundColor = 'rgba(18,18,18,255)';

    // 🔴 Draw a red square
    ctx.fillStyle = "red";
    ctx.fillRect(100, 100, 150, 150);

    // 🟢 Draw a green circle
    ctx.beginPath();
    ctx.arc(300, 300, 50, 0, Math.PI * 2);
    ctx.fillStyle = "green";
    ctx.fill();
  }, []);

  return <div>
    <canvas ref={canvasRef}  />
    <Button className="fixed top-2 left-2 text-amber-600" appName="Excalidraw">Test</Button>
  </div>
}
