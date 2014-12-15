(function() {
    function Force(vector) {
        this.accelVector = vector;
        this.modificator = 1;

        this.mainVector = new Vector(0, 0);
    }

    Force.prototype.getAccelVector = function() {
        this.mainVector.dir(this.accelVector.dir());
        this.mainVector.dis(this.accelVector.dis() * this.modificator);

        return this.mainVector
    }

    window.Force = Force;
})();

