var svgStr = '';

var Class = {
   create: function() {
     return function() {
       if (this.initialize) {
         this.initialize();
       }
     }
   }
 }

var Wave = function (ele) {
    var self = this;

    this.mcParticles = [];
    this.mcParticleSprings = [];
    this.fK = 0.95;
    this.ele = ele || document.body;
    var _root = {
        _xmouse: 0,
        _ymouse: 0
    };

    this.width = $(ele).width();    
    this.height = $(ele).height();
    var pnum; 

	console.log("this.ele",this.ele);
    // this.paper = Raphael(this.ele);
	this.paper = Raphael(0,0,500,500);
    this.hitFlag = -1;
	console.log("this.paper",this.paper);

    $(document).live('mousemove', function (evt) {
        _root._xmouse = Event.pointerX(evt);
        _root._ymouse = Event.pointerY(evt);

        if (self.path && !self.obsDone) {
            $(self.path.node).onmouseover = function () {
                self.hitFlag = true;
               // console.log('entered');
            };

            $(self.path.node).onmouseout = function () {
                self.hitFlag = false;
                //console.log('left');
            };
            self.obsDone = true;
        }
    });

    this.hitTest = function () {
        return self.hitFlag;
    };

    this.setEnds = function (mcParticles) {
        this.mcParticles = mcParticles;
        pnum = this.mcParticles.length;
        for (var i = 0; i < this.mcParticles.length; i++) {
            this.mcParticles[i].fXPos = this.mcParticles[i]._x;
            this.mcParticles[i].fYAccel = 0;
            this.mcParticles[i].fYVel = 0;
            this.mcParticles[i].fYPos = this.mcParticles[i]._y;
            this.mcParticles[i].fBaseYPos = this.mcParticles[i]._y;
            this.mcParticles[i].iMass = 15;
            this.hitting = this.hitTest(_root._xmouse, _root._ymouse); //todo
            this.mYPos = _root._ymouse; //todo
            this.showParticles = false; //todo
            this.firstRun = true;
        }
        
        $(document.body).live('mousemove',function(){
             if (this.firstRun) {
                this.hitting = this.hitTest(_root._xmouse, _root._ymouse); //todo
                this.firstRun = false;
            }
            if (this.hitting != this.hitTest(_root._xmouse, _root._ymouse) ) {
                // work out mouse speed
                var iTarg = Math.round((_root._xmouse / this.width) * (this.mcParticles.length - 1));
                this.mcParticles[(iTarg - 2+pnum) % pnum].fYVel = (_root._ymouse - this.mYPos) / 6;
                this.mcParticles[(iTarg - 1+pnum) % pnum].fYVel = (_root._ymouse - this.mYPos) / 5;
                this.mcParticles[iTarg].fYVel = (_root._ymouse - this.mYPos) / 3;
                this.mcParticles[(iTarg + 1+pnum) % pnum].fYVel = (_root._ymouse - this.mYPos) / 5;
                this.mcParticles[(iTarg + 2+pnum) % pnum].fYVel = (_root._ymouse - this.mYPos) / 6;

                this.hitting = this.hitTest(_root._xmouse, _root._ymouse);
                this.mYPos = _root._ymouse;
            }
        });
    };

    this.activate = function () {
        // add a spring between each particle
        for (var u = 0; u < this.mcParticles.length - 1; u++) {
            this.mcParticleSprings.push({
                iLengthY: (this.mcParticles[u + 1]._y - this.mcParticles[u]._y)
            });
        }
        
        setInterval(function(){
        
			for (var u = this.mcParticles.length - 1; u >= 0; u--) {
				// work out what forces are applying
				var fExtensionY = 0;
				var fForceY = 0;

				if (u > 0) {
					fExtensionY = this.mcParticles[u - 1]._y - this.mcParticles[u]._y - this.mcParticleSprings[u - 1].iLengthY;
					fForceY += -this.fK * fExtensionY;
				}
				if (u < this.mcParticles.length - 1) {
					fExtensionY = this.mcParticles[u]._y - this.mcParticles[u + 1]._y - this.mcParticleSprings[u].iLengthY;
					fForceY += this.fK * fExtensionY;
				}

				fExtensionY = this.mcParticles[u]._y - this.mcParticles[u].fBaseYPos;
				fForceY += this.fK / 15 * fExtensionY;

				// now update the position of each particle, but don't render (so we don't cascade changes early)
				this.mcParticles[u].fYAccel = -fForceY / this.mcParticles[u].iMass;
				this.mcParticles[u].fYVel += this.mcParticles[u].fYAccel;
				this.mcParticles[u].fYPos += this.mcParticles[u].fYVel;
				this.mcParticles[u].fYVel /= 1.04; // friction
			}

            // time to render our wave
            svgStr = '';

            for (var u = 0; u < this.mcParticles.length; u++) {
                // use each particle as a control for the curve to and then use halfway points as actual anchors... took me AGES to work that out :-S
                if (u == 0) {
                    svgStr += 'M' + (this.mcParticles[u].fXPos + (this.mcParticles[u + 1].fXPos - this.mcParticles[u].fXPos) / 2) + ',' + (this.mcParticles[u].fYPos + (this.mcParticles[u + 1].fYPos - this.mcParticles[u].fYPos) / 2) + ' ';
                }
                else if (u < this.mcParticles.length - 1) {
                    svgStr += 'S' + this.mcParticles[u].fXPos + ',' + this.mcParticles[u].fYPos + ' ' + (this.mcParticles[u].fXPos + (this.mcParticles[u + 1].fXPos - this.mcParticles[u].fXPos) / 2) + ',' + (this.mcParticles[u].fYPos + (this.mcParticles[u + 1].fYPos - this.mcParticles[u].fYPos) / 2) + ' ';
                }
                this.mcParticles[u].x(this.mcParticles[u].fXPos);
                this.mcParticles[u].y(this.mcParticles[u].fYPos);
            }

            svgStr += 'L' + (this.width+50) + ',' + (this.height + 50) + ' ';
            svgStr += 'L' + (-25) + ',' + (this.height + 50) + ' ';
            svgStr += 'L' + (-25) + ',' + (this.height/2) + ' ';
            svgStr += 'Z';

            if (!this.path) {
                this.path = this.paper.path(svgStr).attr({fill:'90-#000-#444','stroke':'#000000', 'stroke-width':0});
            } else {
                this.path.attr({path: svgStr});
            }
        }.bind(this),40);
    }.bind(self);
};

var Particle = Class.create({
    initialize: function (x, y, paper) {
        this._x = x;
        this._y = y;
        this.fYVel = 0;
        this.node = paper.circle(x, y, 10).attr({'stroke-width':0});
    },
    x: function (num) {
        this._x = num;
        this.node.attr({cx: num});
        return this;
    },
    y: function (num) {
        this._y = num;
        this.node.attr({cy: num});
        return this;
    }
});

// USAGE 
// 
// $(document).observe('dom:loaded',function(){
//     var cnt = $('waveCnt');
//     var particles = [];
//     var wave = new Wave(cnt);
//     for (var i = 0; i < Math.ceil(wave.width/50) + 3; i++) {
//         particles.push(new Particle(-50 + (i*50), wave.height-300, wave.paper));
//     }
//     wave.setEnds(particles);
//     wave.activate();
// });
