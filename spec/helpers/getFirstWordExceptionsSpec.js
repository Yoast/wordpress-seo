let firstWordExceptions = require( "../../js/helpers/getFirstWordExceptions.js" );

describe( "a test for getting the correct first word exception array", function() {
	it( "returns the English first word exception array in case of en_US locale", function() {
		expect( firstWordExceptions( "en_US" )() ).toEqual( [ "the", "a", "an", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "this", "that", "these", "those" ] );
	} );

	it( "returns the French first word exception array in case of fr_FR locale", function() {
		expect( firstWordExceptions( "fr_FR" )() ).toEqual( [ "le", "la", "les", "un", "une", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix", "celui", "celle", "ceux", "celles", "celui-ci", "celle-là", "celui-là", "celle-ci" ] );
	} );

	it( "returns the Spanish first word exception array in case of es_ES locale", function() {
		expect( firstWordExceptions( "es_ES" )() ).toEqual( [ "el", "los", "la", "las", "un", "una", "unas", "unos", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez", "este", "estos", "esta", "estas", "ese", "esos", "esa", "esas", "aquel", "aquellos", "aquella", "aquellas", "esto", "eso", "aquello" ] );
	} );

	it( "returns the German first word exception array in case of de_DE locale", function() {
		expect( firstWordExceptions( "de_DE" )() ).toEqual( [ "das", "dem", "den", "der", "des", "die", "ein", "eine", "einem", "einen", "einer", "eines", "eins", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun", "zehn", "denen", "deren", "derer", "dessen", "diese", "diesem", "diesen", "dieser", "dieses", "jene", "jenem", "jenen", "jener", "jenes", "welch", "welcher", "welches" ] );
	} );

	it( "returns the Dutch first word exception array in case of nl_NL locale", function() {
		expect( firstWordExceptions( "nl_NL" )() ).toEqual( [ "de", "het", "een", "één", "eén", "twee", "drie", "vier", "vijf", "zes", "zeven", "acht", "negen", "tien", "dit", "dat", "die", "deze" ] );
	} );

	it( "returns the Italian first word exception array in case of it_IT locale", function() {
		expect( firstWordExceptions( "it_IT" )() ).toEqual( [ "il", "lo", "la", "i", "gli", "le", "uno", "un", "una", "due", "tre", "quattro", "cinque", "sei", "sette", "otto", "nove", "dieci", "questo", "questa", "quello", "quella", "questi", "queste", "quelli", "quelle", "codesto", "codesti", "codesta", "codeste" ] );
	} );

	it( "returns the Russian first word exception array in case of ru_RU locale", function() {
		expect( firstWordExceptions( "ru_RU" )() ).toEqual( [ "один", "одна", "одно", "два", "две", "три", "четыре", "пять", "шесть", "семь", "восемь", "девять", "десять", "этот", "этого", "этому", "этим", "этом", "эта", "этой", "эту", "это", "этого", "этому", "эти", "этих", "этим", "этими", "тот", "того", "тому", "тем", "том", "та", "той", "ту", "те", "тех", "тем", "теми", "тех", "такой", "такого", "такому", "таким", "такая", "такую", "такое", "такие", "таких", "таким", "такими", "стольких", "стольким", "столько", "столькими", "вот" ] );
	} );

	it( "returns the Polish first word exception array in case of pl_PL locale", function() {
		expect( firstWordExceptions( "pl_PL" )() ).toEqual( [ "jeden", "jedna", "jedno", "dwa", "dwie", "trzy", "cztery", "pięć", "sześć", "siedem", "osiem", "dziewięć", "dziesięć", "ta", "to", "ten", "te", "ci", "taki", "tacy", "taka", "taką", "takich", "takie", "takiego", "takiej", "takiemu", "takim", "takimi", "tamten", "tamta", "tamto", "tamci", "tamte", "tamtą", "tamtego", "tamtej", "tamtemu", "tamtych", "tamtym", "tamtymi", "tą", "tę", "tego", "tej", "temu", "tych", "tymi", "tym", "tak" ] );
	} );

	it( "returns the English first word exception array in case of empty locale", function() {
		expect( firstWordExceptions( "" )() ).toEqual( [ "the", "a", "an", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "this", "that", "these", "those" ] );
	} );

	it( "returns the English first word exception array in case of non-existing locale", function() {
		expect( firstWordExceptions( "xx_yy" )() ).toEqual( [ "the", "a", "an", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "this", "that", "these", "those" ] );
	} );
} );
