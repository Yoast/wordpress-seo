/** @module config/transitionWords */

var singleWords = [ "ainsi", "alors", "aussi", "car", "cependant", "certainement", "certes", "conséquemment", "d'abord", "d'ailleurs", "d'après",
	"davantage", "désormais", "deuxièmement", "donc", "dorénavant", "effectivement", "également", "enfin", "ensuite", "entre-temps",
	"essentiellement", "excepté", "finalement", "globalement", "jusqu'ici", "la-dessus", "lorsque", "mais", "malgré", "néanmoins",
	"notamment", "partant", "plutôt", "pourtant", "précédemment", "premièrement", "probablement", "puis", "puisque", "quoique",
	"sauf", "selon", "semblablement", "sinon", "suivant", "tel",  "toutefois", "troisièmement" ];

var multipleWords = [ "à cause de", "à ce jour", "à ce propos", "à ce sujet", "à cet égard", "à cette fin", "à compter de",
	"à condition que", "à défaut de", "à force de", "à la lumière de", "à la suite de", "à l'aide de", "à l'appui de",
	"à l'encontre de", "à l'époque actuelle", "à l'exception de", "à l'exclusion de", "à l'heure actuelle", "à l'image de", "à l'instar de",
	"à l'inverse", "à l'inverse de", "à l'opposé", "à la condition que", "à mesure que", "à moins que", "à partir de", "à première vue",
	"à savoir", "à seule fin que",	"à supposer que", "à tel point que", "à tout prendre", "à vrai dire", "afin de", "afin que", "ainsi donc",
	"ainsi que", "alors que", "antérieurement", "apès réflexion", "après cela", "après quoi", "après que", "après réflexion", "après tout",
	"attendu que",	"au cas où", "au contraire", "au fond", "au fur et à mesure que", "au lieu de", "au même temps", "au moment où",
	"au moyen de", "au point que", "au risque de", "au surplus", "au total", "aussi bien que", "aussitôt que", "autant que", "autrement dit",
	"avant que", "avant tout", "ayant fini", "bien que", "c'est à dire que", "c'est ainsi que", "c'est dire", "c'est le cas de",
	"c'est pourquoi", "c'est qu'en effet", "c'est-à-dire", "ça confirme que", "ça montre que", "ça prouve que", "cela étant", "cela dit",
	"cependant que", "compte tenu", "comme l'illustre", "comme le souligne", "comme quoi", "comme si", "comparativement à", "conformément à",
	"contrairement à", "d'autant plus que", "d'autant que", "d'autre part", "d'ici là", "d'où", "d'un autre côté", "d'un côté",
	"d'une facon générale", "dans ce cas", "dans ces conditions", "dans cet esprit", "dans l'ensemble", "dans l'état actuel des choses",
	"dans l'éventualité où", "dans l'hypothèse où",	"dans la mesure où", "dans le but de", "dans le cadre de", "dans le cas où",
	"dans les circonstances actuelles", "dans les grandes lignes", "dans un autre ordre d'idée", "dans un délai de", "de ce fait",
	"de cette façon", "de crainte que", "de façon à", "de façon à ce que", "de façon que", "de fait", "de l'autre côté",
	"de la même façon que", "de manière que", "de même", "de même qua", "de même que", "de nos jours", "de peur que", "de prime abord",
	"de sorte que", "de surcroît", "de telle manière que", "de telle sorte que", "de toute façon", "de toute manière", "depuis que",
	"dès lors que", "dès maintenant", "dès qua", "dès que", "du fait que", "du moins", "du moment que", "du point de vue de", "du reste",
	"d'ici là", "d'ores et déjà", "en admettant que", "en attendant que",	"en bref", "en cas de", "en cas que", "en ce cas",
	"en ce domaine", "en ce moment", "en ce qui a trait à", "en ce qui concerne", "en ce sens", "en cela", "en comparaison de",
	"en concequence", "en conclusion", "en conformité avec", "en conséquence", "en d'autres termes", "en définitive", "en dépit de",
	"en dernier lieu", "en deuxième lieu", "en effet", "en face de", "en fait", "en fin de compte", "en général",
	"en guise de conclusion", "en matière de", "en même temps que", "en outre",	"en particulier", "en plus", "en premier lieu",
	"en principe", "en raison de", "en réalité", "en règle générale", "en résumé", "en revanche", "en second lieu", "en somme",
	"en sorte que", "en supposant que", "en tant que", "en terminant", "en théorie", "en tout cas", "en troisième lieu", "en un mot",
	"en vérité", "en vue que", "encore que", "entre autres", "et même", "et puis", "étant donné qua", "étant donné que", "face à",
	"grâce à", "il est à noter que", "il faut dire aussi que", "il s'ensuit que", "jusqu'à ce que", "jusqu'à ce jour",
	"jusqu'à maintenant", "jusqu'à présent", "jusqu'au moment où", "la preuve c'est que", "loin que", "malgré cela", "malgré tout",
	"même si", "mentionnons que", "mis à part le fait que", "notons que", "nul doute que", "ou bien", "où que", "par ailleurs",
	"par conséquent", "par contre", "par exception", "par exemple", "par la suite", "par l'entremise de", "par l'intermédiaire de",
	"par rapport à", "par suite", "par suite de", "par surcroît", "parce que", "pareillement", "partant de ce fait", "pas du tout",
	"pendant que", "pour ainsi dire", "pour autant que", "pour ce qui est de", "pour ces motifs", "pour ces raisons", "pour cette raison",
	"pour conclure", "pour le moment", "pour l'instant", "pour peu que", "pour que",	"pour résumé", "pour terminer", "pour tout dire",
	"pourvu que", "pur toutes ces raisons", "quand bien même que", "quand même", "quant à", "quant même", "quel que soit", "qui que",
	"quitte à",	"quoi qu'il en soit", "quoi que", "quoiqu'il en soit", "sans délai", "sans doute", "sans parler de", "sans préjuger",
	"sans tarder", "sauf si", "selon que", "si bien que", "si ce n'est que", "si l'on songe que", "sitôt que", "somme toute",
	"sous cette réserve", "sous prétexte que",  "sous réserve de", "sous réserve que", "suivant que", "supposé que", "sur le plan de",
	"tandis que", "tant et si bien que", "tant que", "tel que", "tellement que", "tout à fait", "tout bien pesé", "tout compte fait",
	"tout d'abord", "tout de même", "vu que" ];

/**
 * Returns an array with transition words to be used by the assessments.
 * @returns {Array} The array filled with transition words.
 */
module.exports = function() {
	return {
		singleWords: singleWords,
		multipleWords: multipleWords,
		allWords: singleWords.concat( multipleWords ),
	};
};
