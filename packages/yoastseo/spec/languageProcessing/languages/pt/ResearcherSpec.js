import Researcher from "../../../../src/languageProcessing/languages/pt/Researcher.js";
import Paper from "../../../../src/values/Paper.js";
import getMorphologyData from "../../../specHelpers/getMorphologyData";
const morphologyDataPT = getMorphologyData( "pt" );

describe( "a test for the Portuguese Researcher", function() {
	const researcher = new Researcher( new Paper( "This is another paper!" ) );
	const functionWordExamples = [ 	"aquilo", "àquele", "àquela", "àqueles", "àquelas", "àquilo", "este", "estes", "esta", "estas",
		"àqueles", "aqueles", "aquele", "aquela", "aquelas", "aquilo", "esse", "esses", "essa", "essas", "isto", "isso" ];

	it( "returns true if the inherited Abstract Researcher has a specific research", function() {
		expect( researcher.hasResearch( "getParagraphLength" ) ).toBe( true );
	} );

	it( "returns true if the Portuguese Researcher has a specific research", function() {
		expect( researcher.hasResearch( "getPassiveVoice" ) ).toBe( true );
	} );

	it( "returns Portuguese function words", function() {
		expect( researcher.getConfig( "functionWords" ).all ).toEqual( ( expect.arrayContaining( functionWordExamples ) ) );
	} );

	it( "returns the Portuguese first word exceptions", function() {
		expect( researcher.getConfig( "firstWordExceptions" ) ).toEqual(
			[ "o", "a", "os", "as", "um", "uma", "uns", "umas", "um", "dois", "três", "quatro", "cinco", "seis", "sete",
				"oito", "nove", "dez", "este", "estes", "esta", "estas", "esse", "esses", "essa", "essas", "aquele", "aqueles",
				"aquela", "aquelas", "isto", "isso", "aquilo" ]
		);
	} );

	it( "returns the Portuguese transition words", function() {
		expect( researcher.getConfig( "transitionWords" ) ).toEqual(
			[ "ademais", "afinal", "aliás", "analogamente", "anteriormente", "assim", "certamente", "conforme",
				"conquanto", "contudo", "decerto", "embora", "enfim", "enquanto", "então", "entretanto", "eventualmente",
				"igualmente", "inegavelmente", "inesperadamente", "mas", "outrossim", "pois", "porquanto", "porque", "portanto",
				"posteriormente", "precipuamente", "primeiramente", "primordialmente", "principalmente", "salvo",
				"semelhantemente", "similarmente", "sobretudo", "surpreendentemente", "todavia", "a fim de", "a fim de que",
				"a menos que", "a princípio", "a saber", "acima de tudo", "ainda assim", "ainda mais", "ainda que", "além disso",
				"antes de mais nada", "antes de tudo", "antes que", "ao mesmo tempo", "ao passo que", "ao propósito", "apesar de",
				"às vezes", "assim como", "assim que", "assim sendo", "assim também", "bem como", "com a finalidade de",
				"com efeito", "com o fim de", "com o intuito de", "com o propósito de", "com toda a certeza", "como resultado",
				"como se", "da mesma forma", "de acordo com", "de conformidade com", "de fato", "de maneira idêntica",
				"de tal forma que", "de tal sorte que", "depois que", "desde que", "dessa forma", "dessa maneira", "desse modo",
				"do mesmo modo", "é provável", "em conclusão", "em contrapartida", "em contraste com", "em outras palavras",
				"em primeiro lugar", "em princípio", "em resumo", "em seguida", "em segundo lugar", "em síntese", "em suma",
				"em terceiro lugar", "em virtude de", "finalmente agora atualmente", "isto é", "já que", "logo após", "logo depois",
				"logo que", "mesmo que", "não apenas", "nesse hiato", "nesse ínterim", "nesse meio tempo", "nesse sentido",
				"no entanto", "no momento em que", "ou por outra", "ou seja", "para que", "pelo contrário", "por analogia",
				"por causa de", "por certo", "por conseguinte", "por conseqüência", "por exemplo", "por fim", "por isso",
				"por mais que", "por menos que", "por outro lado", "posto que", "se acaso", "se bem que", "seja como for",
				"sem dúvida", "só para exemplificar", "só para ilustrar", "só que", "sob o mesmo ponto de vista",
				"talvez provavelmente", "tanto quanto", "uma vez que", "visto que" ]
		);
	} );

	it( "returns the Portuguese two part transition word", function() {
		expect( researcher.getConfig( "twoPartTransitionWords" ) ).toEqual(
			[ [ "não apenas", "como também" ], [ "não só", "bem como" ], [ "não só", "como também" ], [ "não só", "mas também" ],
				[ "ora", "ora" ], [ "ou", "ou" ], [ "quer", "quer" ] ]
		);
	} );

	it( "returns a specified part of the Portuguese syllables data", function() {
		expect( researcher.getConfig( "syllables" ).deviations.words.full ).toEqual(
			[
				{ word: "delegacia", syllables: 5 },
				{ word: "democracia", syllables: 5 },
				{ word: "parceria", syllables: 4 },
				{ word: "secretaria", syllables: 5 },
			],
		);
	} );

	it( "returns the Portuguese stop words", function() {
		expect( researcher.getConfig( "stopWords" ) ).toEqual(
			[ "que ", "como", "e", "nem", "se", "caso", "conforme", "consoante", "porque", "pois", "segundo ", "enquanto",
				"embora", "conquanto", "quanto menos", "quanto mais", "quando", "mal ", "apenas", "ora", "seja", "quer", "já",
				"logo", "portanto", "por isso", "pois", "рог conseguinte", "ou seja ", "isto é", "quer dizer", "a saber",
				"ou melhor", "mas", "também", "sim", "porém", "contudo", "senão", "todavia", "mas ainda", "no entanto", "entretanto" ]
		);
	} );

	it( "returns the Portuguese locale", function() {
		expect( researcher.getConfig( "language" ) ).toEqual( "pt" );
	} );

	it( "returns the Portuguese passive construction type", function() {
		expect( researcher.getConfig( "isPeriphrastic" ) ).toEqual( true );
	} );

	it( "stems a word using the Portuguese stemmer", function() {
		researcher.addResearchData( "morphology", morphologyDataPT );
		expect( researcher.getHelper( "getStemmer" )( researcher )( "gatas" ) ).toEqual( "gat" );
	} );

	it( "splits Portuguese sentence into parts", function() {
		const sentence =  "Eles eram três amigos quando eram crianças.";
		expect( researcher.getHelper( "getSentenceParts" )( sentence )[ 0 ].getSentencePartText() ).toBe( "eram três amigos" );
		expect( researcher.getHelper( "getSentenceParts" )( sentence )[ 1 ].getSentencePartText() ).toBe( "eram crianças." );
	} );

	it( "checks if a Portuguese sentence is passive or not", function() {
		expect( researcher.getHelper( "isPassiveSentencePart" )( "Os gatos são amados.", [ "são" ] ) ).toEqual( true );
		expect( researcher.getHelper( "isPassiveSentencePart" )( "A garota ama seus gatos.", [] ) ).toEqual( false );
	} );

	it( "calculates the Flesch reading score using the formula for Portuguese", function() {
		const statistics = {
			numberOfWords: 600,
			numberOfSyllables: 1200,
			averageWordsPerSentence: 19,
		};
		expect( researcher.getHelper( "fleschReadingScore" )( statistics ) ).toBe( 60.4 );
	} );
} );
