// These are the suffixes for the verbs in -ódik.
const odikSuffixes1 = [
	"ódom",
	"ódsz",
	"ódik",
	"ódunk",
	"ódtok",
	"ódnak",
	"ódtam",
	"ódtál",
	"ódott",
	"ódtunk",
	"ódtatok",
	"ódtak",
	"ódom",
	"ódsz",
	"ódik",
	"ódunk",
	"ódtok",
	"ódnak",
	"ódtam",
	"ódtál",
	"ódott",
	"ódtunk",
	"ódtatok",
	"ódtak",
	"ódjak",
	"ódj",
	"ódjon",
	"ódjunk",
	"ódjatok",
	"ódjanak",
	"ódnék",
	"ódnál",
	"ódna",
	"ódnánk",
	"ódnátok",
	"ódnának",
];
// These are the suffixes for the verbs in -ődik.
const odikSuffixes2 = [
	"ődöm",
	"ődsz",
	"ődik",
	"ődünk",
	"ődtök",
	"ődnek",
	"ődtem",
	"ődtél",
	"ődött",
	"ődtünk",
	"ődtetek",
	"ődtek",
	"ődöm",
	"ődsz",
	"ődik",
	"ődünk",
	"ődtök",
	"ődnek",
	"ődtem",
	"ődtél",
	"ődött",
	"ődtünk",
	"ődtetek",
	"ődtek",
];

/**
 * Returns an list with morphological suffixes for the passive voice in Hungarian.
 *
 * @returns {Object}        The list filled with morphological suffixes lists.
 */
module.exports = function() {
	return {
		odikSuffixes1: odikSuffixes1,
		odikSuffixes2: odikSuffixes2,
		allWords: odikSuffixes1.concat( odikSuffixes2 ),
	};
};
