let transitionWords = require( "./transitionWords.js" )().singleWords;

/**
 * Returns an object with exceptions for the prominent words researcher
 * @returns {Object} The object filled with exception arrays.
 */

let articles = [ "le", "la", "les", "un", "une", "des", "aux", "du", "au", "d'un", "d'une" ];

let cardinalNumerals = [ "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix", "onze", "douze", "treize", "quatorze",
	"quinze", "seize", "dix-sept", "dix-huit", "dix-neuf", "vingt", "trente", "quarante", "cinquante", "soixante", "soixante-dix",
	"quatre-vingt", "quatre-vingt-dix", "cent", "mille", "million", "milliard" ];

// 'premier' and 'première' are not included because of their secondary meanings ('prime minister', '[movie] premiere')
let ordinalNumerals = [ "deuxième", "troisième",
	"quatrième", "cinquième", "sixième", "septième", "huitième", "neuvième", "dixième", "onzième", "douzième", "treizième",
	"quatorzième", "quinzième", "seizième", "dix-septième", "dix-huitième", "dix-neuvième", "vingtième" ];

let personalPronounsNominative = [ "je", "tu", "il", "elle", "on", "nous", "vous", "ils", "elles" ];

let personalPronounsStressed = [ "moi", "toi", "lui", "soi", "eux", "elles" ];

// Le, la, les are already included in the articles list.
let personalPronounsAccusative = [ "me", "te", "en" ];

// The remaining dative personal pronouns are already included in other pronoun lists.
let personalPronounsDative = [ "leur" ];

let demonstrativePronouns = [ "celui", "celle", "ceux", "celles", "ce", "celui-ci", "celui-là", "celle-ci", "celle-là", "ceux-ci",
	"ceux-là", "celles-ci", "celles-là", "ceci", "cela", "ça", "cette", "ce", "cet", "ces", "ceci" ];

let possessivePronouns = [ "mon", "ton", "son", "ma", "ta", "sa", "mes", "tes", "ses", "notre", "votre", "leur", "nos", "vos", "leurs" ];

let quantifiers = [ "beaucoup", "peu", "bien", "quelque", "quelques", "tous", "tout", "toute", "toutes", "plusieurs", "plein", "chaque",
	"suffisant", "suffisante", "suffisantes", "suffisants", "faible", "moins", "tant", "plus", "plusieurs", "divers", "diverse", "diverses" ];

// The remaining reflexive personal pronouns are already included in other pronoun lists.
let reflexivePronouns = [ "se" ];

let indefinitePronouns = [ "aucun", "aucune", "autre", "autres", "certain", "certaine", "certaines", "certains", "chacun", "chacune", "même", "mêmes",
	"quelqu'un", "quelqu'une", "quelques'uns", "quelques'unes", "autrui", "nul", "personne", "quiconque", "rien", "d'aucunes", "d'aucuns", "nuls",
	"nules", "l'autre", "l'autres", "autrui", "tel", "telle", "tels", "telles" ];

let relativePronouns = [ "qui", "que", "lequel", "laquelle", "auquel", "auxquels", "auxquelles", "duquel", "desquels", "desquelles", "dont", "où",
	"quoi" ];

let interrogativeProAdverbs =  [ "combien", "comment", "pourquoi", "quand", "d'où"  ];

let interrogativeAdjectives =  [ "quel", "quels", "quelle", "quels"  ];

let pronominalAdverbs = [ "en", "y" ];

let locativeAdverbs = [ "là", "ici", "voici" ];

// 'Vins' is not included because it also means 'wines'.
let otherAuxiliaries = [ "j'ai", "ai", "as", "a", "avons", "avez", "ont", "ai-je", "as-tu", "a-t-il", "a-t-elle", "a-t-on", "avons-nous", "avez-vous",
	"eu", "avais", "avait", "avions", "aviez", "avaient", "aurai", "auras", "aura", "aurons", "aurez", "auront", "aurais", "aurait", "auions",
	"auriez", "auraient", "aie", "ayons", "ayez", "vais", "vas", "va", "allons", "allez", "vont", "vais-je", "vas-tu", "va-t-il", "va-t-elle",
	"va-t-on", "allons-nous", "allez-vous", "vont-elles", "vont-ils", "allé", "allés", "j'allai", "allai", "allas", "allas", "allâmes", "allâtes",
	"allèrent", "j'allais", "allais", "allait", "allions", "alliez", "allaient", "j'irai", "iras", "ira", "irons", "irez", "iront", "j'aille",
	"aille", "ailles", "allions", "alliez", "aillent", "j'allasse", "allasse", "allasses", "allât", "allassions", "allassiez", "allassent",
	"j'irais", "irais", "irait", "irions", "iriez", "iraient", "allant", "viens", "vient", "venons", "venez", "viennent", "viens-je", "viens-de",
	"vient-il", "vient-elle", "vient-on", "venons-nous", "venez-vous", "viennent-elles", "viennent-ils", "vins", "vint", "vînmes", "vîntes",
	"vinrent", "venu", "venus", "vint", "vînmes", "vîntes", "vinrent", "venais", "venait", "venions", "veniez", "venaient", "viendrai",
	"viendras", "viendra", "viendrons", "viendrez", "viendront", "vienne", "viennes", "venions", "veniez", "viennent", "vinsse", "vinsses",
	"vînt", "vinssions", "vinssiez", "vinssent", "viendrais", "viendrait", "viendrions", "viendriez", "viendraient", "venant", "dois", "doit",
	"devons", "devez", "doivent", "dois-je", "dois-tu", "doit-il", "doit-elle", "doit-on", "devons-nous", "devez-vous", "doivent-elles",
	"doivent-ils", "dus", "dut", "dûmes", "dûtes", "durent", "dû", "devais", "devait", "devions", "deviez", "devaient", "devrai", "devras",
	"devra", "devrons", "devrez", "devront", "doive", "doives", "devions", "deviez", "doivent", "dusse", "dusses", "dût", "dussions", "dussiez",
	"dussent", "devrais", "devrait", "devrions", "devriez", "devraient", "devant", "peux", "peut", "pouvons", "pouvez", "peuvent", "peux-je",
	"peux-tu", "peut-il", "peut-elle", "peut-on", "pouvons-nous", "pouvez-vous", "peuvent-ils", "peuvent-elles", "pus", "put", "pûmes", "pûtes",
	"purent", "pu", "pouvais", "pouvait", "pouvions", "pouviez", "pouvaient", "pourrai", "pourras", "pourra", "pourrons", "pourrez", "pourront",
	"puisse", "puisses", "puisse", "puissions", "puissiez", "puissent", "pusse", "pusses", "pût", "pussions", "pussiez", "pussent", "pourrais",
	"pourrait", "pourrions", "pourriez", "pourraient", "pouvant", "semble", "sembles", "semblons", "semblez", "semblent", "semble-je", "sembles-il",
	"sembles-elle", "sembles-on", "semblons-nous", "semblez-vous", "semblent-ils", "semblent-elles", "semblai", "semblas", "sembla", "semblâmes",
	"semblâtes", "semblèrent", "semblais", "semblait", "semblions", "sembliez", "semblaient", "semblerai", "sembleras", "semblera", "semblerons",
	"semblerez", "sembleront", "semblé", "semblions", "sembliez", "semblent", "semblasse", "semblasses", "semblât", "semblassions", "semblassiez",
	"semblassent", "semblerais", "semblerait", "semblerions", "sembleriez", "sembleraient", "parais", "paraît", "ait", "paraissons", "paraissez",
	"paraissent", "parais-je", "parais-tu", "paraît-il", "paraît-elle", "paraît-on", "ait-il", "ait-elle", "ait-on", "paraissons-nous",
	"paraissez-vous", "paraissent-ils", "paraissent-elles", "parus", "parut", "parûmes", "parûtes", "parurent", "paraissais", "paraissait",
	"paraissions", "paraissiez", "paraissaient", "paraîtrai", "paraîtras", "paraîtra", "paraîtrons", "paraîtrez", "paraîtront", "aitrai", "aitras",
	"aitra", "aitrons", "aitrez", "aitront", "paru", "paraisse", "paraisses", "paraissions", "paraissiez", "paraissent", "parusse", "parusses",
	"parût", "parussions", "parussiez", "parussent", "paraîtrais", "paraîtrait", "paraîtrions", "paraîtriez", "paraîtraient", "paraitrais",
	"paraitrait", "paraitrions", "paraitriez", "paraitraient", "paraissant", "mets", "met", "mettons", "mettez", "mettent", "mets-je", "mets-tu",
	"met-il", "met-elle", "met-on", "mettons-nous", "mettez-vous", "mettent-ils", "mettent-elles", "mis", "mit", "mîmes", "mîtes", "mirent",
	"mettais", "mettait", "mettions", "mettiez", "mettaient", "mettrai", "mettras", "mettra", "mettrons", "mettrez", "mettront", "mette", "mettes",
	"mettions", "mettiez", "mettent", "misse", "misses", "mît", "missions", "missiez", "missent", "mettrais", "mettrais", "mettrait", "mettrions",
	"mettriez", "mettraient", "mettant", "finis", "finit", "finissons", "finissez", "finissent", "finis-je", "finis-tu", "finit-il", "finit-elle",
	"finit-on", "finissons-nous", "finissez-vous", "finissent-ils", "finissent-elles", "finîmes", "finîtes", "finirent", "finissais", "finissait",
	"finissions", "finissiez", "finissaient", "finirai", "finiras", "finira", "finirons", "finirez", "finiront", "fini", "finisse", "finisses",
	"finissions", "finissiez", "finissent", "finît", "finirais", "finirait", "finirions", "finiriez", "finiraient", "finissant" ];

let otherAuxiliariesInfinitive = [ "avoir", "aller", "venir", "devoir", "pouvoir", "sembler", "paraître", "paraitre", "mettre", "finir" ];

let copula = [ "suis", "es", "est", "est-ce", "n'est", "sommes", "êtes", "sont", "suis-je", "es-tu", "est-il", "est-elle", "est-on", "sommes-nous",
	"êtes-vous", "sont-ils", "sont-elles", "étais", "était", "étions", "étiez", "étaient", "serai", "seras", "sera", "serons", "serez", "seront",
	"serais", "serait", "serions", "seriez", "seraient", "sois", "soit", "soyons", "soyez", "soient", "été" ];

let copulaInfinitive = [ "être" ];

/*
’Excepté' not filtered because might also be participle of 'excepter', 'concernant' not filtered because might also be present participle
of 'concerner'.
Not filtered because of primary meaning: 'grâce à' ('grace'), 'en face' ('face'), 'en dehors' ('outside'), 'à côté' ('side'),
'à droite' ('right'), 'à gauche' ('left'). 'voici' already included in the locative pronoun list.
'hors' for 'hors de', 'quant' for 'quant à'. ‘travers’ is part of 'à travers.'
 */

let prepositions = [ "à", "après", "au-delà", "au-dessous", "au-dessus", "avant", "avec", "concernant", "chez", "contre", "dans", "d'après", "de",
	"depuis", "derrière", "dès", "devant", "durant", "en", "entre", "envers", "environ", "hormis", "hors", "jusque", "jusqu'à", "jusqu'au",
	"jusqu'aux", "loin", "malgré", "moyennant", "outre", "par", "parmi", "pendant", "pour", "près", "quant", "sans", "sauf", "selon", "sous",
	"suivant", "sur", "travers", "vers", "voilà" ];

let coordinatingConjunctions = [  "car", "donc", "et", "mais", "ni", "or", "ou" ];

/*
Et...et, ou...ou, ni...ni – in their simple forms already in other lists. 'd'une', 'd'autre' are part of 'd'une part…d'autre part'.
'sinon' is part of 'sinon…du moins'.
*/

let correlativeConjunctions = [ "non", "pas", "seulement", "si", "alors", "ainsi", "autant", "aussi", "sitôt", "aussitôt", "d'une",
	 "d'autre", "sinon" ];


/*
Many subordinating conjunctions are already included in the prepositions list, transition words list or pronominal adverbs list.
'autant', 'avant', 'cependant', 'd'autant', 'd'ici', 'tandis' part of the complex form with 'que', 'lors' as a part of 'lors même que',
'parce' as a part of 'parce que'
 */

let subordinatingConjunctions = [ "afin", "autant", "avant", "cependant", "comme", "d'autant", "d'ici", "quand", "lors", "lorsque",
	"parce", "puisque",  "que", "quoique", "si", "tandis" ];

/*
 These verbs are frequently used in interviews to indicate questions and answers.
'Dire' ('to say'), 'demander' ('to ask'), 'penser' ('to think')– 16 forms; more specific verbs – 4 forms
'affirmer', 'ajouter' ('to add'), 'analyser', 'avancer', 'écrire' ('to write'), 'indiquer', 'poursuivre' ('to pursue'), 'préciser', 'résumer',
 'souvenir' ('to remember'), 'témoigner' ('to witness') – only VS forms (due to their more general nature)
 */

let interviewVerbs = [ "dit", "disent", "dit-il", "dit-elle", "disent-ils", "disent-elles", "disait", "disait-il", "disait-elle", "disaient-ils",
	"disaient-elles", "dirent", "demande", "demandent", "demande-t-il", "demande-t-elle", "demandent-ils", "demandent-elles", "demandait",
	"demandaient", "demandait-il", "demandait-elle", "demandaient-ils", "demandaient-elles", "demanda", "demanda-t-il", "demanda-t-elle",
	"demandé", "pense", "pensent", "pense-t-il", "pense-t-elle", "pensent-ils", "pensent-elles", "pensait", "pensaient", "pensait-il",
	"pensait-elle", "pensaient-ils", "pensaient-elles", "pensa", "pensa-t-il", "pensa-t-elle", "pensé", "affirme", "affirme-t-il",
	"affirme-t-elle", "affirmé", "avoue", "avoue-t-il", "avoue-t-elle", "avoué", "concède", "concède-t-il", "concède-t-elle", "concédé",
	"confie", "confie-t-il", "confie-t-elle", "confié", "continue", "continue-t-il", "continue-t-elle", "continué", "déclame", "déclame-t-il",
	"déclame-t-elle", "déclamé", "déclare", "déclare-t-il", "déclare-t-elle", "déclaré", "déplore", "déplore-t-il", "déplore-t-elle",
	"déploré", "explique", "explique-t-il", "explique-t-elle", "expliqué", "lance", "lance-t-il", "lance-t-elle", "lancé", "narre",
	"narre-t-il", "narre-t-elle", "narré", "raconte", "raconte-t-il", "raconte-t-elle", "raconté", "rappelle", "rappelle-t-il",
	"rappelle-t-elle", "rappelé", "réagit", "réagit-il", "réagit-elle", "réagi", "répond", "répond-il", "répond-elle", "répondu", "rétorque",
	"rétorque-t-il", "rétorque-t-elle", "rétorqué", "souligne", "souligne-t-il", "souligne-t-elle", "souligné", "affirme-t-il", "affirme-t-elle",
	"ajoute-t-il", "ajoute-t-elle", "analyse-t-il", "analyse-t-elle", "avance-t-il", "avance-t-elle", "écrit-il", "écrit-elle", "indique-t-il",
	"indique-t-elle", "poursuit-il", "poursuit-elle", "précise-t-il", "précise-t-elle", "résume-t-il", "résume-t-elle", "souvient-il",
	"souvient-elle", "témoigne-t-il", "témoigne-t-elle" ];

let interviewVerbsInfinitive = [ "dire", "penser", "demander", "concéder", "continuer", "confier", "déclamer", "déclarer", "déplorer", "expliquer",
	"lancer", "narrer", "raconter", "rappeler", "réagir", "répondre", "rétorquer", "souligner", "affirmer", "ajouter", "analyser", "avancer",
	"écrire", "indiquer", "poursuivre", "préciser", "résumer", "témoigner" ];

// These transition words were not included in the list for the transition word assessment for various reasons.
let additionalTransitionWords = [ "seulement", "encore", "éternellement", "aussitôt", "immédiatement", "compris", "comprenant",
	"inclus", "naturellement", "particulièrement", "notablement", "actuellement", "maintenant", "aujourd'hui", "ordinairement", "généralement",
	"habituellement", "ordinairement", "d'habitude", "vraiment", "finalement", "uniquement", "premier", "première", "deuxième", "troisième",
	"peut-être", "probablement", "initialement", "globalement", "déjà", "c.-à-d.", "souvent", "fréquemment", "régulièrement", "simplement",
	"éventuellement", "quelquefois", "parfois", "probable", "plausible", "jamais", "toujours", "incidemment", "accidentellement", "récemment",
	"dernièrement", "relativement", "clairement", "évidemment", "apparemment", "pourvu", "toutefois", "d'ailleurs" ];

let intensifiers = [ "assez", "trop", "tellement", "presque", "extrêmement", "très", "absolument", "extrêmement", "près", "quasi", "quasiment",
	"plutôt", "fort" ];

// These verbs convey little meaning.
let delexicalizedVerbs = [ "ont-ils", "ont-elles", "j'eus", "eus", "eut", "eûmes", "eûtes", "eurent", "j'avais", "avais", "avait", "avions", "aviez",
	"avaient", "j'aurai", "aurai", "auras", "aura", "aurons", "aurez", "auront", "eu", "fais", "fait", "faisons", "faites", "font", "fais-je",
	"fait-il", "fait-elle", "fait-on", "faisons-nous", "faites-vous", "font-ils", "font-elles", "fis", "fit", "fîmes", "fîtes", "firent", "faisais",
	"faisait", "faisions", "faisiez", "faisaient", "ferai", "feras", "fera", "ferons", "ferez", "feront", "veux", "veut", "voulons", "voulez",
	"veulent", "voulus", "voulut", "voulûmes", "voulûtes", "voulurent", "voulais", "voulait", "voulions", "vouliez", "voulaient", "voudrai",
	"voudras", "voudra", "voudrons", "voudrez", "voudront", "voulu", "veux-je", "veux-tu", "veut-il", "veut-elle", "veut-on", "voulons-nous",
	"voulez-vous", "veulent-ils", "veulent-elles", "voudrais", "voudrait", "voudrions", "voudriez", "voudraient", "voulant" ];

let delexicalizedVerbsInfinitive = [ "avoir", "faire", "vouloir" ];

/* These adjectives and adverbs are so general, they should never be suggested as a (single) keyword.
 Keyword combinations containing these adjectives/adverbs are fine.
 'Dernier' is also included in generalAdjectivesAdverbsPreceding because it can be used both before and after a noun.
 */
let generalAdjectivesAdverbs = [ "antérieur", "antérieures", "antérieurs", "antérieure", "précédent", "précédents", "précédente",
	"précédentes",  "facile", "faciles", "simple", "simples", "vite", "vites", "vitesse", "vitesses", "difficile", "difficiles",
	"propre", "propres", "long", "longe", "longs", "longes", "longue", "longues", "bas", "basse",
	"basses", "ordinaire", "ordinaires", "bref", "brefs", "brève", "brèves", "sûr", "sûrs", "sûre", "sûres", "sure", "sures",
	"surs", "habituel", "habituels", "habituelle", "habituelles", "soi-disant", "surtout",
	"récent", "récents", "récente", "récentes", "total", "totaux", "totale", "totales", "complet", "complets", "complète",
	"complètes", "possible", "possibles", "communément", "constamment", "facilement", "continuellement", "directement",
	"presque", "légèrement", "environ", "dernier", "derniers", "dernière", "dernières", "différent", "différents", "différente",
	"différentes", "autre", "autres", "similaire", "similaires",
	"pareil", "pareils", "pareille", "pareilles", "largement", "beaucoup", "mal", "super", "bien", "pire", "pires", "suivant",
	"suivants", "suivante", "suivantes", "prochain", "prochaine", "prochains", "prochaines", "proche", "proches", "fur" ];

// 'Dernier' is also included in generalAdjectivesAdverbs because it can be used both before and after a noun.
let generalAdjectivesAdverbsPreceding = [ "nouveau", "nouvel", "nouvelle", "nouveaux", "nouvelles", "vieux", "vieil",
	"vieille", "vieux", "vieilles", "beau", "bel", "belle", "beau",
	"belles", "bon", "bons", "bonne", "bonnes", "grand", "grande", "grands", "grandes", "haut", "hauts", "haute", "hautes",
	"petit", "petite", "petits", "petites", "meilleur",
	"meilleurs", "meilleure", "meilleures", "joli", "jolis", "jolie", "jolies", "gros", "grosse", "grosses", "mauvais", "mauvaise",
	"mauvaises", "derniers", "dernière", "dernières" ];

let interjections = [ "ah", "ha", "oh", "ho", "bis", "plouf", "vlan", "ciel", "pouf", "paf", "crac", "enfin", "hurrah",
	"allo", "stop", "bravo", "ô", "eh", "hé", "aïe", "oef", "ahi", "fi", "zest", "ça", "hem", "holà", "chut", "si", "voilà" ];

// These words and abbreviations are frequently used in recipes in lists of ingredients.
let recipeWords = [ "mg", "g", "kg", "ml", "dl", "cl", "l", "grammes", "gram", "once", "onces", "oz", "lbs", "càc", "cc", "càd", "càs", "càt",
	"cd", "cs", "ct" ];

let timeWords = [ "seconde", "secondes", "minute", "minutes", "heure", "heures", "journée", "journées", "semaine", "semaines", "mois", "année",
	"années" ];

let vagueNouns = [ "chose", "choses", "façon", "façons", "ceux", "pièce", "pièces", "truc", "trucs", "fois", "cas", "aspect", "aspects", "objet",
	"objets", "idée", "idées", "thème", "thèmes", "sujet", "sujets", "personne", "personnes", "manière", "manières", "sorte", "sortes" ];

let miscellaneous = [ "ne", "oui", "non", "d'accord", "amen", "%", "euro", "euros", "rien", "plus", "moins", "même", "mêmes", "aussi", "etc." ];

module.exports = function() {
	return {
		articles: articles,
		personalPronouns: personalPronounsNominative.concat( personalPronounsAccusative, personalPronounsDative,
			possessivePronouns, personalPronounsStressed ),
		prepositions: prepositions,
		demonstrativePronouns: demonstrativePronouns,
		conjunctions: coordinatingConjunctions.concat( subordinatingConjunctions, correlativeConjunctions ),
		verbs: copula.concat( interviewVerbs, otherAuxiliaries, delexicalizedVerbs ),
		quantifiers: quantifiers,
		relativePronouns: relativePronouns,
		interrogatives: interrogativeProAdverbs.concat( interrogativeAdjectives ),
		transitionWords: transitionWords.concat( additionalTransitionWords ),
		// These verbs that should be filtered at the beginning of prominent word combinations.
		infinitives: otherAuxiliariesInfinitive.concat( delexicalizedVerbsInfinitive, copulaInfinitive, interviewVerbsInfinitive ),
		miscellaneous: miscellaneous,
		interjections: interjections,
		pronominalAdverbs: pronominalAdverbs,
		reflexivePronouns: reflexivePronouns,
		cardinalNumerals: cardinalNumerals,
		ordinalNumerals: ordinalNumerals,
		indefinitePronouns: indefinitePronouns,
		locativeAdverbs: locativeAdverbs,
		intensifiers: intensifiers,
		generalAdjectivesAdverbs: generalAdjectivesAdverbs,
		generalAdjectivesAdverbsPreceding: generalAdjectivesAdverbsPreceding,
		recipeWords: recipeWords,
		timeWords: timeWords,
		all: articles.concat( cardinalNumerals, ordinalNumerals, demonstrativePronouns, possessivePronouns, reflexivePronouns,
			personalPronounsNominative,
			personalPronounsAccusative, relativePronouns, quantifiers, indefinitePronouns, interrogativeProAdverbs, pronominalAdverbs,
			locativeAdverbs, otherAuxiliaries, otherAuxiliariesInfinitive, interrogativeAdjectives, copula, copulaInfinitive, prepositions,
			coordinatingConjunctions, correlativeConjunctions, subordinatingConjunctions, interviewVerbs, interviewVerbsInfinitive,
			transitionWords, additionalTransitionWords, intensifiers, delexicalizedVerbs, delexicalizedVerbsInfinitive, interjections,
			generalAdjectivesAdverbs, generalAdjectivesAdverbsPreceding, recipeWords, vagueNouns, miscellaneous, timeWords ),
	};
};
