(function() {
    //Prototypes
    Number.prototype.degToRad = function(){return(this * Math.PI) / 180;}
    Number.prototype.radToDeg = function(){return(this * 180) / Math.PI;}
    Number.prototype.clearFloat = function(rank){
        if(!rank) rank = 1;
        if(Math.round(this) != this){
            if(Math.abs(Math.round(this) - this) < Math.pow(0.1, rank))
                return Math.round(this);
        }
        return this*1;
    }

    function Vector(args, arg2){
        var _this = {
            _objType: "vector",
            _x: null,
            _y: null,
            _dir: null,
            _dis: null,
            _xyToDirdis: function(){
                //по xy вектора устанавливает его dirdis
                if((this._x == 0) && (this._y == 0)){//вектор нулевой длины
                    this._dis = 0;
                    if(this._dir === null) this._dir = 0;
                }else{
                    this._dis = (Math.sqrt(Math.pow(this._x, 2) + Math.pow(this._y, 2))).clearFloat(8);
                    this._dir = ((Math.atan2(-this._y, this._x)).radToDeg()).clearFloat(8);
                }
            },
            _dirdisToXy: function(){
                if(this._dis == 0){
                    this._x = 0;
                    this._y = 0;
                }else{
                    this._x = (Math.cos((this._dir).degToRad())*this._dis).clearFloat(8);
                    this._y = (-Math.sin((this._dir).degToRad())*this._dis).clearFloat(8);
                }
            },
            x: function(arg){
                //устанавливает или возвращает x вектора
                if(typeof arg != 'undefined'){
                    this._x = arg;
                    this._xyToDirdis();
                    return this;
                }else{
                    return this._x;
                }
            },
            y: function(arg){
                //устанавливает или возвращает y вектора
                if(typeof arg != 'undefined'){
                    this._y = arg;
                    this._xyToDirdis();
                    return this;
                }else{
                    return this._y;
                }
            },
            dir: function(arg){
                //устанавливает или возвращает dir вектора
                if(typeof arg != 'undefined'){
                    this._dir = arg;
                    this._dirdisToXy();
                    return this;
                }else{
                    return this._dir;
                }
            },
            dis: function(arg){
                //устанавливает или возвращает dis вектора
                if(typeof arg != 'undefined'){
                    this._dis = arg;
                    this._dirdisToXy();
                    return this;
                }else{
                    return this._dis;
                }
            },
            set: function(args, arg2){
                if(typeof args != 'undefined'){
                    if((typeof args == 'number') && (typeof arg2 == 'number')){
                        this._x = args;
                        this._y = arg2;
                        this._xyToDirdis();
                    }else if(("x" in args) && ("y" in args)){
                        this._x = args.x;
                        this._y = args.y;
                        this._xyToDirdis();
                    }else if(("dir" in args) && ("dis" in args)){
                        this._dir = args.dir;
                        this._dis = args.dis;
                        this._dirdisToXy();
                    }else{
                        this._x = 0;
                        this._y = 0;
                        this._dir = 0;
                        this._dis = 0;
                    }
                }else{
                    this._x = 0;
                    this._y = 0;
                    this._dir = 0;
                    this._dis = 0;
                }
                return this;
            },
            add: function(args, arg2){
                //добавляет к этому вектору указанный вектор
                if(typeof args == 'object'){
                    if(args._objType != "vector")
                        args = vector(args);
                }else if((typeof args == 'number') && (typeof arg2 == 'number')){
                    args = vector(args, arg2);
                }else
                    return this;
                this._x += args.x();
                this._y += args.y();
                this._xyToDirdis();
                return this;
            },
            modify: function(args, arg2){
                if(typeof args == 'number') args = {dis: args};
                args = $.extend({
                    dir: this._dir,
                    dis: 1
                }, args);
                if(args.dis != 1){
                    this._dis *= args.dis;
                    this._dirdisToXy();
                }
                return this;
            },
            copy: function(){return vector(this.x(), this.y())},
            log: function(){return [this._x, this._y]},
            print: function(){
                console.log("vector", this._x, this._y);
                return this;
            },
            momentAtPoint: function(x0, y0){
//                var x1 = -x0,
//                    y1 = -y0,
//                    x2 = -x0 + this._x,
//                    y2 = -y0 + this._y;

                //Mz = xFy -yFx
                var Mz = (x0 * this._y) - (y0 * this._x);

                return Mz;

                //y-y1=(y2-y1)/(x2-x1)*(x-x1)=0
                //y-y1=D*(x-x1)=0
                //y-y1=D*x-D*x1=0
                //y-y1-(D*x)+(D*x1)=0
                //-(D*x)+(y)-(y1+D*x1)=0
                //(D*x)-(y)+(y1+D*x1)=0

                //D = (y2-y1)/(x2-x1)
                //C = (y1+D*x1)

                //l = mod(Ax+By+C) / sqrt(A*A + B*B)
                //l = mod(C) / sqrt(D*D + 1)

                var D = (y2-y1)/(x2-x1),
                    C = y1+D*x1,
                    l = Math.abs(C) / Math.sqrt(D*D + 1);

                return l;
            }
        }
        return _this.set(args, arg2);
    }

    window.Vector = Vector;
})();
