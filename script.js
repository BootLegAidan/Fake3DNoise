// import {createNoise3D} from "https://cdn.skypack.dev/simplex-noise@4.0.0";

// const noise3D = createNoise3D();

let c = document.getElementById("canvas"),
	ctx = c.getContext("2d");

let speedDisp = document.getElementById("speedDisp");

let num = 70,
	displaySize = 1000,
	maxHeight = 150,
	seed = "39875307",
	smoothing = 30,
	tickChange = 0.01,
	colorSmoothing = 1,
	sideHeightMult = 5,
	frameSmooting = 50,
	scroll = 0

let simplex = new SimplexNoise(seed);
let chunkSize = displaySize / num;
let emergencyStop = false;
let lastFrameSpeeds = [];

c.height = displaySize * 2;
c.width = displaySize + displaySize / num;
c.style.height = 100 + "vmin";
c.style.width = 100 + "vmin";

frameTime = 1;

function draw() {
	let curFrame = performance.now();

	ctx.clearRect(0, 0, c.width, c.height);
	for (let i = 0; i < num; i++) {
		for (let j = 0; j < num; j++) {
			let height =
				simplex.noise3D((i / smoothing), (j / smoothing) + (scroll * tick), (tick) * tickChange) *
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
	frameTime = performance.now() - curFrame;

	if (frameTime > 1000) {
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
		${emergencyStop ? 'Process was paused (took ' + frameTime + 'ms to render). Click to unpause' : ''} <br>
		`;
	if (!emergencyStop) {
		frameTime = performance.now() - curFrame;
		tick += 1
		requestAnimationFrame(draw);
	}
}

let tick = 0;
draw();

document.addEventListener('click', () => {
	emergencyStop = false
	console.log('Unpaused')
	draw()
})
// let update = setInterval(draw,1000)
