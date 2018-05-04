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
        this.load.image('bossPlatform', 'assets/bossPlatform.png');
        this.load.image('wall', 'assets/wall.png');
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
        
        //to check if player is at boss section
        var atBoss = 0;
        this.atBoss = 0;

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
        this.platforms = this.physics.add.staticGroup();
        createPlatform(400,568,this.platforms);
        createPlatform(1200,568,this.platforms);
        createPlatform(2000,568,this.platforms);
        createPlatform(2800,568,this.platforms);
        createPlatform(600,400,this.platforms);
        createPlatform(50,300,this.platforms);
        createPlatform(750,220,this.platforms);
        createPlatform(1350,400,this.platforms);
        createPlatform(1550,250,this.platforms);
        createPlatform(2150,250,this.platforms);
        createPlatform(1850,100,this.platforms);

        function createPlatform(x,y, platforms)
        {
            if(y<568)
            {
                var platform = platforms.create(x,y,'ground');
            }
            else
            {
                var platform = platforms.create(x,y, 'ground').setScale(2).refreshBody();
            }

        }

        var bossPlatforms;
        bossPlatforms = this.physics.add.staticGroup();
        bossPlatforms.create(2525,400,'bossPlatform');
        bossPlatforms.create(2800,250,'bossPlatform');
        bossPlatforms.create(3075,350,'bossPlatform');

        // var walls;
        this.walls = this.physics.add.staticGroup();
        
        //Camera
        this.cameras.main.setBounds(0,0,3200,600);
        
        //Player creation
        this.player = this.physics.add.sprite(100, 450, 'player');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.player.body.setGravityY(300) 
        //Player variables
        this.player.direction = "left";
        this.player.invulnerable = false;
        this.player.health = 3;
        this.player.isColliding = false;
        //Player collision with platform
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.player, bossPlatforms);
        this.physics.add.collider(this.player, this.walls);
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
        this.anims.create({
            key: 'fireballDestroyed',
            frames: this.anims.generateFrameNumbers('fireball', {start: 2, end: 6}),
            frameRate: 20,
            repeat: 0,
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
        this.healthBar = this.health.create(40,585,'').setScrollFactor(0);
        this.healthBar.anims.play('heartsThree');
        this.healthBar.setCollideWorldBounds(true);
        
        //Score
        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
        this.scoreText.setScrollFactor(0);
        var score = 0;

        //Adding spearman enemy
        this.enemySpearmans = this.physics.add.group({
            gravityY: 300,
        });
        // this.physics.add.collider(this.player, this.enemySpearmans, spearmanHitPlayer, null, this);
        this.physics.add.collider(this.enemySpearmans, this.platforms);

        function spearmanHitPlayer (player, enemySpearman)
        {
            //If player is in front or behind the spearman
            if(enemySpearman.y- player.y < 49)
            {
                //Spearman is hitting
                enemySpearman.hitting = true;
                //If player hasn't been hit already
                if(player.invulnerable === false)
                {
                    player.health--;
                    player.invulnerable = true;
                    //Flash effect to show invulnerability
                    this.playerInvisibleTimer = this.time.addEvent({ delay: 100, callback: playerInvisible, callbackScope: this, repeat: 10});
                    this.playerVisibleTimer = this.time.addEvent({ delay: 200, callback: playerVisible, callbackScope: this, repeat: 10});
                    //Set vulnerable
                    this.playerInvulnerabletimer = this.time.delayedCall(2000,playerInvulnerable,[player],this);
                    //Spearman hit delay

                }
                if(enemySpearman.x > player.x)
                {
                    enemySpearman.anims.play('spearmanHitLeft',true); 
                }
                else
                {
                    enemySpearman.anims.play('spearmanHitRight', true);
                }
                
                this.spearmanHitTimer = this.time.delayedCall(1000,spearmanHit,[enemySpearman], this);
            }
        }

        //adding enemies
        var fireballs = this.physics.add.group({
            gravityY: 300,
        });
        this.physics.add.collider(fireballs, this.platforms);
        this.physics.add.collider(this.player, fireballs, hitfireball, null, this);

        //Player hits fireball
        function hitfireball (player, fireball)
        {
            if(player.invulnerable === false)
            {
                player.health--;
                player.invulnerable = true;
                //Player flash effect
                this.playerInvisibleTimer = this.time.addEvent({ delay: 100, callback: playerInvisible, callbackScope: this, repeat: 10});
                this.playerVisibleTimer = this.time.addEvent({ delay: 200, callback: playerVisible, callbackScope: this, repeat: 10});
                this.playerInvulnerabletimer = this.time.delayedCall(2000,playerInvulnerable,[player],this);
            }
            fireball.anims.play('fireballDestroyed', true);
            //timer for destruction of fireball
            this.fireballTimedDestruction = this.time.delayedCall(200,fireballDestruction,[fireball], this);
        }

        //Creating group of stars
        var stars = this.physics.add.group({
            gravityY: 300,
        });

        stars.children.iterate(function (child) {

            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });
        
        // populating screen with spearman
        for(var i = 0; i< 2; i++)
        {
            createSpearman(Phaser.Math.Between(300, 1000), 500,this.enemySpearmans,Phaser.Math.Between(100,300),false);
            createSpearman(Phaser.Math.Between(800, 2000), 500,this.enemySpearmans,Phaser.Math.Between(100,300),false);
            createSpearman(Phaser.Math.Between(1500, 2100), 500,this.enemySpearmans,Phaser.Math.Between(100,300),false);
            createSpearman(Phaser.Math.Between(650,750),179,this.enemySpearmans,Phaser.Math.Between(100,200), true);
            createSpearman(Phaser.Math.Between(1250,1400),359,this.enemySpearmans,Phaser.Math.Between(100,150), true);
            createSpearman(Phaser.Math.Between(1750,1950),59,this.enemySpearmans,Phaser.Math.Between(50,110), true);
            createSpearman(1850,59,this.enemySpearmans,Phaser.Math.Between(150,200), true);
            createSpearman(Phaser.Math.Between(2100,2200),209,this.enemySpearmans,Phaser.Math.Between(100,150),true);

        }
        createSpearman(2100, 500,this.enemySpearmans,Phaser.Math.Between(100,300),false);
        createSpearman(124,259,this.enemySpearmans, 100, true);
        createSpearman(515,359,this.enemySpearmans, 115, true);
        createSpearman(600,359,this.enemySpearmans, 200, true);
        createSpearman(750,179,this.enemySpearmans,200, true);
        createSpearman(1550,209,this.enemySpearmans,200, true);
        createSpearman(2150,209,this.enemySpearmans,200, true);

        function createSpearman(x, y,enemySpearmans,distance, platform)
        {
            var enemySpearman = enemySpearmans.create(x,y, 'spearman');
            enemySpearman.anims.play('spearmanLeft', true);
            enemySpearman.health = 2;
            //If spearman is on platform or ground
            if(platform === true)
            {
                enemySpearman.originXValue = x;
            }
            else
            {
                enemySpearman.originXValue = x+ Phaser.Math.Between(-100,100);
            }
            enemySpearman.direction = "right";
            enemySpearman.hitting = false;
            enemySpearman.distance = distance;
            enemySpearman.setCollideWorldBounds(true);
        }

        function spearmanActivated(enemySpearman)
        {
            enemySpearman.anims.play('spearmanHitLeft');
        }

        //Check star collision with ground
        this.physics.add.collider(stars, this.platforms);   
        //If player gets star
        this.physics.add.overlap(this.player, stars, collectStar, null, this);
        
        //Collect star if touching FUNCTION!!!!!
        function collectStar (player, star)
        {
            score += 10;
            this.scoreText.setText('Score: ' + score);
            star.disableBody(true, true);
            var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
            var fireball = fireballs.create(x, 16, 'fireball');
            fireball.destroyed = 0;
            fireball.anims.play('fireballMovement', true);
            fireball.setBounce(1);
            fireball.setCollideWorldBounds(true);
            fireball.setVelocity(Phaser.Math.Between(-200, 200), 20);
            fireball.allowGravity = false;
                
            if (stars.countActive(true) === 0)
            {
                stars.children.iterate(function (child) 
                {
                    child.enableBody(true, child.x, 0, true, true);
                });

            }
        }
        
        //add bullets group
        this.bullets = this.physics.add.group();
        this.physics.add.collider(this.bullets, fireballs, bulletHit, null, this);
        this.physics.add.collider(this.bullets, this.platforms, bulletBounds, null, this);
        this.physics.add.collider(this.bullets,this.bullets, bulletTouchingBullet, null, this);
        this.physics.add.collider(this.bullets, this.enemySpearmans, bulletHitSpearman, null, this);

        //If bullet hit disable
        function bulletHit (bullet, fireball)
        {
            score += 10;
            this.scoreText.setText('Score: ' + score);
            bullet.disableBody(true,true);
            if(fireball.destroyed===0){
                //Call destruction of fireball
                fireball.anims.play('fireballDestroyed', true);
                fireball.destroyed = 1;
                //timer
                this.fireballTimedDestruction = this.time.delayedCall(200,fireballDestruction,[fireball], this);
            }
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
        //After a certain amount of time, fireball disappears
        function fireballDestruction(fireball)
        {
            fireball.disableBody(true, true);
        }

        //Wait time for spearman to hit the player
        function spearmanHit(spearman)
        {
            spearman.hitting = false;
        }

        //Spearman loses health
        function bulletHitSpearman (bullet, enemySpearman)
        {
            enemySpearman.health--;
            if(enemySpearman.health === 0)
            {
                score += 25;
                this.scoreText.setText('Score: ' + score);
                enemySpearman.disableBody(true,true);
            }
            bullet.disableBody(true,true);
        }

        function playerInvulnerable (player)
        {
            player.invulnerable = false;
        }

        function playerInvisible()
        {
            this.player.setVisible(false);
        }

        function playerVisible()
        {
            this.player.setVisible(true);
        }
    }

    update (delta)
    {
        //Holding an arrow
        if(this.key_Space.isDown)
        {
            this.player.setVelocityX(0);
            if(this.player.direction=== "left")
            {
                this.player.anims.play('shootLeft');
            }
            else if(this.player.direction === "right")
            {
                this.player.anims.play('shootRight');
            }

        }
        //set shooting function
        else if(this.key_Space._justUp)
        //Just up is used if the button is pressed, hence just popped up
        {
            var velX = 200;
            if(this.player.direction=== "left")
            {
                velX = -200;
                this.player.anims.play('shootLeft');
            }
            else if(this.player.direction === "right")
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
            console.log(this.player.x + ", " + this.player.y);
            this.key_Space._justUp = false;
        }
        //Moving left
        else if (this.key_Left.isDown)
        {  
            this.player.setVelocityX(-500);
            this.player.anims.play('left', true);
            this.player.direction = "left";        
        }
        //Moving right
        else if (this.key_Right.isDown)
        {
            this.player.setVelocityX(500);
            this.player.anims.play('right', true);
            this.player.direction = "right";
        }
        //Not moving
        else
        {
            this.player.setVelocityX(0);
            if(this.player.direction === "left")
            {
                this.player.anims.play('faceLeft');
            }
            else if(this.player.direction === "right")
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
        if(this.player.health === 2)
        {
            this.healthBar.anims.play('heartsTwo');
        }
        else if (this.player.health === 1)
        {
            this.healthBar.anims.play('heartsOne');
        }
        else if (this.player.health === 0)
        {
            this.healthBar.anims.play('heartsZero');
            this.gameOver = true;
            this.physics.pause();
        }
        
        //Checks all the spearman in the group
        for(var i =0; i<this.enemySpearmans.children.size;i++)
        {
            var spearman = this.enemySpearmans.children.entries[i];

            var distance = spearman.distance;
            //Spearman paces back and forth
            if(spearman.hitting === true)
            {
                spearman.setVelocityX(0);
            }
            else if(spearman.x < spearman.originXValue+distance && spearman.direction==="right")
            {
                spearman.setVelocityX(100);
                spearman.anims.play('spearmanRight', true)
            }
            else if(spearman.x > spearman.originXValue- distance && spearman.direction ==="left")
            {
                spearman.setVelocityX(-100);
                spearman.anims.play('spearmanLeft', true)
            }
            if(spearman.x >= spearman.originXValue + distance)
            {
                spearman.direction = "left";
            }
            else if(spearman.x <=spearman.originXValue-distance)
            {
                spearman.direction= "right";
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
            this.player.health = 3;
            this.healthBar.anims.play('heartsThree');
            this.key_R._justUp = false;
        }

        if(this.player.x > 2800 && this.player.x <2810)
        {
            if(this.atBoss === 0)
            {
                //Pause movement
                this.physics.pause();
                var time = 500;
                //Make the wall built over time
                for(var i = -14; i<=486; i+=100)
                {
                    //Create wall boundaries
                    this.createWalls = this.time.delayedCall(time,createWall,[i], this);
                    time += 500;
                }
                //Resume the physics after wall is build
                this.resumePhysics = this.time.delayedCall(4000, resumePhysics,[], this);
            }
            this.atBoss = 1;
        }

        

        function createWall(i)
        {
            //Wall both sides of the screen
            this.walls.create(2416,i, 'wall');
            this.walls.create(3184,i, 'wall');
        }

        function resumePhysics()
        {
            this.physics.resume();
            //Stop screen from following the player
            this.cameras.main.stopFollow();
        }
    }
    
}
