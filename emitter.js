



emitter.prototype = new object();
emitter.prototype.contructor = emitter;

function emitter() {

    this.position = new THREE.Vector3(0, 0, 0);   

    var STAR_X=10000, STAR_Y=10000, STAR_Z=10000;
    var STAR = new THREE.Vector3(STAR_X, STAR_Y, STAR_Z);  
    var canvas = document.createElement("canvas");
    var size = 16;
    var color = "#ff0000";
    var context = canvas.getContext("2d");
    canvas.width = size
    canvas.height = size;
    context = canvas.getContext("2d");
    var texture = new THREE.Texture(canvas);
    var radgrad = context.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    radgrad.addColorStop(0, '#A7990C');
    radgrad.addColorStop(0.9, '#FF9962');
    radgrad.addColorStop(1, 'rgba(255,65,98,0)');
    context.fillStyle = radgrad;
    context.fillRect(0, 0, size, size);

    texture.needsUpdate = true;


   var material = new THREE.ParticleBasicMaterial({
        color: 0xFFFFFF,
        size: size,
        map: texture,
        blending: THREE.AdditiveBlending,
        transparent: true
    });

    var particle_count = 10000;
    var particle_max = 10000;
    
    var particles = new THREE.Geometry();
    var attributes = new Array();

    
    var pool_unused = [];
    var pool_used = [];


    for (var p = 0; p < particle_count; p++) {
        particle = STAR.clone();    
        particles.vertices.push(particle);
        var attribute = {ttl: 0, 
                         direction: new THREE.Vector3(
                            0,0,0)};
        attributes.push(attribute);
        pool_unused.push([particle, attribute]);
    }

    this.model = new THREE.ParticleSystem(particles, material);
    this.model.sortParticles = true; 

    this.going  = false;

    this.start = function(){
        this.going = true;
    }

    this.stop = function(){
        this.going = false;
    }

    this.update = function() {
        if(this.going){
    
            if(pool_used.length < particle_max){
                var i = 0;
                while(i < 20 && pool_used.length < particle_max){
                var part_tup = pool_unused.pop();
                part_tup[0].copy(this.position);
                part_tup[0].x+=Math.random()*20-10;
                part_tup[0].y+=Math.random()*20-10;
                part_tup[0].z+=Math.random()*20-10;
                part_tup[1].direction.x=Math.random()*2-1;
                part_tup[1].direction.y=Math.random()*2-1;
                part_tup[1].direction.z=Math.random()*2-1;
                part_tup[1].ttl=Math.round(Math.random()*20+5);
                pool_used.push(part_tup);
                i++;
                }
            }
        }
        for (var p = pool_used.length-1; p>=0; p--){
            var part_tup = pool_used[p];
            part_tup[1].ttl--;
            if(!part_tup[1].ttl){
               pool_used.shift(p);
               part_tup[0].copy(STAR);
               pool_unused.push(part_tup);
            }
            else{
            part_tup[0].addSelf(part_tup[1].direction);
}
        }
        this.model.geometry.__dirtyVertices = true;
    }
}
