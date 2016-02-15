function object() {
    this.model;
    this.add_to_scene = function(scene) {
        scene.add(this.model);
    }
    this.set_pos = function(x, y, z) {
        this.model.position = {
            x: x,
            y: y,
            z: z
        };
    }
    this.update = function() {}
}