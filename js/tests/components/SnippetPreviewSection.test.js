import React from "react";
import { mount } from "enzyme";

import SnippetPreviewSection from "../../src/components/SnippetPreviewSection";

jest.mock( "../../src/containers/SnippetEditor", () => {
	return () => {
		return <div>HI!</div>;
	};
} );

jest.mock( "yoast-components", () => {
	return { StyledSection: () => <span>yoast-components StyledSection</span> };
} );

describe( "SnippetPreviewSection", () => {
	it( "renders the snippet editor inside of it", () => {
		const tree = mount(
			<SnippetPreviewSection
				title="Snippet editor"
				icon="eye" />
		);

		expect( tree ).toMatchSnapshot();
	} );
} );
