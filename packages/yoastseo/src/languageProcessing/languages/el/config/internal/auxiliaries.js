/**
 * Returns a list with auxiliaries for the Greek passive voice assessment.
 * @returns {Array}             The list with auxiliaries.
 */
const auxiliariesToBe = [
	"είμαι",
	"είσαι",
	"είναι",
	"είμαστε",
	"είστε",
	"είσαστε",
	"είναι",
	"ήμουν",
	"ήσουν",
	"ήταν",
	"ήμαστε",
	"ήμασταν",
	"ήσαστε",
	"ήσασταν",
	"ήταν",
];

const auxiliariesToHave = [
	"έχω",
	"έχεις",
	"έχει",
	"έχουμε",
	"έχετε",
	"έχουν",
	"είχα",
	"είχες",
	"είχε",
	"είχαμε",
	"είχαμε",
	"είχαν",
];

export default {
	auxiliaries1: auxiliariesToHave,
	auxiliaries2: auxiliariesToBe,
	allAuxiliaries: [].concat( auxiliariesToHave, auxiliariesToBe ),
};
