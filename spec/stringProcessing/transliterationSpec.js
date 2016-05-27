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
		expect( transliteration( "áÁčČďĎéÉěĚíÍňŇóÓřŘšŠťŤúÚůŮýÝžŽ", "cs_CZ" ) ).toBe( "aAcCdDeEeEiInNoOrRsStTuUuUyYzZ" );
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
	it("returns a Catalan string without special characters.", function(  ){
		expect( transliteration( "àÀéÉèÈíÍïÏóÓòÒúÚüÜçÇ", "ca" ) ).toBe( "aAeEeEiIiIoOoOuUuUcC" );
	});
	it("returns an Asturian string without special characters.", function(  ){
		expect( transliteration( "ñÑ", "ast" ) ).toBe( "nN" );
	});
	it("returns an Aragonese string without special characters.", function(  ){
		expect( transliteration( "üÜñÑçÇíÍóÓáÁ", "an" ) ).toBe( "uUnyNycCiIoOaA" );
	});
	it("returns an Aymara string without special characters.", function(  ){
		expect( transliteration( "äÄïÏüÜíÍ'ñÑ", "ay" ) ).toBe( "aAiIuUiInN" );
	});
	it("returns an English string without special characters.", function(  ){
		expect( transliteration( "æÆӕӔœŒéÉôÔïÏöÖëËçÇñÑüÜäÄ", "en_US" ) ).toBe( "aeAeaeAeoeOeeEoOiIoOeEcCnNuUaA" );
	});
	it("returns a French string without special characters.", function(  ){
		expect( transliteration( "æÆӕӔœŒéÉèÈëËêÊàÀâÂïÏîÎùÙûÛüÜôÔÿŸçÇñÑ", "fr_BE" ) ).toBe( "aeAeaeAeoeOeeEeEeEeEaAaAiIiIuUuUuUoOyYcCnN" );
	});
	it("returns an Italian string without special characters.", function(  ){
		expect( transliteration( "àÀéÉèÈìÌíÍîÎóÓòÒùÙúÚ", "it_IT" ) ).toBe( "aAeEeEiIiIiIoOoOuUuU" );
	});
	it("returns a Dutch string without special characters.", function(  ){
		expect( transliteration( "çÇñÑèÈêÊéÉëËôÔöÖïÏüÜäÄ", "nl_NL" ) ).toBe( "cCnNeEeEeEeEoOoOiIuUaA" );
	});
	it("returns a Bambara string without special characters.", function(  ){
		expect( transliteration( "ɛƐɲƝŋŊɔƆ", "bm" ) ).toBe( "eEnyNyngNgoO" );
	});
	it("returns a Ukrainian string without special characters.", function(  ){
		expect( transliteration( "бБвВгГґҐдДкКлЛмМpPпПсСтТуУфФхХцЦчЧшШщЩьЬжЖзЗиИ", "uk" ) ).toBe( "bBvVhHgGdDkKlLmMrRpPsStTuUfFkhKhtsTschChshShshchShchzhZhzZyY" );
	});
	it("returns a Ukrainian string without special characters.", function(  ){
		expect( transliteration( "єє є", "uk" ) ).toBe( "yeie ye" );
	});
	it("returns a Ukrainian string without special characters.", function(  ){
		expect( transliteration( "ЄЄ Є", "uk" ) ).toBe( "YeIE Ye" );
	});
	it("returns a Ukrainian string without special characters.", function(  ){
		expect( transliteration( "її ї", "uk" ) ).toBe( "yii yi" );
	});
	it("returns a Ukrainian string without special characters.", function(  ){
		expect( transliteration( "ЇЇ Ї", "uk" ) ).toBe( "YiI Yi" );
	});
	it("returns a Ukrainian string without special characters.", function(  ){
		expect( transliteration( "йй й", "uk" ) ).toBe( "yi y" );
	});
	it("returns a Ukrainian string without special characters.", function(  ){
		expect( transliteration( "ЙЙ Й", "uk" ) ).toBe( "YI Y" );
	});
	it("returns a Ukrainian string without special characters.", function(  ){
		expect( transliteration( "юю ю", "uk" ) ).toBe( "yuiu yu" );
	});
	it("returns a Ukrainian string without special characters.", function(  ){
		expect( transliteration( "ЮЮ Ю", "uk" ) ).toBe( "YuIU Yu" );
	});
	it("returns a Ukrainian string without special characters.", function(  ){
		expect( transliteration( "яя я", "uk" ) ).toBe( "yaia ya" );
	});
	it("returns a Ukrainian string without special characters.", function(  ){
		expect( transliteration( "ЯЯ Я", "uk" ) ).toBe( "YaIA Ya" );
	});
	it("returns an unchanged string for a non-existing locale.", function(  ){
		expect( transliteration( "abc", "qxz" ) ).toBe( "abc" );
	});
	it("returns an unchanged string for an empty locale.", function(  ){
		expect( transliteration( "abc", "" ) ).toBe( "abc" );
	});
	it("returns an unchanged string for no locale.", function(  ){
		expect( transliteration( "abc" ) ).toBe( "abc" );
	});
});

