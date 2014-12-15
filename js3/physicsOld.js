//physics
physics = function(args){
    var _this = $.extend({
        el: null,
        params: null,
        vector: vector(),//вектор скорости за секунду, по которому будет двигаться объект
        accel: vector(),
        speed: vector(),
        vectors: [],//массив векторов, которые накладываются на вектор скорости
        controlMap: {},
        _moveHandler: function(args){return args},//функция, выполняющаяся каждый move
        setMoveHandler: function(func){
            this._moveHandler = $.proxy(func, this);
            return this;
        },
        move: function(args){
            args = $.extend({
                speed: 1,
                gravity: vector(),
                friction: 0,
                damp: 0
            }, args);
            //выполняем функцию
            args = this._moveHandler(args);
            if(args === false)//завершить движение если обработчик вернул false
                return this;
            if(this.params.physicMode == "vector"){
                //обрабатываем события клавиатуры
                if(typeof this.controlMap == 'object'){
                    for(var keyNam in this.controlMap){
                        if(keyController.pressed(keyNam))
                            this.vector.add(vector(this.controlMap[keyNam]).modify(args.speed));
                    }
                }
                //формируем окончательный вектор движения
                for(var index in this.vectors){
                    this.vector.add(this.vectors[index].copy().modify(args.speed));
                }
                //гравитация
                if(args.gravity.dis())
                    this.vector.add(args.gravity.copy().modify(args.speed));
                //трение
                if(args.friction){
                    if(this.vector.dis() > args.friction*args.speed){
                        this.vector.add({
                            dir: this.vector.dir()+180,
                            dis: args.friction*args.speed
                        });
                    }else{
                        this.vector.dis(0);
                    }
                }
                //затухание
                if(args.damp)
                    this.vector.modify(1 - (args.damp * args.speed));
                //передвигаем объект по вуктору
                this.params.cx += this.vector.x() * args.speed;
                this.params.cy += this.vector.y() * args.speed;
                this.el.attr({
                    cx: this.params.cx,
                    cy: this.params.cy
                })
            }else if(this.params.physicMode == "accel"){
                //обрабатываем события клавиатуры
                if(typeof this.controlMap == 'object'){
                    for(var keyNam in this.controlMap){
                        if(keyController.pressed(keyNam))
                            this.accel.add(this.controlMap[keyNam]);
                    }
                }
                //формируем окончательный вектор ускорения
                for(var index in this.vectors){
                    this.accel.add(this.vectors[index]);
                }
                //гравитация
                if(args.gravity.dis())
                    this.accel.add(args.gravity);
                //трение
                var effectSpeed = this.speed.copy().modify(args.speed);
                if(args.friction && this.speed.dis()){
                    var effectFriction = vector({dir: 0, dis: args.friction}).modify((args.speed*args.speed)/2);
                    if(effectFriction.dis() > effectSpeed.dis()){
                        this.speed.set();
                        effectSpeed.set();
                    }else{
                        this.accel.add({
                            dir: this.speed.dir()+180,
                            dis: args.friction
                        });
                    }
                }
                //затухание НЕ РЕАЛИЗОВАНО
                //if(args.damp)
                //   this.speed.modify(1 - (args.damp * args.speed));

                //расчитываем эффективные значения скорости и ускорения
                //newCoords = oldCoords + moveVector
                //newCoords = oldCoords + effectSpeed + effectAccel
                //newCoords = oldCoords + (speedVector * speed) + (accelVector * speed^2/2)
                var effectAccel = this.accel.copy().modify((args.speed*args.speed)/2);
                //var effectSpeed = this.speed.copy().modify(args.speed);
                var moveVector = effectSpeed.copy().add(effectAccel);
                //передвигаем объект по вектору
                this.params.cx += moveVector.x();
                this.params.cy += moveVector.y();
                this.el.attr({
                    cx: this.params.cx,
                    cy: this.params.cy
                })
                //console.log("M S A :", moveVector.dis(), this.speed.dis(), this.accel.dis());
                //console.log("M eS eA :", moveVector.dis(), effectSpeed.dis(), effectAccel.dis());
                //добавляем ускорение к вектору движения
                this.speed.add(this.accel.copy().modify(args.speed));
                //обнуляем вектор ускорения
                this.accel.set();
            }
            return this;
        }
    }, args);
    return _this;
}