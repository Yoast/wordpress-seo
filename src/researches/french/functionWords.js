let transitionWords = require( "./transitionWords.js" )().singleWords;

/**
 * Returns an object with exceptions for the prominent words researcher
 * @returns {Object} The object filled with exception arrays.
 */

let articles = [ "le", "la", "les", "un", "une", "des", "aux", "du", "au", "d'un", "d'une", "l'un", "l'une" ];

let cardinalNumerals = [ "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix", "onze", "douze", "treize", "quatorze",
	"quinze", "seize", "dix-sept", "dix-huit", "dix-neuf", "vingt", "trente", "quarante", "cinquante", "soixante", "soixante-dix",
	"quatre-vingt", "quatre-vingt-dix", "septante", "huitante", "octante", "nonante", "cent", "mille", "million", "milliard" ];

// 'premier' and 'première' are not included because of their secondary meanings ('prime minister', '[movie] premiere')
let ordinalNumerals = [ "second", "secondes", "deuxième", "deuxièmes", "troisième", "troisièmes", "quatrième", "quatrièmes", "cinquième",
	"cinquièmes", "sixième", "sixièmes", "septième", "septièmes", "huitième", "huitièmes", "neuvième", "neuvièmes",
	"dixième", "dixièmes", "onzième", "onzièmes", "douzième", "douzièmes", "treizième", "treizièmes", "quatorzième",
	"quatorzièmes", "quinzième", "quinzièmes", "seizième", "seizièmes", "dix-septième", "dix-septièmes", "dix-huitième",
	"dix-huitièmes", "dix-neuvième", "dix-neuvièmes", "vingtième", "vingtièmes" ];

let personalPronounsNominative = [ "je", "tu", "il", "elle", "on", "nous", "vous", "ils", "elles", "qu'il", "qu'elle",
	"qu'ils", "qu'elles", "qu'on", "d'elle", "d'elles" ];

let personalPronounsStressed = [ "moi", "toi", "lui", "soi", "eux", "d'eux", "qu'eux" ];

// Le, la, les are already included in the articles list.
let personalPronounsAccusative = [ "me", "te" ];

let demonstrativePronouns = [ "celui", "celle", "ceux", "celles", "ce", "celui-ci", "celui-là", "celle-ci", "celle-là", "ceux-ci",
	"ceux-là", "celles-ci", "celles-là", "ceci", "cela", "ça", "cette", "cet", "ces" ];

let possessivePronouns = [ "mon", "ton", "son", "ma", "ta", "sa", "mes", "tes", "ses", "notre", "votre", "leur", "nos", "vos", "leurs" ];

let quantifiers = [ "beaucoup", "peu", "quelque", "quelques", "tous", "tout", "toute", "toutes", "plusieurs", "plein", "chaque",
	"suffisant", "suffisante", "suffisantes", "suffisants", "faible", "moins", "tant", "plus", "divers", "diverse", "diverses" ];

// The remaining reflexive personal pronouns are already included in other pronoun lists.
let reflexivePronouns = [ "se" ];

let indefinitePronouns = [ "aucun", "aucune", "autre", "autres", "d'autres", "certain", "certaine", "certaines", "certains",
	"chacun", "chacune", "même", "mêmes", "quelqu'un", "quelqu'une", "quelques'uns", "quelques'unes", "autrui", "nul",
	"personne", "quiconque", "rien", "d'aucunes", "d'aucuns", "nuls", "nules", "l'autre", "tel", "telle",
	"tels", "telles" ];

let relativePronouns = [ "qui", "que", "lequel", "laquelle", "auquel", "auxquels", "auxquelles", "duquel", "desquels", "desquelles", "dont", "où",
	"quoi" ];

let interrogativeProAdverbs = [ "combien", "comment", "pourquoi", "d'où" ];

let interrogativeAdjectives = [ "quel", "quels", "quelle" ];

let pronominalAdverbs = [ "y", "n'y" ];

let locativeAdverbs = [ "là", "ici", "d'ici", "voici" ];

// 'Vins' is not included because it also means 'wines'.
let otherAuxiliaries = [ "a", "a-t-elle", "a-t-il", "a-t-on", "ai", "ai-je", "aie", "as", "as-tu", "aura", "aurai", "auraient", "aurais", "aurait",
	"auras", "aurez", "auriez", "aurons", "auront", "avaient", "avais", "avait", "avez", "avez-vous", "aviez", "avions", "avons", "avons-nous",
	"ayez", "ayons", "eu", "eûmes", "eurent", "eus", "eut", "eûtes", "j'ai", "j'aurai", "j'avais", "j'eus", "ont", "ont-elles", "ont-ils", "vais",
	"vas", "va", "allons", "allez", "vont", "vais-je", "vas-tu", "va-t-il", "va-t-elle", "va-t-on", "allons-nous", "allez-vous", "vont-elles",
	"vont-ils", "allé", "allés", "j'allai", "allai", "allas", "alla", "allâmes", "allâtes", "allèrent", "j'allais", "allais", "allait", "allions",
	"alliez", "allaient", "j'irai", "iras", "ira", "irons", "irez", "iront", "j'aille", "aille", "ailles", "aillent", "j'allasse", "allasse",
	"allasses", "allât", "allassions", "allassiez", "allassent", "j'irais", "irais", "irait", "irions", "iriez", "iraient", "allant", "viens",
	"vient", "venons", "venez", "viennent", "viens-je", "viens-de", "vient-il", "vient-elle", "vient-on", "venons-nous", "venez-vous",
	"viennent-elles", "viennent-ils", "vins", "vint", "vînmes", "vîntes", "vinrent", "venu", "venus", "venais", "venait", "venions", "veniez",
	"venaient", "viendrai", "viendras", "viendra", "viendrons", "viendrez", "viendront", "vienne", "viennes", "vinsse", "vinsses", "vînt",
	"vinssions", "vinssiez", "vinssent", "viendrais", "viendrait", "viendrions", "viendriez", "viendraient", "venant", "dois", "doit", "devons",
	"devez", "doivent", "dois-je", "dois-tu", "doit-il", "doit-elle", "doit-on", "devons-nous", "devez-vous", "doivent-elles", "doivent-ils",
	"dus", "dut", "dûmes", "dûtes", "durent", "dû", "devais", "devait", "devions", "deviez", "devaient", "devrai", "devras", "devra", "devrons",
	"devrez", "devront", "doive", "doives", "dusse", "dusses", "dût", "dussions", "dussiez", "dussent", "devrais", "devrait", "devrions",
	"devriez", "devraient", "peux", "peut", "pouvons", "pouvez", "peuvent", "peux-je", "peux-tu", "peut-il", "peut-elle", "peut-on", "pouvons-nous",
	"pouvez-vous", "peuvent-ils", "peuvent-elles", "pus", "put", "pûmes", "pûtes", "purent", "pu", "pouvais", "pouvait", "pouvions", "pouviez",
	"pouvaient", "pourrai", "pourras", "pourra", "pourrons", "pourrez", "pourront", "puisse", "puisses", "puissions", "puissiez", "puissent",
	"pusse", "pusses", "pût", "pussions", "pussiez", "pussent", "pourrais", "pourrait", "pourrions", "pourriez", "pourraient", "pouvant",
	"semble", "sembles", "semblons", "semblez", "semblent", "semble-je", "sembles-il", "sembles-elle", "sembles-on", "semblons-nous", "semblez-vous",
	"semblent-ils", "semblent-elles", "semblai", "semblas", "sembla", "semblâmes", "semblâtes", "semblèrent", "semblais", "semblait", "semblions",
	"sembliez", "semblaient", "semblerai", "sembleras", "semblera", "semblerons", "semblerez", "sembleront", "semblé", "semblasse", "semblasses",
	"semblât", "semblassions", "semblassiez", "semblassent", "semblerais", "semblerait", "semblerions", "sembleriez", "sembleraient", "parais",
	"paraît", "ait", "paraissons", "paraissez", "paraissent", "parais-je", "parais-tu", "paraît-il", "paraît-elle", "paraît-on", "ait-il", "ait-elle",
	"ait-on", "paraissons-nous", "paraissez-vous", "paraissent-ils", "paraissent-elles", "parus", "parut", "parûmes", "parûtes", "parurent",
	"paraissais", "paraissait", "paraissions", "paraissiez", "paraissaient", "paraîtrai", "paraîtras", "paraîtra", "paraîtrons", "paraîtrez",
	"paraîtront", "paru", "paraisse", "paraisses", "parusse", "parusses", "parût",
	"parussions", "parussiez", "parussent", "paraîtrais", "paraîtrait", "paraîtrions", "paraîtriez", "paraîtraient", "paraitrais", "paraitrait",
	"paraitrions", "paraitriez", "paraitraient", "paraissant", "mets", "met", "mettons", "mettez", "mettent", "mets-je", "mets-tu", "met-il",
	"met-elle", "met-on", "mettons-nous", "mettez-vous", "mettent-ils", "mettent-elles", "mis", "mit", "mîmes", "mîtes", "mirent", "mettais",
	"mettait", "mettions", "mettiez", "mettaient", "mettrai", "mettras", "mettra", "mettrons", "mettrez", "mettront", "mette", "mettes", "misse",
	"misses", "mît", "missions", "missiez", "missent", "mettrais", "mettrait", "mettrions", "mettriez", "mettraient", "mettant", "finis", "finit",
	"finissons", "finissez", "finissent", "finis-je", "finis-tu", "finit-il", "finit-elle", "finit-on", "finissons-nous", "finissez-vous",
	"finissent-ils", "finissent-elles", "finîmes", "finîtes", "finirent", "finissais", "finissait", "finissions", "finissiez", "finissaient",
	"finirai", "finiras", "finira", "finirons", "finirez", "finiront", "fini", "finisse", "finisses", "finît", "finirais", "finirait", "finirions",
	"finiriez", "finiraient", "finissant", "n'a", "n'ai", "n'aie", "n'as", "n'aura", "n'aurai", "n'auraient", "n'aurais", "n'aurait",
	"n'auras", "n'aurez", "n'auriez", "n'aurons", "n'auront", "n'avaient", "n'avais", "n'avait", "n'avez", "n'avez-vous", "n'aviez",
	"n'avions", "n'avons", "n'avons-nous", "n'ayez", "n'ayons", "n'ont", "n'ont-elles", "n'ont-ils", "n'allons", "n'allez", "n'allais",
	"n'allait", "n'allions", "n'alliez", "n'allaient", "n'iras", "n'ira", "n'irons", "n'irez", "n'iront", "qu'a" ];

let otherAuxiliariesInfinitive = [ "avoir", "aller", "venir", "devoir", "pouvoir", "sembler", "paraître", "paraitre", "mettre", "finir",
	"d'avoir", "d'aller", "n'avoir" ];

let copula = [ "suis", "es", "est", "est-ce", "n'est", "sommes", "êtes", "sont", "suis-je", "es-tu", "est-il", "est-elle", "est-on", "sommes-nous",
	"êtes-vous", "sont-ils", "sont-elles", "étais", "était", "étions", "étiez", "étaient", "serai", "seras", "sera", "serons", "serez", "seront",
	"serais", "serait", "serions", "seriez", "seraient", "sois", "soit", "soyons", "soyez", "soient", "été", "n'es", "n'est-ce", "n'êtes", "n'était",
	"n'étais", "n'étions", "n'étiez", "n'étaient", "qu'est" ];

let copulaInfinitive = [ "être", "d'être" ];

/*
’Excepté' not filtered because might also be participle of 'excepter', 'concernant' not filtered because might also be present participle
of 'concerner'.
Not filtered because of primary meaning: 'grâce à' ('grace'), 'en face' ('face'), 'en dehors' ('outside'), 'à côté' ('side'),
'à droite' ('right'), 'à gauche' ('left'). 'voici' already included in the locative pronoun list.
'hors' for 'hors de', 'quant' for 'quant à'. ‘travers’ is part of 'à travers.'
 */

let prepositions = [ "à", "après", "d'après", "au-delà", "au-dessous", "au-dessus", "avant", "avec", "concernant",
	"chez", "contre", "dans", "de", "depuis", "derrière", "dès", "devant", "durant", "en", "entre", "envers", "environ",
	"hormis", "hors", "jusque", "jusqu'à", "jusqu'au", "jusqu'aux",	"loin", "moyennant", "outre", "par", "parmi",
	"pendant", "pour", "près", "quant", "sans", "sous", "sur", "travers", "vers", "voilà" ];

let coordinatingConjunctions = [ "et", "ni", "or", "ou" ];

/*
Et...et, ou...ou, ni...ni – in their simple forms already in other lists. 'd'une', 'd'autre' are part of 'd'une part…d'autre part'.
'sinon' is part of 'sinon…du moins'.
*/

let correlativeConjunctions = [ "non", "pas", "seulement", "sitôt", "aussitôt", "d'autre" ];


/*
Many subordinating conjunctions are already included in the prepositions list, transition words list or pronominal adverbs list.
'autant', 'd'autant', 'd'ici', 'tandis' part of the complex form with 'que', 'lors' as a part of 'lors même que',
'parce' as a part of 'parce que'
 */

let subordinatingConjunctions = [ "afin", "autant", "comme", "d'autant", "d'ici", "quand", "lors", "parce", "si", "tandis" ];

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
let additionalTransitionWords = [ "encore", "éternellement", "immédiatement", "compris", "comprenant", "inclus", "naturellement", "particulièrement",
	"notablement", "actuellement", "maintenant", "ordinairement", "généralement", "habituellement", "d'habitude", "vraiment",
	"finalement", "uniquement", "peut-être", "initialement", "déjà", "c.-à-d", "souvent", "fréquemment", "régulièrement", "simplement",
	"éventuellement", "quelquefois", "parfois", "probable", "plausible", "jamais", "toujours", "incidemment", "accidentellement", "récemment",
	"dernièrement", "relativement", "clairement", "évidemment", "apparemment", "pourvu" ];

let intensifiers = [ "assez", "trop", "tellement", "presque", "très", "absolument", "extrêmement", "quasi", "quasiment", "fort" ];

// These verbs convey little meaning.
let delexicalizedVerbs = [ "fais", "fait", "faisons", "faites", "font", "fais-je",
	"fait-il", "fait-elle", "fait-on", "faisons-nous", "faites-vous", "font-ils", "font-elles", "fis", "fit", "fîmes", "fîtes", "firent", "faisais",
	"faisait", "faisions", "faisiez", "faisaient", "ferai", "feras", "fera", "ferons", "ferez", "feront", "veux", "veut", "voulons", "voulez",
	"veulent", "voulus", "voulut", "voulûmes", "voulûtes", "voulurent", "voulais", "voulait", "voulions", "vouliez", "voulaient", "voudrai",
	"voudras", "voudra", "voudrons", "voudrez", "voudront", "voulu", "veux-je", "veux-tu", "veut-il", "veut-elle", "veut-on", "voulons-nous",
	"voulez-vous", "veulent-ils", "veulent-elles", "voudrais", "voudrait", "voudrions", "voudriez", "voudraient", "voulant" ];

let delexicalizedVerbsInfinitive = [ "faire", "vouloir" ];

/* These adjectives and adverbs are so general, they should never be suggested as a (single) keyword.
 Keyword combinations containing these adjectives/adverbs are fine.
 'Dernier' is also included in generalAdjectivesAdverbsPreceding because it can be used both before and after a noun,
 and it should be filtered out either way.
 */
let generalAdjectivesAdverbs = [ "antérieur", "antérieures", "antérieurs", "antérieure", "précédent", "précédents", "précédente",
	"précédentes", "facile", "faciles", "simple", "simples", "vite", "vites", "vitesse", "vitesses", "difficile", "difficiles",
	"propre", "propres", "long", "longe", "longs", "longes", "longue", "longues", "bas", "basse", "basses", "ordinaire", "ordinaires",
	"bref", "brefs", "brève", "brèves", "sûr", "sûrs", "sûre", "sûres", "sure", "sures", "surs", "habituel", "habituels", "habituelle",
	"habituelles", "soi-disant", "surtout", "récent", "récents", "récente", "récentes", "total", "totaux", "totale", "totales",
	"complet", "complets", "complète", "complètes", "possible", "possibles", "communément", "constamment", "facilement", "continuellement",
	"directement", "légèrement", "dernier", "derniers", "dernière", "dernières", "différent", "différents",
	"différente", "différentes", "similaire", "similaires", "pareil", "pareils", "pareille", "pareilles", "largement",
	"mal", "super", "bien", "pire", "pires", "suivants", "suivante", "suivantes", "prochain", "prochaine", "prochains",
	"prochaines", "proche", "proches", "fur" ];

/*
 'Dernier' is also included in generalAdjectivesAdverbs because it can be used both before and after a noun,
 and it should be filtered out either way.
 */
let generalAdjectivesAdverbsPreceding = [ "nouveau", "nouvel", "nouvelle", "nouveaux", "nouvelles", "vieux", "vieil",
	"vieille", "vieilles", "beau", "bel", "belle", "belles", "bon", "bons", "bonne", "bonnes", "grand", "grande",
	"grands", "grandes", "haut", "hauts", "haute", "hautes", "petit", "petite", "petits", "petites", "meilleur",
	"meilleurs", "meilleure", "meilleures", "joli", "jolis", "jolie", "jolies", "gros", "grosse", "grosses", "mauvais",
	"mauvaise", "mauvaises", "dernier", "derniers", "dernière", "dernières" ];

let interjections = [ "ah", "ha", "oh", "ho", "bis", "plouf", "vlan", "ciel", "pouf", "paf", "crac", "hurrah",
	"allo", "stop", "bravo", "ô", "eh", "hé", "aïe", "oef", "ahi", "fi", "zest", "hem", "holà", "chut" ];

// These words and abbreviations are frequently used in recipes in lists of ingredients.
let recipeWords = [ "mg", "g", "kg", "ml", "dl", "cl", "l", "grammes", "gram", "once", "onces", "oz", "lbs", "càc", "cc", "càd", "càs", "càt",
	"cd", "cs", "ct" ];

let timeWords = [ "minute", "minutes", "heure", "heures", "journée", "journées", "semaine", "semaines", "mois", "année",
	"années", "aujourd'hui", "demain", "hier", "après-demain", "avant-hier" ];

let vagueNouns = [ "chose", "choses", "façon", "façons", "pièce", "pièces", "truc", "trucs", "fois", "cas", "aspect", "aspects", "objet",
	"objets", "idée", "idées", "thème", "thèmes", "sujet", "sujets", "personnes", "manière", "manières", "sorte", "sortes" ];

let miscellaneous = [ "ne", "oui", "d'accord", "amen", "euro", "euros", "etc" ];

let titlesPreceding = [ "mme", "mmes", "mlle", "mlles", "mm", "dr", "pr" ];

let titlesFollowing = [ "jr", "sr" ];

export default function() {
	return {
		// These word categories are filtered at the ending of word combinations.
		filteredAtEnding: [].concat( ordinalNumerals, otherAuxiliariesInfinitive, delexicalizedVerbsInfinitive, copulaInfinitive,
			interviewVerbsInfinitive, generalAdjectivesAdverbsPreceding ),

		// These word categories are filtered at the beginning of word combinations.
		filteredAtBeginning: generalAdjectivesAdverbs,

		// These word categories are filtered at the beginning and ending of word combinations.
		filteredAtBeginningAndEnding: [].concat( articles, prepositions, coordinatingConjunctions, demonstrativePronouns, intensifiers,
			quantifiers, possessivePronouns ),

		// These word categories are filtered everywhere within word combinations.
		filteredAnywhere: [].concat( transitionWords, personalPronounsNominative, personalPronounsAccusative, personalPronounsStressed,
			reflexivePronouns, interjections, cardinalNumerals, copula, interviewVerbs, otherAuxiliaries, delexicalizedVerbs,
			indefinitePronouns, correlativeConjunctions, subordinatingConjunctions, interrogativeAdjectives, relativePronouns,
			locativeAdverbs, miscellaneous, pronominalAdverbs, recipeWords, timeWords, vagueNouns ),

		// These word categories cannot directly precede a passive participle.
		cannotDirectlyPrecedePassiveParticiple: [].concat( articles, prepositions, personalPronounsStressed,
			personalPronounsAccusative, possessivePronouns, reflexivePronouns, indefinitePronouns, interrogativeProAdverbs,
			interrogativeAdjectives, cardinalNumerals, ordinalNumerals, delexicalizedVerbs, interviewVerbs, delexicalizedVerbsInfinitive ),

		// These word categories cannot intervene between an auxiliary and a corresponding passive participle.
		cannotBeBetweenPassiveAuxiliaryAndParticiple: [].concat( otherAuxiliaries, otherAuxiliariesInfinitive ),

		// This export contains all of the above words.
		all: [].concat( articles, cardinalNumerals, ordinalNumerals, demonstrativePronouns, possessivePronouns, reflexivePronouns,
			personalPronounsNominative, personalPronounsAccusative, relativePronouns, quantifiers, indefinitePronouns, interrogativeProAdverbs,
			pronominalAdverbs, locativeAdverbs, otherAuxiliaries, otherAuxiliariesInfinitive, interrogativeAdjectives, copula, copulaInfinitive,
			prepositions, coordinatingConjunctions, correlativeConjunctions, subordinatingConjunctions, interviewVerbs, interviewVerbsInfinitive,
			transitionWords, additionalTransitionWords, intensifiers, delexicalizedVerbs, delexicalizedVerbsInfinitive, interjections,
			generalAdjectivesAdverbs, generalAdjectivesAdverbsPreceding, recipeWords, vagueNouns, miscellaneous, timeWords,
			titlesPreceding, titlesFollowing ),
	};
};
