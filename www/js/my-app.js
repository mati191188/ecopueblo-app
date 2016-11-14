// Initialize app
var myApp = new Framework7();

// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true,    
    tapHold: true,
});

$$(document).on('deviceready', function() {
    console.log("Device is ready!");
});

myApp.onPageAfterAnimation('recorrido1', function (page) {})
myApp.onPageAfterAnimation('recorrido2', function (page) {})
myApp.onPageAfterAnimation('recorrido3', function (page) {})
myApp.onPageAfterAnimation('recorrido4', function (page) {})

myApp.onPageAfterBack('recorrido1', function (page) {})
myApp.onPageAfterBack('recorrido2', function (page) {})
myApp.onPageAfterBack('recorrido3', function (page) {})
myApp.onPageAfterBack('recorrido4', function (page) {})

$$(document).on('pageInit', function (e) {
    
    var page = e.detail.page;
})

$$(document).on('pageAfterAnimation',function(e){

    var page= e.detail.page;
    var img_name = null;

    if(page.name === 'recorrido1')
        var img_name = "img/360/01.jpg";

    if(page.name === 'recorrido2')
        var img_name = "img/360/02.jpg";

    if(page.name === 'recorrido3')
        var img_name = "img/360/03.jpg";

    if(page.name === 'recorrido4')
        var img_name = "img/360/04.jpg";

    if(page.name === 'recorrido1' || page.name === 'recorrido2' || page.name === 'recorrido3' || page.name === 'recorrido4'){

        var manualControl = false;
        var longitude = 0;
        var latitude = 0;
        var savedX;
        var savedY;
        var savedLongitude;
        var savedLatitude;					

        // setting up the renderer
        renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);        
        $$(".page-content").append(renderer.domElement);        
        $$(".page-content").css("padding-top", "0px");
        $$(".page-content").css("padding-bottom", "0px");
        $$(".page-content").css("overflow", "inherit");        
        $$("canvas").css("width", "100%");
        $$("canvas").css("height", "100%");
        
        // creating a new scene
        var scene = new THREE.Scene();
        
        // adding a camera
        var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
        camera.target = new THREE.Vector3(0, 0, 0);

        // creation of a big sphere geometry
        var sphere = new THREE.SphereGeometry(100, 100, 40);
        sphere.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));

        // creation of the sphere material
        var sphereMaterial = new THREE.MeshBasicMaterial();        
        sphereMaterial.map = THREE.ImageUtils.loadTexture(img_name)
        
        // geometry + material = mesh (actual object)
        var sphereMesh = new THREE.Mesh(sphere, sphereMaterial);
        scene.add(sphereMesh);

        // listeners
        document.addEventListener("mousedown", onDocumentMouseDown, false);
        document.addEventListener("mousemove", onDocumentMouseMove, false);
        document.addEventListener("mouseup", onDocumentMouseUp, false);      

        document.addEventListener("touchstart", onDocumentTouchDown, false);
        document.addEventListener("touchmove", onDocumentTouchMove, false);
        document.addEventListener("touchend", onDocumentTouchUp, false);               
						
        render();
            
        function render(){
            
            requestAnimationFrame(render);
            
            if(!manualControl){
                longitude += 0.1;
            }

            // limiting latitude from -85 to 85 (cannot point to the sky or under your feet)
            latitude = Math.max(-85, Math.min(85, latitude));

            // moving the camera according to current latitude (vertical movement) and longitude (horizontal movement)
            camera.target.x = 500 * Math.sin(THREE.Math.degToRad(90 - latitude)) * Math.cos(THREE.Math.degToRad(longitude));
            camera.target.y = 500 * Math.cos(THREE.Math.degToRad(90 - latitude));
            camera.target.z = 500 * Math.sin(THREE.Math.degToRad(90 - latitude)) * Math.sin(THREE.Math.degToRad(longitude));
            camera.lookAt(camera.target);

            // calling again render function
            renderer.render(scene, camera);
            
        }
                
        // when the mouse is pressed, we switch to manual control and save current coordinates
        function onDocumentMouseDown(event){

            event.preventDefault();

            manualControl = true;

            savedX = event.clientX;
            savedY = event.clientY;

            savedLongitude = longitude;
            savedLatitude = latitude;

        }
        
        function onDocumentTouchDown(event){

            event.preventDefault();

            manualControl = true;

            savedX = event.clientX;
            savedY = event.clientY;

            savedLongitude = longitude;
            savedLatitude = latitude;

        }

        // when the mouse moves, if in manual contro we adjust coordinates
        function onDocumentMouseMove(event){

            if(manualControl){
                longitude = (savedX - event.clientX) * 0.1 + savedLongitude;
                latitude = (event.clientY - savedY) * 0.1 + savedLatitude;
            }

        }

        function onDocumentTouchMove(event){

            if(manualControl){
                longitude = (savedX - event.clientX) * 0.1 + savedLongitude;
                latitude = (event.clientY - savedY) * 0.1 + savedLatitude;
            }

        }

        // when the mouse is released, we turn manual control off
        function onDocumentMouseUp(event){

            manualControl = false;

        }
                
        function onDocumentTouchUp(event){
            manualControl = false;
        }

        // pressing a key (actually releasing it) changes the texture map
        document.onkeyup = function(event){
        
            panoramaNumber = (panoramaNumber + 1) % panoramasArray.length
            sphereMaterial.map = THREE.ImageUtils.loadTexture(panoramasArray[panoramaNumber])
        
        }        
    }
})

$$(document).on('pageAfterBack', function (e) {
    
    var page = e.detail.page;

    if(page.name === 'recorrido1' || page.name === 'recorrido2' || page.name === 'recorrido3' || page.name === 'recorrido4'){
        $$(".page-content").css("padding-top", "44px");
        $$(".page-content").css("padding-bottom", "44px");
        $$(".page-content").css("overflow", "auto");
    }
})