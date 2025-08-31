"use client";
import { useRef, useEffect, useState } from "react";

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

type Handle =
  | "top-left"
  | "top"
  | "top-right"
  | "right"
  | "bottom-right"
  | "bottom"
  | "bottom-left"
  | "left"
  | null;

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [shapes, setShapes] = useState<Rect[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [resizing, setResizing] = useState<Handle>(null);

  const handleSize = 12;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const drawAllShapes = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      shapes.forEach((shape, index) => {
        ctx.lineWidth = 2;
        ctx.strokeStyle = index === selectedIndex ? "red" : "white";
        ctx.strokeRect(shape.x, shape.y, shape.w, shape.h);

        if (index === selectedIndex) {
          drawHandles(ctx, shape);
        }
      });
    };

    const drawHandles = (ctx: CanvasRenderingContext2D, rect: Rect) => {
      const positions = getHandlePositions(rect);
      ctx.fillStyle = "red";
      positions.forEach(({ x, y }) => {
        ctx.fillRect(x - handleSize / 2, y - handleSize / 2, handleSize, handleSize);
      });
    };

    const getHandlePositions = (rect: Rect) => {
      const { x, y, w, h } = rect;
      return [
        { x: x, y: y, handle: "top-left" },
        { x: x + w / 2, y: y, handle: "top" },
        { x: x + w, y: y, handle: "top-right" },
        { x: x + w, y: y + h / 2, handle: "right" },
        { x: x + w, y: y + h, handle: "bottom-right" },
        { x: x + w / 2, y: y + h, handle: "bottom" },
        { x: x, y: y + h, handle: "bottom-left" },
        { x: x, y: y + h / 2, handle: "left" },
      ];
    };

    const getHandleUnderCursor = (x: number, y: number, rect: Rect): Handle => {
      const handles = getHandlePositions(rect);
      for (let h of handles) {
        if (
          x >= h.x - handleSize / 2 &&
          x <= h.x + handleSize / 2 &&
          y >= h.y - handleSize / 2 &&
          y <= h.y + handleSize / 2
        ) {
          return h.handle as Handle;
        }
      }
      return null;
    };

    const selectShape = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      for (let i = 0; i < shapes.length; i++) {
        const shape = shapes[i];

        const handle = getHandleUnderCursor(x, y, shape);
        if (handle) {
          setSelectedIndex(i);
          setResizing(handle);
          return;
        }

        ctx.beginPath();
        ctx.rect(shape.x, shape.y, shape.w, shape.h);
        if (ctx.isPointInStroke(x, y)) {
          setSelectedIndex(i);
          drawAllShapes();
          return;
        }
      }

      setSelectedIndex(null);
    };

    const mouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (!resizing) {
        setStartPoint({ x, y });
        setDrawing(true);
      }
    };

    const mouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (!ctx) return;

      if (resizing && selectedIndex !== null) {
        const updatedShapes = [...shapes];
        const shape = updatedShapes[selectedIndex];

        const dx = x - shape.x;
        const dy = y - shape.y;

        switch (resizing) {
          case "top-left":
            shape.w += shape.x - x;
            shape.h += shape.y - y;
            shape.x = x;
            shape.y = y;
            break;
          case "top":
            shape.h += shape.y - y;
            shape.y = y;
            break;
          case "top-right":
            shape.w = x - shape.x;
            shape.h += shape.y - y;
            shape.y = y;
            break;
          case "right":
            shape.w = x - shape.x;
            break;
          case "bottom-right":
            shape.w = x - shape.x;
            shape.h = y - shape.y;
            break;
          case "bottom":
            shape.h = y - shape.y;
            break;
          case "bottom-left":
            shape.w += shape.x - x;
            shape.h = y - shape.y;
            shape.x = x;
            break;
          case "left":
            shape.w += shape.x - x;
            shape.x = x;
            break;
        }

        setShapes(updatedShapes);
        drawAllShapes();
        return;
      }

      if (drawing) {
        drawAllShapes();
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.strokeRect(startPoint.x, startPoint.y, x - startPoint.x, y - startPoint.y);
      }
    };

    const mouseUp = (e: MouseEvent) => {
      if (resizing) {
        setResizing(null);
        return;
      }

      if (drawing) {
        const rect = canvas.getBoundingClientRect();
        const endX = e.clientX - rect.left;
        const endY = e.clientY - rect.top;

        setShapes((prev) => [
          ...prev,
          {
            x: startPoint.x,
            y: startPoint.y,
            w: endX - startPoint.x,
            h: endY - startPoint.y,
          },
        ]);
        setDrawing(false);
      }
    };

    canvas.addEventListener("mousedown", selectShape);
    canvas.addEventListener("mousedown", mouseDown);
    canvas.addEventListener("mousemove", mouseMove);
    canvas.addEventListener("mouseup", mouseUp);

    drawAllShapes();

    return () => {
      canvas.removeEventListener("mousedown", selectShape);
      canvas.removeEventListener("mousedown", mouseDown);
      canvas.removeEventListener("mousemove", mouseMove);
      canvas.removeEventListener("mouseup", mouseUp);
    };
  }, [drawing, startPoint, shapes, selectedIndex, resizing]);

  return (
    <div>
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-screen h-screen bg-[#121212]" />
    </div>
  );
}
