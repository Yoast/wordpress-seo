/** @module config/transitionWords */

const singleWords = [ "aber", "abschließend", "abschliessend", "alldieweil", "allerdings", "also", "anderenteils", "andererseits", "andernteils",
	"anfaenglich", "anfänglich", "anfangs", "angenommen", "anschliessend", "anschließend",	"aufgrund",	"ausgenommen",
	"ausserdem", "außerdem", "beispielsweise", "bevor", "beziehungsweise", "bspw", "bzw", "d.h", "da", "dabei", "dadurch", "dafuer", "dafür",
	"dagegen", "daher", "dahingegen", "danach", "dann", "darauf", "darum", "dass", "davor", "dazu", "dementgegen", "dementsprechend", "demgegenüber",
	"demgegenueber", "demgemaess", "demgemäß", "demzufolge", "denn", "dennoch", "dergestalt", "derweil", "desto", "deshalb", "desungeachtet",
	"deswegen", "doch", "dort", "drittens",	"ebenfalls", "ebenso", "endlich", "ehe", "einerseits", "einesteils", "entsprechend",
	"entweder", "erst", "erstens", "falls", "ferner", "folgerichtig", "folglich", "fürderhin", "fuerderhin", "genauso",
	"hierdurch", "hierzu", "hingegen", "immerhin", "indem", "indes", "indessen", "infolge",	"infolgedessen", "insofern", "insoweit", "inzwischen",
	"jedenfalls", "jedoch", "kurzum", "m.a.w", "mitnichten", "mitunter", "möglicherweise", "moeglicherweise", "nachdem", "nebenher",
	"nichtsdestotrotz", "nichtsdestoweniger", "ob", "obenrein", "obgleich", "obschon", "obwohl", "obzwar", "ohnehin", "richtigerweise",
	"schliesslich", "schließlich", "seit", "seitdem", "sobald", "sodass", "so dass", "sofern", "sogar", "solang", "solange", "somit",
	"sondern", "sooft", "soviel", "soweit", "sowie", "sowohl", "statt", "stattdessen", "trotz",	"trotzdem", "überdies", "übrigens",
	"ueberdies", "uebrigens", "ungeachtet", "vielmehr", "vorausgesetzt", "vorher", "waehrend", "während", "währenddessen",
	"waehrenddessen", "weder", "wegen", "weil", "weiter", "weiterhin", "wenn", "wenngleich", "wennschon", "wennzwar", "weshalb", "widrigenfalls",
	"wiewohl", "wobei", "wohingegen", "z.b", "zudem", "zuerst", "zufolge", "zuletzt", "zumal", "zuvor", "zwar", "zweitens" ];
const multipleWords = [ "abgesehen von", "abgesehen davon", "als dass", "als ob", "als wenn", "anders ausgedrückt", "anders ausgedrueckt",
	"anders formuliert", "anders gefasst", "anders gefragt", "anders gesagt", "anders gesprochen", "anstatt dass", "auch wenn",
	"auf grund", "auf jeden fall", "aus diesem grund", "ausser dass", "außer dass", "ausser wenn", "außer wenn", "besser ausgedrückt",
	"besser ausgedrueckt", "besser formuliert", "besser gesagt", "besser gesprochen", "bloss dass", "bloß dass", "darüber hinaus",
	"das heisst", "das heißt", "des weiteren", "dessen ungeachtet", "ebenso wie", "genauso wie", "geschweige denn", "im fall",
	"im falle", "im folgenden", "im gegensatz dazu", "im gegenteil", "im grunde genommen", "in diesem sinne", "je nachdem", "kurz gesagt",
	"mit anderen worten", "ohne dass", "so dass", "umso mehr als", "umso weniger als", "umso mehr, als", "umso weniger, als",
	"unbeschadet dessen", "und zwar", "ungeachtet dessen", "unter dem strich", "zum beispiel", "zunächts einmal" ];

/**
 * Returns lists with transition words to be used by the assessments.
 * @returns {Object} The object with transition word lists.
 */
export default function() {
	return {
		singleWords: singleWords,
		multipleWords: multipleWords,
		allWords: singleWords.concat( multipleWords ),
	};
}
