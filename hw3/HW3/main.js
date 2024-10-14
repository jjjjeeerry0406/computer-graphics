import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';
import { GLTFLoader } from 'GLTFLoader';
import { DRACOLoader } from 'DRACOLoader';
var render
var scene
var camera,camera1
var controls,controls1
var offsetx=110
var offsety=40
var offsetz=10
var tryval=16
var camid=1  //1 for first person perspective, 2 for third person perspective
function animateFrame()
{
    var light = scene.getObjectByName('MyPTlihght')
    var cc = scene.getObjectByName('lightRefPos')
    var cc1 = scene.getObjectByName('CameraRefPos')
    var cc2 = scene.getObjectByName('CameraPos')
  
    if (light)
    {        

        var pt = cc.position.clone()//get position from reference object
        var pt1 = cc1.position.clone()//get position from reference object       
        var ra = new THREE.Matrix4()        
        ra.makeRotationZ(Math.PI/180.0*1)        
        pt.applyMatrix4(ra)
        pt1.applyMatrix4(ra)

        //light position calculate
        var px=pt.x+offsetx      
        var py=pt.y+offsety
        var pz=pt.z+offsetz

        //camera position calculate
        var pcx=pt1.x+offsetx      
        var pcy=pt1.y+offsety
        var pcz=pt1.z-offsetz
        
        //reference position at (0,0,0), rotate axis=100 by cc's position.y
        cc.position.x = pt.x;
        cc.position.y = pt.y;
        cc.position.z = pt.z;

        //reference position at (0,0,0), rotate axis=60 by cc2's position.y
        cc1.position.x = pt1.x;
        cc1.position.y = pt1.y;
        cc1.position.z = pt1.z;

        //light position with axis=100
        light.position.x = px;
        light.position.y = py;
        light.position.z = pz;     
        
    

        cc2.position.x = pcx;
        cc2.position.y = pcy;
        cc2.position.z = pcz;
        cc2.lookAt(pcx,pcy,pcz)
        cc2.up.set(pcx-offsetx,pcy-offsety,pcz-offsetz)
        //camera position with axis=60(on the surface)
        camera.position.x = pcx;
        camera.position.y = pcy;
        camera.position.z = pcz;
        camera.lookAt(pcx,pcy,pcz)        
        camera.up.set(pcx-offsetx,pcy-offsety,pcz-offsetz)
        camera.rotateZ((Math.PI/180*45))
        camera.rotateX((Math.PI/180*360))
        camera.rotateY((Math.PI/180*90)) 
        //select camera
    if(camid==1)
    {
    //controls.update(); 
    render.render(scene,camera);//first person perspective
    }
    if(camid==2)
    {
    //controls1.update(); 
    render.render(scene,camera1);//third person perspective
    }
    }    
    
    requestAnimationFrame(animateFrame)
}

function main()
{
    //Scene (as globle var)
    scene = new THREE.Scene();
    var rb = new THREE.Matrix4()
    rb.makeRotationZ(Math.PI/180.0*1.0)
    
    //camera (as globle var)
    camera = new THREE.PerspectiveCamera(45, (window.innerWidth-16) / (window.innerHeight-16), 5, 100)
    camera.position.set(0,-100,500);

    camera1 = new THREE.PerspectiveCamera(45, (window.innerWidth-16) / (window.innerHeight-16), 5, 3000)
    camera1.position.set(0,-300,0);
    scene.add(camera);
    scene.add(camera1);
    var helper = new THREE.CameraHelper( camera );
    scene.add( helper )

    //material 
    var material = new THREE.MeshStandardMaterial({color: 0x888888, wireframe: false})

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath( '../lib/jsm/libs/draco/' );
    
    var loader = new GLTFLoader() 
    loader.setDRACOLoader( dracoLoader );
    
    loader.load('./Earth.glb', function(glb) {
       var Earth;
       
       glb.scene.traverse( function( node ) {
       if ( node.isMesh ) { node.castShadow = true; 
                            node.receiveShadow = false; }
            Earth = glb.scene 
       } );

       Earth.receiveShadow = true
       Earth.scale.setScalar( 1 );
       Earth.name = 'Earth'
       scene.add(glb.scene)
    })

    // Plane structure
    var planeGeometry = new THREE.PlaneGeometry(5000, 5000)
    var plane = new THREE.Mesh(planeGeometry, new THREE.MeshPhongMaterial({ color: 0x808080 }))
    plane.position.z = -50
    scene.add(plane)

    //reference objects
    const geometry = new THREE.BoxGeometry(10,10,10);
    var cube = new THREE.Mesh(geometry, material) 
    cube.position.set(0, 100, 10)
    cube.scale.setScalar(0);
    cube.name = 'lightRefPos'
    scene.add(cube)    
    
    const geometry1 = new THREE.BoxGeometry(5,10,15);
    var cube1 = new THREE.Mesh(geometry1, material) 
    cube1.scale.setScalar(0);
    cube1.position.set(0,70,25)
    cube1.name = 'CameraRefPos'
    scene.add(cube1)


    const geometry2 = new THREE.BoxGeometry(5,5,5);
    var cube2 = new THREE.Mesh(geometry2, material) 
    cube2.scale.setScalar(1);
    cube2.position.set(0,70,25)
    cube2.name = 'CameraPos'
    scene.add(cube2)
    //set light index
    var light = new THREE.PointLight( 0xffffff, 5, 3000, 0) 
    //light.position.set(1, -10, 45)
    light.scale.setScalar( 5.0 );
    light.castShadow = true
    light.shadow.mapSize.width = 512 
    light.shadow.mapSize.height = 512 
    light.shadow.camera.near = 10
    light.shadow.camera.far = 10000
    light.name = 'MyPTlihght'
    scene.add(light)
    
    //Render (as globle var)
    render = new THREE.WebGLRenderer();
    render.shadowMap.enabled = true;
    render.shadowMap.type = THREE.PCFSoftShadowMap;
    render.setClearColor(0x000000,1);
    render.setSize(window.innerWidth-16,window.innerHeight-16);

    document.body.appendChild(render.domElement);
    controls = new OrbitControls( camera, render.domElement);
    controls1 = new OrbitControls( camera1, render.domElement);

    addEventListener("resize",() => {
        camera.aspect = (window.innerWidth-tryval) / (window.innerHeight-tryval);
        camera.updateProjectionMatrix();
        render.setSize(window.innerWidth-16, window.innerHeight-16);
    },false);
    var axisHelper = new THREE.AxesHelper(100);
    scene.add(axisHelper);
    animateFrame();
}


main();