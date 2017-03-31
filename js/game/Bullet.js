// Bullets

//@params
//direction: positive shoots down, negative shoots bullets up
function Bullet(context, image, width, height, x, y, direction) {
    ScreenWidget.call(this, context);
    var self = this;
    self.image = image;
    self.width = width;
    self.height = height;
    self.x = x;
    self.y = y;
    //self.hitbox = { x: self.x, y: self.y, width: 10, height: 10 };

    self.render = function () {
        self.context.drawImage(self.image,       //source image
            0,  //sprite x offset
            0,                                   //sprite y offset
            self.width,                          //sprite width
            self.height,                         //sprite height
            self.x,                              //destination x
            self.y,                              //destination y
            self.width,                          //destination width (for scaling)
            self.height);                        //destination height (for scaling)
    };


    self.update = function () {
        self.y += direction;
    };

    self.LeftClicked = function (evt) {
        self.x = evt.clientX - self.width / 2;
        self.y = evt.clientY - 2*self.height;
    };

    //shoot enemy bullets from their position
    self.enemyShot = function (x, y) {
        self.x = x - self.width / 2;
        self.y = y - self.height / 2 - 10;
    };

}
