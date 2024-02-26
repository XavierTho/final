import Character from './Character.js';
import GameEnv from './GameEnv.js';

export class Boss extends Character {
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
  }

  dropThwomp() {
    let playerX = GameEnv.PlayerPosition.playerX;
    let playerY = GameEnv.PlayerPosition.playerY;

    // Drop the Thwomp on the Player when relatively close
    if (Math.abs(this.x - playerX) < 250 && this.y !== playerY) {
      //Move Thwomp towards Player
      this.y = followPlayer(this.y, playerY, 0.02);
      this.x = followPlayer(this.x, playerX, 0.02);
    } else {
      //Move Thwomp towards Sky
      this.y = followPlayer(this.y, this.yPercentage * GameEnv.innerHeight, 0.02);
    }
  }

  spawnThwomp() {
    let playerX = GameEnv.PlayerPosition.playerX;

    //If Player Between 40% and 80% of level & this is the first time this is so, spawn Thwomp
    if ((playerX > GameEnv.innerWidth * 0.4) && (playerX < GameEnv.innerWidth * 0.8) && this.flag === 0) {
      this.x = this.xPercentage * GameEnv.innerWidth
      this.flashScreen();
      this.flag = 1
    }

    // Reset Boss on Level Reset
    if (playerX < 10) {
      this.x = this.xPercentage * GameEnv.innerWidth + 1000000;
      this.flag = 0;
    }

    // Remove Boss when Player is Far Enough
    if (playerX > (GameEnv.innerWidth * 0.75)) {
      this.x = this.xPercentage * GameEnv.innerWidth + 1000000;
    }
  }

  flashScreen() {
    this.canvas.style.backgroundColor = 'white';
    this.flashTimeout = setTimeout(() => {
      this.canvas.style.backgroundColor = '';
      this.flashTimeout = null;
    }, 10); // Flash duration
  }

  update() {
      super.update();
      this.dropThwomp();
      this.spawnThwomp();
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

export default Boss;