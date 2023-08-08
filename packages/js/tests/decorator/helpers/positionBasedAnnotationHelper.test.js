import { Mark } from "yoastseo/src/values";
import { createAnnotationsFromPositionBasedMarks } from "../../../src/decorator/helpers/positionBasedAnnotationHelper";

describe( "createAnnotationsFromPositionBasedMarks", () => {
	it( "create annotation from block position based mark:" +
		" when the block client id matches the mark client id and the block html is the same as the rich text", () => {
		const mark = new Mark( {
			position: {
				startOffsetBlock: 22,
				endOffsetBlock: 26,
				clientId: "261e3892-f28c-4273-86b4-a00801c38d22",
			},
		} );
		const html = "The Maine Coon is a large domesticated cat breed.";

		/*
		 * "A long text. A marked text."
		 *                     22 ^   ^ 26
		 */
		const expected = [
			{
				startOffset: 22,
				endOffset: 26,
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
	it( "should return annotations with adjusted block start and end position " +
		"when the block html is not the same as the rich text", () => {
		const mark = new Mark( {
			position: {
				startOffsetBlock: 115,
				endOffsetBlock: 120,
				clientId: "261e3892-f28c-4273-86b4-a00801c38d22",
			},
		} );
		const html = "Red panda has smaller chewing muscles than " +
			"the <strong><a href=\"https://github.com/Yoast/wordpress-seo/pull/20139\">giant</a></strong> panda. ";
		const richText = "Red panda has a smaller chewing muscles than the giant panda.";

		const actual = createAnnotationsFromPositionBasedMarks(
			mark,
			"261e3892-f28c-4273-86b4-a00801c38d22",
			"",
			html,
			richText
		);

		expect( actual ).toEqual( [ {
			startOffset: 47,
			endOffset: 52,
		} ] );
	} );
	it( "should return annotations for the first section of a Yoast sub-block with adjusted block start and end position", () => {
		const mark = new Mark( {
			position: {
				startOffsetBlock: 115,
				endOffsetBlock: 120,
				clientId: "261e3892-f28c-4273-86b4-a00801c38d22",
			},
		} );
		const html = "Red panda has smaller chewing muscles than " +
			"the <strong><a href=\"https://github.com/Yoast/wordpress-seo/pull/20139\">giant</a></strong> panda. ";
		const richText = "Red panda has a smaller chewing muscles than the giant panda.";

		const actual = createAnnotationsFromPositionBasedMarks(
			mark,
			"261e3892-f28c-4273-86b4-a00801c38d22",
			"yoast/faq-block",
			html,
			richText
		);

		expect( actual ).toEqual( [ {
			startOffset: 47,
			endOffset: 52,
		} ] );
	} );
} );
