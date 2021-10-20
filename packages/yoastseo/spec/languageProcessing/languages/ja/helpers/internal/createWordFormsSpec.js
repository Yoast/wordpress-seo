import createWordForms from "../../../../../../src/languageProcessing/languages/ja/helpers/internal/createWordForms";
import getMorphologyData from "../../../../../specHelpers/getMorphologyData";

const morphologyDataJA = getMorphologyData( "ja" ).ja;


describe( "test for creating word forms for Japanese", function() {
	it( "returns an array with the original word if the word is one character long", function() {
		let words = createWordForms( "猫", morphologyDataJA );
		expect( words ).toEqual( [ "猫" ] );

		words = createWordForms( "バラ", morphologyDataJA );
		expect( words ).toEqual( [ "バラ" ] );
	} );
	it( "returns an array with the word forms for a input word that ends in vowel group ending, e.g. -わせる", function() {
		const words = createWordForms( "会わせる", morphologyDataJA );

		expect( words ).toEqual( [ "会う", "会い", "会わ", "会え", "会お", "会っ", "会える", "会わせ", "会わせる", "会われ", "会われる", "会おう" ]
		);
	} );
	it( "returns an array with the word forms for a input word that ends in T group ending", function() {
		const words = createWordForms( "待つ", morphologyDataJA );

		expect( words ).toEqual( [ "待つ", "待ち", "待た", "待て", "待と", "待っ", "待てる", "待たせ", "待たせる", "待たれ", "待たれる", "待とう" ] );
	} );
	it( "returns an array with the word forms for a input word that ends in R group ending", function() {
		const words = createWordForms( "頑張り", morphologyDataJA );

		expect( words ).toEqual( [ "頑張る", "頑張り", "頑張ら", "頑張れ", "頑張ろ", "頑張っ", "頑張れる", "頑張らせ", "頑張らせる", "頑張られ", "頑張られる", "頑張ろう" ]
		);
	} );
	it( "returns an array with the word forms for a input word that ends in N group ending", function() {
		const words = createWordForms( "死な", morphologyDataJA );

		expect( words ).toEqual( [ "死ぬ", "死に", "死な", "死ね", "死の", "死ん", "死ねる", "死なせ", "死なせる", "死なれ", "死なれる", "死のう" ]
		);
	} );
	it( "returns an array with the word forms for a input word that ends in M group ending", function() {
		const words = createWordForms( "休め", morphologyDataJA );

		expect( words ).toEqual( [ "休む", "休み", "休ま", "休め", "休も", "休ん", "休める", "休ませ", "休ませる", "休まれ", "休まれる", "休もう" ] );
	} );
	it( "returns an array with the word forms for a input word that ends in B group ending", function() {
		const words = createWordForms( "及ぼ", morphologyDataJA );

		expect( words ).toEqual( [ "及ぶ", "及び", "及ば", "及べ", "及ぼ", "及ん", "及べる", "及ばせ", "及ばせる", "及ばれ", "及ばれる", "及ぼう" ] );
	} );
	it( "returns an array with the word forms for a input word that ends in K group ending", function() {
		const words = createWordForms( "遅かっ", morphologyDataJA );

		expect( words ).toEqual( [ "遅く", "遅き", "遅か", "遅け", "遅こ", "遅い", "遅ける", "遅かせ", "遅かせる", "遅かれ", "遅かれる", "遅こう", "遅かっ" ] );
	} );
	it( "returns an array with the word forms for a input word that ends in G group ending", function() {
		const words = createWordForms( "脱げる", morphologyDataJA );

		expect( words ).toEqual( [ "脱ぐ", "脱ぎ", "脱が", "脱げ", "脱ご", "脱い", "脱げる", "脱がせ", "脱がせる", "脱がれ", "脱がれる", "脱ごう" ] );
	} );
	it( "returns an array with the word forms for a input word that ends in S group ending", function() {
		const words = createWordForms( "話させる", morphologyDataJA );

		expect( words ).toEqual( [ "話す", "話し", "話さ", "話せ", "話そ", "話せる", "話させ", "話させる", "話され", "話される", "話そう" ] );
	} );
	it( "returns an additional forms without る ending if the input word ends in -る", function() {
		const words = createWordForms( "見る", morphologyDataJA );

		expect( words ).toEqual( [ "見る", "見り", "見ら", "見れ", "見ろ", "見っ", "見れる", "見らせ", "見らせる", "見られ", "見られる", "見ろう", "見" ] );
	} );
	it( "returns an array of word forms for an input word that ends in an ending that present in multiple ending groups, i.e. い", function() {
		const words = createWordForms( "会い", morphologyDataJA );

		expect( words ).toEqual( [ "会う", "会い", "会わ", "会え", "会お", "会っ", "会える", "会わせ", "会わせる", "会われ", "会われる", "会おう", "会く", "会き",
			"会か", "会け", "会こ", "会ける", "会かせ", "会かせる", "会かれ", "会かれる", "会こう", "会かっ", "会ぐ", "会ぎ", "会が", "会げ", "会ご", "会げる", "会がせ",
			"会がせる", "会がれ", "会がれる", "会ごう" ]
		);
	} );
	it( "returns an array of word forms for an input word that ends in an ending that present in multiple ending groups, i.e. っ", function() {
		const words = createWordForms( "会っ", morphologyDataJA );

		expect( words ).toEqual( [ "会う", "会い", "会わ", "会え", "会お", "会っ", "会える", "会わせ", "会わせる", "会われ", "会われる", "会おう", "会つ", "会ち",
			"会た", "会て", "会と", "会てる", "会たせ", "会たせる", "会たれ", "会たれる", "会とう", "会る", "会り", "会ら", "会れ", "会ろ", "会れる", "会らせ", "会らせる",
			"会られ", "会られる", "会ろう" ]
		);
	} );
	it( "returns an array of word forms for an input word that ends in an ending that present in multiple ending groups, i.e. ん", function() {
		const words = createWordForms( "読ん", morphologyDataJA );

		expect( words ).toEqual( [ "読ぬ", "読に", "読な", "読ね", "読の", "読ん", "読ねる", "読なせ", "読なせる", "読なれ", "読なれる", "読のう", "読む", "読み",
			"読ま", "読め", "読も", "読める", "読ませ", "読ませる", "読まれ", "読まれる", "読もう", "読ぶ", "読び", "読ば", "読べ", "読ぼ", "読べる", "読ばせ", "読ばせる",
			"読ばれ", "読ばれる", "読ぼう" ]
		);
	} );
	it( "returns an array of word forms for an input word that ends in an overlapping ending. The longer ending should be matched " +
		"and the forms form that ending group should be created. I.e. 書こう, ending -こう should be matched instead of -う", function() {
		const words = createWordForms( "書こう", morphologyDataJA );

		expect( words ).toEqual( [ "書く", "書き", "書か", "書け", "書こ", "書い", "書ける", "書かせ", "書かせる", "書かれ", "書かれる", "書こう", "書かっ" ] );
	} );
} );
