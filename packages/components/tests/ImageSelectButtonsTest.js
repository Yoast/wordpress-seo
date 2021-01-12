import React from "react";
import renderer from "react-test-renderer";

import ImageSelectButtons from "../src/image-select/ImageSelectButtons";

describe( "ImageSelectButtons", () => {
	test( "ImageSelectButtons without image selected matches the snapshot", () => {
		const component = renderer.create(
			<ImageSelectButtons
				imageSelected={ false }
			/>
		);

		const tree = component.toJSON();

		expect( tree ).toMatchSnapshot();

		expect( tree.children[ 0 ] ).toBe( "Select image" );
	} );

	test( "ImageSelectButtons with image selected matches the snapshot", () => {
		const component = renderer.create(
			<ImageSelectButtons
				imageSelected={ true }
			/>
		);

		const tree = component.toJSON();

		expect( tree ).toMatchSnapshot();
		expect( tree[ 0 ].children[ 0 ] ).toBe( "Replace image" );
		expect( tree[ 1 ].children[ 0 ] ).toBe( "Remove image" );
	} );
} );
