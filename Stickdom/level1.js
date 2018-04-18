class level1 extends Phaser.Scene
{
    constructor()
    {
        super({key: "level1"});
         //Global variables
    }

    preload ()
    {
        //loading images
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.spritesheet('player', 
            'assets/stickman.png',
            { frameWidth: 32, frameHeight: 50 }
        );
        this.load.image('bullet', 'assets/bullet.png');
        this.load.image('background', 'assets/basicBack.png');
    }

   

    create ()
    {
        //Adding large background
        this.add.image(1600,300,'background');
        //Setting world bounds
        this.physics.world.bounds.width = 3200;
        
        //bullet number for bullet checking
        var bulletNum=0;
        this.bulletNum=1;        
        
        //Creating keyboard input
        var cursors = this.input.keyboard.createCursorKeys();
        //Keycodes
        this.key_Left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.key_Right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.key_Up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.key_Space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        //Create platforms
        var platforms;
        platforms = this.physics.add.staticGroup();
        platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        platforms.create(1200, 568, 'ground').setScale(2).refreshBody();
        platforms.create(2000, 568, 'ground').setScale(2).refreshBody();
        platforms.create(2800, 568, 'ground').setScale(2).refreshBody();
        platforms.create(600, 400, 'ground');
        platforms.create(50, 300, 'ground');
        platforms.create(750, 220, 'ground');

         //Camera
         this.cameras.main.setBounds(0,0,3200,600);
        
        //Player creation
        this.player = this.physics.add.sprite(100, 450, 'player');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        // this.player.setCollideWorldBounds(false);
        this.player.body.setGravityY(300) 
        //direction player facing
        var direction = "right";
        direction = "left";
        //Player collision with platform
        this.physics.add.collider(this.player, platforms);
        //Camera follows player
        this.cameras.main.startFollow(this.player); 
 
         //Create animations
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', { start: 10, end: 21 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 9 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'faceLeft',
            frames: [{key: 'player', frame: 10}],
            frameRate: 20
        });

        this.anims.create({
            key: 'faceRight',
            frames: [{key: 'player', frame: 0}],
            frameRate: 20
        });

        this.anims.create({
            key: 'shootLeft',
            frames: [{key: 'player', frame: 29}],
            frameRate: 10,
        });
        
        this.anims.create({
            key: 'shootRight',
            frames: [{key: 'player', frame: 24}],
            frameRate: 10,
        });

        //Score creation
        var score = 0;
        var scoreText;
        
        scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
        
        //adding enemies
        var bombs = this.physics.add.group({
            gravityY: 300,
        });
        this.physics.add.collider(bombs, platforms);
        this.physics.add.collider(this.player, bombs, hitBomb, null, this);

        //hit bomb FUNCTION!!!!!!
        function hitBomb (player, bomb)
        {
            this.physics.pause();
            player.setTint(0xff0000);
            player.anims.play('turn');
            this.gameOver = true;
        }

        //Creating group of stars
        var stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 },
            gravityY: 300,
        });

        stars.children.iterate(function (child) {

            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

        });
        
        //Check star collision with ground
        this.physics.add.collider(stars, platforms);
        
        //If player gets star
        this.physics.add.overlap(this.player, stars, collectStar, null, this);
        
        //Collect star if touching FUNCTION!!!!!
        function collectStar (player, star)
        {
            star.disableBody(true, true);

            score += 10;
            scoreText.setText('Score: ' + score);

            var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
            var bomb = bombs.create(x, 16, 'bomb');
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
            bomb.allowGravity = false;
                
            if (stars.countActive(true) === 0)
            {
                stars.children.iterate(function (child) {

                    child.enableBody(true, child.x, 0, true, true);

                });

            }
        }

        //If bullet hit disable
        function bulletHit (bullet, bomb)
        {
            bullet.disableBody(true,true);
            bomb.disableBody(true,true);
        }

        //Delete a bullet when hitbox overlap
        function bulletTouchingBullet (bulletOne,bulletTwo)
        {
            this.bulletTwo.disableBody(true,true);

        }
        
        //add bullets group
        this.bullets = this.physics.add.group();
        this.physics.add.collider(this.bullets, bombs, bulletHit, null, this);
        this.physics.add.collider(this.bullets, platforms, bulletBounds, null, this);
        this.physics.add.collider(this.bullets,this.bullets, bulletTouchingBullet, null, this);
        
        
        function bulletBounds (bullet, platforms)
        {
            bullet.disableBody(true,true);
        }

    }

    update (delta)
    {
        //Holding an arrow
        if(this.key_Space.isDown)
        {
            this.player.setVelocityX(0);
            if(this.direction=== "left")
            {
                this.player.anims.play('shootLeft');
            }
            else if(this.direction === "right")
            {
                this.player.anims.play('shootRight');


            } 
        }
        //set shooting function
        else if(this.key_Space._justUp)
        //Just up is used if the button is pressed, hence just popped up
        {
            // isShooting === true;
            var velX = 200;
            if(this.direction=== "left")
            {
                velX = -200;
                this.player.anims.play('shootLeft');
            }
            else if(this.direction === "right")
            {
                velX = 200;
                this.player.anims.play('shootRight');


            }
            if(this.bulletNum == 1)
            {
                this.bulletOne = this.bullets.create(this.player.x+5,this.player.y-5, 'bullet');
                this.bulletOne.setVelocity(velX,0);
                this.bulletNum = 2;
            }
            else if(this.bulletNum == 2)
            {
                this.bulletTwo = this.bullets.create(this.player.x+5,this.player.y-4, 'bullet');
                this.bulletTwo.setVelocity(velX,0);
                this.bulletNum = 1;
            }
            this.key_Space._justUp = false;
        }
        //Moving left
        else if (this.key_Left.isDown)
        {  
            this.player.setVelocityX(-160);
            this.player.anims.play('left', true);
            this.direction = "left";
        }
        //Moving right
        else if (this.key_Right.isDown)
        {
            this.player.setVelocityX(160);

            this.player.anims.play('right', true);
            this.direction = "right";
        }
        //Not moving
        else
        {
            this.player.setVelocityX(0);
            if(this.direction === "left")
            {
                this.player.anims.play('faceLeft');
            }
            else if(this.direction === "right")
            {
                this.player.anims.play('faceRight');
            }            
        }
        

        //Jump 
        if (this.key_Up.isDown && this.player.body.touching.down)
        {
            this.player.setVelocityY(-325);
        }

        //RESET DEBUGGING USE ONLY
        this.key_R = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        if (this.key_R.isDown)
        {
            this.physics.resume();
            // this.player.setTint();
            this.player.anims.play('turn');
            this.gameOver = false;
        }
    }
}
