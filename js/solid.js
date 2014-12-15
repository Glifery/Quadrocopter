(function() {
    function Solid(x, y, img) {
        this.cx = x;
        this.cy = y;
        this.dir = 0;
        this.img = img;
        this.imgMainVector = null;

        this.positions = [];
        this.centerForces = [];

        this.accelVector = new Vector(0, 0);
        this.accelMoment = 0;

        this.mainVector = new Vector(0, 0);
        this.mainMoment = 0;

        this.onFrameFn = onFrameFn;
    }

    function onFrameFn() {
        this.move();
    }

    Solid.prototype.move = function() {
        this.calculateAccelMove();
        this.replace();
        this.redraw();
    }

    Solid.prototype.calculateAccelMove = function() {
        this.accelVector.set(0, 0);
        this.accelMoment = 0;

        for (var positionIndex in this.positions) {
            var position = this.positions[positionIndex];
            var positionMove = position.getAbsoluteMove(this.dir);

            this.accelVector.add(positionMove.vector);
            this.accelMoment += positionMove.moment;
        }

        for (var centerForceIndex in this.centerForces) {
            var centerForce = this.centerForces[centerForceIndex];
            var forceAccelVector = centerForce.getAccelVector();

            this.accelVector.add(forceAccelVector);
        }
    }

    Solid.prototype.replace = function() {
        this.mainVector.add(this.accelVector);
        this.mainMoment += this.accelMoment;

        this.cx += this.mainVector.x();
        this.cy += this.mainVector.y();
        this.dir += (this.mainMoment / 30);
    }

    Solid.prototype.redraw = function() {
        if (this.img !== null) {
            this.img.attr({
                x: this.cx - 20,
                y: this.cy - 20
            });
            this.img.transform('r' + -this.dir);
        }

        if (this.imgMainVector !== null) {
            var x1 = this.cx,
                y1 = this.cy,
                x2 = this.mainVector.x() * 100,
                y2 = this.mainVector.y() * 100,
                path = 'M' + x1 + ',' + y1 + 'l' + x2 + ',' + y2
            ;

            this.imgMainVector.attr({path: path});
        }

        if (this.imgAccelVector !== null) {
            var x1 = this.cx,
                y1 = this.cy,
                x2 = this.accelVector.x() * 100,
                y2 = this.accelVector.y() * 100,
                path = 'M' + x1 + ',' + y1 + 'l' + x2 + ',' + y2
                ;

            this.imgAccelVector.attr({path: path});
        }
    }

    Solid.prototype.addPosition = function(position) {
        this.positions.push(position);
    }

    Solid.prototype.addCenterForce = function(centerForce) {
        this.centerForces.push(centerForce);
    }

    window.Solid = Solid;
})();

