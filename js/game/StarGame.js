/*
Main file for Star Game
Requires: ScreenWidget.js
          Star.js
          SpaceShip.js
 */
function StarGame(canvas, shipImageSrc, enemyShipImageSrc, bulletImageSrc, playerBulletImageSrc, explosionImageSrc, displayBulletImageSrc, displayLivesImageSrc, displayScoreImageSrc)
{
    var self = this;
    self.canvas = canvas;
    self.context = canvas.getContext("2d");
    self.shipImage = new Image();
    self.shipImage.src = shipImageSrc;
    
    //set images for all of the objects
    self.enemyShipImage = new Image();
    self.enemyShipImage.src = enemyShipImageSrc;

    self.bulletImage = new Image();
    self.bulletImage.src = bulletImageSrc;

    self.playerBulletImage = new Image();
    self.playerBulletImage.src = playerBulletImageSrc;

    self.explosionImage = new Image();
    self.explosionImage.src = explosionImageSrc;

    self.displayBulletImage = new Image();
    self.displayBulletImage.src = displayBulletImageSrc;

    self.displayLivesImage = new Image();
    self.displayLivesImage.src = displayLivesImageSrc;

    self.displayScoreImage = new Image();
    self.displayScoreImage.src = displayScoreImageSrc;

    self.widgets = Array();

    //NEW Content
    //used to make sure the playerShip doesn't get rendered when it's destroyed
    self.shipDead = false;
    //keeps track of the user's score
    self.score = 0;
    //bonus points added to score for every enemy destroyed, enemy ships resetting to the top reduce the bonus
    self.bonus = 500;

    //These arrays will contain the objects they describe
    //They're put into individual arrays to make it easier to add and remove them from the canvas
    self.enemies = Array();
    self.playerBullets = Array();
    self.enemyBullets = Array();
    self.displayBullets = Array();
    self.displayLives = Array();

    //hide mouse
    self.canvas.style.cursor = "none";

    //set up player piece
    self.playerShip = new SpaceShip(self.context, self.shipImage, 9, 66, 64, 64);
    //render ship at bottom middle of screen
    self.playerShip.initialize(canvas.width / 2, canvas.height - self.playerShip.height);

    //explosion animation initialization
    self.explode = new Sprite(self.context,
            self.explosionImage,
            0,
            134,
            134,
            134,
            self.playerShip.x - (self.playerShip.width / 2),
            self.playerShip.y - (self.playerShip.height / 2)
            );
    

    //set up globals
    maxX = canvas.clientWidth;
    maxY = canvas.clientHeight;

    self.begin = function()
    {
        self.init();
        self.renderLoop();
    };

    //resets game state
    self.init = function()
    {
        //set up starfield
        //generate 100 small stars
        for (var i = 0; i < 100; i++)
        {
            //make it so most stars are in the far background
            var howFast = Math.random() * 100;
            var speed = 5;
            if (howFast > 60)
            {
                speed = 2;
            }
            else if (howFast > 20)
            {
                speed = 1;
            }
            //var speed = (Math.floor(Math.random() * 3) + 1) * 1;
            var someStar = Star.makeStar(self.context, 2, speed);
            self.widgets.push(someStar);
        }

        //generate 10 large stars
        for (var i = 0; i < 10; i++) {
            var speed = (Math.floor(Math.random() * 3) + 1) * 1;
            var someStar = Star.makeStar(self.context, 5, speed);
            self.widgets.push(someStar);
        }

        //generate 20 medium stars
        for (var i = 0; i < 10; i++) {
            var speed = (Math.floor(Math.random() * 3) + 1) * 1;
            var someStar = Star.makeStar(self.context, 3, speed);
            self.widgets.push(someStar);
        }

        //and 200 tiny stars
        for (var i = 0; i < 200; i++) {
            var speed = (Math.floor(Math.random() * 3) + 1) * 1;
            var someStar = Star.makeStar(self.context, 1, speed);
            self.widgets.push(someStar);
        }

        //placing ship last puts it on top of the stars
        self.widgets.push(self.playerShip);

        //NEW content
        //adds all 10 enemy ships to the array
        for (var i = 0; i < 10; i++)
        {
            self.enemyShip = new EnemyShip(self.context, self.enemyShipImage, 0, 0, 100, 100, 100 + i *64, 20 +(i % 2)*64);
            self.enemies.push(self.enemyShip);
        }

        //save the number of bullets in an array
        //currently you have to hard code the distance between each bullet
        for (var i = 0; i < self.playerShip.clip; i++)
        {
            self.numBullets = new Sprite(self.context, self.displayBulletImage, 0, 0, 60, 60, 10 + (30*i), canvas.height - 50);
            self.displayBullets.push(self.numBullets);
        }

        //save the number of displayed hearts into an array
        for (var i = 0; i < self.playerShip.health; i++)
        {
            //this controls where each heart gets rendered
            self.numHearts = new Sprite(self.context, self.displayLivesImage, 0, 0, 50, 54, 10 + (50 * i), canvas.height - 110);
            self.displayLives.push(self.numHearts);
        }

        self.scoreDisplay = new Sprite(self.context, self.displayScoreImage, 0, 0, 71, 14, (canvas.width / 2) - 35, 10)

        //begin game
        window.requestAnimationFrame(self.renderLoop);
    };

    self.renderLoop = function()
    {
        //clear canvas
        self.context.clearRect(0, 0, maxX, maxY);

        //paint black
        self.context.fillStyle = "rgb(0, 0, 0)";
        self.context.fillRect(0, 0, maxX, maxY);


        //if player is destroyed, remove it from the canvas
        if (self.playerShip.health < 1 && self.shipDead === false)
        {
            self.shipDead = true;
            self.widgets.pop();
        }

        //render widgets (stars and playerShip)
        for(var i = 0; i < self.widgets.length; i++)
        {
            self.widgets[i].render();
            self.widgets[i].update();
        }

        //renders the enemies
        for (var i = 0; i < self.enemies.length; i++)
        {
            self.enemies[i].render();
            //enemies that make it to the bottom and reset to the top will decrement the bonus
            if (self.enemies[i].update() == 1)
            {
                self.updateScore(1);
            }
                
        }

        //renders player bullets
        for (var i = 0; i < self.playerBullets.length; i++)
        {
            self.playerBullets[i].render();
            self.playerBullets[i].update();
            //remove bullets that go too far up
            if(self.playerBullets[i].y <= 0 - self.playerBullets[i].height)
            {
                self.playerBullets.splice(i, 1);
            }
        }
        
        //renders enemy bullets
        for (var i = 0; i < self.enemyBullets.length; i++)
        {
            self.enemyBullets[i].render();
            self.enemyBullets[i].update();
            //remove bullets if they go too far down
            if (self.enemyBullets[i].y >= canvas.height)
            {
                self.enemyBullets.splice(i, 1);
            }
        }

        //Render score value
        self.scoreDisplay.render();
        self.context.fillStyle = "#FFFFFF"; //white
        self.context.font = "20px Arial";
        self.context.fillText(self.score, (canvas.width / 2) - 20, 50); // top, center

        //render number of bullets available
        for (var i = 0; i < (self.playerShip.clip - self.playerBullets.length); i++)
        {
            self.displayBullets[i].render();
        }

        //render number of lives available
        for (var i = 0; i < (self.playerShip.health) ; i++)
        {
            self.displayLives[i].render();
        }


        //NEW content
        //collision detection
        if (self.playerShip.health > 0)
        {
            for (var i = 0; i < self.enemies.length; i++)
            {
                //detection for player & enemies
                if ((self.playerShip.x < (self.enemies[i].x + self.enemies[i].width)) &&
                  ((self.playerShip.x + self.playerShip.width) > self.enemies[i].x) &&
                   (self.playerShip.y < (self.enemies[i].y + self.enemies[i].height)) &&
                  ((self.playerShip.height + self.playerShip.y) > self.enemies[i].y)
                  )
                {
                    //destroy enemy once they come into contact with player
                    self.enemies.splice(i, 1);
                    self.playerShip.health = 0; //contact with enemy ship causes death to player
                    self.updateScore(2);
                }

                //detect bullet collision for playerbullets & enemies
                for(var j = 0; j < self.playerBullets.length; j++)
                {
                    if(!self.enemies[i])    //this will prevent the code from breaking if the enemy gets destroyed prior to this check
                    {
                        
                    }
                    else if ((self.playerBullets[j].x < (self.enemies[i].x + self.enemies[i].width)) &&
                  ((self.playerBullets[j].x + self.playerBullets[j].width) > self.enemies[i].x) &&
                   (self.playerBullets[j].y < (self.enemies[i].y + self.enemies[i].height) - 15) &&
                  ((self.playerBullets[j].height + self.playerBullets[j].y) > self.enemies[i].y)
                  )
                    {
                        //decrement enemy lifepoints and delete bullet
                        self.enemies[i].health--;
                        self.playerBullets.splice(j, 1);

                        if (self.enemies[i].health < 1)
                        {
                            //destroy enemy once they lose all health
                            self.enemies.splice(i, 1);
                            self.updateScore(3);
                        }
                    }
                }

                //detect collsion between player and enemy bullets
                for (var j = 0; j < self.enemyBullets.length; j++)
                {
                    if ((self.enemyBullets[j].x < (self.playerShip.x + self.playerShip.width)) &&
                        ((self.enemyBullets[j].x + self.enemyBullets[j].width) > self.playerShip.x) &&
                         (self.enemyBullets[j].y < (self.playerShip.y + self.playerShip.height) - 15) &&
                        ((self.enemyBullets[j].height + self.enemyBullets[j].y) > self.playerShip.y)
                        )
                    {
                        self.enemyBullets.splice(j, 1);
                        self.playerShip.health--;
                    }
                }

                //fire enemy bullets
                if(Math.floor((Math.random() * 1000) + 1) == 1)
                {
                    self.enemyBullet = new Bullet(self.context, self.bulletImage, 49, 61, 20, 20, 1);
                    //controls where the bullet is shot from
                    self.enemyBullet.enemyShot(self.enemies[i].x + (self.enemies[i].width /2) - 10, self.enemies[i].y + self.enemies[i].height);
                    self.enemyBullets.push(self.enemyBullet);
                }
            }
        }

        //conditions for winning the game
        if (self.enemies.length <= 0 && self.playerShip.health > 0)
        {
            self.context.fillStyle = "#FF0000";
            self.context.font = "80px Arial";
            self.context.fillText("You Win!", (canvas.height / 2) - 100, (canvas.width / 2) - 50);
        }

        //condition for losing the game
        if (self.playerShip.health < 1)
        {
            self.context.fillStyle = "#FF0000";
            self.context.font = "80px Arial";
            self.context.fillText("Game Over", (canvas.width / 2) - 200, (canvas.height / 2));

            //renders explosion animation for player ship if they lose
            //probably should have made these variables protected/private and made setter functions for x and y
            self.explode.x = self.playerShip.x - (self.playerShip.width / 2);
            self.explode.y = self.playerShip.y - (self.playerShip.height / 2);
            self.explode.render();
            self.explode.update();
            
            
        }
        
        
        window.requestAnimationFrame(self.renderLoop);
    };//End of RenderLoop



    /*Event Listeners and other useful functions*/
    //controls player movement on the screen
    self.canvasMouseMoved = function(evt)
    {
        //update interested parties
        if (self.playerShip.health > 0)
        {
            //lose mouse movement when dead
            self.playerShip.mouseMoved(evt);
        }
    };

    canvas.addEventListener("mousemove", self.canvasMouseMoved, false);



    //NEW CONTENT
    //player bullet spawning
    self.canvasLeftClick = function (evt)
    {
        if (self.playerBullets.length <= 3 && self.playerShip.health > 0) {
            //fire bullets!
            self.playerBullet = new Bullet(self.context, self.playerBulletImage, 12, 16, 20, 20, -1);
            self.playerBullets.push(self.playerBullet);
            self.playerBullet.LeftClicked(evt);
        }
    };

    canvas.addEventListener("click", self.canvasLeftClick, false);


    //changes the players ship
    self.f1 = function (evt) {
        if (self.playerShip.imageIndex == 9) {
            self.playerShip.imageIndex = 0;
        }
        else {
            self.playerShip.imageIndex++;
        }
    }

    canvas.addEventListener("keydown", self.f1, false);


    //score updating logic
    self.updateScore = function(value)
    {
        //enemies completed 1 wave to bottom, decrement bonus
        if (value == 1)
        {
            if(self.bonus > 50)
            {
                self.bonus -= 25;
            }
        }

        //player runs into enemy ship
        if (value == 2)
        {
            self.score += 10;
        }

        //player blows up enemy ship
        if (value == 3)
        {
            self.score += self.bonus;
        }
    };
 
}
