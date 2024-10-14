import * as THREE from 'three';
import { MTLLoader } from 'MTLLoader';
import { OBJLoader } from 'OBJLoader';
import { DRACOLoader } from 'DRACOLoader';
import { GLTFLoader } from 'GLTFLoader';
import { RGBELoader } from 'RGBELoader';
import { OrbitControls } from 'OrbitControls';

var render
var scene
var camera,camera1
var controls,controls1
var trackArray=[];//set array to store value in .xyz file 
var trackArraynumber=0;
var trackArraynumber1=1;
var camid=2
var stereoCam
var camlook=new THREE.Vector3
var camup=new THREE.Vector3
var ii=0
function animateFrame()
{
  //Get the object from scene
  var mesh = scene.getObjectByName('MyOBJ',true) 
  if (trackArraynumber < trackArray.length)     
  {
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //keyboard control taxi        
  window.addEventListener(
    "keydown",
    (event) => 
    {
    if (event.defaultPrevented) {
      return; // Do nothing if event already handled
    }
  
    switch (event.code) 
    {
    case "ArrowDown"://Execute when ArrowDown key is pressed
      trackArraynumber--;
      trackArraynumber1--;
      
    if( trackArraynumber<0)//when trackArraynumber=-1, change value to 559(because first value's number is 0) 
    {
    trackArraynumber=559;//after execute to data 560, will back to the last data
    }
    if(trackArraynumber1<0)///when trackArraynumber1=-1, change value to 559 
    {
    trackArraynumber1=559;
    }
    var exactPos1 = trackArray[trackArraynumber];//first position
    var nextPos1 = trackArray[trackArraynumber1];//next position
     const carNorVec1 = new THREE.Vector3
     (
       nextPos1.nx ,
       nextPos1.ny ,
       nextPos1.nz 
     )
     const CARoffset1 = new THREE.Vector3
     (
       -nextPos1.x+exactPos1.x ,
       -nextPos1.y+exactPos1.y ,
       -nextPos1.z+exactPos1.z
     )
    CARoffset1.cross(carNorVec1).normalize()//use cross product to calculate offse         
    var carPosition1 = new THREE.Vector3
    (
      nextPos1.x-(CARoffset1.x*8),
      nextPos1.y-(CARoffset1.y*8),
      nextPos1.z-(CARoffset1.z*8)
    )
    mesh.lookAt(carPosition1)//let car face on forward direction
    mesh.up.copy(carNorVec1)//let car can follow normal vector to rotate
    mesh.rotateX(-(Math.PI/2))//let car'roof can have same direction as the normal vector
    mesh.position.set(carPosition1.x,carPosition1.y,carPosition1.z)
    mesh.add(camera1)//let camera follow taxi
    camlook=carPosition1//output parameter for camera.lookAT
    camup=carNorVec1    //output parameter for camera.up 
    break;
  
  case "ArrowUp"://Execute when ArrowUp key is pressed
    trackArraynumber1++;
    trackArraynumber++;
  if( trackArray.length<= trackArraynumber+1)//because final data in .xyz is empty, +1 to ignore
  {
  trackArraynumber=0;//after execute to data 560, will back to the first data
  }
  if(trackArray.length<=trackArraynumber1+1)
  {
  trackArraynumber1=0;//after execute to data 560, will back to the second data
  } 
    var exactPos = trackArray[trackArraynumber];//first position
    const nextPos = trackArray[trackArraynumber1];//next position
    const carNorVec = new THREE.Vector3
     (
       exactPos.nx ,
       exactPos.ny ,
       exactPos.nz 
     )
    const CARoffset = new THREE.Vector3
     (
       nextPos.x-exactPos.x ,
       nextPos.y-exactPos.y ,
       nextPos.z-exactPos.z
     )
    CARoffset.cross(carNorVec).normalize()//use cross product to calculate offse         
    var carPosition = new THREE.Vector3
    (
     exactPos.x+(CARoffset.x*8),
     exactPos.y+(CARoffset.y*8),
     exactPos.z+(CARoffset.z*8)
    )
    mesh.lookAt(carPosition)//let car face on forward direction
    mesh.up.copy(carNorVec)//let car can follow normal vector to rotate
    mesh.rotateX(-(Math.PI/2))//let car'roof can have same direction as the normal vector
    mesh.position.set(carPosition.x,carPosition.y,carPosition.z)
    mesh.add(camera1)//let camera follow taxi
    
    camlook=carPosition//output parameter for camera.lookAT
    camup=carNorVec    //output parameter for camera.up              
    break;  
	  }	
	  if (event.code !== "Tab") 
        {                 
        event.preventDefault();//detect keydown on time
        }   
    },
    true,
  );            
  }       
  
  camera1.position.set(0,170,100)
  camera1.lookAt(camlook)//camera will keep looking to taxi's forward direction         
  camera1.up.copy(camup)
  camera1.rotateZ((Math.PI/180*180))
  camera1.rotateX((Math.PI/180*160))           
  camera1.rotateY((Math.PI/180*180))
 controls1.update();    
 if(camid==1)//Switch perspective
 {
 render.render(scene,camera)//view as eagle 
 }
 if(camid==2)//view as vr headset
 {
 var size = new THREE.Vector2();
 render.getSize(size);
 stereoCam.update( camera1 );   
 render.setScissorTest(true);
 render.setScissor(0, 0, size.width / 2, size.height);
 render.setViewport(0, 0, size.width / 2, size.height);
 render.render(scene, stereoCam.cameraL);
 render.setScissor(size.width / 2, 0, size.width / 2, size.height);
 render.setViewport(size.width / 2, 0, size.width / 2, size.height);
 render.render(scene, stereoCam.cameraR);
 render.setScissorTest(false);
 }
  requestAnimationFrame(animateFrame);
}

function main()
{
    //Scene (as globle var)
    scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(45, (window.innerWidth-16) / (window.innerHeight-16), 5, 1000)
      camera.position.set(0,0,500);
      camera1 = new THREE.PerspectiveCamera(45, (window.innerWidth-16) / (window.innerHeight-16), 5, 1000)
      var helper = new THREE.CameraHelper( camera1 );
      scene.add( helper );
      camera1.updateMatrixWorld()
      
      stereoCam = new THREE.StereoCamera()

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //load obj
    //Mesh (still local var, we will retrive it by getObjectByName)
    new MTLLoader().load( './TaxiCar.mtl', function ( materials ) 
    {
		materials.preload();
		new OBJLoader()
			.setMaterials( materials )
			.load( './TaxiCar.obj', function ( object ) {
        object.name = 'MyOBJ'                             
        object.scale.setScalar(0.5);//set taxi size
        scene.add( object );} );
			} );
 
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //load GLB
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath( '../lib/jsm/libs/draco/' );
    var loader = new GLTFLoader() 
    loader.setDRACOLoader( dracoLoader );
    loader.load('./MarioKartStadium.glb', function(glb) 
    {
       var mesh = glb.scene 
       mesh.name = 'MyGLTF'
       scene.add(mesh)
    })

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //load xyz   
   fetch('TrackCenter.xyz')//import .xyz file
   .then(value => value.text())//change value to text
   .then(text =>
    {
        var arrValue = text.split('\n')  // split into lines
      .map(line => line
        .split(' ')                 // split by ' '
        .map(Number))               // and parse the parts to numbers
      .map(([ x, y, z,nx,ny,nz]) => ({  x, y, z,nx,ny,nz }));//name every data in array
      trackArray=arrValue // create objects from the arrays
      
    });
  
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //load hdr file for background texture
    new RGBELoader().load( 'industrial_sunset_puresky_1k.hdr', function ( texture ) {//import hdr file

        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.background = texture;
        scene.environment = texture;//change enviorment to hdr

    } );

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    var axisHelper = new THREE.AxesHelper(100);
    var light = new THREE.PointLight( 0xffffff, 5, 10000, 0.05)
    light.name = 'Mylihght'
    light.position.set(100, -75, 300)
    light.castShadow = true
    light.shadow.mapSize.width = 512 
    light.shadow.mapSize.height = 512 
    light.shadow.camera.near = 10
    light.shadow.camera.far = 10000  

    scene.add(camera);
    scene.add(camera1);
    scene.add(axisHelper);
    scene.add(light)

    //Render (as globle var)
    
    render = new THREE.WebGLRenderer();
    render.setClearColor(0x888888,1);
    render.setSize(window.innerWidth-16,window.innerHeight-16);
    document.body.appendChild(render.domElement);
    controls = new OrbitControls( camera, render.domElement);
    controls1 = new OrbitControls( camera1, render.domElement);
    controls.target = new THREE.Vector3(0,0,90)
    controls1.target = new THREE.Vector3(0,0,90)

    addEventListener("resize",() => {
        camera1.aspect = (window.innerWidth-16) / (window.innerHeight-16);
        camera1.updateProjectionMatrix();
        render.setSize(window.innerWidth-16, window.innerHeight-16);
    },false);
    
    animateFrame();
}
main();
