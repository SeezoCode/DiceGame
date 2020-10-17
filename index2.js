// Get the canvas element from the DOM
const canvas = document.getElementById('scene');
console.log(canvas)
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
// Store the 2D context
const ctx = canvas.getContext('2d');

if (window.devicePixelRatio > 1) {
    canvas.width = canvas.clientWidth * 2;
    canvas.height = canvas.clientHeight * 2;
    ctx.scale(2, 2);
}

/* ====================== */
/* ====== VARIABLES ===== */
/* ====================== */
let width = canvas.clientWidth; // Width of the canvas
let height = canvas.clientHeight; // Height of the canvas
const dots = []; // Every dots in an array

/* ====================== */
/* ====== CONSTANTS ===== */
/* ====================== */
const DOTS_AMOUNT = 1000; // Amount of dots on the screen
const DOT_RADIUS = 2; // Radius of the dots
let PROJECTION_CENTER_X = width / 2; // X center of the canvas HTML
let PROJECTION_CENTER_Y = height / 2; // Y center of the canvas HTML
let FIELD_OF_VIEW = width * 0.8;
const CUBE_SIZE = 2
const CUBE_LINES = [[0, 1], [1, 3], [3, 2], [2, 0], [2, 6], [3, 7], [0, 4], [1, 5], [6, 7], [6, 4], [7, 5], [4, 5]];
const CUBE_VERTICES = [[-CUBE_SIZE, -CUBE_SIZE, -CUBE_SIZE],[CUBE_SIZE, -CUBE_SIZE, -CUBE_SIZE],[-CUBE_SIZE, CUBE_SIZE, -CUBE_SIZE],[CUBE_SIZE, CUBE_SIZE, -CUBE_SIZE],[-CUBE_SIZE, -CUBE_SIZE, CUBE_SIZE],[CUBE_SIZE, -CUBE_SIZE, CUBE_SIZE],[-CUBE_SIZE, CUBE_SIZE, CUBE_SIZE],[CUBE_SIZE, CUBE_SIZE, CUBE_SIZE]];


class Cube {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.radius = 100;
    }

    project(x, y, z) {
        const sizeProjection = FIELD_OF_VIEW / (FIELD_OF_VIEW + z);
        const xProject = (x * sizeProjection) + PROJECTION_CENTER_X;
        const yProject = (y * sizeProjection) + PROJECTION_CENTER_Y;
        return {
            size: sizeProjection,
            x: xProject,
            y: yProject,
            z: z
        }
    }

    findCords(x, y, z, rotX, rotY, rotZ) {
        let projections = []
        console.log('draw')
        if (this.z < -FIELD_OF_VIEW + this.radius) {console.log('not rendered'); return; }

        for (let i = 0; i < CUBE_LINES.length; i++) {
            const v1 = {
                x: this.x + (this.radius * CUBE_VERTICES[CUBE_LINES[i][0]][0]),
                y: this.y + (this.radius * CUBE_VERTICES[CUBE_LINES[i][0]][1]),
                z: this.z + (this.radius * CUBE_VERTICES[CUBE_LINES[i][0]][2])
            };
            const v2 = {
                x: this.x + (this.radius * CUBE_VERTICES[CUBE_LINES[i][1]][0]),
                y: this.y + (this.radius * CUBE_VERTICES[CUBE_LINES[i][1]][1]),
                z: this.z + (this.radius * CUBE_VERTICES[CUBE_LINES[i][1]][2])

            };
            const v1Project = this.project(v1.x, v1.y, v1.z);
            const v2Project = this.project(v2.x, v2.y, v2.z);
            projections.push([v1Project, v2Project]);

            ctx.beginPath();
            ctx.moveTo(v1Project.x, v1Project.y);
            ctx.lineTo(v2Project.x, v2Project.y);
            ctx.stroke();
        }
        // this.draw(projections)
        console.log(projections)
    }

    draw(cords) {
        cords.sort((a, b) => (a.z > b.z) ? 1 : -1)
        console.log(cords)


    }


}





let dot = new Cube(0, 0, 60)
dot.findCords(20, 10, 50, 14, 0, 0);
