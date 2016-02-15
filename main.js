

var wd = window;
if (!wd.requestAnimationFrame) {
    wd.requestAnimationFrame =
    wd.webkitRequestAnimationFrame ||
    wd.mozRequestAnimationFrame ||
    wd.oRequestAnimationFrame ||
    wd.msRequestAnimationFrame ||
    function(cb, element) {
        wd.setTimeout(cb, 1000 / 60);
    };
}
var time, clock;
var ctnEl = document.getElementById('ctn');
var camera, scene, renderer;

var players = [];
var lights = [];
var scene_objects = [];

var winDims = [ctnEl.offsetWidth, ctnEl.offsetHeight];
var winHalfW = winDims[0] / 2;
var tick_count=0;
  var controls;
var stats;
var UP;
var DOWN;

var Key = {
    _pressed: {},

    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    SPACE: 32,

    isDown: function(keyCode) {
        return this._pressed[keyCode];
    },

    onKeydown: function(event) {
        event.preventDefault();
        this._pressed[event.keyCode] = true;
        return false;
    },

    onKeyup: function(event) {
        delete this._pressed[event.keyCode];
        return false;
    }
};



function onWindowResize( event ) {
 renderer.setSize( window.innerWidth, window.innerHeight );
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}


function init() {
    UP = new THREE.Vector3(0,0,1);
    DOWN = new THREE.Vector3(0,0,-1);

    clock = new THREE.Clock();;
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.bottom = '0px';
    stats.domElement.style.zIndex = 100;
    ctnEl.appendChild( stats.domElement );
    this.camera_distance = 500;
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 1000000);
    camera.position.z = this.camera_distance;
    camera.rotation.x = Math.PI/4;
    scene.add(camera);
/*controls = new THREE.TrackballControls( camera );
controls.target.set( 0, 1000, 0 );
controls.rotateSpeed = 1.0;
                controls.zoomSpeed = 1.2;
                controls.panSpeed = 0.8;

                controls.noZoom = false;
                controls.noPan = false;

                controls.staticMoving = false;
                controls.dynamicDampingFactor = 0.15;*/
    players.push(new player());

   /* var light1 = new light();
    light1.set_pos(-200, -200, 500);
    lights.push(light1);

    var light2 = new light();
    light2.set_pos(200, 200, 500);
    lights.push(light2);*/

    var lev = new level();
    scene_objects.push(lev);


    for (var i in players) {
        players[i].add_to_scene(scene)
    }

    for (var i in lights) {
        lights[i].add_to_scene(scene)

    }
    // add 'subtle' ambient lighting
    var ambientLight = new THREE.AmbientLight(0x888888);
    scene.add(ambientLight);

    for (var i in scene_objects) {
        scene_objects[i].add_to_scene(scene);
    }

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });

    renderer.shadowMapEnabled = true;
    renderer.shadowMapSoft = true;
    /*renderer.shadowMapBias = 0.0039;
    renderer.shadowMapDarkness = 0.5;
    renderer.shadowMapWidth = 1024;
    renderer.shadowMapHeight = 1024;*/
    renderer.setSize(winDims[0], winDims[1]);
    ctnEl.appendChild(renderer.domElement);
    window.addEventListener( 'resize', onWindowResize, false );
    window.addEventListener('keyup', function(event) {
        Key.onKeyup(event);
    }, false);
    window.addEventListener('keydown', function(event) {
        Key.onKeydown(event);
    }, false);
}


function update() {
    players[0].update()
    camera.position.x = players[0].model.position.x;
    camera.position.y = players[0].model.position.y-300;
    camera.position.z-=0.05*(camera.position.z - this.camera_distance - players[0].model.position.z);
      //this.camera_distance++;
     // camera.rotation.x *=0.99;

}

function tick() {

    requestAnimationFrame(tick);
    var now = new Date().getTime(),
        dt = now - (time || now);
    time = now;
   // controls.update();
   scene.updateMatrixWorld();
    update();
    stats.update();
    clock.getDelta()
    render();
    tick_count++;
}


function render() {
    renderer.render(scene, camera);
}


window.onload = function() {
init();
tick();
}