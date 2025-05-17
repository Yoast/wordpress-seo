import countSyllableFunction from "../../../../../src/languageProcessing/helpers/syllables/countSyllables.js";
import dutchSyllables from "../../../../../src/languageProcessing/languages/nl/config/syllables.json";

describe( "a syllable counter for Dutch text strings", function() {
	it( "returns the number of syllables of words containing the subtract syllable ue$", function() {
		expect( countSyllableFunction( "cue", dutchSyllables ) ).toBe( 1 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable dge+$", function() {
		expect( countSyllableFunction( "bridge", dutchSyllables ) ).toBe( 1 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [tcp]iënt", function() {
		expect( countSyllableFunction( "patiënt", dutchSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "recipiënt", dutchSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "efficiënt", dutchSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable ace$", function() {
		expect( countSyllableFunction( "interface", dutchSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [br]each", function() {
		expect( countSyllableFunction( "beachboy", dutchSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "reachtruck", dutchSyllables ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [ainpr]tiaal", function() {
		expect( countSyllableFunction( "spatiaal", dutchSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "initiaal", dutchSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "potentiaal", dutchSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "nuptiaal", dutchSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "martiaal", dutchSyllables ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [io]tiaan$", function() {
		expect( countSyllableFunction( "Mauritiaan", dutchSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "Laotiaan", dutchSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable gua[yc]", function() {
		expect( countSyllableFunction( "Paraguayaan", dutchSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "guacamole", dutchSyllables ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [^i]deal", function() {
		expect( countSyllableFunction( "autodealer", dutchSyllables ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable tive$", function() {
		expect( countSyllableFunction( "detective", dutchSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable load", function() {
		expect( countSyllableFunction( "download", dutchSyllables ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [^e]coke", function() {
		expect( countSyllableFunction( "parelcokes", dutchSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [^s]core$", function() {
		expect( countSyllableFunction( "hardcore", dutchSyllables ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable aä", function() {
		expect( countSyllableFunction( "Kanaäniet", dutchSyllables ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable aeu", function() {
		expect( countSyllableFunction( "linnaeusklokje", dutchSyllables ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable aie", function() {
		expect( countSyllableFunction( "aaien", dutchSyllables ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable ao", function() {
		expect( countSyllableFunction( "aorta", dutchSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable ë", function() {
		expect( countSyllableFunction( "Indiër", dutchSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable eo", function() {
		expect( countSyllableFunction( "deodorant", dutchSyllables ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable eú", function() {
		expect( countSyllableFunction( "seúfeest", dutchSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable ieau", function() {
		expect( countSyllableFunction( "politieauto", dutchSyllables ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable ea$", function() {
		expect( countSyllableFunction( "alinea", dutchSyllables ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable ea[^u]", function() {
		expect( countSyllableFunction( "Koreaan", dutchSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "bureau", dutchSyllables ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable ei[ej]", function() {
		expect( countSyllableFunction( "bemoeien", dutchSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "geijkt", dutchSyllables ) ).toBe( 2 );
	} );
	it( "returns the number of syllables of words containing the add syllable eu[iu]", function() {
		expect( countSyllableFunction( "geuit", dutchSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "geboorteuur", dutchSyllables ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable ï", function() {
		expect( countSyllableFunction( "atheïst", dutchSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable iei", function() {
		expect( countSyllableFunction( "persieing", dutchSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable ienne", function() {
		expect( countSyllableFunction( "julienne", dutchSyllables ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable [^l]ieu[^w]", function() {
		expect( countSyllableFunction( "copieus", dutchSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "milieubeheer", dutchSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "nieuw", dutchSyllables ) ).toBe( 1 );
	} );

	it( "returns the number of syllables of words containing the add syllable [^l]ieu$", function() {
		expect( countSyllableFunction( "camaieu", dutchSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "milieu", dutchSyllables ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable i[auiy]", function() {
		expect( countSyllableFunction( "Keniaan", dutchSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "atrium", dutchSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "eiig", dutchSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "riyal", dutchSyllables ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable stion", function() {
		expect( countSyllableFunction( "bastion", dutchSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable [^cstx]io", function() {
		expect( countSyllableFunction( "zionisme", dutchSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "aficionado", dutchSyllables ) ).toBe( 5 );
		expect( countSyllableFunction( "pensioen", dutchSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "station", dutchSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "annexionisme", dutchSyllables ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable ^sion", function() {
		expect( countSyllableFunction( "Sion", dutchSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "fusion", dutchSyllables ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable riè", function() {
		expect( countSyllableFunction( "carrière", dutchSyllables ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable oö", function() {
		expect( countSyllableFunction( "coördinatie", dutchSyllables ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable oa", function() {
		expect( countSyllableFunction( "arboarts", dutchSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable oeing", function() {
		expect( countSyllableFunction( "boeing", dutchSyllables ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable oie", function() {
		expect( countSyllableFunction( "dooien", dutchSyllables ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable [eu]ü", function() {
		expect( countSyllableFunction( "reünie", dutchSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "vacuüm", dutchSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable [^q]u[aeèo]", function() {
		expect( countSyllableFunction( "duaal", dutchSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "actueel", dutchSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "suède", dutchSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "duo", dutchSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "qua", dutchSyllables ) ).toBe( 1 );
		expect( countSyllableFunction( "bouquet", dutchSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "quorn", dutchSyllables ) ).toBe( 1 );
	} );

	it( "returns the number of syllables of words containing the add syllable uie", function() {
		expect( countSyllableFunction( "buien", dutchSyllables ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable [bhnpr]ieel", function() {
		expect( countSyllableFunction( "microbieel", dutchSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "parochieel", dutchSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "ceremonieel", dutchSyllables ) ).toBe( 5 );
		expect( countSyllableFunction( "principieel", dutchSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "prieel", dutchSyllables ) ).toBe( 2 );
	} );


	it( "returns the number of syllables of words containing the add syllable [bhnpr]iël", function() {
		expect( countSyllableFunction( "microbiële", dutchSyllables ) ).toBe( 5 );
		expect( countSyllableFunction( "parochiële", dutchSyllables ) ).toBe( 5 );
		expect( countSyllableFunction( "ceremoniële", dutchSyllables ) ).toBe( 6 );
		expect( countSyllableFunction( "principiële", dutchSyllables ) ).toBe( 5 );
		expect( countSyllableFunction( "notariële", dutchSyllables ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable [aeolu]y[aeéèoóu]", function() {
		expect( countSyllableFunction( "papaya", dutchSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "cayenne", dutchSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "mayonaise", dutchSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "ayó", dutchSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "ayurveda", dutchSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "hockeyacademie", dutchSyllables ) ).toBe( 6 );
		expect( countSyllableFunction( "erlenmeyer", dutchSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "foeyonghai", dutchSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "reclameyup", dutchSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "chatoyant", dutchSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "foyer", dutchSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "employé", dutchSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "coyote", dutchSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "shoyu", dutchSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "polyacetyleen", dutchSyllables ) ).toBe( 6 );
		expect( countSyllableFunction( "flyer", dutchSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "lyofiel", dutchSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "polyurethaan", dutchSyllables ) ).toBe( 5 );
		expect( countSyllableFunction( "bruyant", dutchSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "appuyeren", dutchSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "gruyère", dutchSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "golauyoek", dutchSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables for a sentence with diacritics words", function() {
		expect( countSyllableFunction( "hé café", dutchSyllables ) ).toBe( 3 );
	} );
	it( "returns the number of syllables for a sentence with add and substract syllables", function() {
		expect( countSyllableFunction( "face bastion", dutchSyllables ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing diacritics", function() {
		expect( countSyllableFunction( "café, ayó", dutchSyllables ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words affected by the exclusionCompound regex", function() {
		expect( countSyllableFunction( "voetbalteam, soap, teaktafel", dutchSyllables ) ).toBe( 7 );
	} );

	it( "returns the number of syllables of words affected by the exclusionCompound regex", function() {
		expect( countSyllableFunction( "teaktafel", dutchSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words affected by the exclusionCompound regex", function() {
		expect( countSyllableFunction( "voetbalteam", dutchSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of a word that should not be affected by the exclusionCompound regex", function() {
		expect( countSyllableFunction( "gemeenteambtenaar, ", dutchSyllables ) ).toBe( 6 );
	} );
} );
