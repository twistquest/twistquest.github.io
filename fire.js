var palette = [
	'#070707', '#1f0707', '#2f0f07', '#470f07',
	'#571707', '#671f07', '#771f07', '#8f2707',
	'#9f2f07', '#af3f07', '#bf4707', '#c74707',
	'#df4f07', '#df5707', '#df5707', '#d75f07',
	'#d7670f', '#cf6f0f', '#cf770f', '#cf7f0f',
	'#cf8717', '#c78717', '#c78f17', '#c7971f', 
	'#bf9f1f', '#bf9f1f', '#bfa727', '#bfa727',
	'#bfaf2f', '#b7af2f', '#b7b72f', '#b7b737',
	'#cfcf6f', '#dfdf9f', '#efefc7', '#ffffff'
];
var global = { w: 0, h: 0 };
var scale = 4;
var dots = [];

function start() {
	global.w = Math.min(320, Math.round(window.innerWidth / scale));
	global.h = Math.min(240, Math.round(window.innerHeight / scale));

	// Get and init canvas
	var canvas = document.getElementById('frame');
	canvas.width = global.w * scale;
	canvas.height = global.h * scale;
	if (canvas.getContext) {
		ctx = canvas.getContext('2d');
		ctx.globalCompositeOperation = 'new content';
	}

	// Init all dots array with zeros except first line
	for (var x = 0; x < global.w; x++) {
		for (var y = 0; y < global.h; y++) {
			dots[y * global.w + x] = y == global.h - 1 ? 35 : 0;
		}
	}

	window.requestAnimationFrame(update);
}

function update() {
	if (ctx == null) return;
	window.requestAnimationFrame(update);

	ctx.fillStyle = 'rgba(0, 0, 0, 1)';
	ctx.fillRect(0, 0, global.w * scale, global.h * scale);

	/* Move & draw */
	for (var x = 0; x < global.w; x++) {
		var xp = x * scale;
		for (var y = 1; y < global.h; y++) {
			var rand = Math.round(Math.random() * 3);
			var from = y * global.w + x;
			var to = from - global.w - rand + 1;
			dots[to] = dots[from] - (rand & 2);

			var index = Math.max(0, dots[from]);
			if (index == 0) continue;
			ctx.fillStyle = palette[index];
			ctx.fillRect(xp, y * scale, scale, scale);
		}
	}
}

start();
