import JapaneseSentenceTokenizer from "../../../../../../src/languageProcessing/languages/ja/helpers/internal/SentenceTokenizer";

describe( "The JapaneseSentenceTokenizer", () => {
	it( "gives back an empty array of sentences when given an empty text", () => {
		const text = "";

		const sentenceTokenizer = new JapaneseSentenceTokenizer();
		const { tokens, tokenizer } = sentenceTokenizer.createTokenizer();
		sentenceTokenizer.tokenize( tokenizer, text );

		expect( tokens ).toHaveLength( 0 );
	} );

	it( "correctly splits a Japanese text into sentences", () => {
		const text = "東海道新幹線の開業前、東西の大動脈である東海道本線は高度経済成長下で線路容量が逼迫しており、抜本的な輸送力増強を迫られていた。" +
					 "これに対し日本国有鉄道（国鉄）は、十河信二国鉄総裁と技師長の島秀雄の下、高速運転が可能な標準軌新線を建設することを決定。" +
					 "計画段階では「東海道新線」と呼ばれていたが、開業時には「東海道新幹線」と命名された。";

		// Three sentences, delimited by three sentence delimiters.
		const expected = [
			{ "col": 1, "line": 1, "src": "東海道新幹線の開業前、東西の大動脈である東海道本線は高度経済成長下で線路容量が逼迫しており、抜本的な輸送力増強を迫られていた", "type": "sentence" },
			{ "col": 63, "line": 1, "src": "。", "type": "sentence-delimiter" },
			{ "col": 64, "line": 1, "src": "これに対し日本国有鉄道（国鉄）は、十河信二国鉄総裁と技師長の島秀雄の下、高速運転が可能な標準軌新線を建設することを決定", "type": "sentence" },
			{ "col": 123, "line": 1, "src": "。", "type": "sentence-delimiter" },
			{ "col": 124, "line": 1, "src": "計画段階では「東海道新線」と呼ばれていたが、開業時には「東海道新幹線」と命名された", "type": "sentence" },
			{ "col": 165, "line": 1, "src": "。", "type": "sentence-delimiter" }
		];

		const sentenceTokenizer = new JapaneseSentenceTokenizer();
		const { tokens, tokenizer } = sentenceTokenizer.createTokenizer();
		sentenceTokenizer.tokenize( tokenizer, text );

		expect( tokens ).toEqual( expected );
	} );

	it( "parses a Japanese text with sentences that start with numerals", () => {
		const text = "東海道新幹線の開業前、東西の大動脈である東海道本線は高度経済成長下で線路容量が逼迫しており、抜本的な輸送力増強を迫られていた。" +
					 "９これに対し日本国有鉄道（国鉄）は、十河信二国鉄総裁と技師長の島秀雄の下、高速運転が可能な標準軌新線を建設することを決定。" +
					 "1959年（昭和34年）4月20日、新丹那トンネル熱海口で起工式を行って着工し、東京オリンピック開会直前の1964年（昭和39年）" +
					 "10月1日に開業した。⑳計画段階では「東海道新線」と呼ばれていたが、開業時には「東海道新幹線」と命名された。㊉新丹那トンネル熱海口で起工式を行って着工し、" +
					 "東京オリンピック開会直前の1964年。㈠東西の大動脈である東海道本線は高度経済成長下で線路容量が逼迫しており。";

		// Six sentences, delimited by six sentence delimiters.
		const expected = [
			{ "col": 1, "line": 1, "src": "東海道新幹線の開業前、東西の大動脈である東海道本線は高度経済成長下で線路容量が逼迫しており、抜本的な輸送力増強を迫られていた", "type": "sentence" },
			{ "col": 63, "line": 1, "src": "。", "type": "sentence-delimiter" },
			{ "col": 64, "line": 1, "src": "９これに対し日本国有鉄道（国鉄）は、十河信二国鉄総裁と技師長の島秀雄の下、高速運転が可能な標準軌新線を建設することを決定", "type": "sentence" },
			{ "col": 124, "line": 1, "src": "。", "type": "sentence-delimiter" },
			{ "col": 125, "line": 1, "src": "1959年（昭和34年）4月20日、新丹那トンネル熱海口で起工式を行って着工し、東京オリンピック開会直前の1964年（昭和39年）10月1日に開業した", "type": "sentence" },
			{ "col": 200, "line": 1, "src": "。", "type": "sentence-delimiter" },
			{ "col": 201, "line": 1, "src": "⑳計画段階では「東海道新線」と呼ばれていたが、開業時には「東海道新幹線」と命名された", "type": "sentence" },
			{ "col": 243, "line": 1, "src": "。", "type": "sentence-delimiter" },
			{ "col": 244, "line": 1, "src": "㊉新丹那トンネル熱海口で起工式を行って着工し、東京オリンピック開会直前の1964年", "type": "sentence" },
			{ "col": 285, "line": 1, "src": "。", "type": "sentence-delimiter" },
			{ "col": 286, "line": 1, "src": "㈠東西の大動脈である東海道本線は高度経済成長下で線路容量が逼迫しており", "type": "sentence" },
			{ "col": 321, "line": 1, "src": "。", "type": "sentence-delimiter" }
		];

		const sentenceTokenizer = new JapaneseSentenceTokenizer();
		const { tokens, tokenizer } = sentenceTokenizer.createTokenizer();
		sentenceTokenizer.tokenize( tokenizer, text );

		expect( tokens ).toEqual( expected );
	} );

	it( "parses a Japanese text with sentences that end with different types of sentence delimiters.", () => {
		const text = "東海道新幹線の開業前、東西の大動脈である東海道本線は高度経済成長下で線路容量が逼迫しており、⁇" +
					 "９これに対し日本国有鉄道（国鉄）は、十河信二国鉄総裁と技師長の島秀雄の下、高速運転が可能な標準軌新線を建設することを決定‼" +
					 "1959年（昭和34年）4月20日、新丹那トンネル熱海口で起工式を行って着工し、東京オリンピック開会直前の1964年（昭和39年）" +
					 "10月1日に開業した‥⑳計画段階では「東海道新線」と呼ばれていたが、開業時には「東海道新幹線」と命名された…㊉新丹那トンネル熱海口で起工式を行って着工し、" +
					 "東京オリンピック開会直前の1964年。";

		// Five sentences, delimited by five sentence delimiters.
		const expected = [
			{ "col": 1, "line": 1, "src": "東海道新幹線の開業前、東西の大動脈である東海道本線は高度経済成長下で線路容量が逼迫しており、", "type": "sentence" },
			{ "col": 47, "line": 1, "src": "⁇", "type": "sentence-delimiter" },
			{ "col": 48, "line": 1, "src": "９これに対し日本国有鉄道（国鉄）は、十河信二国鉄総裁と技師長の島秀雄の下、高速運転が可能な標準軌新線を建設することを決定", "type": "sentence" },
			{ "col": 108, "line": 1, "src": "‼", "type": "sentence-delimiter" },
			{ "col": 109, "line": 1, "src": "1959年（昭和34年）4月20日、新丹那トンネル熱海口で起工式を行って着工し、東京オリンピック開会直前の1964年（昭和39年）10月1日に開業した", "type": "sentence" },
			{ "col": 184, "line": 1, "src": "‥", "type": "sentence-delimiter" },
			{ "col": 185, "line": 1, "src": "⑳計画段階では「東海道新線」と呼ばれていたが、開業時には「東海道新幹線」と命名された", "type": "sentence" },
			{ "col": 227, "line": 1, "src": "…", "type": "sentence-delimiter" },
			{ "col": 228, "line": 1, "src": "㊉新丹那トンネル熱海口で起工式を行って着工し、東京オリンピック開会直前の1964年", "type": "sentence" },
			{ "col": 269, "line": 1, "src": "。", "type": "sentence-delimiter" }
		];

		const sentenceTokenizer = new JapaneseSentenceTokenizer();
		const { tokens, tokenizer } = sentenceTokenizer.createTokenizer();
		sentenceTokenizer.tokenize( tokenizer, text );

		expect( tokens ).toEqual( expected );
	} );

	it( "parses a Japanese text which contains quotation marks.", () => {
		const text = "『東海道新幹線の開業前、東西の大動脈である東海道本線は高度経済成長下で線路容量が逼迫しており、』抜本的な輸送力増強を迫られていた。" +
					 "これに対し日本国有鉄道（国鉄）は、十河信二国鉄総裁と技師長の島秀雄の下、高速運転が可能な標準軌新線を建設することを決定。";

		const expected = [
			{ "col": 1, "line": 1, "src": "『東海道新幹線の開業前、東西の大動脈である東海道本線は高度経済成長下で線路容量が逼迫しており、』抜本的な輸送力増強を迫られていた", "type": "sentence" },
			{ "col": 65, "line": 1, "src": "。", "type": "sentence-delimiter" },
			{ "col": 66, "line": 1, "src": "これに対し日本国有鉄道（国鉄）は、十河信二国鉄総裁と技師長の島秀雄の下、高速運転が可能な標準軌新線を建設することを決定", "type": "sentence" },
			{ "col": 125, "line": 1, "src": "。", "type": "sentence-delimiter" }
		];

		const sentenceTokenizer = new JapaneseSentenceTokenizer();
		const { tokens, tokenizer } = sentenceTokenizer.createTokenizer();
		sentenceTokenizer.tokenize( tokenizer, text );

		expect( tokens ).toEqual( expected );
	} );
} );
