$(function(){
    var prevX, prevY, toolbarHeight=0;
    var colors = ['red','green','blue','yellow','orange','purple','teal','black','magenta'];
    var toolbar = $('#toolbar');
    var canvas = $("#canvas");
    var context = canvas.get(0).getContext("2d");
    var cache = [];

    $('html, body').on('touchstart touchmove', function(e){ 
         //prevent native touch activity like scrolling
         e.preventDefault(); 
    });

    $.get({url:'/js/draw.js', dataType:"text"}).done(initGlimpse);
    initToolbar();

    function initGlimpse(data) {
        // var options = {server:'http://localhost', port:3000, cache:true};
        var options = {cache:true};
        var  glimpse = new Glimpse("draw", data, options);
        glimpse.connect(start);
    }

    function start(err, socket) {
        var down = false;

        function onDown(e) {
            // console.log('down');
            down=true;
            prevX = undefined;
            prevY= undefined;
        }

        function onUp() {
            // console.log('up');
            down=false;
        }

        function onMove(e) {
            if(e && e.originalEvent && e.originalEvent.touches && e.originalEvent.touches.length > 0) {
                e = e.originalEvent.touches[0];
            }
            // console.log('move', e);
            if(!down) return;
            var currX = e.clientX;
            var currY = e.clientY - toolbarHeight;
            if(!prevX || !prevY) {
                prevX = currX;
                prevY = currY;
                return;
            }

            var data = {
                px: prevX,
                py: prevY,
                x: currX,
                y: currY,
                w: $(window).innerWidth(),
                h: $(window).innerHeight(),
                color: color
            };
            draw(data);
            socket.emit('update', data);
            cache.push(data);
            prevX = currX;
            prevY = currY;
        }

        function draw(data) {
            context.beginPath();
            context.moveTo(data.px, data.py);
            context.lineTo(data.x, data.y);
            context.strokeStyle = data.color;
            context.lineWidth = 2;
            context.stroke();
            context.closePath();            
        }

        function resize(e) {
            toolbarHeight = $('#toolbar').outerHeight();
            canvas.attr({
                width: $(window).innerWidth(),
                height: $(window).innerHeight() - toolbarHeight,
            }).css('marginTop', toolbarHeight+'px');
            cache.forEach(draw);
        }

        
        canvas.on('touchstart mousedown' , onDown);
        canvas.on('touchend mouseup touchcancel' , onUp);
        $(window).on('mouseup touchend touchcancel', onUp);
        canvas.on('touchmove mousemove' , onMove);
        $(window).on('resize', resize);

        resize();        

        $('#loading').fadeOut();
    }

    function initToolbar() {
        colors.forEach(function(color) {
            $('<div>').css({backgroundColor:color}).appendTo(toolbar);
        });
        $('#toolbar div').on('click touchstart', function(e) {
            e.preventDefault();
            e.stopPropagation();
            $('#toolbar div.active').removeClass('active');
            color = $(this).addClass('active').css('background-color');
        });
        $('#toolbar div').first().click();        
    }

});
