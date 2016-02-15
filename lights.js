


light.prototype = new object();
light.prototype.contructor = light;

function light() {
    this.model = new THREE.SpotLight(0xffffff, 5, 100);
    this.model.castShadow = true;
    this.model.shadowDarkness = 0.4;
    //this.model.shadowCameraVisible = true;
}
