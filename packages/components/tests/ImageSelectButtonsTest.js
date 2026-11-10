import React from "react";
import { render } from "@testing-library/react";

import ImageSelectButtons from "../src/image-select/ImageSelectButtons";

describe( "ImageSelectButtons", () => {
	test( "ImageSelectButtons without image selected matches the snapshot", () => {
		const { container } = render(
			<ImageSelectButtons
				imageSelected={ false }
			/>
		);

		const tree = container.firstChild;

		expect( tree ).toMatchSnapshot();

		expect( tree.children[ 0 ].textContent ).toBe( "Select image" );
	} );

	test( "ImageSelectButtons with image selected matches the snapshot", () => {
		const { container } = render(
			<ImageSelectButtons
				imageSelected={ true }
			/>
		);

		const tree = container.firstChild;

		expect( tree ).toMatchSnapshot();
		expect( tree.children[ 0 ].textContent ).toBe( "Replace image" );
		expect( tree.children[ 1 ].textContent ).toBe( "Remove image" );
	} );
} );
