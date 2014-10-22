var degreesFlipped = 3600000;

var DIRECTION = {
	LEFT: 0,
	UP: 1,
	RIGHT: 2,
	DOWN: 3
};

function alterRotation(degrees) {
	fc.style.transform = 'rotateY(' + degrees + 'deg)';
}

// Flip flash card over
function flipCard(direction) {
	degreesFlipped += direction === DIRECTION.LEFT ? -180:180;
	alterRotation(degreesFlipped);
} 
animateCard = function(direction) {
	switch (direction) {
		case DIRECTION.LEFT:
		case DIRECTION.RIGHT:
			flipCard(direction);
			break;
		case DIRECTION.UP:
			fc.classList.add('moveUp');
			var t1 = setTimeout(goNextCard, 250);
			var t2 = setTimeout(function() {fc.classList.remove('moveUp');}, 500);
			break;
		case DIRECTION.DOWN:
			fc.classList.add('moveDown');
			var t1 = setTimeout(goBackCard, 250);
			var t2 = setTimeout(function() {fc.classList.remove('moveDown');}, 500);
			break;
	}
}

// Touch events
var touchX = null;
var touchY = null;
var tiltDirection = null;

window.addEventListener('touchstart', function() {
	touchX = event.touches[0].pageX;
	touchY = event.touches[0].pageY;

	event.preventDefault();
});

window.addEventListener('touchend', function() {
	if (touchX != null && touchY != null) {
		alterRotation(degreesFlipped);

		var endX = event.changedTouches[0].pageX;
		var endY = event.changedTouches[0].pageY;

		// If swipe length is long enough
		if (Math.abs(endX - touchX) > 50 || Math.abs(endY - touchY) > 50) {
			event.preventDefault();
			animateCard(swipeDirection(endX, endY));
		}
	}

	resetTouchEvent();
});

window.addEventListener('touchmove', function() {
	if (touchX != null && touchY != null) {
		event.preventDefault();

		var curX = event.touches[0].pageX;
		var curY = event.touches[0].pageY;

		// If tilt direction has changed
		if (tiltDirection != swipeDirection(curX, curY)) {
			distX = Math.abs(curX - touchX);

			// If length of swipe is long enough
			if (distX > 50)
				alterRotation(
					degreesFlipped + (
						(swipeDirection(curX, curY) === DIRECTION.LEFT) ? -15:15
					)
				);
		}
	}
});

function resetTouchEvent() {
	touchX = null;
	touchY = null;
	tiltDirection = null;
}

function swipeDirection(endX, endY) {
	if (Math.abs(touchX - endX) > Math.abs(touchY - endY))
		return (touchX > endX) ? DIRECTION.LEFT : DIRECTION.RIGHT;
	else
		return (touchY > endY) ? DIRECTION.UP: DIRECTION.DOWN;
}

// Arrow keys
window.addEventListener('keydown', function(event) {
	animateCard(event.which - 37);
}, false);

// Mouse click
fc.addEventListener('click', flipCard, false);

alterRotation(degreesFlipped);