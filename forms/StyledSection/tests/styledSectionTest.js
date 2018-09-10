import React from "react";
import renderer from "react-test-renderer";
import forEach from "lodash/forEach";

import StyledSection from "../StyledSection";

const icons = [
	"edit", "search", "angle-left", "angle-right", "angle-up", "angle-down",
	"question-circle", "times", "eye", "circle", "file-text", "key", "list",
];

describe( "StyledSection", () => {
	test( "match the snapshot", () => {
		const component = renderer.create(
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

		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );

	test( "can change the heading level", () => {
		const component = renderer.create(
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

		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
		expect( tree.children[ 0 ].type ).toBe( "h4" );
	} );

	forEach( icons, function( icon ) {
		test( `can change the icon to ${icon}`, () => {
			const component = renderer.create(
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

			const tree = component.toJSON();
			expect( tree ).toMatchSnapshot();
			expect( tree.children ).toBeDefined();

			// Child should be the Header
			let child = tree.children[ 0 ];
			expect( child ).toBeDefined();
			expect( child.type ).toBe( "h2" );
			expect( child.children ).toBeDefined();

			// Child should be the SVG
			child = child.children[ 0 ];
			expect( child ).toBeDefined();
			expect( child.type ).toBe( "svg" );
			expect( child.children ).toBeDefined();
			expect( child.props.className ).toContain( `yoast-svg-icon-${icon}` );
		} );
	} );

	test( "have a red icon", () => {
		const component = renderer.create(
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

		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
		const svg = tree.children[ 0 ].children[ 0 ];
		expect( svg.props.fill ).toBe( "red" );
	} );
} );
