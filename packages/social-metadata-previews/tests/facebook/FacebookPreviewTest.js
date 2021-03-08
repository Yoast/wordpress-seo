/* External dependencies */
import React from "react";
import renderer from "react-test-renderer";

/* Internal dependencies */
import FacebookPreview from "../../src/facebook/FacebookPreview";

describe( "FacebookPreview", () => {
	it( "matches the snapshot for a landscape image", () => {
		const component = renderer.create(
			<FacebookPreview
				siteUrl="yoast.com"
				title="YoastCon Workshops"
				description="Description to go along with a landscape image."
				src="https://yoast.com/app/uploads/2015/06/How_to_choose_keywords_FI.png"
				alt="Alt text"
			/>
		);

		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );
	it( "matches the snapshot for a portrait image", () => {
		const component = renderer.create(
			<FacebookPreview
				siteUrl="yoast.com"
				title="YoastCon Workshops"
				description="Description to go along with a portrait image."
				src="https://yoast.com/app/uploads/2015/09/Author_Joost_x2.png"
				alt="Alt text"
			/>
		);

		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );
	it( "matches the snapshot for a square image", () => {
		const component = renderer.create(
			<FacebookPreview
				siteUrl="yoast.com"
				title="YoastCon Workshops"
				description="Description to go along with a square image."
				src="https://yoast.com/app/uploads/2018/09/avatar_user_1_1537774226.png"
				alt="Alt text"
			/>
		);

		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );
	it( "matches the snapshot for a too small image", () => {
		const component = renderer.create(
			<FacebookPreview
				siteUrl="yoast.com"
				title="YoastCon Workshops"
				description="Description to go along with too small an image."
				src="https://yoast.com/app/uploads/2018/11/Logo_TYPO3-250x105.png"
				alt="Alt text"
			/>
		);

		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );
	it( "matches the snapshot for a faulty image", () => {
		const component = renderer.create(
			<FacebookPreview
				siteUrl="yoast.com"
				title="YoastCon Workshops"
				description="Description to go along with a faulty image."
				src="thisisnoimage"
			/>
		);

		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );
} );
