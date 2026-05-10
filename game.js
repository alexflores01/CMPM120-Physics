class Menu extends Phaser.Scene{
    constructor(){
        super('menu')
    }
    
    handleGrab(pointer){
        //calculate the offset between the pointer and the box's position
        //if the box is at (100, 100) and the pointer is at (150, 150), the offset will be (50, 50)
        const offSetX = pointer.worldX - this.box.position.x;
        const offSetY = pointer.worldY - this.box.position.y;

        //calculate distance for the rope length
        let distance = Phaser.Math.Distance.Between(this.ball.position.x, this.ball.position.y, 
            this.box.position.x, this.box.position.y
        );

        //create the constraint the rope
        //this.matter.add.constraint(body1, body2, length, stiffness)
        this.rope = this.matter.add.constraint(this.ball, this.box, distance, 0.1, {
            pointA: {x: 0, y: 0}, //attach the rope to the center of the ball
            pointB: {x: offSetX, y: offSetY} //exact spot you clicked on the box
        });
    }

    handleRelease(){
        if (this.rope){
            this.matter.world.removeConstraint(this.rope);
            this.rope = null;
        }
    }

    preload(){
    }

    create(){
        //create invisible boundaries around the edges of the game world 
        //to prevent objects from falling off the screen
        //this.matter.world.setBounds(x, y, width, height)
        this.matter.world.setBounds(10, 10, game.config.width - 20, game.config.height - 20);

        this.rope = null;
        this.pullSpeed = 13;

        this.box = this.matter.add.circle(960, 200, 50,
            {isStatic: true});

        this.ball = this.matter.add.circle(960, 800, 30, 
            {restitution: 0.8}); //restitution is the bounciness of the ball, 0.6 means it will bounce back with 60% of its original velocity

        this.input.on('pointerdown', this.handleGrab, this);
        this.input.on('pointerup', this.handleRelease, this);

    }

    update(){
        //every frame (60fps), if the rope exists, reel it in
        if (this.rope){
            this.rope.length -= this.pullSpeed;

            //safety check to prevent the rope from becoming too short and causing erratic behavior
            if (this.rope.length < 5){
                this.rope.length = 5
            }
        }

    }
}

const config = {
    type: Phaser.AUTO, //explicity set the rendering mode to AUTO, which will choose between WebGL and Canvas based on the browser's capabilities
    width: 1920, //set the width of the game canvas to 1920 pixels
    height: 1080, //set the height of the game canvas to 1080 pixels


    scale: {
        mode: Phaser.Scale.FIT, //scale the game to fit the available space while maintaining aspect ratio
        autoCenter: Phaser.Scale.CENTER_BOTH, //center the game within the avaiable space
    },

    physics: {
        default: 'matter', 
        matter: {
            gravity: {y: 1}, //set the gravity in the y direction to 1, which will cause objects to fall downwards}
            debug: true, //enable the physics debug mode, which will render outlines and other visual aids to help with debugging physics interactions
        }
    },

    //scene management
    scene: [Menu],
};

const game = new Phaser.Game(config);
