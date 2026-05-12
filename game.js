class Menu extends Phaser.Scene{
    constructor(){
        super('menu');
    }

    preload(){
        this.load.image('background', 'assets/background.png');
    }

    create(){
        this.add.image(960, 540, 'background')
            .setScale(3.4);
        this.add.text(710, 200, 'Sky Skate', {
            fontSize: '72px',
            fill: '#0a90e9',
            fontStyle: 'bold'
        });

        this.startText = this.add.text(650, 560, 'Click to Start', {
            fontSize: '60px',
            fill: '#f7f6f4',
            fontStyle: 'bold'
        });
        this.tweens.add({
            targets: this.startText,
            alpha: 0.5,
            duration: 800,
            repeat: -1,
            ease: 'Sine.easeInout'
        });

        this.input.on('pointerdown', () => {
            this.scene.start('park');
        });
    }
}

class Park extends Phaser.Scene{
    constructor(){
        super('park')
    }
    
    handleGrab(pointer){
        //hit test to check if the pointer is over the box
        //this.matter.query.point(bodies, point) 
        //returns an array of bodies that are under the specified point
        let bodiesAtPointer = this.matter.query.point(this.matter.world.localWorld.bodies, 
            {x: pointer.worldX, y: pointer.worldY});
        //if the array is not empty, it means the pointer is over the box
        if (bodiesAtPointer.length > 0){
                //calculate the offset between the pointer and the box's position
                //if the box is at (100, 100) and the pointer is at (150, 150), the offset will be (50, 50)
                const offSetX = pointer.worldX - this.box.position.x;
                const offSetY = pointer.worldY - this.box.position.y;

                //calculate distance for the rope length
                let distance = Phaser.Math.Distance.Between(this.player.position.x, this.player.position.y, 
                pointer.worldX, pointer.worldY
            );

            //create the constraint the rope
            //this.matter.add.constraint(body1, body2, length, stiffness)
            this.rope = this.matter.add.constraint(this.player, this.box, distance, 0.1, {
                pointA: {x: 0, y: 0}, //attach the rope to the center of the ball
                pointB: {x: offSetX, y: offSetY} //exact spot you clicked on the box
            });
    } 
    }

    handleRelease(){
        if (this.rope){
            this.matter.world.removeConstraint(this.rope);
            this.rope = null;
        }
    }

    preload(){
        this.load.image('background1', 'assets/background1.png');
        this.load.image('backgroundTrees', 'assets/5.png');
        this.load.image('grass2', 'assets/Tile_02.png');
        this.load.image('smallTree', 'assets/Tree2.png');
        this.load.image('bigTree', 'assets/Tree4.png');
        this.load.image('fountain', 'assets/2.png');
        this.load.image('ramp', 'assets/Ramp2.png');
        this.load.json('rampCurve', 'assets/ramp.json');
        this.load.image('box', 'assets/1.png');
        this.load.image('skateboard','assets/Skateboard1.png');
        this.load.image('cash', 'assets/singleCash.PNG');
    }

    create(){
        //this.scene.start('summarylevel1');
        //create invisible boundaries around the edges of the game world 
        //to prevent objects from falling off the screen
        //this.matter.world.setBounds(x, y, width, height)
        this.matter.world.setBounds(10, 10, game.config.width - 20, game.config.height - 20);

        this.add.image(960, 540, 'background1')
            .setScale(3.4);
        this.add.image(960, 490, 'backgroundTrees')
            .setScale(3.4);
        this.add.image(300, 900, 'smallTree')
            .setScale(3)
        this.matter.add.image(1550, 720, 'bigTree', null, {isStatic: true})
            .setScale(4)
            .setBody({
                type: 'rectangle',
                width: 90,
                height: 760
            })
            .setStatic(true);

        this.matter.add.image(900, 1000, 'fountain', null, {isStatic: true})
            .setScale(5)
            .setBody({
                type: 'rectangle',
                width: 150,
                height: 340
            })
            .setStatic(true);

        const rampPhysics = this.cache.json.get('rampCurve');
        this.matter.add.image(1000, 600, 'ramp', null, 
            {isStatic: true, shape: rampPhysics.Ramp2})
            .setScale(3)
            .setAngle(60);
        //create the cash as a sensor, 
        //which will allow the player to pass through it,
        //trigger an event when they overlap
        this.cash = this.matter.add.image(960, 520, 'cash', null, {
            isStatic: true,
            isSensor: true
        })
        .setScale(2.5);
        this.cash.body.label = 'money';
        
        //create the goal area using a graphics object
        this.goalVisual = this.add.graphics();
        this.goalVisual.fillGradientStyle(0x1419B5, 0x359EB8, 0x8135B8, 0xCA5DD0);
        this.goalVisual.fillCircle(0, 0, 67);
        this.goalVisual.setPosition(1550, 280);
        this.goalVisual.setAlpha(0);
        this.matter.add.gameObject(this.goalVisual, {
            shape: {type: 'circle', radius: 67},
            isStatic: true,
            isSensor: true 
        });
        this.goalVisual.body.label = 'goal';

        this.tweens.add({
            targets: this.goalVisual,
            angle: 360,
            duration: 2500,
            repeat: -1,
            ease: 'linear'
        });

        //listen for collision events between the player and the cash
        this.matter.world.on('collisionstart', (event, body1, body2) => {
                if(body1.label === 'money' && body2 === this.player ||
                    body2 === this.player && body1.label === 'money'){
                       this.cash.destroy(); //remove the cash from the game
                       this.goalVisual.setAlpha(1); //make the goal fully visible 
                    }
                }); 

        this.matter.world.on('collisionstart', (event, body1, body2) => {
            if (body1 === this.player && body2.label === 'goal' ||
                body2 === this.player && body1.label === 'goal'){
                    this.scene.start('summarylevel1', {seconds: this.seconds, level: 'Park'});
                }
        });

        for (let i = 0; i < 40; i++){
            this.matter.add.image(i * 64, 1060, 'grass2', null, 
                {isStatic: true})
                .setScale(2)
        }

         this.seconds = 0;

         this.timerText = this.add.text(800, 20, 'Time: 0', {
            fontSize: '40px',
            fill: '#f6f5f0'
         });

         this.time.addEvent({
             delay: 1000,
             callback: () => {
                 this.seconds++;
                 let  minutes = Math.floor(this.seconds /60);
                 let partInSeconds = this.seconds % 60;

                 let formattedSeconds = partInSeconds.toString().padStart(2, '0');

                 this.timerText.setText(`Time: ${minutes}:${formattedSeconds}`);
             },
             callbackScope: this,
             loop: true
         });

        this.rope = null;
        //this will be subtracted from the rope length 
        //every frame to reel it in
        this.pullSpeed = 13;

        //physics bodies
        this.box = this.matter.add.circle(460, 500, 30, {isStatic: true});
        this.player = this.matter.add.circle(200, 800, 30, {restitution: 0.85});

        //the visual part of the box and ball
        this.boxVisual = this.add.image(this.box.position.x, this.box.position.y, 'box')
        .setScale(5)
        this.playerVisual = this.add.image(this.player.position.x, this.player.position.y, 'skateboard')
        .setScale(4)

        this.ropeVisual = this.add.graphics();

        this.input.on('pointerdown', this.handleGrab, this);
        this.input.on('pointerup', this.handleRelease, this);
    }

    update(){

        if (this.player && this.playerVisual){
            this.playerVisual.x =this.player.position.x;
            this.playerVisual.y = this.player.position.y;

            this.playerVisual.rotation = this.player.angle;
        }
        //every frame (60fps), if the rope exists, reel it in
        if (this.rope){
            this.rope.length -= this.pullSpeed;

            //safety check to prevent the rope from becoming too short and causing erratic behavior
            if (this.rope.length < 5){
                this.rope.length = 5
            }
        }
        //clear the previous rope drawing
        this.ropeVisual.clear();
        //if the rope exists, draw a line between the player and the box
        if (this.rope){
            //set the line style for the rope (width, color, alpha)
            this.ropeVisual.lineStyle(4, 0x8B4513, 1)

            const x1 = this.rope.bodyA.position.x
            const y1 = this.rope.bodyA.position.y
            const x2 = this.rope.bodyB.position.x
            const y2 = this.rope.bodyB.position.y

            this.ropeVisual.beginPath();
            this.ropeVisual.moveTo(x1, y1);
            this.ropeVisual.lineTo(x2, y2);
            this.ropeVisual.strokePath();
        }
    }
}

class Rooftops extends Phaser.Scene{
    constructor(){
        super('rooftops');
    }
}

class Sky extends Phaser.Scene{
    constructor(){
        super('sky');
    }
}

class Summary extends Phaser.Scene{
    constructor(){
        super('summary');
    }
    
    preload(){
        this.load.image('backgroundlevel', 'assets/background.png');
    }
    create(data){
        let minutes = Math.floor(data.seconds / 60);
        let partInSeconds = data.seconds % 60;
        let formattedSeconds = partInSeconds.toString().padStart(2, '0');
        this.add.image(960, 540, 'backgroundlevel')
        .setScale(3.4);
        
        //holds the next level and time to beat for each level
        const levelData = {
            'Park': {next: 'Rooftops', label: 'Level 1 Complete!' , timeToBeat: '1:00'},
            'Rooftops': {next: 'Sky', label: 'Level 2 Complete!', timeToBeat: '0:45'},
            'Sky':{next: 'Menu', label: 'Game Complete!'}        
        };

        const current = this.levelData[data.level]

        this.add.rectangle(960, 540, 900, 900, 0x000000, 0.7);

        this.add.text(650, 200, current.label, {
            fontSize: '60px',
            fill: '#4ef75c',
        });

        this.add.text(650, 380, `Final Time: ${minutes}:${formattedSeconds}`, {
            fontSize: '50px',
            fill: '#ffffff'
        });

        this.add.text(650, 500, `Time to beat: ${current.timeToBeat}`, {
            fontSize: '50px',
            fill: '#ffffff'
        });

        this.add.text(770, 620, `Next Level: ${current.next}`, {
            fontSize: '50px',
            fill: '#ffffff'
        });
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
            debug: false, //enable the physics debug mode, which will render outlines and other visual aids to help with debugging physics interactions
        }
    },

    //scene management
    scene: [Menu, Park, Rooftops, Sky, Summary],
};

const game = new Phaser.Game(config);
