import getWords from "../../../../../src/languageProcessing/languages/ja/helpers/getWords";

describe( "test for getting Japanese segmented words", function() {
	it( "returns an empty array if the text is empty", function() {
		const words = getWords( "" );

		expect( words ).toEqual( [] );
	} );
	it( "segments a sentence that contains Japanese punctuations", function() {
		const words = getWords( "東海道新幹線の開業前、東西の大動脈である東海道本線は高度経済成長下で線路容量が逼迫しており、抜本的な輸送力増強を迫られていた。" );

		expect( words ).toEqual( [ "東海道", "新幹線", "の", "開業", "前", "東西", "の", "大動脈", "で", "ある", "東海", "道本",
			"線", "は", "高度", "経済", "成長", "下", "で", "線路", "容量", "が", "逼迫", "し", "て", "おり", "抜本", "的", "な",
			"輸送", "力増", "強", "を", "迫られ", "て", "い", "た" ]
		);
	} );

	it( "segments a sentence that contains English punctuations", function() {
		const words = getWords( "計画段階では「東海道新線」と呼ばれていたが,開業時には「東海道新幹線」と命名された."	);

		expect( words ).toEqual( [ "計画", "段階", "で", "は", "東海道", "新線", "と", "呼ば", "れ", "て", "い", "た",
			"が", "開業", "時", "に", "は", "東海道", "新幹線", "と", "命名", "さ", "れ", "た" ] );
	} );
} );
