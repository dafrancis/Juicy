(function () {
    "use strict";

    var Juicy = {
        /**
         * Starts a canvas application
         *
         * @module
         * @param {Object} options    Options for the application (optional)
         *                            Options include:
         *                              canvas : The canvas element
         *                              time : The time for each loop (default: 30)
         *                              clear : Sets autoclear (default: true)
         * @param {Function} callback Function for the main canvas loop.
         */
        run: function (options, callback) {
            var backupCanvas, self = this;
            if (typeof options === "function") {
                callback = options;
                options = {};
            }
            backupCanvas = document.getElementsByTagName("canvas")[0];
            this.clear = options.clear || true;
            this.canvas = options.canvas || backupCanvas;
            this.canvas.addEventListener("mousemove", this._mouse.mousemove);
            this.canvas.addEventListener("mousedown", this._mouse.mousedown);
            this.canvas.addEventListener("mouseup", this._mouse.mouseup);
            this.ctx = this.canvas.getContext("2d");
            this.canvas.ctx = this.ctx;
            setInterval(function () {
                var collection;
                if (self.clear) {
                    self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
                }
                for (collection in self.collections) {
                    if (self.collections.hasOwnProperty(collection)) {
                        self.collections[collection].step();
                    }
                }
                callback.call(self);
                Juicy.mouse.click = false;
            }, options.time || 30);
        },
        /**
         * Keeps the state of the mouse object
         *
         * x : mouse x on the canvas
         * y : mouse y on the canvas
         * click : determines if mouse is clicked
         * down : determines if the mouse is pressed
         */
        mouse: {
            x: 0,
            y: 0
        },
        /**
         * Mouse event functions
         */
        _mouse: {
            /**
             * Sets mouse.x and mouse.y when mouse moves
             */
            mousemove: function (e) {
                var mouseX, mouseY;
                if (e.offsetX) {
                    mouseX = e.offsetX;
                    mouseY = e.offsetY;
                } else if (e.layerX) {
                    mouseX = e.layerX - Juicy.canvas.offsetLeft;
                    mouseY = e.layerY - Juicy.canvas.offsetTop;
                }
                Juicy.mouse.x = mouseX / Juicy.ratio.x;
                Juicy.mouse.y = mouseY / Juicy.ratio.y;
            },
            /**
             * Sets mouse clicked and mouse is down when mouse is down
             */
            mousedown: function () {
                Juicy.mouse.click = true;
                Juicy.mouse.isDown = true;
            },
            /**
             * Sets mouse down as false when mouse is up
             */
            mouseup: function () {
                Juicy.mouse.isDown = false;
            }
        },
        /**
         * Holds the Audio Objects
         */
        sounds: {},
        /**
         * Holds the Image Objects
         */
        images: {},
        /**
         * Takes an object of names -> path and loads Audio
         * objects ready to be used in the application
         *
         * @param {Object} obj Object of names -> path of all the sounds to be used
         */
        audioLoad: function (obj) {
            var sound, audio, stop = function () {
                this.pause();
                this.currentTime = 0;
            };
            for (sound in obj) {
                if (obj.hasOwnProperty(sound)) {
                    audio = new Audio(obj[sound]);
                    audio.stop = stop;
                    this.sounds[sound] = audio;
                }
            }
        },
        /**
         * Takes an object of names -> path and loads Image
         * objects ready to be used in the application
         *
         * @param {Object} obj Object of names -> path of all the images to be used
         */
        imageLoad: function (obj) {
            var img, image;
            for (image in obj) {
                if (obj.hasOwnProperty(image)) {
                    img = new Image();
                    img.src = obj[image];
                    this.images[image] = img;
                }
            }
        },
        /**
         * Sets the application to fullscreen mode. This needs to be bound to a
         * button as the JavaScript fullscreen API doesn't allow fullscreen
         * otherwise.
         */
        fullscreen: function () {
            var elem = this.canvas;
            if (elem.requestFullScreenWithKeys) {
                elem.requestFullScreenWithKeys();
            } else if (elem.mozRequestFullScreen) {
                elem.mozRequestFullScreen(elem.ALLOW_KEYBOARD_INPUT);
            } else if (elem.webkitRequestFullScreen) {
                elem.webkitRequestFullScreen(elem.ALLOW_KEYBOARD_INPUT);
            }
        },
        /**
         * Holds the collections used in the application
         */
        collections: {},
        /**
         * Takes an object of names -> Collection and sets up
         * collections ready to be used in the application
         *
         * @param {Object} collections Object of names -> Collection of all the
         *                             collections to be used
         */
        setupCollections: function (collections) {
            var collection, self = this;
            for (collection in collections) {
                if (collections.hasOwnProperty(collection)) {
                    self.collections[collection] = new collections[collection]();
                }
            }
        },
        /**
         * Ratio for fullscreen mode
         */
        ratio: {
            x: 1,
            y: 1
        },
        /**
         * Sets up fullscreen
         */
        onInFullScreen: function () {
            var html, body, elem;
            elem = this.canvas;
            html = document.getElementsByTagName("html")[0];
            body = document.getElementsByTagName("body")[0];
            html.className += " ffs_body";
            body.className += " ffs_body";
            elem.className += " ffs_element";

            this.ratio = {
                x: window.innerWidth / this.canvas.width,
                y: window.innerHeight / this.canvas.height
            };
        },
        /**
         * Sets the application back to normal when going out of fullscreen
         */
        onOutFullScreen: function () {
            var html, body, elem;
            elem = this.canvas;
            html = document.getElementsByTagName("html")[0];
            body = document.getElementsByTagName("body")[0];
            html.className = html.className.replace("ffs_body", "");
            body.className = body.className.replace("ffs_body", "");
            elem.className = elem.className.replace("ffs_element", "");

            this.ratio = {
                x: 1,
                y: 1
            };
        },
        drawText: function (text, x, y, color, font, space) {
            var self = this;
            if (typeof text === "string") {
                text = text.split("\n");
            }
            space = space || 50;
            this.ctx.fillStyle = color || "black";
            this.ctx.font = font || "12px sans-serif";
            text.forEach(function (str) {
                self.ctx.fillText(str, x, y);
                y += space;
            });
        },
        drawMouse: function (mouse, offX, offY) {
            var x, y, img = this.images[mouse];
            if (offX !== undefined && offY !== undefined) {
                x = this.mouse.x - offX;
                y = this.mouse.y - offY;
            } else {
                x = this.mouse.x - (img.width / 2);
                y = this.mouse.y - (img.height / 2);
            }
            this.ctx.drawImage(img, x, y);
        }
    };

    /**
     * Bind for going in and out of fullscreen
     */
    document.addEventListener("fullscreenchange", function () {
        var evt = (document.fullscreen) ? "onInFullScreen" : "onOutFullScreen";
        Juicy[evt]();
    }, false);
    /**
     * Bind for going in and out of fullscreen (Mozilla)
     */
    document.addEventListener("mozfullscreenchange", function () {
        var evt = (document.mozFullScreen) ? "onInFullScreen" : "onOutFullScreen";
        Juicy[evt]();
    }, false);
    /**
     * Bind for going in and out of fullscreen (Webkit)
     */
    document.addEventListener("webkitfullscreenchange", function () {
        var evt = (document.webkitIsFullScreen) ? "onInFullScreen" : "onOutFullScreen";
        Juicy[evt]();
    }, false);

    /**
     * Base class for application objects
     *
     * @module
     * @this {Base}
     */
    function Base() {
        // Something goes here
    }

    /**
     * Draw function. Only methods that draws something per step should be here.
     *
     * @this {Base}
     */
    Base.prototype.draw = function () {};

    /**
     * Change function. Only methods changes something per step should be here.
     *
     * @this {Base}
     */
    Base.prototype.change = function () {};

    /**
     * Step function. What happens per cycle in the canvas loop.
     *
     * @this {Base}
     */
    Base.prototype.step = function () {
        this.draw();
        this.change();
    };

    /**
     * Returns wether object has gone outside of the canvas object
     *
     * @this {Base}
     */
    Base.prototype.isOutOfBounds = function () {
        var self = this, compare = function (attr, compare) {
            return self[attr] + self[compare] > Juicy.canvas[compare] || self[attr] < -self[compare];
        };
        return compare("x", "width") || compare("y", "height");
    };

    /**
     * Returns wether object is currently being hovered on
     *
     * @this {Base}
     */
    Base.prototype.isHover = function () {
        var isX, isY;
        isX = Juicy.mouse.x > this.x && Juicy.mouse.x < this.width + this.x;
        isY = Juicy.mouse.y > this.y && Juicy.mouse.y < this.height + this.y;
        return isX && isY;
    };

    /**
     * Returns wether object is currently being clicked
     *
     * @this {Base}
     */
    Base.prototype.isClicked = function () {
        return Juicy.mouse.click && this.isHover();
    };

    Juicy.Base = Base;

    /**
     * Collection class. Collections are to hold more than one Base items
     * When creating a collection you should say what kind of model you're
     * using and also a filter if objects are to be removed from the collection.
     *
     * e.g.
     * function Particles() {
     *     this.model = Particle;
     *     this.filter = function (particle) {
     *         return !particle.isOutOfBounds();
     *     }
     * }
     *
     * Particles.prototype = new Juicy.Collection();
     *
     * @module
     * @this {Collection}
     */
    function Collection() {
        this.collection = [];
    }

    /**
     * Collection extends Base
     *
     * @this {Collection}
     */
    Collection.prototype = new Base();

    /**
     * Step for collections
     *
     * @this {Collection}
     */
    Collection.prototype.step = function () {
        this.drawCollection();
        this.filterCollection();
        this.draw();
        this.change();
    };

    /**
     * Runs the step function for all the objects in the collection
     *
     * @this {Collection}
     */
    Collection.prototype.drawCollection = function () {
        this.collection.forEach(function (object) {
            object.step();
        });
    };

    /**
     * Runs the filter for the collection if there is a filter
     *
     * @this {Collection}
     */
    Collection.prototype.filterCollection = function () {
        if (this.filter) {
            this.collection = this.collection.filter(this.filter);
        }
    };

    /**
     * Adds a new object (depending on model) for the collection
     *
     * @this {Collection}
     */
    Collection.prototype.add = function () {
        this.collection.push(new this.model());
    };

    /**
     * Removes an object depending on the index
     *
     * @this {Collection}
     * @param {Number} index The index of the object in the collection;
     */
    Collection.prototype.remove = function (index) {
        return this.collection.splice(index, 1);
    };

    Juicy.Collection = Collection;

    /**
     * Animated Class. Like Base but used for images which are animated.
     * Images must be a spritesheet and width and height should be provided.
     * You can repeat an animation by setting repeat to true.
     *
     * e.g.
     * function Explosion() {
     *     this.img = Juicy.images.explosion;
     *     this.width = 64;
     *     this.height = 64;
     *     this.repeat = false;
     * }
     *
     * Explosion.prototype = new Juicy.Animated();
     *
     * @module
     * @this {Animated}
     */
    function Animated() {
        this.offsetX = 0;
        this.offsetY = 0;
        this.isFinished = false;
    }

    /**
     * Animated extends Base
     *
     * @this {Animated}
     */
    Animated.prototype = new Base();

    /**
     * Step function
     *
     * @this {Animated}
     */
    Animated.prototype.step = function () {
        this.drawFrame();
        this.animate();
        this.draw();
        this.change();
    };

    /**
     * Sets the next frame to be animated
     *
     * @this {Animated}
     */
    Animated.prototype.animate = function () {
        this.offsetX += this.width;
        if (this.offsetX === this.img.width) {
            this.offsetX = 0;
            this.offsetY += this.height;
        }
        if (this.offsetY === this.img.height) {
            if (this.repeat) {
                this.offsetY = 0;
            } else {
                this.isFinished = true;
            }
        }
    };

    /**
     * Draws the current frame
     *
     * @this {Animated}
     */
    Animated.prototype.drawFrame = function () {
        var img, offx, offy, width, height, x, y;
        img = this.img;
        offx = this.offsetX;
        offy = this.offsetY;
        width = this.width;
        height = this.height;
        x = this.x;
        y = this.y;
        Juicy.ctx.drawImage(img, offx, offy, width, height, x, y, width, height);
    };

    Juicy.Animated = Animated;

    this.Juicy = Juicy;
}.call(this));