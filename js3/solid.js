(function() {
    function Solid() {
        this.cx = 0;
        this.cy = 0;
        this.dir = 0;
        this.forces;
        this.points = [];

        this.vector = new Vector();
        this.moment = 0;
    }

    Solid.prototype.move = function() {
        calculate(this);
        replace(this);
        redraw(this);
    }

    function calculate(solid) {
        //calculate moment of forces
        for (var index in solid.forces) {
            var realVector = solid.forces[index].point.getRealForce();

            if (index == 0) {
                realVector.dis(accelerate[81]);
            } else {
                realVector.dis(accelerate[87]);
            }

            solid.moment += realVector.momentAtPoint(-dots[index].point.getRealX(), -dots[index].point.getRealY())
            solid.vector.add(realVector);
        }
    }

    window.Solid = Solid;
})();

