let canvas = document.getElementById("renderCanvas"); // Get the canvas element
let engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
let diceRotation = {
    x: 0,
    y: 0,
    z: 0
}
let diceNum = 0

let faceSidesY = [Math.PI / 4 * 8, Math.PI / 4 * 4, Math.PI / 4 * 6, Math.PI / 4 * 2, Math.PI / 4 * 6, Math.PI / 4 * 2]
let history = []

/******* Add the create scene function ******/
let createScene = function (num) {

    // Create the scene space
    let scene = new BABYLON.Scene(engine);
    // scene.clearColor = BABYLON.Color3.White();


    // Add a camera to the scene and attach it to the canvas
    let camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 5, new BABYLON.Vector3(0,0,0), scene);
    camera.attachControl(canvas, true);
    camera.applyGravity = false

    // Add lights to the scene
    let light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, -2, 2), scene);
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
        wrap: true,
        size: 1.5
    };

    var box = BABYLON.MeshBuilder.CreateBox('box', options, scene);
    box.material = mat;

    //BABYLON.SceneLoader.ImportMeshAsync(null, "./", "dice_simple.obj", scene).then((result) =>{
        //const box = result.meshes[0];

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

    let x = 0
    let y = 0 // faceSidesY[Math.floor(Math.random() * faceSidesY.length)]

    if (num === 4 || num === 5) {
        x = faceSidesY[num];
        y = Math.PI
    }
    else {
        x = 0;
        y = faceSidesY[num];
    }
    diceNum = num;


    let keys = [[],[]]
    keys[0].push({
        frame: 0,
        value: diceRotation.y
    });
    keys[1].push({
        frame: 0,
        value: diceRotation.x
    });

    keys[0].push({
        frame: animLength,
        value: y
    });
    keys[1].push({
        frame: animLength,
        value: x
    });


    animationBox[0].setKeys(keys[0]);
    box.animations.push(animationBox[0]);
    animationBox[1].setKeys(keys[1]);
    box.animations.push(animationBox[1]);

    setTimeout(async () => {
        let anim = scene.beginAnimation(box, 0, animLength, false);

        console.log("before");
        await anim.waitAsync();
        console.log("after");
        diceRotation.x = box.rotation.x
        diceRotation.y = box.rotation.y
        diceRotation.z = box.rotation.z
        console.log(diceRotation)
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
    function assignNum() {
        let num = Math.floor(Math.random() * 6)
        if (num === history[history.length - 1]) return assignNum(Math.floor(Math.random() * 6)); // prevents same number appearing twice
        return num;
    }
    let num = assignNum()
    scene = createScene(num) // Here you can specify the dice number
})


let darkMode = document.getElementById('darkMode')
darkMode.addEventListener('mousedown', event => {
    if (document.body.style.backgroundColor !== 'rgb(20, 20, 20)') {
        document.body.style.backgroundColor = 'rgb(20, 20, 20)'
        document.body.style.color = 'rgb(220, 220, 220)'
    }
    else {
        document.body.style.backgroundColor = 'rgb(250, 250, 250)'
        document.body.style.color = 'rgb(10, 10, 10)'
    }
})
let date = new Date()
if (date.getHours() > 16 || date.getHours() <= 8) {
    document.body.style.backgroundColor = 'rgb(20, 20, 20)'
    document.body.style.color = 'rgb(220, 220, 220)'
    document.querySelector('input').setAttribute('checked', "")
}


function dominantDirection(cords) {
    if (cords.x === Math.PI / 4 * 2) return 4;
    if (cords.x === Math.PI / 4 * 6) return 5;

    if (cords.y === Math.PI / 4 * 8) return 0;
    if (cords.y === Math.PI / 4 * 2) return 3;
    if (cords.y === Math.PI / 4 * 4) return 1;
    if (cords.y === Math.PI / 4 * 6) return 2;
}

function DOMStuff() {
    history.push(diceNum)

    let DOMScore = document.querySelector('h3');
    DOMScore.innerHTML = `Current Score: ${history[history.length - 1]}`
    let DOMP = document.querySelectorAll('p');
    DOMP[0].innerHTML = `History: ${history}`
    let avg = 0
    history.forEach(elem => avg += elem)
    DOMP[1].innerHTML = `Average: ${Math.round(avg / history.length * 100) / 100}`
}