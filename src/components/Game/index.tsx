import { FC, useEffect, useRef } from 'react';
import GameC from './game.ts';

const frameSpeed: number | undefined = undefined;

const Game: FC = () => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let gameInstance: GameC | undefined;
    let animationFrameId: number;
    const keys = {};

    const handleKeyDown = (e: KeyboardEvent): void => {
      keys[e.key] = true;
    };

    const handleKeyUp = (e: KeyboardEvent): void => {
      keys[e.key] = false;
    };


    if (ref.current) {
      console.log('starting loop.');
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);

      ref.current.width = window.innerWidth;
      ref.current.height = window.innerHeight;

      gameInstance = new GameC(ref.current);

      const gameLoop = (timestamp: number): void => {
        if (gameInstance) {
          gameInstance.tick(timestamp, keys);
          animationFrameId = !frameSpeed ? requestAnimationFrame(gameLoop) : setTimeout(() => gameLoop(performance.now()), frameSpeed);
        }
      };

      animationFrameId = !frameSpeed ? requestAnimationFrame(gameLoop) : setTimeout(() => gameLoop(performance.now()), frameSpeed);
    } else {
      console.log('no canvas');
    }

    return () => {
      console.warn('I hope this was intentional');
      if (!frameSpeed) {
        cancelAnimationFrame(animationFrameId);
      } else {
        clearTimeout(animationFrameId);
      }
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <canvas ref={ref} />
  );
};

export default Game;