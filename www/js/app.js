var myApp = new Framework7({
    material: true,
});

var $$ = Dom7;

var mainView = myApp.addView('.view-main', {    
    dynamicNavbar: true    
});


//RECORRIDOS 360 CONFIGURACION UNIFICADA
$$(document).on('pageAfterAnimation',function(e){

    var page= e.detail.page;    

    if(page.name === 'recorrido1' || page.name === 'recorrido2' || page.name === 'recorrido3' || page.name === 'recorrido4'){        

        var img_name = null;

        if(page.name === 'recorrido1')
            var img_name = "img/360/01.jpg";

        if(page.name === 'recorrido2')
            var img_name = "img/360/02.jpg";

        if(page.name === 'recorrido3')
            var img_name = "img/360/03.jpg";

        if(page.name === 'recorrido4')
            var img_name = "img/360/04.jpg";

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

        document.addEventListener("touchstart",onDocumentMouseDowns, false);
        document.addEventListener("touchmove",onDocumentMouseMoves, false);
        document.addEventListener("touchend", onDocumentMouseUps, false);                 
						
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
        // when the mouse moves, if in manual contro we adjust coordinates
        function onDocumentMouseMove(event){

            if(manualControl){
                longitude = (savedX - event.clientX) * 0.1 + savedLongitude;
                latitude = (event.clientY - savedY) * 0.1 + savedLatitude;
            }

        }
        // when the mouse is released, we turn manual control off
        function onDocumentMouseUp(event){
            manualControl = false;            
        }


        function onDocumentMouseDowns(event)
        {
            event.preventDefault();

            manualControl = true;

            savedX = event.touches[0].clientX;
            savedY = event.touches[0].clientY;

            savedLongitude = longitude;
            savedLatitude = latitude;

            //alert(“down”+savedX+”–“+savedY+”–“+savedLatitude+”–“+savedLongitude)
        }
        // when the mouse moves, if in manual contro we adjust coordinates
        function onDocumentMouseMoves(event)
        {

            if(manualControl){
                longitude = (savedX - event.touches[0].clientX) * 0.1 + savedLongitude;
                latitude = (event.touches[0].clientY - savedY) * 0.1 + savedLatitude;
                //alert(“move”+longitude+”–“+latitude)
            }   

        }
        // when the mouse is released, we turn manual control off
        function onDocumentMouseUps(event){
            manualControl = false;
        }
    }

    if(page.name === 'recorridos' || page.name === 'lotes' || page.name === 'lugares' || page.name === 'ecoinfo' || page.name === 'monitoreo'){

        myApp.closePanel();    
    }    

    if(page.name ==='recorridos'){
        $$(".page-content").css("padding-top", "50px");        
    }
})


//RECORRIDOS 
myApp.onPageReinit('recorridos', function (page) {

    $$(".page-content").css("padding-top", "50px");
})

//LOTES 
myApp.onPageInit('lotes', function (page) {

    var url_api = 'http://app.ecopueblo.com/api/lotes-libres';
    //var url_api = 'http://localhost:8000/api/lotes-libres';

    // Select Template
    var template = $$('#random-template').html();

    // Compile and render
    var compiledTemplate = Template7.compile(template);
              
    $$.getJSON(url_api, function (json) {                     
        $$('#content-wrap').html(compiledTemplate(json));
        console.log(compiledTemplate(json));
    }); 
    
})

myApp.onPageAfterAnimation('lotes', function (page) {

    var myPhotoBrowserPage = myApp.photoBrowser({
        photos : [
            'img/lotes/mapas.jpg',
        ],                
        theme: 'dark',
        onClose: function () {
            mainView.router.loadPage('index.html');
        }
    });

    myPhotoBrowserPage.open();    
})

//ECOINFO 
myApp.onPageInit('ecoinfo', function (page) {

    var url_api = 'http://app.ecopueblo.com/api/mapas';
    //var url_api = 'http://localhost:8000/api/mapas';

    // Select Template
    var template = $$('#random-template').html();

    // Compile and render
    var compiledTemplate = Template7.compile(template);
              
    $$.getJSON(url_api, function (json) {                     
        $$('#content-wrap').html(compiledTemplate(json));
        console.log(compiledTemplate(json));
    }); 
    
})

myApp.onPageAfterAnimation('ecoinfo', function (page) {

    /*=== Popup ===*/
    var myPhotoBrowserPopup = myApp.photoBrowser({
        photos : [
            {
                url:'http://lorempixel.com/1024/1024/sports/1/',
                caption:'Primera',
            },
            {
                url:'http://lorempixel.com/1024/1024/sports/2/',
                caption:'Segunda',
            },
            {
                url:'http://lorempixel.com/1024/1024/sports/3/',
                caption:'Tercera',
            },            
        ],
        type: 'popup',
        theme: 'dark',
    });
    $$('.pb-popup').on('click', function () {
        myPhotoBrowserPopup.open();        
    });
})


//LUGARES 
myApp.onPageInit('lugares', function (page) {
    var url_api = 'http://app.ecopueblo.com/api/puntos-interes';
    //var url_api = 'http://localhost:3000/api/puntos-interes';

    // Select Template
    var template = $$('#random-template').html();

    // Compile and render
    var compiledTemplate = Template7.compile(template);
              
    $$.getJSON(url_api, function (json) {                     
        $$('#content-wrap').html(compiledTemplate(json));
        console.log(compiledTemplate(json));
    });        
})



 