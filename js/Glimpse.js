var defaults = {
    server: 'https://glimpseserver.herokuapp.com',
    port: '443',

    /** Persist to DB - persistEvents: { "EventName" : ["Property", "Names", "To", "Persist"] } */
    persistEvents: {},
    /** Cache to memory */
    cache: false
}

var Glimpse = function(id, glimpseFile, options) {
    this.options = defaults;
    this.glimpseFile = glimpseFile;
    this.id = id;
    if(options) {
        for(var key in options) {
            if(options.hasOwnProperty(key)) this.options[key] = options[key];
        }
    }
}

Glimpse.prototype.connect = function(callback) {
    var glimpseFile = this.glimpseFile;
    var id = this.id;
    var persistEvents = this.options.persistEvents;
    var cache = this.options.cache;
    var socket = this.socket = io(this.options.server + ':' + this.options.port);

    socket.on('connect', function(){

        socket.emit('glimpse:create', {
            id: id,
            impl: glimpseFile,
            persistEvents: persistEvents,
            cache: cache
        });
        
        if(callback) {
            callback(null, socket);
            callback = undefined;
        }

    });
    
    socket.on('disconnect', function(){
        
    });    
}
