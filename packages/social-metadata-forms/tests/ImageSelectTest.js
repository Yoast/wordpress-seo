/* External dependencies */
import React from "react";

import ReactShallowRenderer from "react-test-renderer/shallow";
/* Internal dependencies */
import ImageSelect from "../src/ImageSelect";

describe( "The ImageSelect component", () => {
	it( "renders", () => {
		const renderer = new ReactShallowRenderer();
		const tree = renderer.render(
			<ImageSelect
				imageSelected={ false }
				title="Facebook image"
				socialMediumName="facebook"
				isPremium={ true }
				imageUrlInputId="facebook-url-input"
				selectImageButtonId="facebook-select-button"
				replaceImageButtonId="facebook-replace-button"
				removeImageButtonId="facebook-remove-button"
			/>
		);
		expect( tree ).toMatchSnapshot();
	} );

	it( "displays warnings", () => {
		const renderer = new ReactShallowRenderer();
		const tree = renderer.render(
			<ImageSelect
				title="Facebook image"
				imageSelected={ true }
				isPremium={ false }
				socialMediumName="twitter"
				warnings={ [
					"Your image is too small",
					"Wow, I like writing tests",
				] }
				imageUrlInputId="twitter-url-input"
				selectImageButtonId="twitter-select-button"
				replaceImageButtonId="twitter-replace-button"
				removeImageButtonId="twitter-remove-button"
			/>
		);
		expect( tree ).toMatchSnapshot();
	} );
} );
