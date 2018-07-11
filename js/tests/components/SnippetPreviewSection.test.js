import React from "react";
import { mount } from "enzyme";
import SnippetPreviewSection from "../../src/components/SnippetPreviewSection";

jest.mock( "../../src/containers/SnippetEditor", () => {
	return () => {
		return <div>HI!</div>;
	};
} );

jest.mock( "yoast-components", () => {
	const yoastComponents = require.requireActual( "yoast-components" );
	return {
		...yoastComponents,
		StyledSection: () => <span>yoast-components StyledSection</span>,
	};
} );

describe( "SnippetPreviewSection", () => {
	it( "renders the snippet editor inside of it", () => {
		const tree = mount(
			<SnippetPreviewSection
				title="Snippet editor"
				icon="eye"
				theme={ { isRtl: false } }
			/>
		);
		expect( tree ).toMatchSnapshot();
	} );
} );

describe( "SnippetPreviewSection RTL", () => {
	it( "renders the snippet editor inside of it", () => {
		const tree = mount(
			<SnippetPreviewSection
				title="Snippet editor"
				icon="eye"
				theme={ { isRtl: true } }
			/>
		);
		expect( tree ).toMatchSnapshot();
	} );
} );
