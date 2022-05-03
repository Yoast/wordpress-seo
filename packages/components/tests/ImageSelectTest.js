import React from "react";
import renderer from "react-test-renderer";

import ImageSelect from "../src/image-select/ImageSelect";

describe( "ImageSelect", () => {
	test( "ImageSelects match the snapshot", () => {
		const imageSelects = [
			{
				label: "Organization",
				hasPreview: true,
				imageUrl: "",
			},
			{
				label: "Another organization",
				hasPreview: true,
				imageUrl: "http://placekitten.com/300/300",
			},
			{
				label: "Yet another organization",
				hasPreview: false,
				imageUrl: "",
			},
			{
				label: "Not another organization",
				hasPreview: false,
				imageUrl: "http://placekitten.com/300/300",
			},
		];

		imageSelects.forEach( imageSelect => {
			const component = renderer.create(
				<ImageSelect
					label={ imageSelect.label }
					imageAltText={ "" }
					hasPreview={ imageSelect.hasPreview }
					imageUrl={ imageSelect.imageUrl }
				/>
			);
			const tree = component.toJSON();

			expect( tree ).toMatchSnapshot();
		} );
	} );
} );
