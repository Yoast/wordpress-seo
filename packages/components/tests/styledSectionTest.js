import React from "react";
import { render } from "@testing-library/react";
import forEach from "lodash/forEach";

import StyledSection from "../src/StyledSection";

const icons = [
	"edit", "search", "angle-left", "angle-right", "angle-up", "angle-down",
	"question-circle", "times", "eye", "circle", "file-text", "key", "list",
];

describe( "StyledSection", () => {
	test( "match the snapshot", () => {
		const { container } = render(
			<StyledSection
				headingText="Insights. Hello, this is a Styled Section heading."
				headingColor="red"
				headingLevel={ 2 }
				headingIcon="file-text"
				headingIconColor="blue"
				headingIconSize="16"
			>
				<p>Keyword Suggestions</p>
				<p>Hello, this is additional content</p>
			</StyledSection>
		);

		expect( container.firstChild ).toMatchSnapshot();
	} );

	test( "can change the heading level", () => {
		const { container } = render(
			<StyledSection
				headingText="Insights. Hello, this is a Styled Section heading."
				headingColor="red"
				headingLevel={ 4 }
				headingIcon="file-text"
				headingIconColor="blue"
				headingIconSize="16"
			>
				<p>Keyword Suggestions</p>
				<p>Hello, this is additional content</p>
			</StyledSection>
		);

		const tree = container.firstChild;
		expect( tree ).toMatchSnapshot();
		expect( tree.children[ 0 ].tagName ).toBe( "H4" );
	} );

	forEach( icons, function( icon ) {
		test( `can change the icon to ${icon}`, () => {
			const { container } = render(
				<StyledSection
					headingText="Insights. Hello, this is a Styled Section heading."
					headingColor="red"
					headingLevel={ 2 }
					headingIcon={ icon }
					headingIconColor="blue"
					headingIconSize="16"
				>
					<p>Icon { icon }</p>
				</StyledSection>
			);

			const tree = container.firstChild;
			expect( tree ).toMatchSnapshot();
			expect( tree.children.length ).toBeGreaterThan( 0 );

			// Child should be the Header
			let child = tree.children[ 0 ];
			expect( child ).toBeDefined();
			expect( child.tagName ).toBe( "H2" );
			expect( child.children.length ).toBeGreaterThan( 0 );

			// Child should be the SVG
			child = child.children[ 0 ];
			expect( child ).toBeDefined();
			expect( child.tagName ).toBe( "svg" );
			expect( child.children.length ).toBeGreaterThan( 0 );
			expect( child.getAttribute( "class" ) ).toContain( `yoast-svg-icon-${icon}` );
		} );
	} );

	test( "have a red icon", () => {
		const { container } = render(
			<StyledSection
				headingText="Insights. Hello, this is a Styled Section heading."
				headingColor="red"
				headingLevel={ 2 }
				headingIcon="search"
				headingIconColor="red"
				headingIconSize="16"
			>
				<p>Color red</p>
			</StyledSection>
		);

		const tree = container.firstChild;
		expect( tree ).toMatchSnapshot();
		const svg = tree.children[ 0 ].children[ 0 ];
		expect( svg.getAttribute( "fill" ) ).toBe( "red" );
	} );
} );
