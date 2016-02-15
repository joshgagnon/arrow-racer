level.prototype = new object();
level.prototype.contructor = level;

function level() {
    function generateHeight(width, height) {
        var size = width * height,
            data = new Float32Array(size),
            perlin = new ImprovedNoise(),
            quality = 1,
            z = Math.random() * 100;
        for (var i = 0; i < size; i++) {
            data[i] = 0
        }
        for (var j = 0; j < 4; j++) {
            for (var i = 0; i < size; i++) {
                var x = i % width,
                    y = ~~(i / width);
                data[i] += Math.abs(perlin.noise(x / quality, y / quality, z) * quality * 1.75);
            }
            quality *= 5;
        }
        return data;
    }


    var canvas = document.createElement("canvas");
    var mesh_width = 2 << 12;
    var vertices_width = mesh_width / (2 << 7);
    var vp_ratio = mesh_width / vertices_width;
    var width = 128;
    var size = mesh_width / (2 << 7);
    var color = "#ff0000";
    var context = canvas.getContext("2d");
    canvas.width = vertices_width;
    canvas.height = vertices_width;
    context = canvas.getContext("2d");
    var texture = new THREE.Texture(canvas);
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, size, size);
    context.fillStyle = "#000000";

    var step = size / 2;
    var flip = true;
    for (var i = 0; i < size; i += step) {
        for (var j = 0; j < size; j += step) {
            if (flip) {
                context.fillRect(i, j, step, step);
            }
            flip = !flip;
        }
        flip = !flip;
    }

    texture.needsUpdate = true;
    texture.wrapT = THREE.RepeatWrapping;
    texture.wrapS = THREE.RepeatWrapping;
    texture.repeat.set(width, width);

    var material = new THREE.MeshPhongMaterial({
        ///map: texture,
        wireframe: true,
        transparent: true,
        opacity: 0.1
    });


    var geo = new THREE.PlaneGeometry(mesh_width, mesh_width, vertices_width - 1, vertices_width - 1);

    this.height_data = generateHeight(vertices_width, vertices_width);


    this.height_scale = 16;
    for (var i = 0, l = geo.vertices.length; i < l; i++) {
        // geo.vertices[ i ].y = this.height_data[ i ] * this.height_scale;
    }

    geo.computeCentroids();
    geo.computeFaceNormals();

    this.model = new THREE.Mesh(geo, material);
    this.model.rotation.x = Math.PI / 2;
    this.z_offset = -500;
    this.hover = 100;
    this.model.position.z = this.z_offset;
    this.model.updateMatrix()
    this.model.receiveShadow = true;

    var offset;
    console.log(this.model);

    var test_face = new THREE.Face4(0, 1, 2, 3);

    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3());
    geometry.vertices.push(new THREE.Vector3());
    geometry.vertices.push(new THREE.Vector3());
    geometry.vertices.push(new THREE.Vector3());
    geometry.computeFaceNormals();
    geometry.computeCentroids();
    geometry.faces.push(test_face);
    geometry.dynamic = true;
    this.test_mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
        ambient: 0x333333,
        color: 0x0000ff
    }));
    this.test_mesh.doubleSided = true;
    this.test_mesh.rotation = this.model.rotation;
    this.test_mesh.position = this.model.position;
    // this.test_mesh.rotation.x = Math.PI / 2;
    //this.test_mesh.position.z+=this.z_offset + 5;
    this.test_ray = new THREE.Ray();


    console.log(this.test_ray);
    console.log(this.test_face);



    this.height_difference = function(position) {
        var x = (position.x + mesh_width / 2) / vp_ratio + 0.5;
        var y = (position.y + mesh_width / 2) / vp_ratio + 0.5;
        var result;
        y = vertices_width + 1 - y;

        return;
        this.test_mesh.geometry.vertices[0].copy(this.model.geometry.vertices[Math.floor(x) + Math.floor(y) * vertices_width])
        this.test_mesh.geometry.vertices[1].copy(this.model.geometry.vertices[Math.floor(x - 1) + Math.floor(y) * vertices_width])
        this.test_mesh.geometry.vertices[2].copy(this.model.geometry.vertices[Math.floor(x - 1) + Math.floor(y - 1) * vertices_width])
        this.test_mesh.geometry.vertices[3].copy(this.model.geometry.vertices[Math.floor(x) + Math.floor(y - 1) * vertices_width])



        var geometry = new THREE.Geometry();
        var material = new THREE.LineBasicMaterial({
            color: 0x0000ff,
        });
        var a = new THREE.Vector3();
        a.copy(position);
        var b = new THREE.Vector3();
        b.copy(position);
        var d = new THREE.Vector3();
        d.copy(DOWN);
        d.setLength(600);
        b.addSelf(d)
        geometry.vertices.push(a);
        geometry.vertices.push(b);

        var line = new THREE.Line(geometry, material);
        scene.add(line);

        // console.log(this.test_ray.direction.x,this.test_ray.direction.y,this.test_ray.direction.z);
        this.test_mesh.geometry.computeFaceNormals();
        this.test_mesh.geometry.computeCentroids();
        this.test_mesh.geometry.normalsNeedUpdate = true;
        this.test_mesh.geometry.verticesNeedUpdate = true;

        this.test_ray.origin.copy(position);
        this.test_ray.direction.copy(DOWN);
        var vector = new THREE.Vector3();
        var normal = new THREE.Vector3();

        var dot = 0;
        var precision = 0.0001;
        var scalar = 0;
        var face = this.test_mesh.geometry.faces[0];
        var objMatrix = this.model.matrixWorld;


        vector = objMatrix.multiplyVector3(vector.copy(face.centroid)).subSelf(this.test_ray.origin);
        normal = this.model.matrixRotationWorld.multiplyVector3(normal.copy(face.normal));
        dot = this.test_ray.direction.dot(normal);


        if (Math.abs(dot) < precision) return 0;

        // calc distance to plane

        scalar = normal.dot(vector) / dot;

        // if negative distance, then plane is behind ray
        // bail if ray and plane are parallel

        if (scalar < 0) return scalar;

        var a = new THREE.Vector3();
        var b = new THREE.Vector3();
        var c = new THREE.Vector3();
        var d = new THREE.Vector3();
        var intersectPoint = new THREE.Vector3()
        var vertices = this.test_mesh.geometry.vertices;
        a = objMatrix.multiplyVector3(a.copy(vertices[face.a]));
        b = objMatrix.multiplyVector3(b.copy(vertices[face.b]));
        c = objMatrix.multiplyVector3(c.copy(vertices[face.c]));
        d = objMatrix.multiplyVector3(d.copy(vertices[face.d]));
        intersectPoint.add(this.test_ray.origin, this.test_ray.direction.normalize().multiplyScalar(scalar));
       // console.log(intersectPoint, this.test_ray.origin.distanceTo(intersectPoint));
       // console.log(dot > 0, pointInFace3(intersectPoint, a, b, d), pointInFace3(intersectPoint, b, c, d));
        if (dot > 0 && pointInFace3(intersectPoint, a, b, d) || pointInFace3(intersectPoint, b, c, d)) {
            console.log(intersectPoint, this.test_ray.origin.distanceTo(intersectPoint));

            return this.test_ray.origin.distanceTo(intersectPoint);
        }
        console.log("fail");

        return 0;
    }

    this.add_to_scene = function(scene) {
        scene.add(this.test_mesh);
        scene.add(this.model);
    }
}