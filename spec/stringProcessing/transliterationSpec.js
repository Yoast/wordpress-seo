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
	it("returns a Balearean Catalan string without special characters.", function(  ){
		expect( transliteration( "àÀéÉèÈíÍïÏóÓòÒúÚüÜçÇ", "bal" ) ).toBe( "aAeEeEiIiIoOoOuUuUcC" );
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
		expect( transliteration( "æÆӕӔœŒéÉôÔïÏöÖëËçÇñÑüÜäÄ", "en_US" ) ).toBe
		( "aeAeaeAeoeOeeEoOiIoOeEcCnNuUaA" );
	});
	it("returns a French string without special characters.", function(  ){
		expect( transliteration( "æÆӕӔœŒéÉèÈëËêÊàÀâÂïÏîÎùÙûÛüÜôÔÿŸçÇñÑ", "fr_BE" ) ).toBe
		( "aeAeaeAeoeOeeEeEeEeEaAaAiIiIuUuUuUoOyYcCnN" );
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
		expect( transliteration( "бБвВгГґҐдДкКлЛмМpPпПсСтТуУфФхХцЦчЧшШщЩьЬжЖзЗиИ", "uk" ) ).toBe
		( "bBvVhHgGdDkKlLmMrRpPsStTuUfFkhKhtsTschChshShshchShchzhZhzZyY" );
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
	it("returns a Breton string without special characters.", function(  ){
		expect( transliteration( "âÂêÊîÎôÔûÛùÙüÜñÑ", "br" ) ).toBe( "aAeEiIoOuUuUuUnN" );
	});
	it("returns a Chamorro string without special characters.", function(  ){
		expect( transliteration( "'åÅñÑ", "ch" ) ).toBe( "aAnN" );
	});
	it("returns a Kashubian string without special characters.", function(  ){
		expect( transliteration( "ąĄãÃéÉëËłŁńŃòÒóÓôÔùÙżŻ", "csb" ) ).toBe( "aAaAeEeElLnNoOoOoOuUzZ" );
	});
	it("returns a Welsh string without special characters.", function(  ){
		expect( transliteration( "âÂêÊîÎôÔûÛŵŴŷŶ", "cy" ) ).toBe( "aAeEiIoOuUwWyY" );
	});
	it("returns an Ewe string without special characters.", function(  ){
		expect( transliteration( "ɖƉɛƐƒƑɣƔŋŊɔƆʋƲãáàǎâÃÁÀǍÂéèěêÉÈĚÊóòǒôÓÒǑÔúùǔûÚÙǓÛíìǐîÍÌǏÎ", "ee" ) ).toBe
		( "dDeEfFgGngNgoOwWaaaaaAAAAAeeeeEEEEooooOOOOuuuuUUUUiiiiIIII" );
	});
	it("returns an Estonian string without special characters.", function(  ){
		expect( transliteration( "šŠžŽõÕäÄöÖüÜ", "et" ) ).toBe( "shShzhZhoOaAoOuU" );
	});
	it("returns a Basque string without special characters.", function(  ){
		expect( transliteration( "ÑñÇçüÜ", "eu" ) ).toBe( "NnCcuU" );

	});
	it("returns a Fulah string without special characters.", function(  ){
		expect( transliteration( "ɓƁɗƊŋŊɲƝƴƳñÑɠƓ", "fuc" ) ).toBe( "bBdDngNgnyNyyYnyNygG" );
	});
	it("returns a Fijian string without special characters.", function(  ){
		expect( transliteration( "ĀāĒēĪīŪūŌō", "fj" ) ).toBe( "AaEeIiUuOo" );
	});
	it("returns an Arpitan string without special characters.", function(  ){
		expect( transliteration( "âÂêÊèÈéÉîÎôÔûÛüÜ", "frp" ) ).toBe( "aAeEeEeEiIoOuUuU" );
	});
	it("returns a Friulian string without special characters.", function(  ){
		expect( transliteration( "çÇàÀèÈìÌòÒùÙâÂêÊîÎôÔûÛčČğĞšŠ", "fur" ) ).toBe( "cCaAeEiIoOuUaAeEiIoOuUcCgGsS" );
	});
	it("returns a Frisian string without special characters.", function(  ){
		expect( transliteration( "âÂêÊéÉôÔûÛúÚāĀäÄåÅēĒöÖüÜíÍúÚđĐðÐ", "fy" ) ).toBe( "aAeEeEoOuUuUaAaAaAeEoOuUiIuUdDdD" );
	});
	it("returns an Irish string without special characters.", function(  ){
		expect( transliteration( "áÁéÉíÍóÓúÚ", "ga" ) ).toBe( "aAeEiIoOuU" );
	});
	it("returns a Scottish Gaelic string without special characters.", function(  ){
		expect( transliteration( "àÀèÈìÌòÒùÙ", "gd" ) ).toBe( "aAeEiIoOuU" );
	});
	it("returns a Galician string without special characters.", function(  ){
		expect( transliteration( "áàÁÀéêÉÊíïÍÏóÓúüÚÜçÇñÑ", "gl" ) ).toBe( "aaAAeeEEiiIIoOuuUUcCnN" );
	});
	it("returns a Guarani string without special characters.", function(  ){
		expect( transliteration( "’g̃G̃ãÃẽẼĩĨñÑõÕũŨỹỸ", "gn" ) ).toBe( "gGaAeEiInNoOuUyY" );
	});
	it("returns a Swiss german string without special characters.", function(  ){
		expect( transliteration( "äöüÄÖÜ", "gsw" ) ).toBe( "aouAOU" );
	});
	it("returns a Haitian Creole string without special characters.", function(  ){
		expect( transliteration( "èÈòÒ", "hat" ) ).toBe( "eEoO" );
	});
	it("returns a Hawaiian string without special characters.", function(  ){
		expect( transliteration( "ʻ'’āēīōūĀĒĪŌŪ", "haw" ) ).toBe( "aeiouAEIOU" );
	});
	it("returns a Croatian string without special characters.", function(  ){
		expect( transliteration( "čČćĆđĐšŠžŽǄǅǆ", "hr" ) ).toBe( "cCcCdjDjsSzZDZDzdz" );
	});
	it("returns a Georgian string without special characters.", function(  ){
		expect( transliteration( "აბგდევზთიკლმნოპჟრსტუფქღყშჩცძწჭხჯჰ", "ka" ) ).toBe( "abgdevztiklmnopzhrstupkghqshchtsdztschkhjh" );
	});
	it("returns a Greenlandic string without special characters.", function(  ){
		expect( transliteration( "åÅæӕÆӔøØ", "kal" ) ).toBe( "aaAaaeaeAeAeoeOe" );
	});
	it("returns a Kinyarwanda string without special characters.", function(  ){
		expect( transliteration( "’'", "kin" ) ).toBe( "" );
	});
	it("returns a Luxembourgish string without special characters.", function(  ){
		expect( transliteration( "äÄëËéÉ", "lb" ) ).toBe( "aAeEeE" );
	});
	it("returns a Limburgish string without special characters.", function(  ){
		expect( transliteration( "áâàäÁÂÀÄëèêËÈÊöóÖÓ", "li" ) ).toBe( "aaaaAAAAeeeEEEooOO" );
	});
	it("returns a Lingala string without special characters.", function(  ){
		expect( transliteration( "áâǎÁÂǍéêěÉÊĚɛɛ́ɛ̂ɛ̌ƐƐ́Ɛ̂Ɛ̌íîǐÍÎǏóôǒÓÔǑɔɔ́ɔ̂ɔ̌ƆƆ́Ɔ̂Ɔ̌úÚ", "lin" ) ).toBe
		( "aaaAAAeeeEEEeeeeEEEEiiiIIIoooOOOooooOOOOuU" );
	});
	it("returns a Lithuanian string without special characters.", function(  ){
		expect( transliteration( "ąĄčČęĘėĖįĮšŠųŲūŪžŽ", "lt" ) ).toBe( "aAcCeEeEiIsSuUuUzZ" );
	});
	it("returns a Malagasy string without special characters.", function(  ){
		expect( transliteration( "ôÔ", "mg" ) ).toBe( "aoAo" );
	});
	it("returns a Macedonian string without special characters.", function(  ){
		expect( transliteration( "Ситe чoвeчки суштeствa сe рaѓaaт слoбoдни и eднaкви пo дoстoинствo и прaвa. " +
			"Tиe сe oбдaрeни сo рaзум и сoвeст и трeбa дa сe oднeсувaaт eдeн кoн друг вo духoт нa oпштo чoвeчкaтa " +
			"припaднoст.", "mk" ) ).toBe( "Site chovechki sushtestva se ragjaat slobodni i ednakvi po dostoinstvo i prava. " +
			"Tie se obdareni so razum i sovest i treba da se odnesuvaat eden kon drug vo duhot na opshto chovechkata pripadnost." );
	});
	it("returns a Macedonian string without special characters.", function(  ){
		expect( transliteration( "АаБбВвГгДдЃѓЕеЖжЗзЅѕИиЈјКкЛлЉљМмНнЊњОоПпРрСсТтЌќУуФфХхЦцЧчЏџШш", "mk" ) ).toBe
		( "AaBbVvGgDdGjgjEeZhzhZzDzdzIiJjKkLlLjljMmNnNjnjOoPpRrSsTtKjkjUuFfHhCcChchDjdjShsh" );
	});
	it("returns a Maori string without special characters.", function(  ){
		expect( transliteration( "āĀēĒīĪōŌūŪ", "mri" ) ).toBe( "aaAaeeEeiiIiooOouuUu" );
	});
	it("returns a Mirandese string without special characters.", function(  ){
		expect( transliteration( "çÇáÁéÉêÊíÍóÓôÔúÚũŨ", "mwl" ) ).toBe( "cCaAeEeEiIoOoOuUuU" );
	});
	it("returns an Occitan string without special characters.", function(  ){
		expect( transliteration( "àáÀÁèéÈÉòóÒÓíïÍÏúüÚÜçÇ·", "oci" ) ).toBe( "aaAAeeEEooOOiiIIuuUUcC" );
	});
	it("returns an Oromo string without special characters.", function(  ){
		expect( transliteration( "'", "orm" ) ).toBe( "" );
	});
	it("returns a Portuguese string without special characters.", function(  ){
		expect( transliteration( "çÇáâãàÁÂÃÀéêÉÊíÍóôõÓÔÕúÚ", "pt" ) ).toBe( "cCaaaaAAAAeeEEiIoooOOOuU" );
	});
	it("returns a Romansh Vallader string without special characters.", function(  ){
		expect( transliteration( "éèêÉÈÊïÏöÖüÜäÄ", "roh" ) ).toBe( "eeeEEEiIoeOeueUeaeAe" );
	});
	it("returns an Aromanian string without special characters.", function(  ){
		expect( transliteration( "ãÃ", "rup" ) ).toBe( "aA" );
	});
	it("returns a Romanian string without special characters.", function(  ){
		expect( transliteration( "ăĂâÂîÎșȘşŞțȚţŢ", "ro" ) ).toBe( "aAaAiIsSsStTtT" );
	});
	it("returns a Klingon string without special characters.", function(  ){
		expect( transliteration( "’'", "tlh" ) ).toBe( "" );
	});
	it("returns a Slovak string without special characters.", function(  ){
		expect( transliteration( "ǄǅǆáÁäÄčČďĎéÉíÍľĽĺĹňŇóÓôÔŕŔšŠťŤúÚýÝžŽ", "sk" ) ).toBe
		( "DZDzdzaAaAcCdDeEiIlLlLnNoOoOrRsStTuUyYzZ" );
	});
	it("returns a Slovene string without special characters.", function(  ){
		expect( transliteration( "čćČĆđĐšŠžŽàáȃȁÀÁȂȀèéẹ́ȇẹ̑ȅǝ̏ǝ̀ÈÉẸ́ȆẸ̑ȄƎ̏Ǝ̀ìíȋȉÌÍȊȈòóọ́ȏọ̑ȍÒÓỌ́ȎỌ̑ȌùúȗȕÙÚȖȔŕȓŔȒ", "sl" ) ).toBe
		( "ccCCdDsSzZaaaaAAAAeeeeeeeeEEEEEEEEiiiiIIIIooooooOOOOOOuuuuUUUUrrRR" );
	});
	it("returns an Albanian string without special characters.", function(  ){
		expect( transliteration( "çÇëË", "sq" ) ).toBe( "cCeE" );
	});
	it("returns a Hungarian string without special characters.", function(  ){
		expect( transliteration( "áÁéÉíÍóöőÓÖŐúüűÚÜŰ", "hu" ) ).toBe( "aAeEiIoooOOOuuuUUU" );
	});
	it("returns a Sardinian string without special characters.", function(  ){
		expect( transliteration( "çÇàáÀÁèéÈÉòóÒÓíïÍÏúùÚÙ", "srd" ) ).toBe( "cCaaAAeeEEooOOiiIIuuUU" );
	});
	it("returns a Silesian string without special characters.", function(  ){
		expect( transliteration( "ÃĆŁNŎŌÔÕŚŹŻŽŮČŘŠãćłnŏōôõśźżžůčřš", "szl" ) ).toBe
		( "ACUNOOOOSZZZUCzRzSzacunooooszzzuczrzsz" );
	});
	it("returns a Tahitian string without special characters.", function(  ){
		expect( transliteration( "’'‘āâàĀÂÀïîìÏÎÌēêéĒÊÉūûúŪÛÚçÇòôōÒÔŌ", "tah" ) ).toBe
		( "aaaAAAiiiIIIeeeEEEuuuUUUcCoooOOO" );
	});
	it("returns a Venetian string without special characters.", function(  ){
		expect( transliteration( "àáâÀÁÂèéÈÉòóÒÓùúÙÚçčċÇČĊł£Łđ\ud835\udeffδĐΔc’c‘c'C’C‘C'" +
			"s-cS-Cs'cS'Cs’cS’Cs‘cS‘CS-cS'cS’cS‘c", "vec" )
		).toBe( "aaaAAAeeEEooOOuuUUcccCCClLLdhdhdhDhDhcccCCCscSCscSCscSCscSCScScScSc" );
	});
	it("returns a Walloon string without special characters.", function(  ){
		expect( transliteration( "âÂåÅçÇéÉèÈêÊëËe̊E̊îÎôÔöÖûÛ", "wa" ) ).toBe( "aAaAcCeEeEeEeEeEiIoOoOuU" );
	});
	it("returns a Yoruba string without special characters.", function(  ){
		expect( transliteration( "áàìíóòọọ́ọ̀úùéèẹẹ́ẹ̀ṣÁÀÌÍÓÒỌỌ́Ọ̀ÚÙÉÈẸẸ́Ẹ̀Ṣ", "yor" )
		).toBe( "aaiiooooouueeeeesAAIIOOOOOUUEEEEES" );
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

