
player.prototype = new object();
player.prototype.contructor = player;

function player() {

    var face1 = new THREE.Face3(0, 1, 2);
    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(0, 100.0, 0.0));
    geometry.vertices.push(new THREE.Vector3(50, 0, 0.0));
    geometry.vertices.push(new THREE.Vector3(-50, 0, 0.0));
    geometry.faces.push(face1);
    geometry.computeFaceNormals();
    var material =
    new THREE.MeshLambertMaterial({
         ambient: 0x333333, color: 0xff0000, specular: 0xffffff, shininess: 50
    });

    this.model = new THREE.Mesh(geometry, material);
    this.model.position.z =100;
    this.model.castShadow = true;
    this.model.doubleSided = true;


    this.rotation = {
        x: 0,
        y: 0,
        z: 0
    }

    this.trajectory = new THREE.Vector3(0, 0, 0);

    this.hover = 100;
    this.thrust = 0;
    this.max_speed = 25;
    this.rot_coeff = 0.05;
    this.thrust_vector = new THREE.Vector3(0.0, 0.0, 0.0);

    this.emitters = [new emitter()];
    this.lights = [new light()];
    this.lights[0].model.target = this.model;


    this.rot_matrix = new THREE.Matrix4();
    this.mass = 100;
    this.ray = new THREE.Ray();
    this.ray.origin = this.model.position;



    this.add_to_scene = function(scene) {
        for (var i in this.emitters) {
            this.emitters[i].add_to_scene(scene);
        }
        for (var i in this.lights) {
            this.lights[i].add_to_scene(scene);
        }
        scene.add(this.model);
    }

    console.log(this.lights[0].model);

    this.update = function() {
        var rot;
        // UPDATE INPUT FIRST
        this.thrust = 0;
        if(this.trajectory.lengthSq())
            this.trajectory.multiplyScalar(0.999);
        if (Key.isDown(Key.UP)) this.thrust =1;
        if (Key.isDown(Key.LEFT)) this.rotation.z += 1 * this.rot_coeff;
        if (Key.isDown(Key.DOWN)) this.thrust =-1;
        if (Key.isDown(Key.RIGHT)) this.rotation.z += -1 * this.rot_coeff;
        if (Key.isDown(Key.SPACE)) this.stop();

        //if (this.thrust > this.thrust_max) this.thrust = this.thrust_max;

        this.thrust_vector.set(0, this.thrust, 0);
        this.rot_matrix.makeRotationZ(this.rotation.z);
        this.rot_matrix.multiplyVector3(this.thrust_vector);

        this.trajectory.addSelf(this.thrust_vector);
        this.model.rotation.z = this.rotation.z;

        if(this.trajectory.lengthSq() > this.max_speed * this.max_speed){
            this.trajectory.setLength(this.max_speed)
        }
        this.model.position.addSelf(this.trajectory);

    this.ray_test = function(){
            this.ray.direction = DOWN;
            var intersects = this.ray.intersectObject(scene_objects[0].model);

            if ( !intersects.length){
                this.ray.direction = UP;
                intersects = this.ray.intersectObject(scene_objects[0].model).length
                if(intersects.length)
                    this.model.position.z+=intersects[0].distance+10;;
            }
            else if(intersects[0].distance < 50){
                this.model.position.z+= 50-  intersects[0].distance ;
            }
            else{
              this.model.position.z--;
            }
        }
    var dist = scene_objects[0].height_difference(this.model.position) - this.hover;

        for (var i in this.emitters) {
            if(this.thrust) this.emitters[i].start();
            else this.emitters[i].stop();
            this.emitters[i].position.copy(this.model.position);
            this.emitters[i].update();
        }

        for (var i in this.lights) {
            this.lights[i].model.position.copy(this.model.position);
            this.lights[i].model.position.z+= 200;
           // this.lights[i].update();

        }

    }


    this.stop = function() {
        that.rotation = {
            x: 0,
            y: 0,
            z: 0
        };
    }
}
