// Enemy Spaceship
function EnemyShip(context, image, imageIndex, imageOffset, width, height, x, y) {
    ScreenWidget.call(this, context);
    var self = this;
    self.image = image;
    self.imageIndex = imageIndex;
    self.imageOffset = imageOffset;
    self.width = width;
    self.height = height;
    self.x = x;
    self.y = y;
    self.speed = .5;
    self.direction = 1;
    self.health = 3;
    

    self.render = function () {
        self.context.drawImage(self.image,       //source image
            self.imageIndex * self.imageOffset,  //sprite x offset
            0,                                   //sprite y offset
            self.width,                          //sprite width
            self.height,                         //sprite height
            self.x,                              //destination x
            self.y,                              //destination y
            self.width,                          //destination width (for scaling)
            self.height);                        //destination height (for scaling)
    };


    self.update = function ()
    {
        var flag = 0;
        self.x += self.direction;
        self.y += self.speed;
        
        flag = self.checkBoundaries();
        return flag;
    };

    self.checkBoundaries = function () {
        //left boundary check
        var flag = 0;
        if (self.x <= 0 - 10)
        {
            self.direction = 1;
        }
        //right boundary check
        if (self.x >= canvas.width - self.width + 10)
        {
            self.direction = -1;
        }
        //lower boundary check
        if (self.y >= canvas.height)
        {
            self.y = 0 - self.height;
            flag = 1;
        }

        return flag;

    };

    
}