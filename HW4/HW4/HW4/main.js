import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';

var render
var scene
var cam
var controls



function animateFrame()
{
    var light = scene.getObjectByName('MyPTlihght')
    if (light)
    {
        var pt = light.position.clone()
        var ra = new THREE.Matrix4()
        ra.makeRotationY(Math.PI/180.0*1.0)
        pt.applyMatrix4(ra)
        light.position.x = pt.x;
        light.position.y = pt.y;
        light.position.z = pt.z;
    }
   
    controls.update();    
    render.render(scene,cam);
    requestAnimationFrame(animateFrame)
}

function main()
{
    //Scene (as globle var)
    scene = new THREE.Scene();

    //camera (as globle var)
    var val=1//val=0 is iny planet,val=1 is crystal ball
    if(val==0)
    {
    //tiny planet
    cam = new THREE.PerspectiveCamera(500, (window.innerWidth-500) / (window.innerHeight-500), 5, 10000)
    cam.position.set(3.1739571284380563,  501.032586688874,  0.8967805773857442);
    }
    else if(val==1)
    {
    //crystal
    cam = new THREE.PerspectiveCamera(100, (window.innerWidth-16) / (window.innerHeight-16), 5, 3000)
    cam.position.set( 0.0004229197285956807,  608.6023766513052,  0.00040219512180204186);
    }   
    scene.add(cam);

    //load 360 photo
    var imgTexture = new THREE.TextureLoader().load('20230704_095421.jpg')
    //creat sphere and put texture on it
    var sphereGeometry = new THREE.SphereGeometry(500, 64, 32);
    var sphereMat = new THREE.MeshBasicMaterial({ map: imgTexture });
    //sphereMat.side = THREE.DoubleSide;
    sphereMat.side = THREE.BackSide;//render inner surface of sphere
    var sphere = new THREE.Mesh(sphereGeometry, sphereMat);
    sphere.position.set(0,0,0)
    sphere.scale.x = -1;
    scene.add(sphere);
    
    //light
    var light = new THREE.PointLight( 0xffffff, 10, 1000, 0.01)
    light.name = 'MyPTlihght'
    light.position.set(100, 500, 300)
    scene.add(light)

    //Render (as globle var)
    render = new THREE.WebGLRenderer();
    render.shadowMap.enabled = true;
    render.shadowMap.type = THREE.PCFSoftShadowMap;
    render.setClearColor(0x888888,1);
    render.setSize(window.innerWidth-16,window.innerHeight-16);

    //set orbit control
    document.body.appendChild(render.domElement);
    controls = new OrbitControls( cam, render.domElement);
    controls.target = new THREE.Vector3(0,25,0)

    addEventListener("resize",() => {
        cam.aspect = (window.innerWidth-16) / (window.innerHeight-16);
        cam.updateProjectionMatrix();
        render.setSize(window.innerWidth-16, window.innerHeight-16);
    },false);
   
    animateFrame();
}
main();