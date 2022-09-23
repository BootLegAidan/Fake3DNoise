// import {createNoise3D} from "https://cdn.skypack.dev/simplex-noise@4.0.0";

// const noise3D = createNoise3D();

let c = document.getElementById("canvas"),
	ctx = c.getContext("2d");

let speedDisp = document.getElementById("speedDisp");

let num = 75,
	displaySize = 1000,
	maxHeight = 100,
	seed = "39875307",
	smoothing = 40,
	tickChange = 0.0125,
	colorSmoothing = 1,
	sideHeightMult = 2,
	frameSmooting = 50;

var simplex = new SimplexNoise(seed);
let chunkSize = displaySize / num;
let emergencyStop = false;
let lastFrameSpeeds = [];

c.height = displaySize * 2;
c.width = displaySize + displaySize / num;
c.style.height = 100 + "vmin";
c.style.width = 100 + "vmin";

function draw() {
	let curFrame = performance.now();

	ctx.clearRect(0, 0, c.width, c.height);
	for (let i = 0; i < num; i++) {
		for (let j = 0; j < num; j++) {
			let height =
				simplex.noise3D(i / smoothing, j / smoothing, (tick / 10) * tickChange) *
				maxHeight;

			ctx.fillStyle = `hsl(${height / colorSmoothing},50%,50%)`;
			ctx.fillRect(
				j * chunkSize + chunkSize / 2,
				i * chunkSize + displaySize * 0.7 - height + chunkSize,
				chunkSize,
				chunkSize * sideHeightMult
			);

			ctx.fillStyle = `hsl(${height / colorSmoothing},70%,70%)`;
			ctx.fillRect(
				j * chunkSize + chunkSize / 2,
				i * chunkSize + displaySize * 0.7 - height,
				chunkSize,
				chunkSize
			);
		}
	}
	let frameTime = performance.now() - curFrame;

	if (frameTime > 60) {
		emergencyStop = true;
		console.log(`STOPPED (Took ${frameTime})`);
	}
	lastFrameSpeeds[frameSmooting] = frameTime;
	lastFrameSpeeds.shift();

	let smoothFrameTime =
		lastFrameSpeeds.reduce((partialSum, a) => partialSum + a, 0) / frameSmooting;

	speedDisp.innerHTML = `
		Speed: <br> 
		${Math.round(smoothFrameTime * 100) / 100}ms <br>
		${Math.round(1000 / smoothFrameTime)}fps <br>
		`;
	if (!emergencyStop) {
		tick++;
		requestAnimationFrame(draw);
	}
}

let tick = 0;
draw();

// let update = setInterval(draw,1000)
