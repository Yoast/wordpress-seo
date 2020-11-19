/**
 * Returns a list with auxiliaries for the Hungarian passive voice assessment.
 * @returns {Array}             The list with auxiliaries.
 */
const auxiliariesParticipleRaAndRe = [
	"kerülök",
	"kerülsz",
	"kerül",
	"kerülünk",
	"kerültök",
	"kerülnek",
	"kerüljek",
	"kerülj",
	"kerüljön",
	"kerüljünk",
	"kerüljetek",
	"kerüljenek",
	"kerülnék",
	"kerülnél",
	"kerülne",
	"kerülnénk",
	"kerülnétek",
	"kerülnének",
	"kerültem",
	"kerültél",
	"került",
	"kerültünk",
	"kerültetek",
	"kerültek",
	"kerültem volna",
	"kerültél volna",
	"került volna",
	"kerültünk volna",
	"kerültetek vola",
	"kerültek volna",
	"fogok kerülni",
	"fogsz kerülni",
	"fog kerülni",
	"fogunk kerülni",
	"fogtok kerülni",
	"fognak kerülni",
];

const auxiliariesParticipleVaAndVe = [
	"vagyok",
	"vagy",
	"van",
	"vagyunk",
	"vagytok",
	"vannak",
	"legyek",
	"legyél",
	"legyen",
	"legyünk",
	"legyetek",
	"legyenek",
	"lennék",
	"lennél",
	"lenne",
	"lennénk",
	"lennétek",
	"lennének",
	"leszek",
	"leszel",
	"lesz",
	"leszünk",
	"lesztek",
	"lesznek",
	"voltam",
	"voltál",
	"volt",
	"voltunk",
	"voltatok",
	"voltak",
	"lettem volna",
	"lettél volna",
	"lett volna",
	"lettünk volna",
	"lettetek volna",
	"lettek volna",
];

const auxiliariesParticipleNi = [
	"fogok",
	"fogsz",
	"fog",
	"fogunk",
	"fogtok",
	"fognak",
];

/**
 * Returns an list with transition words to be used by the assessments.
 * @returns {Object} The list filled with transition word lists.
 */
module.exports = function() {
	return {
		auxiliaries1: auxiliariesParticipleRaAndRe,
		auxiliaries2: auxiliariesParticipleVaAndVe,
		auxiliaries3: auxiliariesParticipleNi,
		allWords: auxiliariesParticipleRaAndRe.concat( auxiliariesParticipleVaAndVe, auxiliariesParticipleNi ),
	};
};
