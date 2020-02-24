// Variables that need to be initialized
var canvas, ctx, rect, isDrawing, points, eraser, bucket, penColor, penSize, fillType, colorCanvas, colorCtx, colorOver;
var mode, saveButton, penSizeSlider, dropperButton;

// Other variables
var isPencil = true;
var activeColor = '#0BE881';
var activeShadow = '0 5px 0 0 #05C46B';
var emptyCanvas = null;
var saveInitialClear = false;


// History stack and maximum undo/redo history, 15 steps
var hist = [];
var histIndex = -1;
var maxHist = 15;

// Save to chrome(ium) storage for persistency
function saveDrawing() {
	console.log("Called drawing save");
	chrome.storage.local.set({'cdata': hist[histIndex]}, function() {
		console.log('Canvas data stored as: ' + hist[histIndex]);
	});

	chrome.storage.local.set({'penSize': penSize, 'penColor': penColor}, function() {
		console.log('set pen color/size');
	});
}

// Mouse/Stroke Functions
function startDrawing(e) {
	if (mode == 'drop') {
		saveColor();
		return;
	}

	if (mode == 'bucket') return;
	
	isDrawing = true;
	if (mode == 'draw') {
		ctx.strokeStyle = penColor;
	}

	ctx.lineWidth = penSize;
	points.push({ x: e.clientX - rect.left, y: e.clientY - rect.top });
	ctx.beginPath();
	ctx.moveTo(points[0].x, points[0].y);
	ctx.lineTo(points[0].x, points[0].y);
	
	// Only necessary for edge, has issue doing a single point
	ctx.arc(points[0].x, points[0].y, 0, 0, 2 * Math.PI, true);
	ctx.fill();
	ctx.stroke();
};

function draw(e) {
	if (mode == 'drop') {
		colorOver = ctx.getImageData(e.clientX - rect.left, e.clientY - rect.top, 1, 1).data;
		colorOver = 'rgba(' + colorOver + ')';
		document.getElementById('colorBoxTop').style.backgroundColor = colorOver;

		return;
	}

	if (!isDrawing) return;
	if (mode == 'bucket') return;
	points.push({ x: e.clientX - rect.left, y: e.clientY - rect.top});
	ctx.beginPath();
	ctx.moveTo(points[0].x, points[0].y);
	for (var i = 1; i < points.length; i++) {
		ctx.lineTo(points[i].x, points[i].y);
	}
	ctx.stroke();
};

function stopDrawing() {
	if (isDrawing) {
		if (mode == 'drop') {
			document.getElementById('colorBoxTop').style.backgroundColor = penColor;
		}

		histStep();
		isDrawing = false;
		points.length = 0;

		saveDrawing();
	}
};

function eraser() {
	ctx.strokeStyle = 'white';
	isPencil = false;
	mode = 'erase';

	resetButtons();
	eraserButton.style.backgroundColor = activeColor;
	eraserButton.style.boxShadow = activeShadow;
}

function drawTool() {
	ctx.strokeStyle = penColor;
	ctx.lineWidth = penSize;
	isPencil = true;
	mode = 'draw';

	resetButtons();
	drawButton.style.backgroundColor = activeColor;
	drawButton.style.boxShadow = activeShadow;
}

function colorSelector(e) {
	var r = colorCanvas.getBoundingClientRect();
	colorOver = colorCtx.getImageData(e.clientX - r.left, e.clientY - r.top, 1, 1).data;
	colorOver = 'rgba(' + colorOver + ')';

	//document.getElementById('colorValue').innerHTML = colorOver;
	document.getElementById('colorBoxTop').style.backgroundColor = colorOver;
}

function saveColor() {
	penColor = document.getElementById('colorBoxBottom').style.backgroundColor = colorOver;
}

function setPenSize() {
	penSize = penSizeSlider.value;
}

function getPenProperties() {
	chrome.storage.local.get('penSize', function(result) {
		if (result.penSize == null) {
			return;
		}
		
		penSize = result.penSize;
		penSizeSlider.value = penSize;
	});

	chrome.storage.local.get('penColor', function(result) {
		penColor = result.penColor;
		document.getElementById('colorBoxTop').style.backgroundColor = penColor;
		document.getElementById('colorBoxBottom').style.backgroundColor = penColor;
	});
}

// Load as file in new tab
function downloadCanvas() {
	var u = canvas.toDataURL('image/jpg');
	this.href = chrome.tabs.create({ url: u });
}

// Greys out undo/redo buttons to indicate possible steps
function updateHistControls () {
	if (histIndex == 0) {
		undoButton.style.opacity = "0.5";
	} else {
		undoButton.style.opacity = "1";
	}

	if (histIndex == hist.length - 1) {
		redoButton.style.opacity = "0.5";
	} else {
		redoButton.style.opacity = "1";
	}
}

function histStep() {
	// Destroy current history stem if diverging
	if (histIndex != hist.length - 1) {
		hist = hist.slice(0, histIndex + 1);
	}

	// If reached max hist length, remove oldest capture
	if (hist.length == maxHist) {
		hist.shift();
		histIndex--;
	}

	// Add snapshot to history
	hist.push(canvas.toDataURL('image/jpg').toString());
	histIndex++;

	// Update control panel to reflect position in history
	updateHistControls();
	// saveDrawing();
}

// Function for loading a step from history
var histImg = new Image();
histImg.onload = function () {
	ctx.drawImage(histImg, 0, 0);
}

// Moves backward in stroke history if possible
function undo() {
	if (histIndex > 0) {
		histIndex--;
		histImg.src = hist[histIndex];
	}

	updateHistControls();
	saveDrawing();
}

// Move forward in history if available
function redo() {
	if (histIndex < hist.length - 1) {
		histIndex++;
		histImg.src = hist[histIndex];
	}

	updateHistControls();
	saveDrawing();
}

// Button Functions
function clear() {
	isDrawing = false;
	points = [];
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = 'white';
	ctx.rect(0, 0, canvas.width, canvas.height);
	ctx.fill();

	// Fully wipe the canvas
	if (emptyCanvas != null) {
		histImg.src = emptyCanvas;
		histStep();
		saveDrawing();
	}
}

function resetButtons() {
	var bgColor = '#AEAEAE';
	drawButton.style.backgroundColor = bgColor;
	bucketButton.style.backgroundColor = bgColor;
	eraserButton.style.backgroundColor = bgColor;
	dropperButton.style.backgroundColor = bgColor;

	var bShadow = '0 5px 0 0 #8A8A8A';
	drawButton.style.boxShadow = bShadow;
	bucketButton.style.boxShadow = bShadow;
	eraserButton.style.boxShadow = bShadow;
	dropperButton.style.boxShadow = bShadow;
}

function eyeDropper() {
	mode = 'drop';

	resetButtons();
	dropperButton.style.backgroundColor = activeColor;
	dropperButton.style.boxShadow = activeShadow;
}

function bucketMode() {
	mode = 'bucket';
	resetButtons();
	bucketButton.style.backgroundColor = activeColor;
	bucketButton.style.boxShadow = activeShadow;
}

// Flood Fill a region --- Currently broken do not engage
function bucketFill(e) {
	if (!(mode=='bucket')) return;

	isDrawing = false;
	points = [];
	ctx.fillStyle = penColor;
	ctx.fillFlood(e.clientX - rect.left, e.clientY - rect.top, 24);

	histStep();
}

function loadPrevious() {
	var dataUrl;
	chrome.storage.local.get('cdata', function(result) {
		dataUrl = result.cdata;
		histImg.src = result.cdata;
		histIndex = 0;
		hist = [dataUrl];
	});
}


// Dimetrodon - http://www.asciiworld.com/-Dinosaurs-.html
//                               _._
//                             _/:|:
//                            /||||||.
//                            ||||||||.
//                           /|||||||||:
//                          /|||||||||||
//                         .|||||||||||||
//                         | ||||||||||||:
//                       _/| |||||||||||||:_=---.._
//                       | | |||||:'''':||  '~-._  '-.
//                     _/| | ||'         '-._   _:    ;
//                     | | | '               '~~     _;
//    What's up?      | '                _.=._    _-~
//         \        _.~                  {     '-_'
//          _.--=.-~       _.._          {_       }
//      _.-~   @-,        {    '-._     _. '~==+  |
//     ('          }       \_      \_.=~       |  |
//     `,,,,,,,'  /_         ~-_    )         <_oo_>
//       `-----~~/ /'===...===' +   /
//              <_oo_>         /  //
//                            /  //
//                           <_oo_></_oo_>


// Color Picker
function initColorPicker() {
	colorCanvas = document.getElementById('colorPicker');
	colorCtx = colorCanvas.getContext('2d');

	var grd=colorCtx.createLinearGradient(0,0,colorCanvas.width,0);
	var colors = ['white', 'red', 'orange', 'yellow', 'green', 'blue', 'purple'];
	var stepSize = 1 / colors.length;
	for (i=0; i < colors.length; i++) {
		grd.addColorStop(i*stepSize, colors[i]);
	}

	colorCtx.fillStyle = grd;
	colorCtx.fillRect(0, 0, colorCanvas.width, colorCanvas.height);

	var overlay=colorCtx.createLinearGradient(0,0,0,colorCanvas.height);
	overlay.addColorStop(0, 'white');
	overlay.addColorStop(0.5, 'rgba(255,255,255,0)');
	overlay.addColorStop(0.75, 'rgba(0,0,0,0)');
	overlay.addColorStop(1, 'black');
	colorCtx.fillStyle = overlay;
	colorCtx.fillRect(0, 0, colorCanvas.width, colorCanvas.height);

	colorCanvas.addEventListener('mousemove', colorSelector, false);
	colorCanvas.addEventListener('click', saveColor, false);
	colorCanvas.addEventListener('touchend', saveColor, false);
	colorCanvas.addEventListener('mouseleave', function(){
		// document.getElementById('colorValue').innerHTML = penColor;
		document.getElementById('colorBoxTop').style.backgroundColor = penColor;
	}, false);
}

function touchHandler(event) {
    var touches = event.changedTouches,
        first = touches[0],
        type = "";
    switch(event.type) {
		case "touchstart": type = "mousedown"; break;
		case "touchmove":  type = "mousemove"; break;        
		case "touchend":   type = "mouseup";   break;
		default: return;
	}

    var simulatedEvent = document.createEvent("MouseEvent");
    simulatedEvent.initMouseEvent(type, true, true, window, 1, 
		first.screenX, first.screenY, 
		first.clientX, first.clientY, false,
		false, false, false, 0/*left*/, null);

	first.target.dispatchEvent(simulatedEvent);
	event.preventDefault();
}



// Initialize Extension
function init() {
	canvas = document.getElementById('pad');
	ctx = canvas.getContext('2d');
	rect = canvas.getBoundingClientRect();
	ctx.lineWidth = penSize = 6;
	ctx.lineJoin = ctx.lineCap = 'round';

	// Canvas Event Listners
	canvas.addEventListener('mouseup', stopDrawing, false);
	window.addEventListener('mouseup', stopDrawing, false);
	canvas.addEventListener('mousedown', startDrawing, false);
	canvas.addEventListener('mousemove', draw, false);
	canvas.addEventListener('mouseup', bucketFill, false);

	// Window Listeners - Convert touch to Mouse
	document.addEventListener("touchstart", touchHandler, true);
	document.addEventListener("touchmove", touchHandler, true);
	document.addEventListener("touchend", touchHandler, true);
	document.addEventListener("touchcancel", touchHandler, true);
	
	// Initialize Controls
	isDrawing, points = [];
	clearButton = document.getElementById('clearButton');
	eraserButton = document.getElementById('eraserButton');
	drawButton = document.getElementById('drawButton');
	bucketButton = document.getElementById('bucketButton');
	saveButton = document.getElementById('saveButton');
	penSizeSlider = document.getElementById('penSize');
	dropperButton = document.getElementById('eyeDropper');
	undoButton = document.getElementById('undo');
	redoButton = document.getElementById('redo');
	penColor = 'black';
	mode = 'draw';
	initColorPicker();

	// Button Event Listeners
	clearButton.addEventListener('click', clear);
	eraserButton.addEventListener('click', eraser);
	drawButton.addEventListener('click', drawTool);
	saveButton.addEventListener('click', downloadCanvas);
	dropperButton.addEventListener('click', eyeDropper);
	bucketButton.addEventListener('click', bucketMode);
	undoButton.addEventListener('click', undo);
	redoButton.addEventListener('click', redo);

	clearButton.addEventListener('touchstart', clear);
	eraserButton.addEventListener('touchstart', eraser);
	drawButton.addEventListener('touchstart', drawTool);
	saveButton.addEventListener('touchstart', downloadCanvas);
	dropperButton.addEventListener('touchstart', eyeDropper);
	bucketButton.addEventListener('touchstart', bucketMode);
	penSizeSlider.addEventListener('change', setPenSize);

	clear();
	emptyCanvas = canvas.toDataURL('image/jpg').toString();
	loadPrevious();
	histStep();
	getPenProperties();
}

init();