  function Glimpse(options) {
    this.element = options.element;
    this.host = options.host;
    this.data = options.data;
    this.init();
}

Glimpse.prototype.init = function() {
    this.canvas = $('<canvas>').appendTo(this.element);
    this.context = this.canvas.get(0).getContext("2d");

    this.host.on('update', this.update.bind(this));
    this.redraw();
}

Glimpse.prototype.update = function(data, redraw) {
    this.context.beginPath();
    this.context.moveTo(data.px, data.py);
    this.context.lineTo(data.x, data.y);
    this.context.strokeStyle = data.color;
    this.context.lineWidth = 2;
    this.context.stroke();
    this.context.closePath();
    if(redraw !== true) this.data.update.push(data);
}

Glimpse.prototype.redraw = function() {
    if(this.data && Array.isArray(this.data.update)) {
        var _this = this;
        this.data.update.forEach(function(data) {
            _this.update.call(_this, data, true)
        });
    } else {
        this.data = {update:[]};
    }    

}

Glimpse.prototype.resize = function (viewport) {
    this.canvas.attr({
        width: viewport.width,
        height: viewport.height
    });
    this.redraw();
}