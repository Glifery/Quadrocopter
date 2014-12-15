(function() {
    function Physics() {
        this.solids = [];
        this.commonForces = [];
        this.frameSpeed = 50;
        this.everyFrameFn = everyFrameFn;

        setInterval(everyFrameFn.apply(this, []), this.frameSpeed);
    }

    function everyFrameFn() {
        var fps = 1 / this.frameSpeed;

        for (var index in this.solids) {
            for (var forceIndex in this.commonForces) {
                this.solids[index].vector.add(
                    this.commonForces[forceIndex].vector
                        .copy()
                        .modify(fps)
                );
            }

            this.solids[index].move(fps);
        }
    }

    window.Physics = Physics;
})();

