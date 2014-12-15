(function() {
    function Point() {
        this.cx = 0;
        this.cy = 0;
        this.dir = 0;
        this.solid = null;
        this.force = new Vector(0, 0);

        this._positionVector = new Vector();
        this._realForceVector = new Vector();
    }

    function updatePositionVector(point) {
        var selfDir;

        point._positionVector.set(point.cx, point.cy);
        selfDir = point._positionVector.dir();
        point._positionVector.dir(selfDir + point.solid.dir);
    }

    Point.prototype.getRealX = function() {
        updatePositionVector(this);

        return this._positionVector.x();
    }

    Point.prototype.getRealY = function() {
        updatePositionVector(this);

        return this._positionVector.y();
    }

    Point.prototype.getRealForce = function() {
        updatePositionVector(this);

        var selfForceDir = this.force.dir();
        var newForceDir = selfForceDir + this.solid.dir;

        this._realForceVector.dir(newForceDir);
        this._realForceVector.dis(this.force.dis());

        return this._realForceVector;
    }

    window.Point = Point;
})();

