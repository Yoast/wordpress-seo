import { Mark } from "yoastseo/src/values";
import { createAnnotationsFromPositionBasedMarks } from "../../../src/decorator/helpers/positionBasedAnnotationHelper";

describe( "createAnnotationsFromPositionBasedMarks", () => {
	it( "create annotation from block position based mark:" +
		" when the block client id matches the mark client id and the block html is the same as the rich text", () => {
		const mark = new Mark( {
			position: {
				startOffsetBlock: 4,
				endOffsetBlock: 14,
				clientId: "261e3892-f28c-4273-86b4-a00801c38d22",
			},
		} );
		const html = "The Maine Coon is a large domesticated cat breed.";

		/*
		 * "The Maine Coon is a large domesticated cat breed."
		 *    4 ^        ^ 14
		 */
		const expected = [
			{
				startOffset: 4,
				endOffset: 14,
			},
		];

		const actual = createAnnotationsFromPositionBasedMarks(
			mark,
			"261e3892-f28c-4273-86b4-a00801c38d22",
			"",
			html,
			html
		);

		expect( actual ).toEqual( expected );
	} );

	it( "should return an empty array if the block client id doesn't match the mark client id", () => {
		const mark = new Mark( {
			position: {
				startOffsetBlock: 22,
				endOffsetBlock: 26,
				clientId: "261aaa892-f28c-4273-86b4-a008574858",
			},
		} );
		const html = "The Maine Coon is a large domesticated cat breed.";

		const actual = createAnnotationsFromPositionBasedMarks(
			mark,
			"261e3892-f28c-4273-86b4-a00801c38d22",
			"",
			html,
			html
		);

		expect( actual ).toEqual( [] );
	} );

	it( "should return annotations with adjusted block start and end position when the block html is not the same as the rich text: " +
		"The mark is for non-Yoast block", () => {
		/*
         * The block start and end offsets that are coming from the analysis is off by the length of the following tags:
         * 1. The length of the HTML tags found in the text preceding the word we want to annotate
         *  - From the html text below, the html tags are:
         *  a. <strong>: 8 chars
         *  b. <a href="https://en.wikipedia.org/wiki/Giant_panda">: 52 chars
         *  c. </a>: 4 chars
         *  d. </strong>: 9 chars
         *
         * Total length of the html tags above: 73.
         *
         * The correct block start offset of the word "panda" is 128 - 73 = 55.
         * The correct block end offset of the word "panda" is 133 - 73 = 60.
        */
		const mark = new Mark( {
			position: {
				startOffsetBlock: 128,
				endOffsetBlock: 133,
				clientId: "261e3892-f28c-4273-86b4-a00801c38d22",
			},
		} );
		const html = "Red panda has smaller chewing muscles than " +
			"the <strong><a href=\"https://en.wikipedia.org/wiki/Giant_panda\">giant</a></strong> panda. ";
		// The word to annotate: panda. In the rich text below, the position is 55 - 60.
		const richText = "Red panda has a smaller chewing muscles than the giant panda.";

		const actual = createAnnotationsFromPositionBasedMarks(
			mark,
			"261e3892-f28c-4273-86b4-a00801c38d22",
			"",
			html,
			richText
		);

		expect( actual ).toEqual( [ {
			startOffset: 55,
			endOffset: 60,
		} ] );
	} );

	it( "should return annotations with adjusted block start and end position when the block html is not the same as the rich text: " +
		"The html contains html tags and html entities", () => {
		/*
         * The block start offset that is coming from the analysis is off by the length of the following tags and entities:
         * 1. The length of the HTML tags and entities found in the text preceding the word we want to annotate
         *  - From the html text below, the html tags and entities are:
         *  a. <em>: 4 chars
         *  b. <strong>: 8 chars
         *  c. amp; 4 chars
         * Total length of the html tags and enities above: 16.
         *
         * The block end offset that is coming from the analysis is off by the length of the following tags and entities:
         * 1. The length of the HTML tags found in the text preceding the word we want to annotate
         *  - From the html text below, the html tags and entities are:
         *  a. <em>: 4 chars
         *  b. <strong>: 8 chars
         *  c. amp; 4 chars
         *  c. </strong>: 9 chars
         *  d. </em>: 5 chars
         *  e. trade; 6 chars
         * Total length of the html tags and entities above: 36.
         *
         * The correct block start offset of the word "Bear™" is 34 - 16 = 18.
         * The correct block end offset of the word "Bear™" is 59 - 36 = 23.
        */
		const mark = new Mark( {
			position: {
				startOffsetBlock: 34,
				endOffsetBlock: 59,
				clientId: "261e3892-f28c-huw77-86b4-a008gdbuiqug01c38d22",
			},
		} );
		const html = "The great <em><strong>Panda &amp; Bear</strong></em>&trade;";
		// The word to annotate: Bear™. In the rich text below, the position is 18 - 23.
		const richText = "The great Panda & Bear™";

		const actual = createAnnotationsFromPositionBasedMarks(
			mark,
			"261e3892-f28c-huw77-86b4-a008gdbuiqug01c38d22",
			"",
			html,
			richText
		);

		expect( actual ).toEqual( [ {
			startOffset: 18,
			endOffset: 23,
		} ] );
	} );

	it( "should return annotations for the first section of a Yoast FAQ sub-block with adjusted block start and end position", () => {
		/*
	     * The block start and end offsets that are coming from the analysis is off by the length of the following tags:
	     * 1. The length of the strong tag opening of the first section, including the class name.
	     * 	a. <strong class="schema-faq-question">: 36 chars
	     * 2. The length of the HTML tags found in the text preceding the word we want to annotate
	     *  - From the html text below, the html tags are:
	     *  a. <strong>: 8 chars
	     *  b. <a href="https://en.wikipedia.org/wiki/Giant_panda">: 52 chars
	     *  c. </a>: 4 chars
	     *  d. </strong>: 9 chars
	     *
	     * Total length of the html tags above: 109.
	     *
	     * The correct block start offset of the word "panda" is 122 - 109 = 13.
		 * The correct block end offset of the word "panda" is 127 - 109 = 18.
	    */
		const mark = new Mark( {
			position: {
				startOffsetBlock: 122,
				endOffsetBlock: 127,
				clientId: "261e3892-f28c-4273-86b4-a00801c38d22",
				isFirstSection: true,
			},
		} );
		const html = "Is the <strong><a href=\"https://en.wikipedia.org/wiki/Giant_panda\">giant</a></strong> panda cute?";
		// The word to annotate: panda. In the rich text below, the position is 13 - 18.
		const richText = "Is the giant panda cute?";

		const actual = createAnnotationsFromPositionBasedMarks(
			mark,
			"261e3892-f28c-4273-86b4-a00801c38d22",
			"yoast/faq-block",
			html,
			richText
		);

		expect( actual ).toEqual( [ {
			startOffset: 13,
			endOffset: 18,
		} ] );
	} );

	it( "should return annotations for the first section of a Yoast How-To sub-block with adjusted block start and end position", () => {
		/*
		 * The block start and end offsets that are coming from the analysis is off by the length of the following tags:
		 * 1. The length of the strong tag opening of the first section, including the class name.
		 * 	a. <strong class="schema-how-to-step-name">: 40 chars
		 * 2. The length of the HTML tags found in the text preceding the word we want to annotate
		 *  - From the html text below, the html tags are:
		 *  a. <strong>: 8 chars
		 *  b. <a href="https://en.wikipedia.org/wiki/Giant_panda">: 52 chars
		 *  c. </a>: 4 chars
		 *  d. </strong>: 9 chars
		 *
		 * Total length of the html tags above: 113
		 *
		 * The correct block start offset of the word "panda" is 153 - 113 = 40.
		 * The correct block end offset of the word "panda" is 158 - 113 = 45.
		 */
		const mark = new Mark( {
			position: {
				startOffsetBlock: 153,
				endOffsetBlock: 158,
				clientId: "261e3892-f28c-4273-86b4-a00801c38d22",
				isFirstSection: true,
			},
		} );
		const html = "Prepare the <strong><a href=\"https://en.wikipedia.org/wiki/Giant_panda\">bamboo shoots</a></strong> for the giant panda";
		// The word to annotate: panda. In the rich text below, the position is 40 - 45.
		const richText = "Prepare the bamboo shoots for the giant panda";

		const actual = createAnnotationsFromPositionBasedMarks(
			mark,
			"261e3892-f28c-4273-86b4-a00801c38d22",
			"yoast/how-to-block",
			html,
			richText
		);

		expect( actual ).toEqual( [ {
			startOffset: 40,
			endOffset: 45,
		} ] );
	} );
} );
