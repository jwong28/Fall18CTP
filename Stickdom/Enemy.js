/*
Generic enemy class that extends Phaser sprites.
Classes for enemy types extend this class.
*/

export default class Enemy extends Phaser.GameObjects.Sprite {
    constructor(config) {
      super(/*config.scene, config.x, config.y - 16, config.key*/);    
      config.scene.physics.world.enable(this);
      config.scene.add.existing(this);
      this.alive = true;
      // start still and wait until needed
      this.body.setVelocity(0, 0).setBounce(0, 0).setCollideWorldBounds(false);
      this.body.allowGravity = false;
      this.beenSeen = false;
      // know about player
      this.player = this.scene.player; 
      // Base horizontal velocity / direction.
      this.direction = -50;    
      // Standard sprite is 16x16 pixels with a smaller body
    //   this.body.setSize(12, 12);
    //   this.body.offset.set(2, 4);    
    }
  
    activated(){
      // Method to check if an enemy is activated, the enemy will stay put
      // until activated so that starting positions is correct
      if(!this.alive){
        if(this.y>600){
          this.kill();
        }
        return false;
      }
      if(!this.beenSeen){
        // check if it's being seen now and if so, activate it
        if(this.x<this.scene.cameras.main.scrollX+this.scene.sys.game.canvas.width+32){
          this.beenSeen = true;
          this.body.velocity.x = this.direction;
          this.body.allowGravity = true;
          return true;
        }
        return false;
      }
      return true;
    }

    kill(){
      // Forget about this enemy
      this.scene.enemyGroup.remove(this);
      this.destroy();
    }
  }
  