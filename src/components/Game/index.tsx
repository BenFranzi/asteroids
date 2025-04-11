import { FC, useEffect, useRef } from 'react';
import GameC from './game.ts';

const frameSpeed: number | undefined = undefined;

const setupGame = (canvas: HTMLCanvasElement) => {
  const gameInstance = new GameC(canvas);
  let touchEvent: TouchEvent | undefined;
  let animationFrameId: number;
  const keys = {};

  const handleKeyDown = (e: KeyboardEvent): void => {
    keys[e.key] = true;
    touchEvent = undefined;
  };

  const handleKeyUp = (e: KeyboardEvent): void => {
    keys[e.key] = false;
  };

  const handleResize = (): void => {
    gameInstance?.resize({ width: window.innerWidth, height: window.innerHeight });
  };

  const preventEverything = (e: { preventDefault: () => void }): void => e.preventDefault();


  const handleTouchMove = (e: TouchEvent): void => {
    e.preventDefault();
    touchEvent = e;
  };

  const handleTouchEnd = (e: TouchEvent): void => {
    e.preventDefault();
    touchEvent = undefined;
  };


  console.log('starting loop.');
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
  window.addEventListener('resize', handleResize);
  window.addEventListener('touchstart', preventEverything, { passive: false });
  window.addEventListener('touchcancel', preventEverything, { passive: false });
  window.addEventListener('touchend', handleTouchEnd, { passive: false });
  window.addEventListener('touchmove', handleTouchMove, { passive: false });
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;


  const gameLoop = (timestamp: number): void => {
    if (gameInstance) {
      gameInstance.tick(timestamp, keys, touchEvent);
      animationFrameId = !frameSpeed ? requestAnimationFrame(gameLoop) : setTimeout(() => gameLoop(performance.now()), frameSpeed);
    }
  };

  animationFrameId = !frameSpeed ? requestAnimationFrame(gameLoop) : setTimeout(() => gameLoop(performance.now()), frameSpeed);
  

  return (): void => {
    if (!frameSpeed) {
      cancelAnimationFrame(animationFrameId);
    } else {
      clearTimeout(animationFrameId);
    }
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('touchstart', preventEverything);
    window.removeEventListener('touchcancel', preventEverything);
    window.removeEventListener('touchend', preventEverything);
    window.removeEventListener('touchmove', handleTouchMove);
    window.removeEventListener('touchend', handleTouchEnd);

  };
};


const Game: FC = () => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let callback: () => void;
    if (ref.current) callback = setupGame(ref.current);
    return (): void => callback?.();
  }, []);

  return (
    <canvas ref={ref} css={{ imageRendering: 'pixelated' }} />
  );
};

export default Game;
