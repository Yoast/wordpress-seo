// A list of all French auxiliaries used for passive voice.
var auxiliaries = [
	"être",
	"d'être",
	"suis",
	"es",
	"est",
	"sommes",
	"êtes",
	"sont",
	"c'est",
	"n'est",
	"n'es",
	"n'êtes",
	"été",
	"j'étais",
	"étais",
	"était",
	"étions",
	"étiez",
	"étaient",
	"c'était",
	"n'étais",
	"n'était",
	"n'étions",
	"n'étiez",
	"n'étaient",
	"serai",
	"seras",
	"sera",
	"serons",
	"serez",
	"seront",
	"sois",
	"soit",
	"soyons",
	"soyez",
	"soient",
	"fusse",
	"fusses",
	"fût",
	"fussions",
	"fussiez",
	"fussent",
	"serais",
	"serait",
	"serions",
	"seriez",
	"seraient",
	"fus",
	"fut",
	"fûmes",
	"fûtes",
	"furent" ];

/**
 * Returns lists with auxiliaries.
 * @returns {Array} The lists with auxiliaries.
 */
module.exports = function() {
	return {
		auxiliaries: auxiliaries,
	};
};
