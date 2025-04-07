type Position = {
  x: number;
  y: number;
}

type Dimensions = {
  width: number;
  height: number;
}

interface Entity {
  position: Position;
  size: Dimensions;
  velocity: Position;
  color: string;
}

// Drawable
interface CanvasVisitor {
  visitPlayer(player: Player): void;
  visitBullet(bullet: Bullet): void;
  visitAsteroid(asteroid: Asteroid): void;
}

interface TerminalVisitor {
  visitPlayer(player: Player): void;
}

interface Drawable {
  accept(visitor: CanvasVisitor): void;
  accept(visitor: TerminalVisitor): void;
  accept(visitor: KeyboardVisitor): Bullet | undefined;
}

// Movement
interface KeyboardVisitor {
  visitPlayer(player: Player): void;
}

interface Movement {
  accept(visitor: KeyboardVisitor): void;
}

type Visitor = CanvasVisitor | TerminalVisitor | KeyboardVisitor;

class Bullet implements Entity, Drawable {
  static type = 'Bullet';
  position: Position;
  size: Dimensions;
  velocity: Position;
  speed: number;
  color: string;

  constructor(position: Position, size: Dimensions, [x, y]: [number, number]) {
    this.position = position;
    this.size = size;
    this.speed = 1000;
    this.color = 'red';

    const length = Math.hypot(x, y);

    if (length <= 0) throw new Error('uh oh');

    this.velocity = {
      x: (x / length) * this.speed,
      y: (y / length) * this.speed,
    };
  }

  public accept(visitor: CanvasVisitor): void;
  public accept(visitor: TerminalVisitor): void;
  public accept(visitor: KeyboardVisitor): Bullet | undefined;
  public accept(visitor: Visitor): void | Bullet | undefined {
    const methodName = `visit${Bullet.type}`;
    if (typeof visitor[methodName] === 'function') {
      return visitor[methodName](this);
    } else {
      console.warn(`Visitor method ${methodName} not implemented for Bullet`);
    }
  };

  public update(deltaTime: number): void {
    this.position.x += this.velocity.x * (deltaTime / 1000);
    this.position.y += this.velocity.y * (deltaTime / 1000);
  }
}

class Player implements Entity, Drawable, Movement {
  static type = 'Player';
  position: Position;
  size: Dimensions;
  velocity: Position;
  speed: number;
  isJumping: boolean;
  color: string;
  health: number;

  constructor(position: Position) {
    this.position = position;
    this.size = { width: 30, height: 30 };
    this.velocity = { x: 0, y: 0 };
    this.speed = 500; // in pixels
    this.isJumping = false;
    this.color = 'blue';
    this.health = 1;
  }

  public update(deltaTime: number): void {
    this.position.x += this.velocity.x * (deltaTime / 1000);
    this.position.y += this.velocity.y * (deltaTime / 1000);
  }

  public move([x, y]: [number, number]): void {
    if (x === 0 && y === 0) {
      this.stopMoving();
    }

    const length = Math.hypot(x, y);
    if (length > 0) {
      this.velocity.x = (x / length) * this.speed;
      this.velocity.y = (y / length) * this.speed;
    }
  }

  public stopMoving(): void {
    this.velocity.x = 0;
    this.velocity.y = 0;
  }

  public fire([x, y]: [number, number]): Bullet {
    const size: Dimensions = { width: 10, height: 10 };

    return new Bullet({
      x: this.position.x + this.size.width / 2 - size.width / 2,
      y: this.position.y + this.size.height / 2 - size.height / 2,
    }, size, [x, y]);
  }

  public hit(_asteroid: Asteroid): void {
    this.health = Math.max(0, this.health - .2);
  }

  public isAlive(): boolean {
    return this.health > 0;
  }

  public accept(visitor: Visitor): Bullet | undefined {
    const methodName = `visit${Player.type}`;
    if (typeof visitor[methodName] === 'function') {
      return visitor[methodName](this);
    } else {
      console.warn(`Visitor method ${methodName} not implemented for Player`);
    }
  };
}

class Asteroid implements Entity, Drawable {
  static type = 'Asteroid';
  size: Dimensions;
  position: Position;
  velocity: Position;
  color: string;

  static getRandomPosition(bounds: Dimensions): Position {
    return {
      x: Math.random() * bounds.width,
      y: Math.random() * bounds.height,
    };
  }

  static getRandomVelocity(maxSpeed = 100): Position {
    return {
      x: (Math.random() * maxSpeed * 2) - maxSpeed,
      y: (Math.random() * maxSpeed * 2) - maxSpeed,
    };
  }

  constructor(position: Position, velocity: Position) {
    this.position = position;
    this.size = { width: 15, height: 15 };
    this.velocity = velocity;
    this.color = 'white';
  }

  public hit(): void {
    this.velocity = { x: 0, y: 0 };
    this.color = 'yellow';
  }

  public intersectPlayer(): void {
    this.velocity = { x: 0, y: 0 };
    this.color = 'green';
  }

  public accept(visitor: Visitor): Bullet | undefined {
    const methodName = `visit${Asteroid.type}`;
    if (typeof visitor[methodName] === 'function') {
      return visitor[methodName](this);
    } else {
      console.warn(`Visitor method ${methodName} not implemented for Asteroid`);
    }
  };

  public update(deltaTime: number): void {
    this.position.x += this.velocity.x * (deltaTime / 1000);
    this.position.y += this.velocity.y * (deltaTime / 1000);
  }
}

class CanvasDrawerVisitor implements CanvasVisitor {
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  visitPlayer(player: Player): void {
    // Player
    this.ctx.beginPath();
    this.ctx.fillStyle = player.color;
    this.ctx.fillRect(
      player.position.x,
      player.position.y,
      player.size.width,
      player.size.height
    );
    this.ctx.stroke();
  }
  
  visitBullet(bullet: Bullet): void {
    this.ctx.beginPath();
    this.ctx.fillStyle = bullet.color;
    this.ctx.fillRect(
      bullet.position.x,
      bullet.position.y,
      bullet.size.width,
      bullet.size.height
    );
    this.ctx.stroke();
  }

  visitAsteroid(asteroid: Asteroid): void {
    this.ctx.beginPath();
    this.ctx.fillStyle = asteroid.color;
    this.ctx.fillRect(
      asteroid.position.x,
      asteroid.position.y,
      asteroid.size.width,
      asteroid.size.height
    );
    this.ctx.stroke();
  }
}

// class TerminalLoggerVisitor implements TerminalVisitor {
//   visitPlayer(player: Player): void {
//     console.log(`Player at (${player.position.x}, ${player.position.y}) - size (${player.size.width}x${player.size.height})`);
//   }
// }

class KeyboardEventVisitor implements  KeyboardVisitor {
  keys: { [key: string]: boolean };

  constructor(keys: { [key: string]: boolean }) {
    this.keys = keys;
  }

  visitPlayer(player: Player): Bullet | undefined {
    if (!player.isAlive()) {
      player.stopMoving();
      return;
    }

    const move: [number, number] = [0, 0];
    if (this.keys['ArrowLeft']) move[0] += -1;
    if (this.keys['ArrowRight']) move[0] += 1;
    if (this.keys['ArrowUp']) move[1] += -1;
    if (this.keys['ArrowDown']) move[1] += 1;
    player.move(move);

    let bullet: Bullet | undefined;
    const direction: [number, number] = [0, 0];
    if (this.keys['a']) direction[0] += -1;
    if (this.keys['d']) direction[0] += 1;
    if (this.keys['w']) direction[1] += -1;
    if (this.keys['s']) direction[1] += 1;
    if (direction[0] !== 0 || direction[1] !== 0) {
      bullet = player.fire(direction);
    }

    return bullet;
  }
}

export default class Game {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  player: Player;
  lastTime: number;
  bullets: Bullet[];
  asteroids: Asteroid[];
  destroyedAsteroid: Asteroid[];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d')!;
    const { width, height } = this.canvas;
    this.player = new Player({ x: width / 2, y: height / 2 });
    this.lastTime = performance.now();
    this.bullets = [];
    this.asteroids = Array.from({ length: 20 }).map(() => new Asteroid(
      Asteroid.getRandomPosition({
        width: this.canvas.width,
        height: this.canvas.height,
      }),
      Asteroid.getRandomVelocity()
    ));
    this.destroyedAsteroid = [];
  }

  initialState() {
    const { width, height } = this.canvas;
    this.player = new Player({ x: width / 2, y: height / 2 });
    this.lastTime = performance.now();
    this.bullets = [];
    this.asteroids = Array.from({ length: 20 }).map(() => new Asteroid(
      Asteroid.getRandomPosition({
        width: this.canvas.width,
        height: this.canvas.height,
      }),
      Asteroid.getRandomVelocity()
    ));
    this.destroyedAsteroid = [];
  }

  private restart() {
    this.initialState();
  }

  tick(timestamp: number, keys: { [key: string]: boolean }): void {
    const deltaTime = timestamp - this.lastTime;
    this.lastTime = timestamp;

    this.update(deltaTime, keys); // Note: update should be happening at a faster interval to paint
    this.paint();
  }

  private update(deltaTime: number, keys: { [key: string]: boolean }): void {
    if (!this.player.isAlive()) {
      if (keys['Enter']) {
        this.restart();
      }
      return;
    }

    const keyboardEventVisitor = new KeyboardEventVisitor(keys);
    const newBullet = this.player.accept(keyboardEventVisitor);
    if (newBullet) {
      this.bullets.push(newBullet);
    }

    this.player.update(deltaTime);

    // Remove offscreen bullets
    this.bullets = this.bullets.filter(bullet => !this.isOffscreen(bullet.position));
    this.asteroids = this.asteroids.filter(asteroid => !this.isOffscreen(asteroid.position));

    // Remove offscreen asteroid
    this.bullets = this.bullets.filter(bullet =>
      !(bullet.position.x < 0
        || bullet.position.x > this.canvas.width
        || bullet.position.y < 0
        || bullet.position.y > this.canvas.height
      ));

    for (const bullet of this.bullets) {
      for (let i = this.asteroids.length - 1; i >= 0; i--) {
        const asteroid = this.asteroids[i];
        if (this.checkCollision(bullet, asteroid)) {
          this.asteroids.splice(i, 1);
          this.destroyedAsteroid.push(asteroid);
          asteroid.hit();
          console.log({ health: this.player.health, isAlive: this.player.isAlive() });
        }
      }
    }

    // Check for collisions between player and asteroids
    for (let i = this.asteroids.length - 1; i >= 0; i--) {
      const asteroid = this.asteroids[i];
      if (this.checkCollision(this.player, asteroid)) {
        asteroid.intersectPlayer();
        this.player.hit(asteroid);
        this.asteroids.splice(i, 1);
        this.destroyedAsteroid.push(asteroid);
      }
    }

    this.bullets.forEach(bullet => bullet.update(deltaTime));
    this.asteroids.forEach(asteroid => asteroid.update(deltaTime));

    if (this.asteroids.length < 8) {
      this.asteroids.push(...Array.from({ length: 20 }).map(() => new Asteroid(
        Asteroid.getRandomPosition({
          width: this.canvas.width,
          height: this.canvas.height,
        }),
        Asteroid.getRandomVelocity()
      )));
    }
  }

  private paintUI(): void {
    const { height, width } = this.ctx.canvas;

    // Health Bar
    const padding = 10;
    const size = 5;
    this.ctx.beginPath();
    this.ctx.fillStyle = 'red';
    this.ctx.fillRect(padding, padding, width - padding * 2, size);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.fillStyle = 'green';
    this.ctx.fillRect(padding, padding, (width - padding * 2) * this.player.health, size);
    this.ctx.stroke();

    // Score
    this.ctx.font = '16px monospace';
    this.ctx.fillStyle = 'white';
    this.ctx.textAlign = 'right';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(`${this.destroyedAsteroid.length} destroyed - health ${Math.ceil(this.player.health * 100)}%`, width - 15, 30);

    // Game over screen
    if (!this.player.isAlive()) {
      this.ctx.font = '48px monospace';
      this.ctx.fillStyle = 'red';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText('Game Over', width / 2, height / 2);

      this.ctx.font = '32px monospace';
      this.ctx.fillStyle = 'white';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText('"Enter" to restart', width / 2, height / 2 + 48);
    }
  }


  private checkCollision(obj1: { position: Position; size: Dimensions }, obj2: { position: Position; size: Dimensions }): boolean {
    return (
      obj1.position.x < obj2.position.x + obj2.size.width &&
      obj1.position.x + obj1.size.width > obj2.position.x &&
      obj1.position.y < obj2.position.y + obj2.size.height &&
      obj1.position.y + obj1.size.height > obj2.position.y
    );
  }

  private isOffscreen(position: Position): boolean {
    return position.x < 0
      || position.x > this.canvas.width
      || position.y < 0
      || position.y > this.canvas.height;
  }

  private paint(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const canvasVisitor = new CanvasDrawerVisitor(this.ctx);

    this.bullets.forEach(bullet => bullet.accept(canvasVisitor));
    this.asteroids.forEach(asteroid => asteroid.accept(canvasVisitor));
    this.destroyedAsteroid.forEach(asteroid => asteroid.accept(canvasVisitor));
    this.player.accept(canvasVisitor);
    this.paintUI();
  }
}