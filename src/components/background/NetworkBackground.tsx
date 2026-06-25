import { useEffect, useRef } from 'react';

import styles from './NetworkBackground.module.css';

export default function NetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current!;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animationId: number;

    const config = {
      particleCount: 80,
      particleRadius: 2,
      lineDistance: 150,
      speed: 0.5,
      primaryColor: "#00d4aa",
      secondaryColor: "#0984e3",
    };

    let particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
    }[] = [];

    function resize() {
      const parent = canvas.parentElement;
      if (!parent) return;

      width = parent.offsetWidth;
      height = parent.offsetHeight;
      canvas.width = width;
      canvas.height = height;
    }

    function createParticles() {
      particles = Array.from({ length: config.particleCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * config.speed,
        vy: (Math.random() - 0.5) * config.speed,
        radius: Math.random() * config.particleRadius + 1,
      }));
    }

    function drawParticle(particle: (typeof particles)[number], index: number) {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fillStyle =
        index % 2 === 0 ? config.primaryColor : config.secondaryColor;
      ctx.fill();
    }

    function drawLines() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < config.lineDistance) {
            const opacity = 1 - distance / config.lineDistance;

            const gradient = ctx.createLinearGradient(
              particles[i].x,
              particles[i].y,
              particles[j].x,
              particles[j].y
            );

            gradient.addColorStop(0, `rgba(0, 212, 170, ${opacity * 0.4})`);
            gradient.addColorStop(1, `rgba(9, 132, 227, ${opacity * 0.4})`);

            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
    }

    function updateParticles() {
      for (const particle of particles) {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > height) particle.vy *= -1;

        particle.x = Math.max(0, Math.min(width, particle.x));
        particle.y = Math.max(0, Math.min(height, particle.y));
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      drawLines();
      particles.forEach(drawParticle);
      updateParticles();
      animationId = requestAnimationFrame(animate);
    }

    resize();
    createParticles();
    animate();

    function handleResize() {
      resize();
      createParticles();
    }

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    }
  }, []);

  return <canvas className={styles['network-canvas']} ref={canvasRef} />;
}
