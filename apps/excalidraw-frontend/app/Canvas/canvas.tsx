// "use client";
// import { Button } from "@repo/ui/button";
// import { useRef, useEffect, useState } from "react";

// export default function Canvas() {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [isDrawing, setDrawing] = useState(false);
//   const [start, setStart] = useState({ x: 0, y: 0 });
  
//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     // Resize to full screen
//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;

//     const mouseDown = (e: MouseEvent) => {
//       const rect = canvas.getBoundingClientRect();
//       setStart({ x: e.clientX - rect.left, y: e.clientY - rect.top });
//       setDrawing(true);
//     }

//     const mouseMove = (e: MouseEvent) => {
//       if(!isDrawing) return;

//       const rect = canvas.getBoundingClientRect();
//       const currentX = e.clientX - rect.left;
//       const currentY = e.clientY - rect.top;

//       ctx.clearRect(0, 0, canvas.width, canvas.height);
//       ctx.beginPath();
//       ctx.rect(start.x, start.y, currentX - start.x, currentY - start.y);
//       ctx.strokeStyle = "white";
//       ctx.stroke();
//     }

//     const mouseUp = (e : MouseEvent) => {
//       setDrawing(false);
//     }

//     canvas.addEventListener("mousedown", mouseDown);
//     canvas.addEventListener("mousemove", mouseMove);
//     canvas.addEventListener("mouseup", mouseUp);
    
//     return () => {
//       canvas.removeEventListener("mousedown", mouseDown);
//       canvas.removeEventListener("mousemove", mouseMove);
//       canvas.removeEventListener("mouseup", mouseUp);
//     };

//   }, [isDrawing, start]);

//   return <div>
//     <canvas ref={canvasRef} className="fixed top-0 left-0 w-screen h-screen bg-[#121212]" />
//     {/* <Button className="fixed top-2 left-2 text-amber-600" appName="Excalidraw">Test</Button> */}
//   </div>
// }


"use client";
import { useRef, useEffect, useState } from "react";

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setDrawing] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });
  const [rectangles, setRectangles] = useState<Rect[]>([]); // store all rectangles

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const drawAll = (preview?: Rect) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
     // ctx.fillStyle = "rgb(18,18,18)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw saved rectangles
      ctx.strokeStyle = "white";
      rectangles.forEach(r => {
        ctx.strokeRect(r.x, r.y, r.w, r.h);
      });

      // Draw preview rectangle if provided
      if (preview) {
        ctx.strokeStyle = "white";
        ctx.strokeRect(preview.x, preview.y, preview.w, preview.h);
      }
    };

    const mouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      setStart({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      setDrawing(true);
    };

    const mouseMove = (e: MouseEvent) => {
      if (!isDrawing) return;

      const rect = canvas.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      const previewRect: Rect = {
        x: start.x,
        y: start.y,
        w: currentX - start.x,
        h: currentY - start.y,
      };

      drawAll(previewRect);
    };

    const mouseUp = (e: MouseEvent) => {
      if (!isDrawing) return;
      setDrawing(false);

      const rect = canvas.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      setRectangles(prev => [
        ...prev,
        {
          x: start.x,
          y: start.y,
          w: currentX - start.x,
          h: currentY - start.y,
        },
      ]);
    };

    // Attach mousedown to canvas, but mousemove/up to window for outside dragging
    canvas.addEventListener("mousedown", mouseDown);
    window.addEventListener("mousemove", mouseMove);
    window.addEventListener("mouseup", mouseUp);

    // Redraw all whenever rectangles array changes
    drawAll();

    return () => {
      canvas.removeEventListener("mousedown", mouseDown);
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("mouseup", mouseUp);
    };
  }, [isDrawing, start, rectangles]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-screen h-screen bg-[#121212]"
    />
  );
}
