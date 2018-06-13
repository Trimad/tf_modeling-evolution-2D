let grid;

let scale = 32;
function setup() {
	let rows = Math.floor(windowHeight / scale - 1);
	let cols = Math.floor(windowHeight / scale - 1);
	createCanvas(rows*scale,cols*scale);

	frameRate(60);
	rectMode(CORNER);
	ellipseMode(CORNER);

	grid = new GridWorld(rows, cols, scale);
	grid.generate();

	grid.spawnCreature(15, 15, scale);
	grid.spawnCreature(16, 16, scale);

}

function draw() {
	background(0);
	grid.display();
	grid.animateCreatures();

	if (frameCount % 15 === 0) {
		document.title = "FPS: " + Math.round(frameRate()) + " Tensors: " + tf.memory().numTensors;
		//console.log(a + ", " + b + ", " + c);
	}
}