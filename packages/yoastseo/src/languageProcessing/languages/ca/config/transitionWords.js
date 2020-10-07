/** @module config/transitionWords */

const singleWords = [ "abans", "així", "alhora", "aleshores", "altrament", "anteriorment", "breument", "bàsicament",
	"contràriament", "després", "doncs", "efectivament", "endemés", "especialment", "evidentment", "finalment", "fins a",
	"fins que", "generalment", "igualment", "malgrat", "mentre", "mentrestant", "parallelament", "paral·lelament", "però",
	"perquè", "quan", "primerament", "resumidament", "resumint", "segurament", "segons això", "sens dubte", "sinó",
	"sobretot", "també", "tanmateix" ];

const multipleWords = [ "a banda d'això", "a continuació", "a diferència de", "a fi de", "a fi que", "a força de",
	"a manera de resum", "a més", "a partir d'aquí", "a partir d'ara",
	"a tall d'exemple", "a tall de recapitulació", "a tall de resum", "al capdavall", "al contrari", "al mateix temps",
	"amb relació a", "tot plegat", "ara bé", "atès que", "com a conseqüència", "com a exemple", "com a resultat",
	"com a resum", "com que", "comptat i debatut", "considerant que", "convé destacar", "convé recalcar",
	"convé ressaltar que", "d'altra banda", "d’una banda", "d’una forma breu", "de la mateixa manera", "de manera parallela",
	"de manera paral·lela", "de manera que", "de tota manera", "degut a", "deixant de banda", "dit d'una altra manera",
	"donat que", "en a resum", "en lloc de", "en altres paraules", "en aquest sentit", "en canvi", "en conclusió", "en conjunt",
	"en conseqüència", "encara que", "en darrer lloc", "en darrer terme", "en definitiva", "en efecte", "en general",
	"en particular", "en pocs mots", "en poques paraules", "en primer lloc", "en relació amb", "en resum", "en segon lloc",
	"en síntesi", "en suma", "en tercer lloc", "en últim terme", "és a dir", "és més", "és per això que", "fins i tot",
	"gràcies a", "gràcies de", "igual com", "igual que", "ja que", "llevat que", "més aviat", "més tard", "més endavant",
	"no obstant", "o sia", "o sigui", "òbviament", "pel fet que", "pel general", "pel que", "per acabar", "per això",
	"per altra banda", "per aquest motiu", "per causa de", "per causa que", "per cert", "per començar", "per concloure",
	"per concretar", "per contra", "per exemple", "per illustrar", "per il·lustrar", "per l'altra part", "per l'altre cantó",
	"per la qual cosa", "per mitjà de", "per posar un exemple", "per raó de", "per raó que", "per tal de", "per tal que", "per tant",
	"per últim", "per un cantó", "per un costat", "per una altra banda", "per una part", "quant a", "recapitulant",
	"respecte de", "s'ha de tenir en compte que", "sempre que", "tal com s’ha dit", "tan bon punt", "tan aviat com",
	"tenint en compte que", "tot i", "tot seguit", "val a dir", "val la pena dir que", "vist que" ];

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
