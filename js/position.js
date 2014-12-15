(function() {
    function Position(x, y, vector) {
        this.cx = x;
        this.cy = y;
        this.absoluteDir = false;
        this._fromCenterVector = new Vector(this.cx, this.cy);

        this.force = new Force(vector);

        this.mainVector = new Vector(0, 0);
        this.mainMoment = 0;
    }

    Position.prototype.getAbsoluteMove = function(dir) {
        var accelVector = this.force.getAccelVector();

        this._fromCenterVector.set(this.cx, this.cy);
        this._fromCenterVector.dir(this._fromCenterVector.dir() + dir);
        this.mainVector.dis(accelVector.dis());
        if (this.absoluteDir) {
            this.mainVector.dir(accelVector.dir());
        } else {
            this.mainVector.dir(accelVector.dir() + dir);
        }
        this.mainMoment = this.mainVector.momentAtPoint(-this._fromCenterVector.x(), -this._fromCenterVector.y());

        return {
            vector: this.mainVector,
            moment: this.mainMoment,
            cx: this._fromCenterVector.x(),
            cy: this._fromCenterVector.y()
        }
    }

    window.Position = Position;
})();

