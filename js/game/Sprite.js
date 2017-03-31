// Sprite Class - for animating 

// Enemy Spaceship
function Sprite(context, image, imageIndex, imageOffset, width, height, x, y) {
    ScreenWidget.call(this, context);
    var self = this;
    self.image = image;
    self.imageIndex = imageIndex;
    self.imageOffset = imageOffset;
    self.width = width;
    self.height = height;
    self.x = x;
    self.y = y;
    self.tickCount = 0;
    self.ticksPerFrame = 5;

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
        self.tickCount++;

        if (self.tickCount > self.ticksPerFrame) {
            self.tickCount = 0;
            self.imageIndex++;
            self.render();
        }

    };

    

    /*self.update = function () {
        var flag = 0;
        self.x += self.direction;
        self.y += self.speed;

        flag = self.checkBoundaries();
        return flag;
    };*/




}