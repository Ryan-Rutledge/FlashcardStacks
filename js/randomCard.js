var showPhrase;

function init() {
	var flipCount = 0;

	// Span element that contains random sentences
	var randSpan = document.getElementsByClassName('fcRandSpan')[0];

	function randElem(arr) {
		return arr[Math.floor(Math.random() * arr.length)];
	}

	function randomPhrase() {
		// Random sentence beginnings
		var begs = ['Dangerous', 'Dun dun dun dunnnn...', 'Time for some intense', 'Darn', 'Quickly! Find', 'Itty-bitty', 'Ornery', 'Onward, brave', 'Leave me,', 'For glory, and', 'Shameful', 'Angry', 'Bad', 'Look at it! Look at the', 'Raging', 'Terrible', 'Artificial', 'You can pillage my', 'Bah,', 'hup.', 'No more', 'I am become', 'Smarmy', 'Hot'];

		// Random sentence endings
		var ends = ['ARNOLD', 'blubber', 'bumfuzzle', 'fish-sticks', 'Pikachu', 'bummage', 'turtlenecks', 'pants', 'Potter', 'cheese', 'sasquatch', 'gumdrops', 'miniature ponies', 'spankity', 'chunks', 'Patsy', 'jorts'];

		// Random sentence punctuations
		var puns = ['.', '!', '?', '.\n#random', '!\n- God', '.\n- Spock', '!\n- Draco Malfoy', '!\n- Severus Snape', '!\n- Jack Sparrow', '.\n- Celtic hymn'];

		// Randomly after the card has been flipped 50 times
		if (flipCount++ > 50 && Math.random() > 0.99) {
		   return 'Just so you know, you\'ve flipped this card ' + flipCount + ' times...';
		}
		else {
		   var beg = randElem(begs);
		   var end = randElem(ends);
		   var pun = randElem(puns);
		
		   return beg + ' ' + end + pun;
		}
	}

	// Show a random phrase from a random source
	showPhrase = function () {
		randSpan.innerText = randomPhrase();
	};

	// Initialize FlashcardStacks
	fc.init();
}
