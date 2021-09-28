/**
 * Returns a list of the participle and infinitive suffixes used for the Greek passive voice assessment.
 *
 * @returns {Array}                The list with participles.
 */

const participleSuffixes = [
	"μένος",
	"μένου",
	"μένον",
	"μένοι",
	"μένων",
	"μένους",
	"μένη",
	"μένης",
	"μένες",
	"μένων",
	"μένο",
	"μένα",
	"ημένος",
	"ημένου",
	"ημένον",
	"ημένοι",
	"ημένων",
	"ημένους",
	"ημένη",
	"ημένης",
	"ημένες",
	"ημένο",
	"ημένα",
	"ούμενος",
	"ούμενου",
	"ούμενον",
	"ούμενη",
	"ούμενης",
	"ούμενη",
	"ούμενοι",
	"ούμενων",
	"ούμενους",
	"ούμενες",
	"ούμενο",
	"ούμενα",
];

const infinitiveSuffixes = [
	"ηθεί",
	"φθεί",
	"θει",
	"τει",
];

export default { participleSuffixes, infinitiveSuffixes, all: participleSuffixes.concat( infinitiveSuffixes ) };

