import Character from './Character.js';
import GameEnv from './GameEnv.js';
import Background from './Background.js';

export class Thwomp extends Character {
  // constructors sets up Character object 
  constructor(canvas, image, data, xPercentage, yPercentage, name, minPosition){
      super(canvas, image, data );

      //Unused but must be Defined
      this.name = name;
      this.yPercentage = yPercentage;
      this.minPosition = minPosition;

      //Initial Position of Goomba
      this.x = xPercentage * GameEnv.innerWidth + 1000000;
      this.xPercentage = xPercentage

      this.speed = 2.5;

      this.flashTimeout = null;
      this.flag = 0;
      this.moveRightTimeout = null;

    // Start the timer for moving right after 10 seconds
    setTimeout(() => {
      this.startMovingRight();
    }, 10000);
  }

  update() {
      super.update();
      this.dropThwomp();
      this.spawnThwomp();
      this.checkReset();
  }

  startMovingRight() {
    // Set a timeout for moving right
    this.moveRightTimeout = setInterval(() => {
      this.x += this.speed;
    }, 50);
  }

  dropThwomp() {
    let playerX = GameEnv.PlayerPosition.playerX;
    let playerY = GameEnv.PlayerPosition.playerY;

    // Drop the Thwomp on the Player when relatively close
    if (Math.abs(this.x - playerX) < 50 && this.y !== playerY) {
      //Move Thwomp towards Player
      this.y = followPlayer(this.y, playerY, 0.05);
    } else {
      //Move Thwomp towards Sky
      this.y = followPlayer(this.y, this.yPercentage * GameEnv.innerHeight, 0.02);
    }
  }

  spawnThwomp() {
    let playerX = GameEnv.PlayerPosition.playerX;

    //If Player Between 40% and 80% of level & this is the first time this is so, spawn Thwomps
    if ((playerX > GameEnv.innerWidth * 0.4) && (playerX < GameEnv.innerWidth * 0.8) && this.flag === 0) {
      this.x = this.xPercentage * GameEnv.innerWidth
      this.flashScreen();
      this.flag = 1
    }
  }

  checkReset() {
    let playerX = GameEnv.PlayerPosition.playerX;
    
    // If Player Dies, Reset Level
    if (playerX < 10) {
      this.x = this.xPercentage * GameEnv.innerWidth + 1000000;
      this.flag = 0;
    }
  }

  flashScreen() {
    this.canvas.style.backgroundColor = 'white';
    this.flashTimeout = setTimeout(() => {
      this.canvas.style.backgroundColor = '';
      this.flashTimeout = null;
    }, 10);
  }
}

/**
 * followPlayer Purpose:
 * Allows for smooth movement &
 * Dynamically changes based off player Y
 * 
 * @param {number} min Start Point
 * @param {number} max Destination
 * @param {number} t Rate of Change
 * @returns 
 * 
 */
function followPlayer(min, max, t) {
  return (max - min) * t + min;
}

export default Thwomp;