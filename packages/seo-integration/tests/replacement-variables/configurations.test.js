import * as data from "@wordpress/data";
import { excerpt } from "../../src/replacement-variables/configurations";

const selectContent = jest.fn().mockReturnValue( "A calico cat is a domestic cat of any breed with a tri-color coat. The calico cat is most commonly thought " +
	"of as being typically 25% to 75% white with large orange and black patches (or sometimes cream and grey patches); however, the calico cat can have" +
	" three other colors in its pattern. They are almost exclusively female except under rare genetic conditions. Calico is not to be confused " +
	"with a tortoiseshell, which has a mostly mottled coat of black/orange or grey/cream with relatively few to no white markings. " +
	"However, outside North America, the calico pattern is more commonly called tortoiseshell and white. In the province of Quebec, Canada, " +
	"they are sometimes called chatte d'Espagne (French for '(female) cat of Spain'). Other names include brindle, tricolor cat, mikeneko (三毛猫)" +
	" (Japanese for 'triple fur cat'), and lapjeskat (Dutch for 'patches cat'); calicoes with diluted coloration have been called calimanco or " +
	"clouded tiger. Occasionally, the tri-color calico coloration is combined with a tabby patterning; this calico-patched tabby is called a " +
	"caliby or a torbie (i.e. a tabby tortoiseshell)." );

describe( "a test for getting the replacement of the variables", () => {
	it( "should return the replacement for the excerpt variable when the current excerpt is an empty string and the locale is English: " +
		"the excerpt should be extracted from the content, truncated in the 156th character", () => {
		jest.spyOn( data, "select" ).mockImplementation( () => {
			return {
				selectExcerpt: jest.fn().mockReturnValue( "" ),
				selectContent: selectContent,
				selectLocale: jest.fn().mockReturnValue( "en" ),
			};
		} );

		expect( excerpt.getReplacement() ).toEqual( "A calico cat is a domestic cat of any breed with a tri-color coat. The calico cat is most " +
			"commonly thought of as being typically 25% to 75% white with" );
	} );

	it( "should return the replacement for the excerpt variable when the current excerpt is not empty and the locale is English", () => {
		jest.spyOn( data, "select" ).mockImplementation( () => {
			return {
				selectExcerpt: jest.fn().mockReturnValue( "The cat (Felis catus) is a domestic species of a small carnivorous mammal. " +
					"It is the only domesticated species in the family Felidae and is often referred to as the domestic cat to distinguish it " +
					"from the wild members of the family." ),
				selectContent: selectContent,
				selectLocale: jest.fn().mockReturnValue( "en" ),
			};
		} );

		expect( excerpt.getReplacement() ).toEqual( "The cat (Felis catus) is a domestic species of a small carnivorous mammal. " +
			"It is the only domesticated species in the family Felidae and is often referred to as the domestic cat to distinguish it " +
			"from the wild members of the family." );
	} );

	it( "should return the replacement for the excerpt variable when the current excerpt is empty and the locale is Japanese: " +
		"the excerpt should be extracted from the content, truncated in the 80th character", () => {
		jest.spyOn( data, "select" ).mockImplementation( () => {
			return {
				selectExcerpt: jest.fn().mockReturnValue( "" ),
				selectContent: jest.fn().mockReturnValue( "腹げゆッ格装まー町告イナヲス情団リラまさ今裁ホウ応4相うごひ進夫更ヤヱ協書ッなにり野責ノワホ臨索フえ以天っ" +
					"兆百ラヘチ全2意だ。近ゅめびル聞9白捕りラ何働成構くでみひ崎9新ルラ法触英クゃゅげ入待サ池稿ろしぶ点法ねレき権増サ禁一ワ心現ワキ表週暮枠トのや。者ヲミ試虚ずーラ" +
					"格岐キロヘム哀7心ア校盤だ連植場つえめ軍島スチセ美属通んばトか動成き入博ス取詳態推よ。" ),
				selectLocale: jest.fn().mockReturnValue( "ja" ),
			};
		} );

		expect( excerpt.getReplacement() ).toEqual( "腹げゆッ格装まー町告イナヲス情団リラまさ今裁ホウ応4相うごひ進夫更ヤヱ協書ッなにり野責ノワホ臨索フえ以天っ" +
			"兆百ラヘチ全2意だ。近ゅめびル聞9白捕りラ何働成構くで" );
	} );
} );
