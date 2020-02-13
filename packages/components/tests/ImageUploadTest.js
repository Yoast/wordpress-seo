/* External dependencies */
import React from "react";
import renderer from "react-test-renderer";
/* Internal dependencies */
import ImageUpload from "@yoast/components/src/ImageSelect";

describe( "<ImageUpload />", () => {
	it( "renders", () => {
		const tree = renderer.create(
			<ImageUpload title="Facebook image" />,
		).toJSON();
		expect( tree ).toMatchSnapshot();
	} );

	it( "displays warnings", () => {
		const tree = renderer.create(
			<ImageUpload
				title="Facebook image"
				warnings={ [
					"Your image is too small",
					"Wow, I like writing tests",
				] }
			/>,
		).toJSON();
		expect( tree ).toMatchSnapshot();
	} );
} );
