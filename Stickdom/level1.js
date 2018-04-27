class level1 extends Phaser.Scene
{
    constructor()
    {
        super({key: "level1"});
    }

    preload ()
    {
        //loading images
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('fireball', 'assets/fireball.png');
        this.load.spritesheet('player', 
            'assets/stickman.png',
            { frameWidth: 32, frameHeight: 50 }
        );
        this.load.image('bullet', 'assets/bullet.png');
        this.load.image('background', 'assets/basicBack.png');
        this.load.spritesheet('healthBar',
            'assets/healthBar.png',
            {frameWidth: 81, frameHeight: 22}
        );
        this.load.image('blank','assets/blankBox.png');
        this.load.spritesheet('fireball', 
        'assets/fireball.png',
            {frameWidth: 17, frameHeight: 17}   
        );
        this.load.spritesheet('spearman', 
        'assets/spearman.png',
            {frameWidth: 32, frameHeight: 50}   
        );
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
        
        //Keycodes
        this.key_Left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.key_Right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.key_Up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.key_Space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.key_Enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        
        //Starting gameplay with enter
        this.physics.pause();
        var startText = this.add.text(200,450,'Press Enter to start the game',{ fontSize: '32px', fill: '#000' })
        this.input.keyboard.on('keyup_ENTER', function(event)
        {
            startText.setText("");
            this.physics.resume();
        },this);

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
        this.player.body.setGravityY(300) 
        //direction player facing
        var direction;
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

        //Health bar
        this.anims.create({
            key: 'heartsThree',
            frames: [{key: 'healthBar', frame: 0}],
            frameRate: 10,
        });
        this.anims.create({
            key: 'heartsTwo',
            frames: [{key: 'healthBar', frame: 1}],
            frameRate: 10,
        });
        this.anims.create({
            key: 'heartsOne',
            frames: [{key: 'healthBar', frame: 2}],
            frameRate: 10,
        });
        this.anims.create({
            key: 'heartsZero',
            frames: [{key: 'healthBar', frame: 3}],
            frameRate: 10,
        });

        //Fireball animation
        this.anims.create({
            key: 'fireballMovement',
            frames: this.anims.generateFrameNumbers('fireball', { start: 0, end: 1 }),
            frameRate: 10,
            repeat: -1
        });

        //Enemy spearman animation
        this.anims.create({
            key: 'spearmanLeft',
            frames: this.anims.generateFrameNumbers('spearman', { start: 11, end: 17 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'spearmanRight',
            frames: this.anims.generateFrameNumbers('spearman', { start: 0, end: 6 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'spearmanFaceLeft',
            frames: [{key: 'spearman', frame: 18}],
            frameRate: 20
        });
        this.anims.create({
            key: 'spearmanFaceRight',
            frames: [{key: 'spearman', frame: 7}],
            frameRate: 20
        });
        this.anims.create({
            key: 'spearmanHitLeft',
            frames: this.anims.generateFrameNumbers('spearman', { start: 19, end: 21 }),
            frameRate: 10,
            repeat: 0
        });
        this.anims.create({
            key: 'spearmanHitRight',
            frames: this.anims.generateFrameNumbers('spearman', { start: 8, end: 10 }),
            frameRate: 10,
            repeat: 0
        });

        //Healthbar
        this.health = this.physics.add.group();
        this.healthBar = this.health.create(40,16,'blank');
        this.healthBar.anims.play('heartsThree');
        this.healthBar.setCollideWorldBounds(true);
        //Collider so healthbar doesn't go off screen
        this.physics.add.collider(this.healthBar, platforms);
        platforms.create(16,16,'blank');
        //Health count
        var healthCount = 3;
        this.healthCount = 3;

        //Adding spearman enemy
        // var enemySpearmans = this.physics.add.group({
        this.enemySpearmans = this.physics.add.group({
            gravityY: 300,
        });
        this.physics.add.collider(this.player, this.enemySpearmans, spearmanHitPlayer, null, this);
        this.physics.add.collider(this.enemySpearmans, platforms);

        function spearmanHitPlayer (player, enemySpearman)
        {
            this.healthCount--;
            // player.x -=10;
            // player.setVelocityX(-10); 
            enemySpearman.anims.play('spearmanHitLeft',true); 
            if(enemySpearman.health ===0)
            {
                enemySpearman.disableBody(true,true);
            }
        }

        //populating screen with spearman
        for(var i=500; i<3200;i+=600)
        {
            createSpearman(i, this.player,this.enemySpearmans);
        }

        function createSpearman(i, player,enemySpearmans)
        {
            var enemySpearman = enemySpearmans.create(i,500, 'spearman');
            // this.enemySpearman.anims.play('spearmanHitLeft');
            enemySpearman.anims.play('spearmanLeft', true);
            enemySpearman.health = 2;
            enemySpearman.originXValue = i;
            enemySpearman.direction = "right";
            enemySpearman.setCollideWorldBounds(true);
        }

        function spearmanActivated(enemySpearman)
        {
            console.log(true);
            enemySpearman.anims.play('spearmanHitLeft');
        }

        //adding enemies
        var fireballs = this.physics.add.group({
            gravityY: 300,
        });
        this.physics.add.collider(fireballs, platforms);
        this.physics.add.collider(this.player, fireballs, hitfireball, null, this);

        //Player hits fireball
        function hitfireball (player, fireball)
        {
            // player.anims.play('turn');
            this.healthCount--;
            fireball.disableBody(true, true);
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
            var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
            var fireball = fireballs.create(x, 16, 'fireball');
            fireball.anims.play('fireballMovement', true);
            fireball.setBounce(1);
            fireball.setCollideWorldBounds(true);
            fireball.setVelocity(Phaser.Math.Between(-200, 200), 20);
            fireball.allowGravity = false;
                
            if (stars.countActive(true) === 0)
            {
                stars.children.iterate(function (child) {

                    child.enableBody(true, child.x, 0, true, true);

                });

            }
        }
        
        //add bullets group
        this.bullets = this.physics.add.group();
        this.physics.add.collider(this.bullets, fireballs, bulletHit, null, this);
        this.physics.add.collider(this.bullets, platforms, bulletBounds, null, this);
        this.physics.add.collider(this.bullets,this.bullets, bulletTouchingBullet, null, this);
        this.physics.add.collider(this.bullets, this.enemySpearmans, bulletHitSpearman, null, this);

        //If bullet hit disable
        function bulletHit (bullet, fireball)
        {
            bullet.disableBody(true,true);
            fireball.disableBody(true,true);
        }

        //Delete a bullet when hitbox overlap
        function bulletTouchingBullet (bulletOne,bulletTwo)
        {
            this.bulletTwo.disableBody(true,true);
        }
        function bulletBounds (bullet, platforms)
        {
            bullet.disableBody(true,true);
        }

        function bulletHitSpearman (bullet, enemySpearman)
        {
            enemySpearman.health--;
            if(enemySpearman.health === 0)
            {
                enemySpearman.disableBody(true,true);
            }
            bullet.disableBody(true,true);
        }

    }

    update (delta)
    {
        //Holding an arrow
        if(this.key_Space.isDown)
        {
            this.player.setVelocityX(0);
            this.healthBar.setVelocityX(0);
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
                this.bulletOne.setVelocity(velX,-25);
                this.bulletOne.setGravityY(35);
                this.bulletNum = 2;
            }
            else if(this.bulletNum == 2)
            {
                this.bulletTwo = this.bullets.create(this.player.x+5,this.player.y-4, 'bullet');
                this.bulletTwo.setVelocity(velX,-25);
                this.bulletTwo.setGravityY(35);
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
            if(this.player.x>=395)
            {
                this.healthBar.setVelocityX(-160);
            }
        }
        //Moving right
        else if (this.key_Right.isDown)
        {
            this.player.setVelocityX(160);

            this.player.anims.play('right', true);
            this.direction = "right";
            if(this.player.x>=395 ) 
            {
                this.healthBar.setVelocityX(160);
            }
        }
        //Not moving
        else
        {
            this.player.setVelocityX(0);
            this.healthBar.setVelocityX(0);
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

        //Different heart animations for different health
        if(this.healthCount === 2)
        {
            this.healthBar.anims.play('heartsTwo');
        }
        else if (this.healthCount === 1)
        {
            this.healthBar.anims.play('heartsOne');
        }
        else if (this.healthCount === 0)
        {
            this.healthBar.anims.play('heartsZero');
            this.gameOver = true;
            this.physics.pause();
        }
        
        //Checks all the spearman in the group
        for(var i =0; i<this.enemySpearmans.children.size;i++)
        {
            var spearman = this.enemySpearmans.children.entries[i];
            //Spearman paces back and forth
            if(spearman.x < spearman.originXValue+300 && spearman.direction==="right")
            {

                spearman.setVelocityX(100);
            }
            else if(spearman.x > spearman.originXValue && spearman.direction ==="left")
            {
                spearman.setVelocityX(-100);
               
            }
            if(spearman.x >= spearman.originXValue + 300)
            {
                spearman.direction = "left";
                spearman.anims.play('spearmanLeft', true)
            }
            else if(spearman.x <=spearman.originXValue)
            {
                spearman.direction= "right";
                spearman.anims.play('spearmanRight', true)
            }
                       
        }


        //RESET DEBUGGING USE ONLY
        this.key_R = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        if (this.key_R._justUp)
        {
            this.physics.resume();
            // this.player.setTint();
            this.player.anims.play('turn');
            this.gameOver = false;
            this.healthCount = 3;
            this.healthBar.anims.play('heartsThree');
            this.key_R._justUp = false;
        }
    }
    
}
