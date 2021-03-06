/*
Requires: ScreenWidget.js
 */
function SpaceShip(context, image, imageIndex, imageOffset, width, height)
{
    ScreenWidget.call(this, context);
    var self = this;
    self.image = image;
    self.imageIndex = imageIndex;
    self.imageOffset = imageOffset;
    self.width = width;
    self.height = height;
    //number of shots the playerShip can withstand NOTE: this should probably be a variable in the playerShip logic
    self.health = 3;
    //number of bullets the player can have on screen at one time
    self.clip = 4;


    self.render = function()
    {
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

    self.initialize = function (x, y)
    {
        self.x = x;
        self.y = y;
    };

    self.mouseMoved = function (evt)
    {
        self.x = evt.clientX - self.width / 2;
        self.y = evt.clientY - self.height / 2;
    };


}