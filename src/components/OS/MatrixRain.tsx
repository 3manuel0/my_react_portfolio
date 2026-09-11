import React, { useEffect, useRef } from "react";

const GLYPHS = "アイウエオカキクケコサシスセソタチツテト0123456789ABCDEF$#<>";

const MatrixRain: React.FC = () => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const fontSize = 14;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    let columns = Math.ceil(w / fontSize);
    let drops = Array.from({ length: columns }, () => Math.random() * 100);

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      columns = Math.ceil(w / fontSize);
      drops = Array.from({ length: columns }, () => Math.random() * 100);
    };
    window.addEventListener("resize", onResize);

    let raf = 0;
    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#5eead4";
      ctx.font = `${fontSize}px monospace`;
      for (let i = 0; i < columns; i++) {
        const ch = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        ctx.fillText(ch, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > h && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-40 opacity-30"
    />
  );
};

export default MatrixRain;