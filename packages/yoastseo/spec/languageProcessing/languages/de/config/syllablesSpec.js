import countSyllableFunction from "../../../../../src/languageProcessing/helpers/syllables/countSyllables.js";
import germanSyllables from "../../../../../src/languageProcessing/languages/de/config/syllables.json";

describe( "a syllable counter for German text strings", function() {
	it( "returns the number of syllables of words containing the subtract syllable ouil", function() {
		expect( countSyllableFunction( "bouillon", germanSyllables ) ).toBe( 2 );
	} );

	// Compensates for "e[äaoö]" in add syllables
	it( "returns the number of syllables of words containing the subtract syllable deaux", function() {
		expect( countSyllableFunction( "bordeauxfarben", germanSyllables ) ).toBe( 4 );
	} );

	// Compensates for "e[äaoö]" in add syllables
	it( "returns the number of syllables of words containing the subtract syllable deau$", function() {
		expect( countSyllableFunction( "bordeau", germanSyllables ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable oard", function() {
		expect( countSyllableFunction( "keyboard", germanSyllables ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable äthiop", function() {
		expect( countSyllableFunction( "äthiopisch", germanSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable euil", function() {
		expect( countSyllableFunction( "fauteuil", germanSyllables ) ).toBe( 2 );
	} );

	// Compensates for "e[äaoö]" in add syllables
	it( "returns the number of syllables of words containing the subtract syllable veau", function() {
		expect( countSyllableFunction( "niveau", germanSyllables ) ).toBe( 2 );
	} );

	// Compensates for "e[äaoö]" in add syllables
	it( "returns the number of syllables of words containing the subtract syllable eau$", function() {
		expect( countSyllableFunction( "bandeau", germanSyllables ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable ueue", function() {
		expect( countSyllableFunction( "billardqueue", germanSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable lienisch", function() {
		expect( countSyllableFunction( "italienisch", germanSyllables ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable ance$", function() {
		expect( countSyllableFunction( "ambiance", germanSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable ence$", function() {
		expect( countSyllableFunction( "absence", germanSyllables ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable time$", function() {
		expect( countSyllableFunction( "halftime", germanSyllables ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable once$", function() {
		expect( countSyllableFunction( "annonce", germanSyllables ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable ziat", function() {
		expect( countSyllableFunction( "benefiziat", germanSyllables ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable guette", function() {
		expect( countSyllableFunction( "baguette", germanSyllables ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable ête$", function() {
		expect( countSyllableFunction( "tête", germanSyllables ) ).toBe( 1 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable ôte$", function() {
		expect( countSyllableFunction( "côte", germanSyllables ) ).toBe( 1 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [hp]omme$", function() {
		expect( countSyllableFunction( "Gentilhomme", germanSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "pomme", germanSyllables ) ).toBe( 1 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [qdscn]ue$", function() {
		expect( countSyllableFunction( "cheque", germanSyllables ) ).toBe( 1 );
		expect( countSyllableFunction( "fondue", germanSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "tissue", germanSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "autocue", germanSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "avenue", germanSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable aire$", function() {
		expect( countSyllableFunction( "affaire", germanSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable ture$", function() {
		expect( countSyllableFunction( "couture", germanSyllables ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable êpe$", function() {
		expect( countSyllableFunction( "crêpe", germanSyllables ) ).toBe( 1 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [^q]ui$", function() {
		expect( countSyllableFunction( "ennui", germanSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "blanqui", germanSyllables ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable tiche$", function() {
		expect( countSyllableFunction( "pastiche", germanSyllables ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable vice$", function() {
		expect( countSyllableFunction( "service", germanSyllables ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable oile$", function() {
		expect( countSyllableFunction( "voile", germanSyllables ) ).toBe( 1 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable zial", function() {
		expect( countSyllableFunction( "asozial", germanSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable cruis", function() {
		expect( countSyllableFunction( "cruisen", germanSyllables ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable leas", function() {
		expect( countSyllableFunction( "geleast", germanSyllables ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable coa[ct]", function() {
		expect( countSyllableFunction( "coach", germanSyllables ) ).toBe( 1 );
		expect( countSyllableFunction( "coating", germanSyllables ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [^i]deal", function() {
		expect( countSyllableFunction( "drogendealer", germanSyllables ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [fw]eat", function() {
		expect( countSyllableFunction( "beefeater", germanSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "sweater", germanSyllables ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [lsx]ed$", function() {
		expect( countSyllableFunction( "overstyled", germanSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "overdressed", germanSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "mixed", germanSyllables ) ).toBe( 1 );
	} );

	it( "returns the number of syllables of words containing the add syllable aau", function() {
		expect( countSyllableFunction( "extraausgabe", germanSyllables ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable a[äöüo]", function() {
		expect( countSyllableFunction( "klimaänderung", germanSyllables ) ).toBe( 5 );
		expect( countSyllableFunction( "aöde", germanSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "gammaübergang", germanSyllables ) ).toBe( 5 );
		expect( countSyllableFunction( "aorta", germanSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable äue", function() {
		expect( countSyllableFunction( "abgesäuert", germanSyllables ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable äeu", function() {
		expect( countSyllableFunction( "mäeutisch", germanSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable aei", function() {
		expect( countSyllableFunction( "kameraeinstellung", germanSyllables ) ).toBe( 6 );
	} );

	it( "returns the number of syllables of words containing the add syllable aue", function() {
		expect( countSyllableFunction( "mauer", germanSyllables ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable aeu", function() {
		expect( countSyllableFunction( "Gammaeule", germanSyllables ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable ael", function() {
		expect( countSyllableFunction( "ismael", germanSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable ai[aeo]", function() {
		expect( countSyllableFunction( "kaianlage", germanSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "dubaier", germanSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "gaio", germanSyllables ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable saik", function() {
		expect( countSyllableFunction( "mosaik", germanSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable aismus", function() {
		expect( countSyllableFunction( "archaismus", germanSyllables ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable ä[aeoi]", function() {
		expect( countSyllableFunction( "mäandrisch", germanSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "achäer", germanSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "äolisch", germanSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "achäisch", germanSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable auä", function() {
		expect( countSyllableFunction( "stauänderung", germanSyllables ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable éa", function() {
		expect( countSyllableFunction( "orléans", germanSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable e[äaoö]", function() {
		expect( countSyllableFunction( "abgeäst", germanSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "reaktor", germanSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "abgeordnet", germanSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "beölt", germanSyllables ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable ei[eo]", function() {
		expect( countSyllableFunction( "abfeiern", germanSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "beiordnen", germanSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable ee[aeiou]", function() {
		expect( countSyllableFunction( "schneealge", germanSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "kleeernte", germanSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "abgeeist", germanSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "seeoffizier", germanSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "seeunfall", germanSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable eu[aäe]", function() {
		expect( countSyllableFunction( "neuanfang", germanSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "efeuähnlich", germanSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "abenteuer", germanSyllables ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable eum$", function() {
		expect( countSyllableFunction( "museum", germanSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable eü", function() {
		expect( countSyllableFunction( "geübt", germanSyllables ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable o[aäöü]", function() {
		expect( countSyllableFunction( "fotoalbum", germanSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "proärese", germanSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "makroökonomie", germanSyllables ) ).toBe( 6 );
		expect( countSyllableFunction( "saldoübertrag", germanSyllables ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable poet", function() {
		expect( countSyllableFunction( "poetisch", germanSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable oo[eo]", function() {
		expect( countSyllableFunction( "zooerastie", germanSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "zooorganisation", germanSyllables ) ).toBe( 6 );
	} );

	it( "returns the number of syllables of words containing the add syllable oie", function() {
		expect( countSyllableFunction( "hanoier", germanSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable oei[^l]", function() {
		expect( countSyllableFunction( "nettoeinkommen", germanSyllables ) ).toBe( 5 );
		expect( countSyllableFunction( "oeil", germanSyllables ) ).toBe( 1 );
	} );

	it( "returns the number of syllables of words containing the add syllable oeu[^f]", function() {
		expect( countSyllableFunction( "indoeuropäer", germanSyllables ) ).toBe( 6 );
		expect( countSyllableFunction( "boeuf", germanSyllables ) ).toBe( 1 );
	} );

	it( "returns the number of syllables of words containing the add syllable öa", function() {
		expect( countSyllableFunction( "euböa", germanSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable [fgrz]ieu", function() {
		expect( countSyllableFunction( "geografieunterricht", germanSyllables ) ).toBe( 7 );
		expect( countSyllableFunction( "energieumwandlung", germanSyllables ) ).toBe( 6 );
		expect( countSyllableFunction( "exterieur", germanSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "pharmazieunternehmen", germanSyllables ) ).toBe( 7 );
		expect( countSyllableFunction( "milieu", germanSyllables ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable mieun", function() {
		expect( countSyllableFunction( "chemieunfall", germanSyllables ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable tieur", function() {
		expect( countSyllableFunction( "garantieurkunde", germanSyllables ) ).toBe( 6 );
	} );

	it( "returns the number of syllables of words containing the add syllable ieum", function() {
		expect( countSyllableFunction( "knieumschwung", germanSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable i[aiuü]", function() {
		expect( countSyllableFunction( "material", germanSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "hawaii", germanSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "abecedarium", germanSyllables ) ).toBe( 6 );
		expect( countSyllableFunction( "freiübung", germanSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable [^l]iä", function() {
		expect( countSyllableFunction( "diärese", germanSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "familiär", germanSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable [^s]chien", function() {
		expect( countSyllableFunction( "tschechien", germanSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "schienend", germanSyllables ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable io[bcdfhjkmpqtuvwx]", function() {
		expect( countSyllableFunction( "folioblatt", germanSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "biochemie", germanSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "diode", germanSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "idiofon", germanSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "soziohormon", germanSyllables ) ).toBe( 5 );
		expect( countSyllableFunction( "radiojodtest", germanSyllables ) ).toBe( 5 );
		expect( countSyllableFunction( "biblioklast", germanSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "angiom", germanSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "agiopapier", germanSyllables ) ).toBe( 5 );
		expect( countSyllableFunction( "studioqualität", germanSyllables ) ).toBe( 6 );
		expect( countSyllableFunction( "agiotierend", germanSyllables ) ).toBe( 5 );
		expect( countSyllableFunction( "biniou", germanSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "audiovision", germanSyllables ) ).toBe( 5 );
		expect( countSyllableFunction( "iowa", germanSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "dioxin", germanSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable [bdhmprv]ion", function() {
		expect( countSyllableFunction( "symbiontisch", germanSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "audion", germanSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "chionograf", germanSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "camion", germanSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "ausspionert", germanSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "chorion", germanSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "alluvion", germanSyllables ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable [lr]ior", function() {
		expect( countSyllableFunction( "amelioriert", germanSyllables ) ).toBe( 5 );
		expect( countSyllableFunction( "apriori", germanSyllables ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable [^g]io[gs]", function() {
		expect( countSyllableFunction( "abiose", germanSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "arteriogramm", germanSyllables ) ).toBe( 5 );
		expect( countSyllableFunction( "angiogram", germanSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "irreligiosität", germanSyllables ) ).toBe( 6 );
	} );

	it( "returns the number of syllables of words containing the add syllable [dr]ioz", function() {
		expect( countSyllableFunction( "propriozeptiv", germanSyllables ) ).toBe( 5 );
		expect( countSyllableFunction( "radiozeit", germanSyllables ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable elioz", function() {
		expect( countSyllableFunction( "heliozentrisch", germanSyllables ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable zioni", function() {
		expect( countSyllableFunction( "antizionist", germanSyllables ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable bio[lnorz]", function() {
		expect( countSyllableFunction( "biologie", germanSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "bionik", germanSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "biooptik", germanSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "bioreaktor", germanSyllables ) ).toBe( 5 );
		expect( countSyllableFunction( "biozid", germanSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable iö[^s]", function() {
		expect( countSyllableFunction( "diözese", germanSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "biliös", germanSyllables ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable ie[ei]", function() {
		expect( countSyllableFunction( "bespieen", germanSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "beieinander", germanSyllables ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable rier$", function() {
		expect( countSyllableFunction( "agrarier", germanSyllables ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable öi[eg]", function() {
		expect( countSyllableFunction( "onomatopöie", germanSyllables ) ).toBe( 6 );
		expect( countSyllableFunction( "böig", germanSyllables ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable [^r]öisch", function() {
		expect( countSyllableFunction( "euböisch", germanSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "färöisch", germanSyllables ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable [^gqv]u[aeéioöuü]", function() {
		expect( countSyllableFunction( "zuarbeiten", germanSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "abbauen", germanSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "habitué", germanSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "abluiert", germanSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "abbauort", germanSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "affektuös", germanSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "andauung", germanSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "neuübergang", germanSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "bilinguisch", germanSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "aalquappe", germanSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "vuota", germanSyllables ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable quie$", function() {
		expect( countSyllableFunction( "reliquie", germanSyllables ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable quie[^s]", function() {
		expect( countSyllableFunction( "requiem", germanSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "quieszieren", germanSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable uäu", function() {
		expect( countSyllableFunction( "zuäußerst", germanSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable ^us-", function() {
		expect( countSyllableFunction( "us-senat", germanSyllables ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable ^it-", function() {
		expect( countSyllableFunction( "it-experte", germanSyllables ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable üe", function() {
		expect( countSyllableFunction( "grüezi", germanSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable naiv", function() {
		expect( countSyllableFunction( "naivität", germanSyllables ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable aisch$", function() {
		expect( countSyllableFunction( "fuldaisch", germanSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable aische$", function() {
		expect( countSyllableFunction( "inkaische", germanSyllables ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable aische[nrs]$", function() {
		expect( countSyllableFunction( "inkaischen", germanSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "inkaischer", germanSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "inkaisches", germanSyllables ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable [lst]ien", function() {
		expect( countSyllableFunction( "familien", germanSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "asien", germanSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "aktien", germanSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable dien$", function() {
		expect( countSyllableFunction( "indien", germanSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable gois", function() {
		expect( countSyllableFunction( "egoist", germanSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable [^g]rient", function() {
		expect( countSyllableFunction( "abiturient", germanSyllables ) ).toBe( 5 );
		expect( countSyllableFunction( "gegrient", germanSyllables ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable [aeiou]y[aeiou]", function() {
		expect( countSyllableFunction( "ayatollah", germanSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "bayer", germanSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "essayistin", germanSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "bayonne", germanSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "ayurveda", germanSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "hochseeyacht", germanSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "erlenmeyer", germanSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "kaffeeyoghurt", germanSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "riyal", germanSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "flamboyant", germanSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "foyer", germanSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "employiert", germanSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "caloyos", germanSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "guyana", germanSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "ennuyieren", germanSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "guyot", germanSyllables ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable byi", function() {
		expect( countSyllableFunction( "hobbyist", germanSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable yä", function() {
		expect( countSyllableFunction( "polyäthylen", germanSyllables ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable [a-z]y[ao]", function() {
		expect( countSyllableFunction( "polyacryl", germanSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "amphiktyonisch", germanSyllables ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable yau", function() {
		expect( countSyllableFunction( "fantasyautor", germanSyllables ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable koor", function() {
		expect( countSyllableFunction( "koordinate", germanSyllables ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable scient", function() {
		expect( countSyllableFunction( "scientologin", germanSyllables ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable eriel", function() {
		expect( countSyllableFunction( "bakteriell", germanSyllables ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable [dg]oing", function() {
		expect( countSyllableFunction( "doing", germanSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "going", germanSyllables ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable eauü", function() {
		expect( countSyllableFunction( "niveauübergang", germanSyllables ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable ioi", function() {
		expect( countSyllableFunction( "radioindikator", germanSyllables ) ).toBe( 7 );
	} );

	it( "returns the number of syllables of words containing the add syllable ioo", function() {
		expect( countSyllableFunction( "varioobjektiv", germanSyllables ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable ioa", function() {
		expect( countSyllableFunction( "radioaktiv", germanSyllables ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable iii", function() {
		expect( countSyllableFunction( "hawaiiinsel", germanSyllables ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable oai", function() {
		expect( countSyllableFunction( "samoainseln", germanSyllables ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable eueu", function() {
		expect( countSyllableFunction( "treueurlaub", germanSyllables ) ).toBe( 4 );
	} );
} );
