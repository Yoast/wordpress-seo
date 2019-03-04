/* External dependencies */
import React from "react";
import renderer from "react-test-renderer";

/* Internal dependencies */
import FacebookPreview from "../components/FacebookPreview";

describe( "FacebookPreview", () => {
	it( "matches the snapshot for a landscape image", () => {
		const component = renderer.create(
			<FacebookPreview siteName="yosat.com" src="https://yoast.com/app/uploads/2015/06/How_to_choose_keywords_FI.png" />
		);

		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );
	it( "matches the snapshot for a portrait image", () => {
		const component = renderer.create(
			<FacebookPreview siteName="yoast.com" src="https://yoast.com/app/uploads/2015/09/Author_Joost_x2.png" />
		);

		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );
	it( "matches the snapshot for a square image", () => {
		const component = renderer.create(
			<FacebookPreview siteName="yoast.com" src="https://yoast.com/app/uploads/2018/09/avatar_user_1_1537774226.png" />
		);

		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );
	it( "matches the snapshot for a too small image", () => {
		const component = renderer.create(
			<FacebookPreview siteName="yoast.com" src="https://yoast.com/app/uploads/2018/11/Logo_TYPO3-250x105.png" />
		);

		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );
	it( "matches the snapshot for a faulty image", () => {
		const component = renderer.create(
			<FacebookPreview siteName="yoast.com" src="thisisnoimage" />
		);

		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );
} );
