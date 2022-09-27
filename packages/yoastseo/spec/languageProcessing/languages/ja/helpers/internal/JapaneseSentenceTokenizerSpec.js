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
			"東海道新幹線の開業前、東西の大動脈である東海道本線は高度経済成長下で線路容量が逼迫しており、抜本的な輸送力増強を迫られていた。",
			"これに対し日本国有鉄道（国鉄）は、十河信二国鉄総裁と技師長の島秀雄の下、高速運転が可能な標準軌新線を建設することを決定。",
			"計画段階では「東海道新線」と呼ばれていたが、開業時には「東海道新幹線」と命名された。",
		];

		const sentenceTokenizer = new JapaneseSentenceTokenizer();
		const { tokens, tokenizer } = sentenceTokenizer.createTokenizer();
		sentenceTokenizer.tokenize( tokenizer, text );

		expect( sentenceTokenizer.getSentencesFromTokens( tokens ) ).toEqual( expected );
	} );

	it( "splits a Japanese text with sentences that start with numerals", () => {
		const text = "東海道新幹線の開業前、東西の大動脈である東海道本線は高度経済成長下で線路容量が逼迫しており、抜本的な輸送力増強を迫られていた。" +
					 "９これに対し日本国有鉄道（国鉄）は、十河信二国鉄総裁と技師長の島秀雄の下、高速運転が可能な標準軌新線を建設することを決定。" +
					 "1959年（昭和34年）4月20日、新丹那トンネル熱海口で起工式を行って着工し、東京オリンピック開会直前の1964年（昭和39年）" +
					 "10月1日に開業した。⑳計画段階では「東海道新線」と呼ばれていたが、開業時には「東海道新幹線」と命名された。㊉新丹那トンネル熱海口で起工式を行って着工し、" +
					 "東京オリンピック開会直前の1964年。㈠東西の大動脈である東海道本線は高度経済成長下で線路容量が逼迫しており。";

		// Six sentences, delimited by six sentence delimiters.
		const expected = [
			"東海道新幹線の開業前、東西の大動脈である東海道本線は高度経済成長下で線路容量が逼迫しており、抜本的な輸送力増強を迫られていた。",
			"９これに対し日本国有鉄道（国鉄）は、十河信二国鉄総裁と技師長の島秀雄の下、高速運転が可能な標準軌新線を建設することを決定。",
			"1959年（昭和34年）4月20日、新丹那トンネル熱海口で起工式を行って着工し、東京オリンピック開会直前の1964年（昭和39年）10月1日に開業した。",
			"⑳計画段階では「東海道新線」と呼ばれていたが、開業時には「東海道新幹線」と命名された。",
			"㊉新丹那トンネル熱海口で起工式を行って着工し、東京オリンピック開会直前の1964年。",
			"㈠東西の大動脈である東海道本線は高度経済成長下で線路容量が逼迫しており。",
		];

		const sentenceTokenizer = new JapaneseSentenceTokenizer();
		const { tokens, tokenizer } = sentenceTokenizer.createTokenizer();
		sentenceTokenizer.tokenize( tokenizer, text );

		expect( sentenceTokenizer.getSentencesFromTokens( tokens ) ).toEqual( expected );
	} );

	it( "splits a Japanese text with sentences that end with different types of sentence delimiters.", () => {
		const text = "東海道新幹線の開業前、東西の大動脈である東海道本線は高度経済成長下で線路容量が逼迫しており、⁇" +
					 "９これに対し日本国有鉄道（国鉄）は、十河信二国鉄総裁と技師長の島秀雄の下、高速運転が可能な標準軌新線を建設することを決定‼" +
					 "1959年（昭和34年）4月20日、新丹那トンネル熱海口で起工式を行って着工し、東京オリンピック開会直前の1964年（昭和39年）" +
					 "10月1日に開業した‥⑳計画段階では「東海道新線」と呼ばれていたが、開業時には「東海道新幹線」と命名された…㊉新丹那トンネル熱海口で起工式を行って着工し、" +
					 "東京オリンピック開会直前の1964年。";

		// Five sentences, delimited by five sentence delimiters.
		const expected = [
			"東海道新幹線の開業前、東西の大動脈である東海道本線は高度経済成長下で線路容量が逼迫しており、⁇",
			"９これに対し日本国有鉄道（国鉄）は、十河信二国鉄総裁と技師長の島秀雄の下、高速運転が可能な標準軌新線を建設することを決定‼",
			"1959年（昭和34年）4月20日、新丹那トンネル熱海口で起工式を行って着工し、東京オリンピック開会直前の1964年（昭和39年）10月1日に開業した‥",
			"⑳計画段階では「東海道新線」と呼ばれていたが、開業時には「東海道新幹線」と命名された…",
			"㊉新丹那トンネル熱海口で起工式を行って着工し、東京オリンピック開会直前の1964年。",
		];

		const sentenceTokenizer = new JapaneseSentenceTokenizer();
		const { tokens, tokenizer } = sentenceTokenizer.createTokenizer();
		sentenceTokenizer.tokenize( tokenizer, text );

		expect( sentenceTokenizer.getSentencesFromTokens( tokens ) ).toEqual( expected );
	} );

	it( "splits a Japanese text which contains quotation marks.", () => {
		const text = "『東海道新幹線の開業前、東西の大動脈である東海道本線は高度経済成長下で線路容量が逼迫しており、』抜本的な輸送力増強を迫られていた。" +
					 "これに対し日本国有鉄道（国鉄）は、十河信二国鉄総裁と技師長の島秀雄の下、高速運転が可能な標準軌新線を建設することを決定。";

		const expected = [
			"『東海道新幹線の開業前、東西の大動脈である東海道本線は高度経済成長下で線路容量が逼迫しており、』抜本的な輸送力増強を迫られていた。",
			"これに対し日本国有鉄道（国鉄）は、十河信二国鉄総裁と技師長の島秀雄の下、高速運転が可能な標準軌新線を建設することを決定。",
		];

		const sentenceTokenizer = new JapaneseSentenceTokenizer();
		const { tokens, tokenizer } = sentenceTokenizer.createTokenizer();
		sentenceTokenizer.tokenize( tokenizer, text );

		expect( sentenceTokenizer.getSentencesFromTokens( tokens ) ).toEqual( expected );
	} );

	it( "splits a Japanese text which contains HTML.", () => {
		const text = "<p>『東海道新幹線の開業前、東西の大動脈である東海道本線は高度経済成長下で線路容量が逼迫しており、』抜本的な輸送力増強を迫られていた。" +
					 "これに対し日本国有鉄道（国鉄）は、十河信二国鉄総裁と技師長の島秀雄の下、高速運転が可能な標準軌新線を建設することを決定。</p>" +
					 "<p>『東海道新幹線の開業前、東西の大動脈である東海道本線は高度経済成長下で線路容量が逼迫しており、』抜本的な輸送力増強を迫られていた。" +
					 "これに対し日本国有鉄道（国鉄）は、十河信二国鉄総裁と技師長の島秀雄の下、高速運転が可能な標準軌新線を建設することを決定。</p>";

		/*
		 * Two paragraphs, with two sentences each, delimited by four sentence delimiters.
		 */
		const expected = [
			"『東海道新幹線の開業前、東西の大動脈である東海道本線は高度経済成長下で線路容量が逼迫しており、』抜本的な輸送力増強を迫られていた。",
			"これに対し日本国有鉄道（国鉄）は、十河信二国鉄総裁と技師長の島秀雄の下、高速運転が可能な標準軌新線を建設することを決定。",
			"</p><p>『東海道新幹線の開業前、東西の大動脈である東海道本線は高度経済成長下で線路容量が逼迫しており、』抜本的な輸送力増強を迫られていた。",
			"これに対し日本国有鉄道（国鉄）は、十河信二国鉄総裁と技師長の島秀雄の下、高速運転が可能な標準軌新線を建設することを決定。",
		];

		const sentenceTokenizer = new JapaneseSentenceTokenizer();
		const { tokens, tokenizer } = sentenceTokenizer.createTokenizer();
		sentenceTokenizer.tokenize( tokenizer, text );

		expect( sentenceTokenizer.getSentencesFromTokens( tokens ) ).toEqual( expected );
	} );

	it( "splits a Japanese text which contains sentence delimiter inside quotation block.", function() {
		const text = "彼女は「明日休みだね。なにしようか？」と言った。";
		const expected = [ "彼女は「明日休みだね。", "なにしようか？", "」と言った。" ];

		const sentenceTokenizer = new JapaneseSentenceTokenizer();
		const { tokens, tokenizer } = sentenceTokenizer.createTokenizer();
		sentenceTokenizer.tokenize( tokenizer, text );

		expect( sentenceTokenizer.getSentencesFromTokens( tokens ) ).toEqual( expected );
	} );

	it( "splits a Japanese text where delimiters are used in the middle of a sentence outside a quotation bracket.", function() {
		const text = "スカパー! が、50チャンネルの番組に一発で飛ぶことができる 「スカパー オリジナルのテレビリモコン」を抽選で50人にプレゼントするという情報が編集部に寄せられた。";
		const expected = [
			"スカパー!",
			"が、50チャンネルの番組に一発で飛ぶことができる 「スカパー オリジナルのテレビリモコン」を抽選で50人にプレゼントするという情報が編集部に寄せられた。",
		];

		const sentenceTokenizer = new JapaneseSentenceTokenizer();
		const { tokens, tokenizer } = sentenceTokenizer.createTokenizer();
		sentenceTokenizer.tokenize( tokenizer, text );

		expect( sentenceTokenizer.getSentencesFromTokens( tokens ) ).toEqual( expected );
	} );

	it( "splits a Japanese text includes a full stop as a sentence delimiter.", function() {
		const text = "東海道新幹線の開業前、東西の大動脈である東海道本線は高度経済成長下で線路容量が逼迫しており、抜本的な輸送力増強を迫られていた。" +
					 "これに対し日本国有鉄道（国鉄）は、十河信二国鉄総裁と技師長の島秀雄の下、高速運転が可能な標準軌新線を建設することを決定." +
					 "計画段階では「東海道新線」と呼ばれていたが、開業時には「東海道新幹線」と命名された。";
		const expected = [
			"東海道新幹線の開業前、東西の大動脈である東海道本線は高度経済成長下で線路容量が逼迫しており、抜本的な輸送力増強を迫られていた。",
			"これに対し日本国有鉄道（国鉄）は、十河信二国鉄総裁と技師長の島秀雄の下、高速運転が可能な標準軌新線を建設することを決定.",
			"計画段階では「東海道新線」と呼ばれていたが、開業時には「東海道新幹線」と命名された。",
		];

		const sentenceTokenizer = new JapaneseSentenceTokenizer();
		const { tokens, tokenizer } = sentenceTokenizer.createTokenizer();
		sentenceTokenizer.tokenize( tokenizer, text );

		expect( sentenceTokenizer.getSentencesFromTokens( tokens ) ).toEqual( expected );
	} );

	it( "splits a Japanese text that includes a full stop and a subsequent sentence that starts with a quotation mark.", function() {
		const text = "東海道新幹線の開業前、東西の大動脈である東海道本線は高度経済成長下で線路容量が逼迫しており、抜本的な輸送力増強を迫られていた. " +
					 " 'これに対し日本国有鉄道（国鉄）は、十河信二国鉄総裁と技師長の島秀雄の下、高速運転が可能な標準軌新線を建設することを決定'。" +
					 "計画段階では「東海道新線」と呼ばれていたが、開業時には「東海道新幹線」と命名された。";
		const expected = [
			"東海道新幹線の開業前、東西の大動脈である東海道本線は高度経済成長下で線路容量が逼迫しており、抜本的な輸送力増強を迫られていた.",
			"'これに対し日本国有鉄道（国鉄）は、十河信二国鉄総裁と技師長の島秀雄の下、高速運転が可能な標準軌新線を建設することを決定'。",
			"計画段階では「東海道新線」と呼ばれていたが、開業時には「東海道新幹線」と命名された。",
		];

		const sentenceTokenizer = new JapaneseSentenceTokenizer();
		const { tokens, tokenizer } = sentenceTokenizer.createTokenizer();
		sentenceTokenizer.tokenize( tokenizer, text );

		expect( sentenceTokenizer.getSentencesFromTokens( tokens ) ).toEqual( expected );
	} );

	it( "splits a Japanese text that includes a full stop and a subsequent sentence that starts with a Japanese quotation mark.", function() {
		const text = "東海道新幹線の開業前、東西の大動脈である東海道本線は高度経済成長下で線路容量が逼迫しており、抜本的な輸送力増強を迫られていた. " +
					 " 「これに対し日本国有鉄道（国鉄）は、十河信二国鉄総裁と技師長の島秀雄の下、高速運転が可能な標準軌新線を建設することを決定」。" +
					 "計画段階では「東海道新線」と呼ばれていたが、開業時には「東海道新幹線」と命名された。";
		const expected = [
			"東海道新幹線の開業前、東西の大動脈である東海道本線は高度経済成長下で線路容量が逼迫しており、抜本的な輸送力増強を迫られていた.",
			"「これに対し日本国有鉄道（国鉄）は、十河信二国鉄総裁と技師長の島秀雄の下、高速運転が可能な標準軌新線を建設することを決定」。",
			"計画段階では「東海道新線」と呼ばれていたが、開業時には「東海道新幹線」と命名された。",
		];

		const sentenceTokenizer = new JapaneseSentenceTokenizer();
		const { tokens, tokenizer } = sentenceTokenizer.createTokenizer();
		sentenceTokenizer.tokenize( tokenizer, text );

		expect( sentenceTokenizer.getSentencesFromTokens( tokens ) ).toEqual( expected );
	} );
} );
