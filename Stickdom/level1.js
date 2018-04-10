class level1 extends Phaser.Scene
{
    constructor()
    {
        super({key: "level1"});
    }

    preload ()
    {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.spritesheet('dude', 
            'assets/stickman.png',
            { frameWidth: 32, frameHeight: 50 }
        );
        this.load.image('bullet', 'assets/bullet.png');
    }
    create ()
    {
        this.add.image(400, 300, 'sky');
    }

    update ()
    {

    }
}
