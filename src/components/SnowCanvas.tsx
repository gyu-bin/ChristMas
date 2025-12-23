import { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

interface Snowflake {
  x: number;
  y: number;
  radius: number;
  speed: number;
  opacity: number;
  stuck?: boolean; // 눈이 쌓였는지 여부
}

interface ShootingStar {
  x: number;
  y: number;
  angle: number;
  length: number;
  speed: number;
  opacity: number;
  life: number;
}

export function SnowCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const snowflakesRef = useRef<Snowflake[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const snowPileRef = useRef<number[]>([]); // 화면 하단 눈 쌓임 높이 배열
  const lastShootingStarRef = useRef<number>(Date.now());
  const { state } = useApp();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // 눈 쌓임 배열 초기화
      snowPileRef.current = new Array(Math.ceil(canvas.width / 10)).fill(0);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 별똥별 생성 함수 (가끔씩 생성)
    const createShootingStar = () => {
      if (Math.random() < 0.3 && Date.now() - lastShootingStarRef.current > 10000) {
        const angle = Math.random() * Math.PI * 0.4 + Math.PI * 0.3; // 45도~90도 각도
        shootingStarsRef.current.push({
          x: Math.random() * canvas.width * 0.3,
          y: Math.random() * canvas.height * 0.2,
          angle: angle,
          length: 30 + Math.random() * 40,
          speed: 3 + Math.random() * 2,
          opacity: 1,
          life: 200 + Math.random() * 100,
        });
        lastShootingStarRef.current = Date.now();
      }
    };

    const generateSnowflakes = () => {
      const amount = state.snow.amount;
      const baseSpeed = state.snow.speed;
      snowflakesRef.current = [];

      for (let i = 0; i < amount; i++) {
        snowflakesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 3 + 1,
          speed: Math.random() * 2 + 0.5 * baseSpeed,
          opacity: Math.random() * 0.5 + 0.5,
        });
      }
    };

    generateSnowflakes();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 별똥별 생성 (가끔씩)
      createShootingStar();

      // 별똥별 렌더링 및 업데이트
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.lineWidth = 2;
      shootingStarsRef.current = shootingStarsRef.current.filter((star) => {
        star.life--;
        star.opacity = Math.max(0, star.opacity - 0.02);
        
        if (star.life <= 0 || star.opacity <= 0) return false;

        // 별똥별 그리기
        ctx.beginPath();
        ctx.globalAlpha = star.opacity;
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(
          star.x + Math.cos(star.angle) * star.length,
          star.y + Math.sin(star.angle) * star.length
        );
        ctx.stroke();
        
        // 별똥별 머리 부분 (더 밝게)
        ctx.beginPath();
        ctx.arc(star.x, star.y, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // 이동
        star.x += Math.cos(star.angle) * star.speed;
        star.y += Math.sin(star.angle) * star.speed;

        return true;
      });

      // 눈 쌓임 영역 그리기 (하단)
      const groundLevel = canvas.height - 100; // 하단 100px 영역에 눈 쌓임
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.beginPath();
      ctx.moveTo(0, groundLevel);
      
      for (let i = 0; i < snowPileRef.current.length; i++) {
        const x = i * 10;
        const y = groundLevel + snowPileRef.current[i];
        ctx.lineTo(x, y);
      }
      ctx.lineTo(canvas.width, groundLevel);
      ctx.closePath();
      ctx.fill();

      // 눈 내리기
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      const speedMultiplier = state.snow.speed;

      // stuck된 눈 개수 확인
      const stuckCount = snowflakesRef.current.filter(s => s.stuck).length;
      
      snowflakesRef.current.forEach((snowflake) => {
        if (snowflake.stuck) {
          // stuck된 눈이 너무 많으면 일부를 재생성
          if (stuckCount > state.snow.amount * 0.7 && Math.random() < 0.1) {
            snowflake.stuck = false;
            snowflake.y = -10;
            snowflake.x = Math.random() * canvas.width;
          }
          return;
        }

        snowflake.y += snowflake.speed * speedMultiplier;
        snowflake.x += Math.sin(snowflake.y * 0.01) * 0.5;

        // 눈이 쌓임 영역에 닿으면
        const pileIndex = Math.floor(snowflake.x / 10);
        if (pileIndex >= 0 && pileIndex < snowPileRef.current.length) {
          const pileHeight = snowPileRef.current[pileIndex];
          if (snowflake.y >= groundLevel - pileHeight) {
            // 눈 쌓임 - 일정 확률로만 쌓이고 나머지는 계속 떨어뜨림
            if (Math.random() < 0.3) { // 30% 확률로만 쌓임
              snowflake.stuck = true;
              snowPileRef.current[pileIndex] = Math.min(
                snowPileRef.current[pileIndex] + snowflake.radius * 0.3,
                80 // 최대 높이 제한
              );
            } else {
              // 쌓지 않고 계속 떨어뜨림
              snowflake.y = groundLevel - pileHeight - 1;
            }
            return;
          }
        }

        // 화면 밖으로 나가면 재생성
        if (snowflake.y > canvas.height) {
          snowflake.y = -10;
          snowflake.x = Math.random() * canvas.width;
          snowflake.stuck = false;
        }

        if (snowflake.x > canvas.width) {
          snowflake.x = 0;
        } else if (snowflake.x < 0) {
          snowflake.x = canvas.width;
        }

        // 눈 그리기
        ctx.beginPath();
        ctx.globalAlpha = snowflake.opacity;
        ctx.arc(snowflake.x, snowflake.y, snowflake.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // 쌓인 눈을 시각적으로 부드럽게 만들기 (선형 보간)
      for (let i = 1; i < snowPileRef.current.length - 1; i++) {
        snowPileRef.current[i] = (snowPileRef.current[i - 1] + snowPileRef.current[i] + snowPileRef.current[i + 1]) / 3;
      }

      ctx.globalAlpha = 1;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [state.snow.amount, state.snow.speed]);

  useEffect(() => {
    if (state.snow.amount !== snowflakesRef.current.length) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const amount = state.snow.amount;
      const baseSpeed = state.snow.speed;
      const currentCount = snowflakesRef.current.length;

      if (amount > currentCount) {
        for (let i = 0; i < amount - currentCount; i++) {
          snowflakesRef.current.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 3 + 1,
            speed: Math.random() * 2 + 0.5 * baseSpeed,
            opacity: Math.random() * 0.5 + 0.5,
          });
        }
      } else {
        snowflakesRef.current = snowflakesRef.current.slice(0, amount);
      }
    }
  }, [state.snow.amount, state.snow.speed]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  );
}

