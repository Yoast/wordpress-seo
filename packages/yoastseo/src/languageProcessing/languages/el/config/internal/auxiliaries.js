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
	"ήμουν",
	"ήσουν",
	"ήταν",
	"ήμαστε",
	"ήμασταν",
	"ήσαστε",
	"ήσασταν",
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
	"είχαν",
];

const allAuxiliaries = auxiliariesToHave.concat( auxiliariesToBe );

export {
	auxiliariesToHave,
	auxiliariesToBe,
	allAuxiliaries,
};
