var signArray = [];
var signalArray = [];
var ruleArray = [];
var tmpSignal;

// Blank Sign
	var noSign = new Sign('#222');
	signArray.push(noSign);

// red Sign
	var rSign = new Sign('#C00');
	signArray.push(rSign);
	var rBSign = new Sign('#C00', true);
	signArray.push(rBSign);

// Green Sign
	var gSign = new Sign('#0A0');
	signArray.push(gSign);
	var gBSign = new Sign('#0A0', true);
	signArray.push(gBSign);

// Yellow Sign
	var ySign = new Sign('#FF0');
	signArray.push(ySign);
	var yBSign = new Sign('#FF0', true);
	signArray.push(yBSign);

// Lunar Sign
	var lSign = new Sign('#BBF');
	signArray.push(lSign);
	var lBSign = new Sign('#BBF', true);
	signArray.push(lBSign);


// Rule 9.1.3
ruleArray.push(new Rule('9.1.3', 'Clear', 'Proceed'));
var r9x1x3 = [];
	var tmpSignal = new Signal();
		tmpSignal.addRow([gSign, gSign, gSign, gSign]);
		tmpSignal.addRow([null, noSign, rSign, rSign]);
		tmpSignal.addRow([null, null, null, rSign]);
	r9x1x3.push(tmpSignal);

	var tmpSignal = new Signal();
		tmpSignal.addRow([gSign, gSign, gSign]);
		tmpSignal.addRow([noSign, noSign, rSign]);
		tmpSignal.addRow([noSign, rSign, noSign]);
	r9x1x3.push(tmpSignal);
signalArray.push(r9x1x3);

// Rule 9.1.4
ruleArray.push(new Rule('9.1.4', 'Approach Limited', 'Proceed to pass next signal not exceeding 60 mph and be prepared to enter diverging route at prescribed speed.'));
var r9x1x4 = [];
	tmpSignal = new Signal();
		tmpSignal.addRow([ySign]);
		tmpSignal.addRow([gBSign]);
	r9x1x4.push(tmpSignal);
signalArray.push(r9x1x4);

// Rule 9.1.5
ruleArray.push(new Rule('9.1.5', 'Advance Approach', 'Proceed prepared to pass next signal not exceeding 50 mph and be prepared to enter diverging route at prescribed speed.'));
var r9x1x5 = [];
	tmpSignal = new Signal();
		tmpSignal.addRow([ySign, ySign, ySign]);
		tmpSignal.addRow([gSign, gSign, gSign]);
		tmpSignal.addRow([null, rSign, noSign]);
	r9x1x5.push(tmpSignal);
signalArray.push(r9x1x5);

// Rule 9.1.6
ruleArray.push(new Rule('9.1.6', 'Approach Medium', 'Proceed prepared to pass next signal not exceeding 40 mph and be prepared to enter diverging route at prescribed speed.'));
var r9x1x6 = [];
	tmpSignal = new Signal();
		tmpSignal.addRow([yBSign, yBSign, yBSign, ySign]);
		tmpSignal.addRow([null, rSign, rSign, ySign]);
		tmpSignal.addRow([null, null, rSign, null]);
	r9x1x6.push(tmpSignal);

	tmpSignal = new Signal();
		tmpSignal.addRow([yBSign, yBSign, ySign, yBSign]);
		tmpSignal.addRow([noSign, noSign, ySign, noSign]);
		tmpSignal.addRow([null, noSign, rSign, rSign]);
	r9x1x6.push(tmpSignal);

	tmpSignal = new Signal();
		tmpSignal.addRow([yBSign, ySign]);
		tmpSignal.addRow([rSign, ySign]);
		tmpSignal.addRow([noSign, noSign]);
	r9x1x6.push(tmpSignal);
signalArray.push(r9x1x6);

// Rule 9.1.7
ruleArray.push(new Rule('9.1.7', 'Approach Restricting', 'Proceed prepared to pass next signal at restricted speed.'));
var r9x1x7 = [];
	tmpSignal = new Signal();
		tmpSignal.addRow([ySign, ySign, ySign]);
		tmpSignal.addRow([lSign, lSign, rBSign]);
		tmpSignal.addRow([null, rSign, null]);
	r9x1x7.push(tmpSignal);

	tmpSignal = new Signal();
		tmpSignal.addRow([ySign, ySign]);
		tmpSignal.addRow([rBSign, rBSign]);
		tmpSignal.addRow([noSign, rSign]);
	r9x1x7.push(tmpSignal);
signalArray.push(r9x1x7);

// Rule 9.1.8
ruleArray.push(new Rule('9.1.8', 'Approach', 'Proceed prepared to stop at next signal, trains exceeding 30mpg immediately reduce to that speed.'));
var r9x1x8 = [];
	tmpSignal = new Signal();
		tmpSignal.addRow([ySign, ySign, ySign, ySign]);
		tmpSignal.addRow([null, rSign, rSign, noSign]);
		tmpSignal.addRow([null, null, rSign, null]);
	r9x1x8.push(tmpSignal);

	tmpSignal = new Signal();
		tmpSignal.addRow([ySign, ySign, noSign, ySign]);
		tmpSignal.addRow([noSign, noSign, ySign, rSign]);
		tmpSignal.addRow([noSign,  rSign,  null, noSign]);
	r9x1x8.push(tmpSignal);
signalArray.push(r9x1x8);

// Rule 9.1.9
ruleArray.push(new Rule('9.1.9', 'Diverging Clear', 'Proceed on diverging route not exceeding prescribed speed through turnout.'));
var r9x1x9 = [];
	tmpSignal = new Signal();
		tmpSignal.addRow([rSign, rSign, rSign, rSign]);
		tmpSignal.addRow([gSign, gSign, rSign, gSign]);
		tmpSignal.addRow([null,  rSign,  gSign, noSign]);
	r9x1x9.push(tmpSignal);
signalArray.push(r9x1x9);

// Rule 9.1.10
ruleArray.push(new Rule('9.1.10', 'Diverging Approach Diverging', 'Proceed on diverging route not exceeding prescribed speed through turnout prepared to advance on diverging route at the next signal not exceeding prescribed speed through turnout.'));
var r9x1x10 = [];
	tmpSignal = new Signal();
		tmpSignal.addRow([rSign]);
		tmpSignal.addRow([ySign]);
		tmpSignal.addRow([ySign]);
	r9x1x10.push(tmpSignal);
signalArray.push(r9x1x10);

// Rule 9.1.11
ruleArray.push(new Rule('9.1.11', 'Diverging Approach Medium', 'Proceed on diverging route not exceeding prescribed speed through turnout prepared to pass next signal not exceeding 35 mph.'));
var r9x1x11 = [];
		tmpSignal = new Signal();
		tmpSignal.addRow([rSign, rSign, rSign]);
		tmpSignal.addRow([yBSign, yBSign, yBSign]);
		tmpSignal.addRow([null,  rSign,  noSign]);
	r9x1x11.push(tmpSignal);
signalArray.push(r9x1x11);

// Rule 9.1.12
ruleArray.push(new Rule('9.1.12', 'Diverging Approach', 'Proceed on diverging route not exceeding prescribed speed through turnout; approach next signal preparing to stop, if exceeding 30mph, immediately reduce to that speed.'));
var r9x1x12 =	[];
	tmpSignal = new Signal();
		tmpSignal.addRow([rSign, rSign, rSign, rSign]);
		tmpSignal.addRow([ySign, ySign, rSign, ySign]);
		tmpSignal.addRow([null,  rSign,  ySign, noSign]);
	r9x1x12.push(tmpSignal);
signalArray.push(r9x1x12);

// Rule 9.1.13
ruleArray.push(new Rule('9.1.13', 'Restricting', 'Proceed at restricted speed.'));
var r9x1x13 = [];
	tmpSignal = new Signal();
		tmpSignal.addRow([rBSign, rSign, rSign, rBSign]);
		tmpSignal.addRow([null, rBSign, rBSign, rSign]);
		tmpSignal.addRow([null, null, rSign, null]);
	r9x1x13.push(tmpSignal);

	tmpSignal = new Signal();
		tmpSignal.addRow([rBSign, rSign, rBSign, noSign]);
		tmpSignal.addRow([rSign, rSign, noSign, rBSign]);
		tmpSignal.addRow([rSign, rBSign]);
	r9x1x13.push(tmpSignal);

	tmpSignal = new Signal();
		tmpSignal.addRow([lSign, lSign, lSign]);
		tmpSignal.addRow([null, rSign, rSign]);
		tmpSignal.addRow([null, null, rSign]);
	r9x1x13.push(tmpSignal);

	tmpSignal = new Signal();
		tmpSignal.addRow([rSign, rSign, rSign, noSign]);
		tmpSignal.addRow([lSign, rSign, lSign, lSign]);
		tmpSignal.addRow([null, lSign, rSign]);
	r9x1x13.push(tmpSignal);

	// e9x1x13

	tmpSignal = new Signal();
		tmpSignal.addRow([noSign, rBSign, rBSign, rSign]);
		tmpSignal.addRow([rBSign, noSign, rSign, rBSign]);
		tmpSignal.addRow([rSign, rSign, noSign, noSign]);
	r9x1x13.push(tmpSignal);
signalArray.push(r9x1x13);

	// a9x1x14

// Rule 9.1.15
ruleArray.push(new Rule('9.1.15', 'Stop', 'Stop.'));
var r9x1x15 = [];
	tmpSignal = new Signal();
		tmpSignal.addRow([rSign, rSign, rSign, rSign]);
		tmpSignal.addRow([null, noSign, rSign, rSign]);
		tmpSignal.addRow([null, null, null, rSign]);
	r9x1x15.push(tmpSignal);

	tmpSignal = new Signal();
		tmpSignal.addRow([noSign, noSign, rSign, rSign]);
		tmpSignal.addRow([rSign, rSign, noSign, rSign]);
		tmpSignal.addRow([null, rSign, rSign, noSign]);
	r9x1x15.push(tmpSignal);
signalArray.push(r9x1x15);

function generateSign() {
	switch (Math.floor(Math.random() * (signArray.length))) {
		case 0:
			return null;
		case 1:
			return noSign;
		default:
			return new Sign(('#' + Math.floor(Math.random() * 3375).toString(16)), (Math.floor(Math.random() * 4) === 0));
	}
}

function generateRow(len) {
	var generatedRow = [];

	for (var j = 0; j < len; j++)
		generatedRow.push(generateSign());

	return generatedRow;
}

function generateSignal() {
	var w = Math.ceil(Math.random() * 6);
	var h = Math.ceil(Math.random() * 4);

	var generatedSignal = new Signal();

	for (var i = 0; i < h; i++) {
		generatedSignal.addRow(generateRow(w));
	}

	return generatedSignal;
}

function generateRule() {
	// Generate number
	var generatedRuleNumber = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.charAt(Math.floor(Math.random() * 26)) + '.' + Math.floor(Math.random() * 10) + '.' + Math.floor(Math.random() * 100);

	// Generate name
	var randNum = Math.floor(Math.random() * ruleArray.length);
	var tmpArray = ruleArray[randNum].name.split(' ');
	var generatedRuleName = tmpArray[Math.floor(Math.random() * tmpArray.length)] + ' ';

	randNum = Math.floor(Math.random() * ruleArray.length);
	tmpArray = ruleArray[randNum].name.split(' ');
	generatedRuleName += tmpArray[Math.floor(Math.random() * tmpArray.length)];
		
	// Generate indication
	randNum = Math.floor(Math.random() * ruleArray.length);
	tmpArray = ruleArray[randNum].indication.split(' ');
	randStartNum = Math.floor(Math.random() * (tmpArray.length));
	var generatedRuleIndication = tmpArray.slice(randStartNum, Math.ceil(Math.random() * (tmpArray.length - randStartNum) + randStartNum));

	randNum = Math.floor(Math.random() * ruleArray.length);
	tmpArray = ruleArray[randNum].indication.split(' ');
	randStartNum = Math.floor(Math.random() * (tmpArray.length));
	generatedRuleIndication = generatedRuleIndication.concat(tmpArray.slice(randStartNum, Math.ceil(Math.random() * (tmpArray.length - randStartNum) + randStartNum)));
	generatedRuleIndication = generatedRuleIndication.sort(function() { return 0.5 - Math.random();}).join(' ');
	generatedRuleIndication = generatedRuleIndication[0].toUpperCase() + generatedRuleIndication.slice(1, generatedRuleIndication.length - 1) + (generatedRuleIndication[generatedRuleIndication.length - 1].match(/\w/) ? generatedRuleIndication[generatedRuleIndication.length - 1] + '.':'.');

	return new Rule(generatedRuleNumber, generatedRuleName, generatedRuleIndication);
}

function drawGeneratedSignal() {
	drawSignal(generateSignal(), generateRule());
}
