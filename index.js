let canvas = document.getElementById("renderCanvas"); // Get the canvas element
let width = window.innerWidth
let height = window.innerHeight
canvas.setAttribute('width', width / 2 + 'px')
canvas.setAttribute('height', height + 'px')



// let settings = document.getElementById('settings');
// let settingsMarginTop = settings.clientHeight / 4
// settings.style.marginTop = settingsMarginTop + 'px'
// settings.style.paddingBottom = (height / 1.8 - settings.clientHeight - settingsMarginTop - 21) + 'px'


let engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
let diceRotation = {
    x: 0,
    y: 0,
    z: 0
}
let diceNum = 0
let multiplier = 1
let speed = 40

let faceSidesY = [0, Math.PI / 4 * 6, Math.PI / 4 * 2, Math.PI / 4 * 4, Math.PI / 4 * 8, Math.PI / 4 * 6, Math.PI / 4 * 2]

let history = localStorage['history'] || '[]';
history = JSON.parse(history);
document.querySelectorAll('p')[1].innerHTML = `${history.join(', ')}`


/******* Add the create scene function ******/
let createScene = function (num, animLength) {
    // Create the scene space
    let scene = new BABYLON.Scene(engine);
    // scene.clearColor = BABYLON.Color3.White();


    // Add a camera to the scene and attach it to the canvas
    let camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 5, new BABYLON.Vector3(0,0,0), scene);
    camera.attachControl(canvas, true);
    camera.applyGravity = false

    // Add lights to the scene
    let light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(16, 6, 12), scene);
    let light3 = new BABYLON.HemisphericLight("light3", new BABYLON.Vector3(-20, 40, -60), scene);
    let light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 0, -.4), scene);

    var ground = BABYLON.Mesh.CreatePlane("ground", 20.0, scene);
    ground.material = new BABYLON.StandardMaterial("groundMat", scene);
    ground.material.diffuseColor = new BABYLON.Color3(1, 1, 1);
    ground.material.backFaceCulling = false;
    ground.position = new BABYLON.Vector3(0, -5, 0);
    ground.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);

    var material = new BABYLON.StandardMaterial("mat", scene);
    material.diffuseTexture = new BABYLON.Texture("Textures/color.png", scene);
    material.bumpTexture = new BABYLON.Texture("Textures/normal.png", scene);

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
        size: window.innerWidth / 1200
    };

    if (window.innerWidth <= 575) options.size *= 4

    var box = BABYLON.MeshBuilder.CreateBox('box', options, scene);
    box.material = material;

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

    console.log(`animation length: ${animLength}`)

    let x = 0
    let y = 0 // faceSidesY[Math.floor(Math.random() * faceSidesY.length)]

    if (num === 1 || num === 6) {
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

resize()
let scene = createScene(); //Call the createScene function
scene.render();
let run = false
// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
    if (run) scene.render();
});





function dominantDirection(cords) {
    if (cords.x === Math.PI / 4 * 2) return 4;
    if (cords.x === Math.PI / 4 * 6) return 5;

    if (cords.y === Math.PI / 4 * 8) return 0;
    if (cords.y === Math.PI / 4 * 2) return 3;
    if (cords.y === Math.PI / 4 * 4) return 1;
    if (cords.y === Math.PI / 4 * 6) return 2;
}

function DOMStuff() {
    history.push(diceNum++)
    localStorage['history'] = JSON.stringify(history)

    let DOMScore = document.querySelector('h3');
    DOMScore.innerHTML = `Current Score: ${history[history.length - 1]}`
    let DOMP = document.querySelectorAll('p');
    DOMP[1].innerHTML = `${history.join(', ')}`
    let avg = 0
    history.forEach(elem => avg += elem)
    DOMP[2].innerHTML = `Average: ${Math.round(avg / history.length * 100) / 100}`
}


/* user interactions */

let button = document.querySelectorAll('button');
button.forEach(elem => {
    elem.addEventListener('mousedown', event => {
        run = true
        function assignNum(chance) {
            let num = Math.ceil(Math.random() * 6 * chance)
            if (num > 5) num = 6;
            if (num === history[history.length - 1]) return assignNum(multiplier); // prevents same number appearing twice
            return num;
        }
        let num = assignNum(multiplier)
        console.log(num, multiplier)
        scene = createScene(num, speed) // Here you can specify the dice number
    })
})
changeBackgroundToDarkTheme()
function changeBackgroundToDarkTheme() {
    document.body.style.backgroundColor = 'rgb(20, 20, 20)'
    document.body.style.color = 'rgb(220, 220, 220)'
}
let darkMode = document.getElementById('darkMode')
darkMode.addEventListener('mouseup', event => {
    if (document.body.style.backgroundColor !== 'rgb(20, 20, 20)') {
        changeBackgroundToDarkTheme()
    }
    else {
        document.body.style.backgroundColor = 'rgb(250, 250, 250)'
        document.body.style.color = 'rgb(10, 10, 10)'
    }
})
// let date = new Date()
// if (date.getHours() > 16 || date.getHours() <= 8) {
//     document.body.style.backgroundColor = 'rgb(20, 20, 20)'
//     document.body.style.color = 'rgb(220, 220, 220)'
//     document.querySelector('input').setAttribute('checked', "")
// }

function resize() {
    let width = window.innerWidth
    let height = window.innerHeight
    if (width > 768) {
        canvas.setAttribute('width', width / 2 + 'px')
        canvas.setAttribute('height', height - 6 + 'px')

        document.querySelector('button').style.display = 'none'
        document.getElementById('2').style.height = height + 'px'

        document.querySelectorAll('button').forEach(elem => elem.style.width = 175 + 'px')

        document.querySelectorAll('button').forEach((elem , i) => {
            if (i <= 1) {
                elem.style.width = width / 2 - 80 + 'px'
                if (width / 2 - 80 > 520) elem.style.width = '520px'
            }
        })
        document.getElementById('settings').style.maxWidth = 500 + 'px'
    }
    else {
        canvas.setAttribute('width', width + 'px')
        canvas.setAttribute('height', height / 2 + 'px')

        document.querySelector('button').style.display = 'grid'
        document.getElementById('2').style.height = height / 2 - 6 + 'px'

        document.querySelectorAll('button').forEach(elem => elem.style.width = 120 + 'px')

        document.querySelectorAll('button').forEach((elem , i) => {
            if (i <= 1) elem.style.width = width - 50 + 'px'
        })
        document.getElementById('settings').style.maxWidth = 1000 + 'px'
    }
    document.querySelector('div').style.width = width + 'px'
}

document.getElementById('res').addEventListener('mousedown', event => {
    history = []
    localStorage['history'] = history
    let DOMP = document.querySelectorAll('p');
    DOMP[1].innerHTML = `History: ${history.join(', ')}`
    document.querySelectorAll('p')[1].innerHTML = 'Average: '
})


document.getElementById('inc').addEventListener('mousedown', event => {
    multiplier += .20;
    if (multiplier >= 20) multiplier = 20
    multiplier = Math.round(multiplier * 100) / 100 // this otherwise causes floating point after several iterations
    document.getElementById('multiplier').innerHTML = `Current Multiplier: ${multiplier}`
})
document.getElementById('dec').addEventListener('mousedown', event => {
    multiplier -= .20;
    if (multiplier <= .2) {
        multiplier = .2
        document.getElementById('multiplier').innerHTML = `Current Multiplier: Is low, but never zero`
    }
    else {
        multiplier = Math.round(multiplier * 100) / 100
        document.getElementById('multiplier').innerHTML = `Current Multiplier: ${multiplier}`
    }
})
document.getElementById('speed').addEventListener(('blur'), event => {
    speed = document.getElementById('speed').value
    if (speed == 0) speed = 40
})
document.getElementById('value').addEventListener(('blur'), event => {
    let val = document.getElementById('value').value
    if (val > 0 && val < 7) {
        run = true
        scene = createScene(Number(val--), speed)
    }
    else {
        document.getElementById('value').value = 'Invalid Value'
    }
})
window.addEventListener('resize', event => {
    resize()
})