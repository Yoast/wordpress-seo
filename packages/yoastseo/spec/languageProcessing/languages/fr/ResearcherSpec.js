import Researcher from "../../../../src/languageProcessing/languages/fr/Researcher.js";
import Paper from "../../../../src/values/Paper.js";
import getMorphologyData from "../../../specHelpers/getMorphologyData";
const morphologyDataFR = getMorphologyData( "fr" );

describe( "a test for the French Researcher", function() {
	const researcher = new Researcher( new Paper( "This is another paper!" ) );
	const frenchFunctionWordExamples = [ "puisque", "ça prouve que", "les", "septante", "onzièmes", "je", "qu'eux",
		"me", "celles-là", "ton", "plus", "se", "quelqu'un", "où", "d'où", "quels", "n'y", "d'ici", "n'ira", "l'avoir",
		"qu'est", "d'être", "à", "or", "sitôt", "afin", "témoigne-t-elle", "réagir", "probable", "presque", "veux-je",
		"vouloir", "fur", "dernier", "ô", "grammes", "avant-hier", "manière", "etc", "mlle", "sr" ];

	it( "returns true if the inherited Abstract Researcher has a specific research", function() {
		expect( researcher.hasResearch( "getParagraphLength" ) ).toBe( true );
	} );

	it( "returns true if the French Researcher has a specific research", function() {
		expect( researcher.hasResearch( "getPassiveVoice" ) ).toBe( true );
	} );

	it( "returns French function words", function() {
		expect( researcher.getConfig( "functionWords" ).all ).toEqual( ( expect.arrayContaining( frenchFunctionWordExamples ) ) );
	} );

	it( "returns the French first word exceptions", function() {
		expect( researcher.getConfig( "firstWordExceptions" )() ).toEqual(
			[ "le", "la", "les", "un", "une", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix",
				"celui", "celle", "ceux", "celles", "celui-ci", "celle-là", "celui-là", "celle-ci" ]
		);
	} );

	it( "returns the French transition words", function() {
		expect( researcher.getConfig( "transitionWords" ) ).toEqual( [
			"ainsi", "alors", "aussi", "car", "cependant", "certainement", "certes", "conséquemment", "d'abord",
			"d'ailleurs", "d'après", "davantage", "désormais", "deuxièmement", "donc", "dorénavant", "effectivement", "également",
			"enfin", "ensuite", "entre-temps", "essentiellement", "excepté", "finalement", "globalement", "jusqu'ici", "là-dessus",
			"lorsque", "mais", "malgré", "néanmoins", "notamment", "partant", "plutôt", "pourtant", "précédemment", "premièrement",
			"probablement", "puis", "puisque", "quoique", "sauf", "selon", "semblablement", "sinon", "suivant", "toutefois", "troisièmement",
			"à cause de", "à ce jour", "à ce propos", "à ce sujet", "à cet égard", "à cette fin", "à compter de",
			"à condition que", "à défaut de", "à force de", "à juste titre", "à la lumière de", "à la suite de", "à l'aide de", "à l'appui de",
			"à l'encontre de", "à l'époque actuelle", "à l'exception de", "à l'exclusion de", "à l'heure actuelle", "à l'image de", "à l'instar de",
			"à l'inverse", "à l'inverse de", "à l'opposé", "à la condition que", "à mesure que", "à moins que", "à nouveau", "à partir de",
			"à première vue", "à savoir", "à seule fin que", "à supposer que", "à tel point que", "à tout prendre", "à vrai dire", "afin de",
			"afin d'attirer l'attention sur", "afin que", "ainsi donc", "ainsi que", "alors que", "antérieurement", "après cela", "après quoi",
			"après que", "après réflexion", "après tout", "attendu que", "au cas où", "au contraire", "au fond", "au fur et à mesure", "au lieu de",
			"au même temps", "au moment où", "au moyen de", "au point que", "au risque de", "au surplus", "au total", "aussi bien que",
			"aussitôt que", "autant que", "autrement dit", "avant que", "avant tout", "ayant fini", "bien que", "c'est à dire que",
			"c'est ainsi que", "c'est dans ce but que", "c'est dire", "c'est le cas de", "c'est pour cela que", "c'est la raison pour laquelle",
			"c'est pourquoi", "c'est qu'en effet", "c'est-à-dire", "ça confirme que", "ça montre que", "ça prouve que", "cela étant", "cela dit",
			"cependant que", "compte tenu", "comme l'illustre", "comme le souligne", "comme on pouvait s'y attendre", "comme quoi", "comme si",
			"commençons par examiner", "comparativement à", "conformément à", "contrairement à", "considérons par exemple", "d'autant plus",
			"d'autant que", "d'autre part", "d'ici là", "d'où", "d'un autre côté", "d'un côté", "d'une façon générale", "dans ce cas",
			"dans ces conditions", "dans cet esprit", "dans l'ensemble", "dans l'état actuel des choses", "dans l'éventualité où",
			"dans l'hypothèse où", "dans la mesure où", "dans le but de", "dans le cadre de", "dans le cas où", "dans les circonstances actuelles",
			"dans les grandes lignes", "dans un autre ordre d'idée", "dans un délai de", "de ce fait", "de cette façon", "de crainte que",
			"de façon à", "de façon à ce que", "de façon que", "de fait", "de l'autre côté", "de la même manière", "de la même façon que",
			"de manière que", "de même", "de même qu'à", "de même que", "de nos jours", "de peur que", "de prime abord", "de sorte que",
			"de surcroît", "de telle manière que", "de telle sorte que", "de toute évidence", "de toute façon", "de toute manière", "depuis que",
			"dès lors que", "dès maintenant", "dès qua", "dès que", "du fait que", "du moins", "du moment que", "du point de vue de",
			"du reste", "d'ici là", "d'ores et déjà", "en admettant que", "en attendant que", "en bref", "en cas de", "en cas que", "en ce cas",
			"en ce domaine", "en ce moment", "en ce qui a trait à", "en ce qui concerne", "en ce sens", "en cela", "en comparaison de",
			"en conclusion", "en conformité avec", "en conséquence", "en d'autres termes", "en définitive", "en dépit de",
			"en dernier lieu", "en deuxième lieu", "en effet", "en face de", "en fait", "en fin de compte", "en général",
			"en guise de conclusion", "en matière de", "en même temps que", "en outre", "en particulier", "en plus", "en premier lieu",
			"en principe", "en raison de", "en réalité", "en règle générale", "en résumé", "en revanche", "en second lieu", "en somme",
			"en sorte que", "en supposant que", "en tant que", "en terminant", "en théorie", "en tout cas", "en tout premier lieu",
			"en troisième lieu", "en un mot", "en vérité", "en vue que", "encore que", "encore une fois", "entre autres", "et même",
			"et puis", "étant donné qu'à", "étant donné que", "face à", "grâce à", "il est à noter que", "il est indéniable que",
			"il est question de", "il est vrai que", "il faut dire aussi que", "il faut reconnaître que", "il faut souligner que",
			"il ne faut pas oublier que", "il s'ensuit que", "il suffit de prendre pour exemple", "jusqu'ici", "il y a aussi",
			"jusqu'à ce que", "jusqu'à ce jour", "jusqu'à maintenant", "jusqu'à présent", "jusqu'au moment où", "jusqu'ici",
			"l'aspect le plus important de", "l'exemple le plus significatif", "jusqu'au moment où", "la preuve c'est que",
			"loin que", "mais en réalité", "malgré cela", "malgré tout", "même si", "mentionnons que", "mis à part le fait que",
			"notons que", "nul doute que", "ou bien", "outre cela", "où que", "par ailleurs",
			"par conséquent", "par contre", "par exception", "par exemple", "par la suite", "par l'entremise de", "par l'intermédiaire de",
			"par rapport à", "par suite", "par suite de", "par surcroît", "parce que", "pareillement", "partant de ce fait", "pas du tout",
			"pendant que", "plus précisément", "plus tard", "pour ainsi dire", "pour autant que", "pour ce qui est de", "pour ces motifs",
			"pour ces raisons", "pour cette raison", "pour commencer", "pour conclure", "pour le moment", "pour marquer la causalité",
			"pour l'instant", "pour peu que", "pour prendre un autre exemple", "pour que", "pour résumé", "pour terminer",
			"pour tout dire", "pour toutes ces raisons", "pourvu que", "prenons le cas de", "quand bien même que", "quand même",
			"quant à", "quel que soit", "qui plus est", "qui que", "quitte à", "quoi qu'il en soit", "quoi que", "quoiqu'il en soit",
			"sans délai", "sans doute", "sans parler de", "sans préjuger", "sans tarder", "sauf si", "selon que", "si bien que",
			"si ce n'est que", "si l'on songe que", "sitôt que", "somme toute", "sous cette réserve", "sous prétexte que",
			"sous réserve de", "sous réserve que", "suivant que", "supposé que", "sur le plan de", "tandis que", "tant et si bien que",
			"tant que", "tel que", "tellement que", "touchant à", "tout à fait", "tout bien pesé", "tout compte fait", "tout d'abord",
			"tout d'abord examinons", "tout d'abord il faut dire que", "tout de même", "tout en reconnaissant que", "une fois de plus",
			"vu que",
		] );
	} );

	it( "returns the French two part transition word", function() {
		expect( researcher.getConfig( "twoPartTransitionWords" ) ).toEqual( [
			[ "à première vue", "mais à bien considérer les choses" ], [ "à première vue", "mais toute réflexion faite" ],
			[ "aussi", "que" ], [ "autant de", "que" ], [ "certes", "mais" ], [ "d'un côté", "de l'autre côté" ],
			[ "d'un côté", "de l'autre" ], [ "d'un côté", "d'un autre côté" ], [ "d'une part", "d'autre part" ],
			[ "d'une parte", "de l'autre parte" ], [ "moins de", "que" ], [ "non seulement", "mais aussi" ], [ "non seulement", "mais en outre" ],
			[ "non seulement", "mais encore" ], [ "plus de", "que" ], [ "quelque", "que" ], [ "si", "que" ], [ "soit", "soit" ],
			[ "tantôt", "tantôt" ],	[ "tout d'abord", "ensuite" ], [ "tout", "que" ],
		] );
	} );

	it( "returns a specified part of the French syllables data", function() {
		expect( researcher.getConfig( "syllables" ).deviations.vowels ).toEqual(
			[
				{
					fragments: [
						"[ptf]aon(ne)?[s]?$",
					],
					countModifier: -1,
				},
				{
					fragments: [
						"aoul",
						"[^eéiïou]e(s|nt)?$",
						"[qg]ue(s|nt)?$",
					],
					countModifier: -1,
				},
				{
					fragments: [
						"o[ëaéèï]",
					],
					countModifier: 1,
				},
				{
					fragments: [
						"a[eéèïüo]",
						"é[aâèéiîuo]",
						"ii[oe]",
						"[aeéuo]y[aâeéèoui]",
						"coe[^u]",
						"zoo",
						"coop",
						"coord",
						"poly[ae]",
						"[bcd]ry[oa]",
						"[bcdfgptv][rl](ou|u|i)[aéèouâ]",
						"ouez",
						"[blmnt]uio",
						"uoia",
						"ment$",
						"yua",
						"[bcdfgptv][rl](i|u|eu)e([ltz]|r[s]?$|n[^t])",
						"[^aeiuyàâéèêëîïûüùôæœqg]uie[rz]$",
					],
					countModifier: 1,
				},
			],
		);
	} );

	it( "returns the French stop words", function() {
		expect( researcher.getConfig( "stopWords" ) ).toEqual(
			[
				"et",
				"ou",
				"car",
				"or",
				"puisque",
				"puisqu'il",
				"puisqu'ils",
				"puisqu'elle",
				"puisqu'elles",
				"puisqu'un",
				"puisqu'une",
				"puisqu'on",
				"quand",
				"lorsque",
				"lorsqu'il",
				"lorsqu'elle",
				"lorsqu'ils",
				"lorsqu'elles",
				"lorsqu'on",
				"lorsqu'un",
				"lorsqu'une",
				"quoique",
				"quoiqu'il",
				"quoiqu'ils",
				"quoiqu'elle",
				"quoiqu'elles",
				"quoiqu'on",
				"quoiqu'un",
				"quoiqu'une",
				"qu'elle",
				"qu'il",
				"qu'ils",
				"qu'elles",
				"qu'on",
				"qu'un",
				"qu'une",
				"si",
				"s'ils",
				"s'il",
				"quand bien même",
				"pourquoi",
				"après",
				"avant",
				"afin de",
				"compte tenu de",
				"pour ne pas dire",
				"sinon",
				"une fois",
				"sitôt",
				"dont",
				"lequel",
				"laquelle",
				"lesquels",
				"lesquelles",
				"auquel",
				"auxquels",
				"auxquelles",
				"duquel",
				"desquels",
				"desquelles",
				"qui",
				"où",
				"d'où",
				":",
				"allé",
				"entré",
				"resté",
				"retombé",
				"apparu",
				"réapparu",
				"devenu",
				"redevenu",
				"intervenu",
				"provenu",
				"resurvenu",
				"survenu",
				"allés",
				"entrés",
				"restés",
				"retombés",
				"apparus",
				"réapparus",
				"devenus",
				"redevenus",
				"intervenus",
				"provenus",
				"resurvenus",
				"survenus",
				"allée",
				"entrée",
				"restée",
				"retombée",
				"apparue",
				"réapparue",
				"devenue",
				"redevenue",
				"intervenue",
				"provenue",
				"resurvenue",
				"survenue",
				"allées",
				"entrées",
				"restées",
				"retombées",
				"apparues",
				"réapparues",
				"devenues",
				"redevenues",
				"intervenues",
				"provenues",
				"resurvenues",
				"survenues",
			]
		);
	} );

	it( "returns the French locale", function() {
		expect( researcher.getConfig( "language" ) ).toEqual( "fr" );
	} );

	it( "returns the French passive construction type", function() {
		expect( researcher.getConfig( "isPeriphrastic" ) ).toEqual( true );
	} );

	it( "stems a word using the French stemmer", function() {
		researcher.addResearchData( "morphology", morphologyDataFR );
		expect( researcher.getHelper( "getStemmer" )( researcher )( "chats" ) ).toEqual( "chat" );
	} );

	it( "splits French sentence into parts", function() {
		const sentence =  "Ils étaient très amis lorsqu'ils étaient enfants.";
		expect( researcher.getHelper( "getSentenceParts" )( sentence )[ 0 ].getSentencePartText() ).toBe( "étaient très amis" );
		expect( researcher.getHelper( "getSentenceParts" )( sentence )[ 1 ].getSentencePartText() ).toBe( "étaient enfants." );
	} );

	it( "checks if a French sentence is passive or not", function() {
		expect( researcher.getHelper( "isPassiveSentencePart" )( "Le chat est amené chez le vétérinaire.", [ "est" ] ) ).toEqual( true );
		expect( researcher.getHelper( "isPassiveSentencePart" )( "La fille a amené le chat chez le vétérinaire.", [] ) ).toEqual( false );
	} );

	it( "calculates the Flesch reading score using the formula for French", function() {
		const statistics = {
			numberOfWords: 400,
			numberOfSyllables: 600,
			numberOfSentences: 20,
		};
		expect( researcher.getHelper( "fleschReadingScore" )( statistics ) ).toBe( 76.3 );
	} );
} );
