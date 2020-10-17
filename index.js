let canvas = document.getElementById("renderCanvas"); // Get the canvas element
let engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
let diceRotation = {
    x: 0,
    y: 0,
    z: 0
}
/******* Add the create scene function ******/
let createScene = function () {

    // Create the scene space
    let scene = new BABYLON.Scene(engine);
    // scene.clearColor = BABYLON.Color3.White();


    // Add a camera to the scene and attach it to the canvas
    let camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 5, new BABYLON.Vector3(0,0,0), scene);
    camera.attachControl(canvas, true);
    camera.applyGravity = false

    // Add lights to the scene
    let light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
    let light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), scene);

    var ground = BABYLON.Mesh.CreatePlane("ground", 20.0, scene);
    ground.material = new BABYLON.StandardMaterial("groundMat", scene);
    ground.material.diffuseColor = new BABYLON.Color3(1, 1, 1);
    ground.material.backFaceCulling = false;
    ground.position = new BABYLON.Vector3(0, -5, 0);
    ground.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);

    var mat = new BABYLON.StandardMaterial("mat", scene);
    var texture = new BABYLON.Texture("https://i.imgur.com/lXehwjZ.jpg", scene);
    mat.diffuseTexture = texture;

    var columns = 6;  // 6 columns
    var rows = 1;  // 1 row

    //alien sprite
    var faceUV = new Array(6);

    //set all faces to same
    for (let i = 0; i < 6; i++) {
        faceUV[i] = new BABYLON.Vector4(i / columns, 0, (i + 1) / columns, 1 / rows);
    }
    //wrap set
    var options = {
        faceUV: faceUV,
        wrap: true
    };


    var box = BABYLON.MeshBuilder.CreateBox('box', options, scene);
    box.material = mat;

    let animationBox = []
    animationBox[0] = new BABYLON.Animation("tutoAnimation", "rotation.y", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    animationBox[1] = new BABYLON.Animation("tutoAnimation", "rotation.x", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    animationBox[2] = new BABYLON.Animation("tutoAnimation", "rotation.z", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    // Animation keys

    const animLength = 50
    console.log(`animation length: ${animLength}`)

    let i = Math.random()

    let keys = [[],[]]
    keys[0].push({
        frame: 0,
        value: diceRotation.y
    });
    keys[1].push({
        frame: 0,
        value: diceRotation.x
    });

    if (i < .5) {
        keys[0].push({
            frame: animLength,
            value: Math.random() * Math.PI * 2
        });
        keys[1].push({
            frame: animLength,
            value: 0
        });
    }
    else if (i > .5) {
        keys[1].push({
            frame: animLength,
            value: Math.random() * Math.PI * 2
        });
        keys[0].push({
            frame: animLength,
            value: 0
        });
    }
    animationBox[0].setKeys(keys[0]);
    box.animations.push(animationBox[0]);
    animationBox[1].setKeys(keys[1]);
    box.animations.push(animationBox[1]);


    setTimeout(async () => {
        var anim = scene.beginAnimation(box, 0, animLength, false);

        console.log("before");
        await anim.waitAsync();
        console.log("after");
        diceRotation.x = box.rotation.x
        diceRotation.y = box.rotation.y
        diceRotation.z = box.rotation.z
        console.log(diceRotation)
        button.disabled = false
        dominantDirection(diceRotation)
        DOMStuff();
    });

    return scene;
};
/******* End of the create scene function ******/


let scene = createScene(); //Call the createScene function
scene.render();
let run = false
// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
    if (run) scene.render();
});



let button = document.querySelector('button');
button.addEventListener('mousedown', event => {
    run = true
    if (button.innerText === 'Play') button.disabled = false
    scene = createScene()

})



function dominantDirection(cords) {
    // Well it's easier to only check for one axis, so that's what i decided to do
    if (cords.x > Math.PI / 4 * 5 && cords.x < Math.PI / 4 * 7) console.log(5)
    else if (cords.x > Math.PI / 4 * 1 && cords.x < Math.PI / 4 * 3) console.log(4)
    else if (cords.x > Math.PI / 4 * 3 && cords.x < Math.PI / 4 * 5) console.log(1)
    else if (cords.x > Math.PI / 4 * 5 && cords.x < Math.PI / 4 * 7) console.log(0)

    else if (cords.y > Math.PI / 4 * 7 || cords.y < Math.PI / 4 * 1) console.log(0)
    else if (cords.y > Math.PI / 4 * 1 && cords.y < Math.PI / 4 * 3) console.log(3)
    else if (cords.y > Math.PI / 4 * 3 && cords.y < Math.PI / 4 * 5) console.log(1)
    else if (cords.y > Math.PI / 4 * 5 && cords.y < Math.PI / 4 * 7) console.log(2)
}

function DOMStuff() {
    
}