/*--------------------------------------------------------------------------------------------------*
|    Dessin de signature lisse responsive utilisant peu de ressource de batterie sur les mobiles	|			
|		   		            Utilisation de RequestAnimFrame - Canvas - HTML5                  	    |
|			                 Réalisé par Philippe Chamard, en septembre 2018		                |
*--------------------------------------------------------------------------------------------------*/

// Déclaration variable
let canvas = document.querySelector("#signatureCanvas");

// Animation de la souris et du toucher sur la zone du canvas
function signatureCapture() {
	let ctx = canvas.getContext("2d");
	canvas.height = 300;
	canvas.width = 500; 
	ctx.fillStyle = "#007BFF";
	ctx.strokeStyle = "#007BFF";
	ctx.lineWidth = 2;
	
	let drawing = false;
	let mousePos = { x:0, y:0 };
	let lastPos = mousePos;

	canvas.addEventListener("mousedown", function (e) {
        drawing = true;
  		lastPos = getMousePos(canvas, e);
	}, false);
	canvas.addEventListener("mouseup", function (e) {
		drawing = false;
	}, false);
	canvas.addEventListener("mousemove", function (e) {
		mousePos = getMousePos(canvas, e);
	}, false);

	// position de la souris dans le canvas
	function getMousePos(canvasDom, mouseEvent) {
		let rect = canvasDom.getBoundingClientRect();
		return {
		    x: mouseEvent.clientX - rect.left,
		    y: mouseEvent.clientY - rect.top
	  	};
	}

	// Créer un interval régulier pour dessiner et la méthode requestAnimationFrame est plus rapide et consomme moins de batterie pour les tactiles 
	window.requestAnimFrame = (function (callback) {
	    return window.requestAnimationFrame || 
	    function (callback) {
			window.setTimeout(callback, 1000/60);
        };
	})();

	function renderCanvas() {
		if (drawing) {
			ctx.beginPath(); // Pour effacer les lignes lorsqu'on fait un clear
			ctx.moveTo(lastPos.x, lastPos.y);
			ctx.lineTo(mousePos.x, mousePos.y);
			ctx.stroke();
			lastPos = mousePos;
		}
	}

	// Animation, ici, le dessin
	(function drawLoop () {
		requestAnimationFrame(drawLoop);
		renderCanvas();
	})();

	// Gestion des événements tactiles
	canvas.addEventListener("touchstart", function (e) {
        mousePos = getTouchPos(canvas, e);
		let touch = e.touches[0];
		let mouseEvent = new MouseEvent("mousedown", {
			clientX: touch.clientX,
			clientY: touch.clientY
  		});
  		canvas.dispatchEvent(mouseEvent);
	}, false);

	canvas.addEventListener("touchend", function (e) {
		let mouseEvent = new MouseEvent("mouseup", {});
		canvas.dispatchEvent(mouseEvent);
	}, false);
	canvas.addEventListener("touchmove", function (e) {
		let touch = e.touches[0];
		let mouseEvent = new MouseEvent("mousemove", {
			clientX: touch.clientX,
			clientY: touch.clientY
		});
		canvas.dispatchEvent(mouseEvent);
	}, false);

	// Gestion de la position du toucher dans le canvas
	function getTouchPos(canvasDom, touchEvent) {
		let rect = canvasDom.getBoundingClientRect();
		return {
			x: touchEvent.touches[0].clientX - rect.left,
			y: touchEvent.touches[0].clientY - rect.top
		};
	}
	// Pour stabiliser le canvas lorsqu'on dessine dessus et éviter les effets de scrolling
	document.body.addEventListener("touchstart", function (e) {
		if (e.target == canvas) {
			e.preventDefault();
		}
	}, {passive: false, capture: false});// Si e.preventDefault mettre l'événement en non passif
	document.body.addEventListener("touchend", function (e) {
		if (e.target == canvas) {
			e.preventDefault();
		}
	}, {passive: false, capture: false});// Si e.preventDefault mettre l'événement en non passif
	document.body.addEventListener("touchmove", function (e) {
		if (e.target == canvas) {
			e.preventDefault();
		}
	}, {passive: false, capture: false});// Si e.preventDefault mettre l'événement en non passif

}
// Pour effacer la signature dans le canvas
function signatureClear() {
	const ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	document.querySelector('#cadre-image-signature').style.visibility = 'hidden';
}

// Transforme la signature en image png
function saveSignature() {
	let dataURL = canvas.toDataURL("image/png");
	document.querySelector("#saveSignature").src = dataURL;
	document.querySelector('#cadre-image-signature').style.visibility = 'visible';
}

// Sauvegarde l'image de la signature
function saveImg(link, canvasId, filename) {
    link.href = document.getElementById(canvasId).toDataURL();
	link.download = filename;
}

// Gestion des boutons "Enregistrer" et "Effacer" du canvas
document.querySelector('#save-img').addEventListener('click', function() {
	saveImg(this, 'signatureCanvas', 'sign.png');
	saveSignature();
});
document.querySelector('#erase-canvas').addEventListener('click', (e) => {
    return signatureClear();
});

signatureCapture();


