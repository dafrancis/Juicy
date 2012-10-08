# Juicy
## A Canvas toolkit

### Wat

This is a toolkit I'm currently working on to make it easier for me to work on
canvas things. I'm aware that there may be better "frameworks" or libraries out
there that are much better at doing things with canvas. This was primarily for
me to learn more about the canvas api whilst also trying out ideas on how to
create a domain specific toolkit.

### How to I start a canvas?

`Juicy.run()` is the main function loop. By default it grabs the first canvas
element and sets that as `Juicy.canvas`. The context can be found at
`Juicy.ctx`. A simple canvas loop may go like this:

    Juicy.run(function () {
        this.drawText("Hello World!!!", 20, 20);
    });

### Cool. What else is there?

#### Setup functions

`Juicy.audioLoad()`, `Juicy.imageLoad()`, and `Juicy.setupCollection()` set up
`Juicy.sounds`, `Juicy.image`, and `Juicy.sounds` respectively:

    Juicy.audioLoad({
        pop: "sounds/pop.wav",
        explosion: "sounds/explosion.wav",
        background: "sounds/gangnam_style.mp3"
    });

    Juicy.imageLoad({
        crosshair: "images/cross.png",
        explosion: "images/explosion.png",
        skull: "images/skull.png",
        swan: "images/robotswanking.png"
    });

    Juicy.setupCollections({
        explosions: Explosions,
        skull: Skulls
    });

You can use audio and images in objects or even in the main loop

    Juicy.sounds.explosion.play();
    Juicy.drawMouse("crosshair");

#### Models

There are two main types of models. Base and Animated. Base is for basic objects
and Animated are for animated images. Images for animated are imported as a
spritesheet.

    function Explosion() {
        this.img = Juicy.images.explosion;
        this.width = 64;
        this.height = 64;
        this.repeat = false;
    }

    Explosion.prototype = new Juicy.Animated();

#### Collections

Collections are for more than one of the main model. So you can have a
collection of particles. It requires a model attribute and an optional filter
attribute:

    function Particles() {
        this.model = Particle;
        this.filter = function (particle) {
            return !particle.isOutOfBounds();
        }
    }
    
    Particles.prototype = new Juicy.Collection();

### Cool so what's next?

This isn't a fully featured canvas library. New features are going to be added
the more I play about with canvas. It's likely I'll probably use this to make a
game or something and find some things to abstract on the way.

What I'll probably add in the future:

* A preloader
* A much more effective way to do text.
* Something to go from one state (or "main loop") to another. Like have multiple
"main loops" that can be switched to whenever instead of one big one.

### License

Copyright (C) 2012 Dafydd Francis 

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.