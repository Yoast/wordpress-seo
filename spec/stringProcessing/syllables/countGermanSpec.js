import countSyllableFunction from '../../../src/stringProcessing/syllables/count.js';

describe( "a syllable counter for German text strings", function() {
	it( "returns the number of syllables of words containing the subtract syllable ouil", function() {
		expect( countSyllableFunction( "bouillon", "de_DE" ) ).toBe( 2 );
	} );

	// Compensates for "e[äaoö]" in add syllables
	it( "returns the number of syllables of words containing the subtract syllable deaux", function() {
		expect( countSyllableFunction( "bordeauxfarben", "de_DE" ) ).toBe( 4 );
	} );

	// Compensates for "e[äaoö]" in add syllables
	it( "returns the number of syllables of words containing the subtract syllable deau$", function() {
		expect( countSyllableFunction( "bordeau", "de_DE" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable oard", function() {
		expect( countSyllableFunction( "keyboard", "de_DE" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable äthiop", function() {
		expect( countSyllableFunction( "äthiopisch", "de_DE" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable euil", function() {
		expect( countSyllableFunction( "fauteuil", "de_DE" ) ).toBe( 2 );
	} );

	// Compensates for "e[äaoö]" in add syllables
	it( "returns the number of syllables of words containing the subtract syllable veau", function() {
		expect( countSyllableFunction( "niveau", "de_DE" ) ).toBe( 2 );
	} );

	// Compensates for "e[äaoö]" in add syllables
	it( "returns the number of syllables of words containing the subtract syllable eau$", function() {
		expect( countSyllableFunction( "bandeau", "de_DE" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable ueue", function() {
		expect( countSyllableFunction( "billardqueue", "de_DE" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable lienisch", function() {
		expect( countSyllableFunction( "italienisch", "de_DE" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable ance$", function() {
		expect( countSyllableFunction( "ambiance", "de_DE" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable ence$", function() {
		expect( countSyllableFunction( "absence", "de_DE" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable time$", function() {
		expect( countSyllableFunction( "halftime", "de_DE" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable once$", function() {
		expect( countSyllableFunction( "annonce", "de_DE" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable ziat", function() {
		expect( countSyllableFunction( "benefiziat", "de_DE" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable guette", function() {
		expect( countSyllableFunction( "baguette", "de_DE" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable ête$", function() {
		expect( countSyllableFunction( "tête", "de_DE" ) ).toBe( 1 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable ôte$", function() {
		expect( countSyllableFunction( "côte", "de_DE" ) ).toBe( 1 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [hp]omme$", function() {
		expect( countSyllableFunction( "Gentilhomme", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "pomme", "de_DE" ) ).toBe( 1 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [qdscn]ue$", function() {
		expect( countSyllableFunction( "cheque", "de_DE" ) ).toBe( 1 );
		expect( countSyllableFunction( "fondue", "de_DE" ) ).toBe( 2 );
		expect( countSyllableFunction( "tissue", "de_DE" ) ).toBe( 2 );
		expect( countSyllableFunction( "autocue", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "avenue", "de_DE" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable aire$", function() {
		expect( countSyllableFunction( "affaire", "de_DE" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable ture$", function() {
		expect( countSyllableFunction( "couture", "de_DE" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable êpe$", function() {
		expect( countSyllableFunction( "crêpe", "de_DE" ) ).toBe( 1 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [^q]ui$", function() {
		expect( countSyllableFunction( "ennui", "de_DE" ) ).toBe( 2 );
		expect( countSyllableFunction( "blanqui", "de_DE" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable tiche$", function() {
		expect( countSyllableFunction( "pastiche", "de_DE" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable vice$", function() {
		expect( countSyllableFunction( "service", "de_DE" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable oile$", function() {
		expect( countSyllableFunction( "voile", "de_DE" ) ).toBe( 1 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable zial", function() {
		expect( countSyllableFunction( "asozial", "de_DE" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable cruis", function() {
		expect( countSyllableFunction( "cruisen", "de_DE" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable leas", function() {
		expect( countSyllableFunction( "geleast", "de_DE" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable coa[ct]", function() {
		expect( countSyllableFunction( "coach", "de_DE" ) ).toBe( 1 );
		expect( countSyllableFunction( "coating", "de_DE" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [^i]deal", function() {
		expect( countSyllableFunction( "drogendealer", "de_DE" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [fw]eat", function() {
		expect( countSyllableFunction( "beefeater", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "sweater", "de_DE" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [lsx]ed$", function() {
		expect( countSyllableFunction( "overstyled", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "overdressed", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "mixed", "de_DE" ) ).toBe( 1 );
	} );

	it( "returns the number of syllables of words containing the add syllable aau", function() {
		expect( countSyllableFunction( "extraausgabe", "de_DE" ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable a[äöüo]", function() {
		expect( countSyllableFunction( "klimaänderung", "de_DE" ) ).toBe( 5 );
		expect( countSyllableFunction( "aöde", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "gammaübergang", "de_DE" ) ).toBe( 5 );
		expect( countSyllableFunction( "aorta", "de_DE" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable äue", function() {
		expect( countSyllableFunction( "abgesäuert", "de_DE" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable äeu", function() {
		expect( countSyllableFunction( "mäeutisch", "de_DE" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable aei", function() {
		expect( countSyllableFunction( "kameraeinstellung", "de_DE" ) ).toBe( 6 );
	} );

	it( "returns the number of syllables of words containing the add syllable aue", function() {
		expect( countSyllableFunction( "mauer", "de_DE" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable aeu", function() {
		expect( countSyllableFunction( "Gammaeule", "de_DE" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable ael", function() {
		expect( countSyllableFunction( "ismael", "de_DE" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable ai[aeo]", function() {
		expect( countSyllableFunction( "kaianlage", "de_DE" ) ).toBe( 4 );
		expect( countSyllableFunction( "dubaier", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "gaio", "de_DE" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable saik", function() {
		expect( countSyllableFunction( "mosaik", "de_DE" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable aismus", function() {
		expect( countSyllableFunction( "archaismus", "de_DE" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable ä[aeoi]", function() {
		expect( countSyllableFunction( "mäandrisch", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "achäer", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "äolisch", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "achäisch", "de_DE" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable auä", function() {
		expect( countSyllableFunction( "stauänderung", "de_DE" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable éa", function() {
		expect( countSyllableFunction( "orléans", "de_DE" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable e[äaoö]", function() {
		expect( countSyllableFunction( "abgeäst", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "reaktor", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "abgeordnet", "de_DE" ) ).toBe( 4 );
		expect( countSyllableFunction( "beölt", "de_DE" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable ei[eo]", function() {
		expect( countSyllableFunction( "abfeiern", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "beiordnen", "de_DE" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable ee[aeiou]", function() {
		expect( countSyllableFunction( "schneealge", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "kleeernte", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "abgeeist", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "seeoffizier", "de_DE" ) ).toBe( 4 );
		expect( countSyllableFunction( "seeunfall", "de_DE" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable eu[aäe]", function() {
		expect( countSyllableFunction( "neuanfang", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "efeuähnlich", "de_DE" ) ).toBe( 4 );
		expect( countSyllableFunction( "abenteuer", "de_DE" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable eum$", function() {
		expect( countSyllableFunction( "museum", "de_DE" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable eü", function() {
		expect( countSyllableFunction( "geübt", "de_DE" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable o[aäöü]", function() {
		expect( countSyllableFunction( "fotoalbum", "de_DE" ) ).toBe( 4 );
		expect( countSyllableFunction( "proärese", "de_DE" ) ).toBe( 4 );
		expect( countSyllableFunction( "makroökonomie", "de_DE" ) ).toBe( 6 );
		expect( countSyllableFunction( "saldoübertrag", "de_DE" ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable poet", function() {
		expect( countSyllableFunction( "poetisch", "de_DE" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable oo[eo]", function() {
		expect( countSyllableFunction( "zooerastie", "de_DE" ) ).toBe( 4 );
		expect( countSyllableFunction( "zooorganisation", "de_DE" ) ).toBe( 6 );
	} );

	it( "returns the number of syllables of words containing the add syllable oie", function() {
		expect( countSyllableFunction( "hanoier", "de_DE" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable oei[^l]", function() {
		expect( countSyllableFunction( "nettoeinkommen", "de_DE" ) ).toBe( 5 );
		expect( countSyllableFunction( "oeil", "de_DE" ) ).toBe( 1 );
	} );

	it( "returns the number of syllables of words containing the add syllable oeu[^f]", function() {
		expect( countSyllableFunction( "indoeuropäer", "de_DE" ) ).toBe( 6 );
		expect( countSyllableFunction( "boeuf", "de_DE" ) ).toBe( 1 );
	} );

	it( "returns the number of syllables of words containing the add syllable öa", function() {
		expect( countSyllableFunction( "euböa", "de_DE" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable [fgrz]ieu", function() {
		expect( countSyllableFunction( "geografieunterricht", "de_DE" ) ).toBe( 7 );
		expect( countSyllableFunction( "energieumwandlung", "de_DE" ) ).toBe( 6 );
		expect( countSyllableFunction( "exterieur", "de_DE" ) ).toBe( 4 );
		expect( countSyllableFunction( "pharmazieunternehmen", "de_DE" ) ).toBe( 7 );
		expect( countSyllableFunction( "milieu", "de_DE" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable mieun", function() {
		expect( countSyllableFunction( "chemieunfall", "de_DE" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable tieur", function() {
		expect( countSyllableFunction( "garantieurkunde", "de_DE" ) ).toBe( 6 );
	} );

	it( "returns the number of syllables of words containing the add syllable ieum", function() {
		expect( countSyllableFunction( "knieumschwung", "de_DE" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable i[aiuü]", function() {
		expect( countSyllableFunction( "material", "de_DE" ) ).toBe( 4 );
		expect( countSyllableFunction( "hawaii", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "abecedarium", "de_DE" ) ).toBe( 6 );
		expect( countSyllableFunction( "freiübung", "de_DE" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable [^l]iä", function() {
		expect( countSyllableFunction( "diärese", "de_DE" ) ).toBe( 4 );
		expect( countSyllableFunction( "familiär", "de_DE" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable [^s]chien", function() {
		expect( countSyllableFunction( "tschechien", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "schienend", "de_DE" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable io[bcdfhjkmpqtuvwx]", function() {
		expect( countSyllableFunction( "folioblatt", "de_DE" ) ).toBe( 4 );
		expect( countSyllableFunction( "biochemie", "de_DE" ) ).toBe( 4 );
		expect( countSyllableFunction( "diode", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "idiofon", "de_DE" ) ).toBe( 4 );
		expect( countSyllableFunction( "soziohormon", "de_DE" ) ).toBe( 5 );
		expect( countSyllableFunction( "radiojodtest", "de_DE" ) ).toBe( 5 );
		expect( countSyllableFunction( "biblioklast", "de_DE" ) ).toBe( 4 );
		expect( countSyllableFunction( "angiom", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "agiopapier", "de_DE" ) ).toBe( 5 );
		expect( countSyllableFunction( "studioqualität", "de_DE" ) ).toBe( 6 );
		expect( countSyllableFunction( "agiotierend", "de_DE" ) ).toBe( 5 );
		expect( countSyllableFunction( "biniou", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "audiovision", "de_DE" ) ).toBe( 5 );
		expect( countSyllableFunction( "iowa", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "dioxin", "de_DE" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable [bdhmprv]ion", function() {
		expect( countSyllableFunction( "symbiontisch", "de_DE" ) ).toBe( 4 );
		expect( countSyllableFunction( "audion", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "chionograf", "de_DE" ) ).toBe( 4 );
		expect( countSyllableFunction( "camion", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "ausspionert", "de_DE" ) ).toBe( 4 );
		expect( countSyllableFunction( "chorion", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "alluvion", "de_DE" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable [lr]ior", function() {
		expect( countSyllableFunction( "amelioriert", "de_DE" ) ).toBe( 5 );
		expect( countSyllableFunction( "apriori", "de_DE" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable [^g]io[gs]", function() {
		expect( countSyllableFunction( "abiose", "de_DE" ) ).toBe( 4 );
		expect( countSyllableFunction( "arteriogramm", "de_DE" ) ).toBe( 5 );
		expect( countSyllableFunction( "angiogram", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "irreligiosität", "de_DE" ) ).toBe( 6 );
	} );

	it( "returns the number of syllables of words containing the add syllable [dr]ioz", function() {
		expect( countSyllableFunction( "propriozeptiv", "de_DE" ) ).toBe( 5 );
		expect( countSyllableFunction( "radiozeit", "de_DE" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable elioz", function() {
		expect( countSyllableFunction( "heliozentrisch", "de_DE" ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable zioni", function() {
		expect( countSyllableFunction( "antizionist", "de_DE" ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable bio[lnorz]", function() {
		expect( countSyllableFunction( "biologie", "de_DE" ) ).toBe( 4 );
		expect( countSyllableFunction( "bionik", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "biooptik", "de_DE" ) ).toBe( 4 );
		expect( countSyllableFunction( "bioreaktor", "de_DE" ) ).toBe( 5 );
		expect( countSyllableFunction( "biozid", "de_DE" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable iö[^s]", function() {
		expect( countSyllableFunction( "diözese", "de_DE" ) ).toBe( 4 );
		expect( countSyllableFunction( "biliös", "de_DE" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable ie[ei]", function() {
		expect( countSyllableFunction( "bespieen", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "beieinander", "de_DE" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable rier$", function() {
		expect( countSyllableFunction( "agrarier", "de_DE" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable öi[eg]", function() {
		expect( countSyllableFunction( "onomatopöie", "de_DE" ) ).toBe( 6 );
		expect( countSyllableFunction( "böig", "de_DE" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable [^r]öisch", function() {
		expect( countSyllableFunction( "euböisch", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "färöisch", "de_DE" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable [^gqv]u[aeéioöuü]", function() {
		expect( countSyllableFunction( "zuarbeiten", "de_DE" ) ).toBe( 4 );
		expect( countSyllableFunction( "abbauen", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "habitué", "de_DE" ) ).toBe( 4 );
		expect( countSyllableFunction( "abluiert", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "abbauort", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "affektuös", "de_DE" ) ).toBe( 4 );
		expect( countSyllableFunction( "andauung", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "neuübergang", "de_DE" ) ).toBe( 4 );
		expect( countSyllableFunction( "bilinguisch", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "aalquappe", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "vuota", "de_DE" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable quie$", function() {
		expect( countSyllableFunction( "reliquie", "de_DE" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable quie[^s]", function() {
		expect( countSyllableFunction( "requiem", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "quieszieren", "de_DE" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable uäu", function() {
		expect( countSyllableFunction( "zuäußerst", "de_DE" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable ^us-", function() {
		expect( countSyllableFunction( "us-senat", "de_DE" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable ^it-", function() {
		expect( countSyllableFunction( "it-experte", "de_DE" ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable üe", function() {
		expect( countSyllableFunction( "grüezi", "de_DE" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable naiv", function() {
		expect( countSyllableFunction( "naivität", "de_DE" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable aisch$", function() {
		expect( countSyllableFunction( "fuldaisch", "de_DE" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable aische$", function() {
		expect( countSyllableFunction( "inkaische", "de_DE" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable aische[nrs]$", function() {
		expect( countSyllableFunction( "inkaischen", "de_DE" ) ).toBe( 4 );
		expect( countSyllableFunction( "inkaischer", "de_DE" ) ).toBe( 4 );
		expect( countSyllableFunction( "inkaisches", "de_DE" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable [lst]ien", function() {
		expect( countSyllableFunction( "familien", "de_DE" ) ).toBe( 4 );
		expect( countSyllableFunction( "asien", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "aktien", "de_DE" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable dien$", function() {
		expect( countSyllableFunction( "indien", "de_DE" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable gois", function() {
		expect( countSyllableFunction( "egoist", "de_DE" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable [^g]rient", function() {
		expect( countSyllableFunction( "abiturient", "de_DE" ) ).toBe( 5 );
		expect( countSyllableFunction( "gegrient", "de_DE" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable [aeiou]y[aeiou]", function() {
		expect( countSyllableFunction( "ayatollah", "de_DE" ) ).toBe( 4 );
		expect( countSyllableFunction( "bayer", "de_DE" ) ).toBe( 2 );
		expect( countSyllableFunction( "essayistin", "de_DE" ) ).toBe( 4 );
		expect( countSyllableFunction( "bayonne", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "ayurveda", "de_DE" ) ).toBe( 4 );
		expect( countSyllableFunction( "hochseeyacht", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "erlenmeyer", "de_DE" ) ).toBe( 4 );
		expect( countSyllableFunction( "kaffeeyoghurt", "de_DE" ) ).toBe( 4 );
		expect( countSyllableFunction( "riyal", "de_DE" ) ).toBe( 2 );
		expect( countSyllableFunction( "flamboyant", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "foyer", "de_DE" ) ).toBe( 2 );
		expect( countSyllableFunction( "employiert", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "caloyos", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "guyana", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "ennuyieren", "de_DE" ) ).toBe( 4 );
		expect( countSyllableFunction( "guyot", "de_DE" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable byi", function() {
		expect( countSyllableFunction( "hobbyist", "de_DE" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable yä", function() {
		expect( countSyllableFunction( "polyäthylen", "de_DE" ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable [a-z]y[ao]", function() {
		expect( countSyllableFunction( "polyacryl", "de_DE" ) ).toBe( 4 );
		expect( countSyllableFunction( "amphiktyonisch", "de_DE" ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable yau", function() {
		expect( countSyllableFunction( "fantasyautor", "de_DE" ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable koor", function() {
		expect( countSyllableFunction( "koordinate", "de_DE" ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable scient", function() {
		expect( countSyllableFunction( "scientologin", "de_DE" ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable eriel", function() {
		expect( countSyllableFunction( "bakteriell", "de_DE" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable [dg]oing", function() {
		expect( countSyllableFunction( "doing", "de_DE" ) ).toBe( 2 );
		expect( countSyllableFunction( "going", "de_DE" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable eauü", function() {
		expect( countSyllableFunction( "niveauübergang", "de_DE" ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable ioi", function() {
		expect( countSyllableFunction( "radioindikator", "de_DE" ) ).toBe( 7 );
	} );

	it( "returns the number of syllables of words containing the add syllable ioo", function() {
		expect( countSyllableFunction( "varioobjektiv", "de_DE" ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable ioa", function() {
		expect( countSyllableFunction( "radioaktiv", "de_DE" ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable iii", function() {
		expect( countSyllableFunction( "hawaiiinsel", "de_DE" ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable oai", function() {
		expect( countSyllableFunction( "samoainseln", "de_DE" ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable eueu", function() {
		expect( countSyllableFunction( "treueurlaub", "de_DE" ) ).toBe( 4 );
	} );
} );
