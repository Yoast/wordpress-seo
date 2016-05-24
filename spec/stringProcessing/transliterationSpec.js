var transliteration = require( "../../js/stringProcessing/transliterate.js" );

describe("a test removing special characters from text", function( ){
	it("returns a Spanish string without special characters.", function(  ){
		expect( transliteration( "ñáéíóúüÑÁÉÍÓÚÜ", "es_AR" ) ).toBe( "naeiouuNAEIOUU" );
	});
	it("returns a Polish string without special characters.", function(  ){
		expect( transliteration( "ąćęłńóśźżĄĆĘŁŃÓŚŹŻ", "pl_PL" ) ).toBe( "acelnoszzACELNOSZZ" );
	});
	it("returns a German string without special characters.", function(  ){
		expect( transliteration( "äüößÄÜÖẞ", "de_DE" ) ).toBe( "aeueoessAeUeOeSS" );
	});
	it("returns a Norwegian (Nynorsk) string without special characters.", function(  ){
		expect( transliteration( "æӕÆӔåÅøØéÉèÈêÊóÓòÒôÔ", "nn_NO" ) ).toBe( "aeaeAeAeaaAaoeOeeEeEeEoOoOoO" );
	});
	it("returns a Norwegian (Bokmal) string without special characters.", function(  ){
		expect( transliteration( "æӕÆӔåÅøØéÉèÈêÊóÓòÒôÔ", "nb_NO" ) ).toBe( "aeaeAeAeaaAaoeOeeEeEeEoOoOoO" );
	});
	it("returns a Swedish string without special characters.", function(  ){
		expect( transliteration( "åÅäÄöÖéÉàÀ", "sv_SE" ) ).toBe( "aaAaaeAeoeOeeEaA" );
	});
	it("returns a Finnish string without special characters.", function(  ){
		expect( transliteration( "åÅäÄöÖžŽšŠ", "fi" ) ).toBe( "aaAaaAoOzhZhshSh" );
	});
	it("returns a Danish string without special characters.", function(  ){
		expect( transliteration( "åÅæӕÆӔøØéÉ", "da_DK" ) ).toBe( "aaAaaeaeAeAeoeOeeE" );
	});
	it("returns a Turkish string without special characters.", function(  ){
		expect( transliteration( "çğıİöşüâîûÇĞÖŞÜÂÎÛ", "tr_TR" ) ).toBe( "cgiIosuaiuCGOSUAIU" );
	});
	it("returns a Latvian string without special characters.", function(  ){
		expect( transliteration( "āĀčČēĒģĢīĪķĶļĻņŅšŠūŪžŽ", "lv" ) ).toBe( "aAcCeEgGiIkKlLnNsSuUzZ" );
	});
	it("returns an Icelandic string without special characters.", function(  ){
		expect( transliteration( "áÁðÐéÉíÍóÓöÖúÚýÝþÞæÆӕӔ", "is_IS" ) ).toBe( "aAdDeEiIoOoOuUyYthThaeAeaeAe" );
	});
	it("returns a Faroese string without special characters.", function(  ){
		expect( transliteration( "áÁðÐíÍóÓøØúÚýÝæÆӕӔ", "fa" ) ).toBe( "aAdDiIoOoOuUyYaeAeaeAe" );
	});
	it("returns a Czech string without special characters.", function(  ){
		expect( transliteration( "áÁčČďĎéÉěĚíÍňŇóÓřŘšŠťŤúÚůŮýÝžŽ", "cz_CZ" ) ).toBe( "aAcCdDeEeEiInNoOrRsStTuUuUyYzZ" );
	});
	it("returns a Russian string without special characters.", function(  ){
		expect( transliteration( "бБвВгГдДёЁжЖзЗиИйЙкКлЛмМнНпПpPсСтТуУфФхХцЦчЧшШщЩъЪыЫьЬэЭюЮяЯ", "ru_RU" ) ).toBe( "bBvVgGdDeEzhZhzZiIiIkKlLmMnNpPrRsStTuUfFkhKhtsTschChshShshchShchieIeyYeEiuIuiaIa" );
	});
	it("returns an Esperanto string without special characters.", function(  ){
		expect( transliteration( "ĉĈĝĜĥĤĵĴŝŜŭŬ", "eo" ) ).toBe( "chChghGhhxHxjxJxsxSxuxUx" );
	});
	it("returns an Afrikaans string without special characters.", function(  ){
		expect( transliteration( "èÈêÊëËîÎïÏôÔöÖûÛüÜ", "af" ) ).toBe( "eEeEeEiIiIoOoOuUuU" );
	});


});

