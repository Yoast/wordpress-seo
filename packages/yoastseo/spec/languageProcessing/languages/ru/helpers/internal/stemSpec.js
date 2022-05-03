import stem from "../../../../../../src/languageProcessing/languages/ru/helpers/internal/stem";
import getMorphologyData from "../../../../../specHelpers/getMorphologyData";

const morphologyDataRU = getMorphologyData( "ru" ).ru;
// The first word in each array is the word, the second one is the expected stem.

const wordsToStem = [
	// Words with perfective gerund suffix.
	[ "прочитав", "прочит" ],
	// Words with perfective prefix and verb suffix.
	[ "прочитал", "чита" ],
	[ "читал", "чита" ],
	[ "побежать", "бежа" ],
	[ "поcодействовали", "cодействова" ],
	[ "просмотрела", "смотре" ],
	[ "смотреть", "смотре" ],
	[ "позавтракали", "завтрака" ],
	[ "завтракают", "завтрака" ],
	// Verbs that start on под- (по- must not get stemmed)
	[ "подбежать", "подбежа" ],
	[ "подставить", "подстав" ],
	// Words with noun suffixes
	[ "записей", "запис" ],
	[ "записями", "запис" ],
	[ "арестантов", "арестант" ],
	[ "чистота", "чистот" ],
	// Words with verb suffixes
	[ "читаете", "чита" ],
	[ "читаем", "чита" ],
	[ "читали", "чита" ],
	[ "читал", "чита" ],
	[ "читаю", "чита" ],
	[ "читала", "чита" ],
	[ "читать", "чита" ],
	[ "стрелять", "стреля" ],
	[ "явленьем", "явлен" ],
	// Words with adjective suffixes
	[ "большой", "больш" ],
	[ "синий", "син" ],
	// Words with participle suffixes
	[ "встречавшем", "встреч" ],
	[ "читанный", "чита" ],
	[ "доставшихся", "дост" ],
	// Words with reflexive suffixes
	[ "вымыться", "вым" ],
	[ "оденусь", "оден" ],
	// Words with superlative suffixes
	[ "труднейш", "трудн" ],
	[ "глупейше", "глуп" ],
	// Words with derivational suffixes
	[ "глупость", "глуп" ],
	[ "глупости", "глуп" ],
	[ "глупостью", "глуп" ],
	[ "глупостями", "глуп" ],
	[ "глупостях", "глуп" ],
	[ "бездыханность",  "бездыхан" ],
	[ "восторженностью", "восторжен" ],
	// Irregular plurals.
	[ "курицу", "кур" ],
	[ "куры", "кур" ],
	[ "ребёнок", "ребёнк" ],
	[ "детей", "ребёнк" ],
	[ "ребята", "ребёнк" ],
	[ "уху", "ухо" ],
	[ "ушами", "ухо" ],
	[ "мать", "ма" ],
	[ "матерей", "ма" ],
	[ "славяне", "славян" ],
	[ "славянин", "славян" ],
	[ "cудна", "cуд" ],
	[ "суднами", "суд" ],
	[ "сыновья", "сы" ],
	[ "церковью", "церкв" ],
	[ "церкви", "церкв" ],
	[ "щенками", "щенк" ],
	// Words that belong to doNotStemSuffix exceptions
	[ "космодром", "космодром" ],
	[ "детдом", "детдом" ],
	[ "альманах", "альманах" ],
	// Word with multiple suffixes
	[ "являющаяся", "явля" ],
	[ "шурин", "шур" ],
	// Word that shouldn't be stemmed
	[ "яблок", "яблок" ],
];

describe( "Test for stemming Russian words", () => {
	for ( let i = 0; i < wordsToStem.length; i++ ) {
		const wordPairToCheck = wordsToStem[ i ];
		const wordToStem = wordPairToCheck[ 0 ];
		const expectedStem = wordPairToCheck[ 1 ];
		const realStem = stem( wordToStem, morphologyDataRU );
		it( "stems the word " + wordToStem + " and gets the stem " + realStem, () => {
			expect( realStem ).toBe( expectedStem );
		} );
	}
} );
