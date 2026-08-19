import React from "react";
import renderer from "react-test-renderer";
import { Collapsible, CollapsibleStateless } from "../src/Collapsible";

describe( "Collapsible", () => {
	const content = (
		<React.Fragment>
			<h4>Vivamus rutrum velit ut nunc dignissim vulputate.</h4>
			<p>In a purus quis leo dictum ultrices. Aenean commodo erat at pellentesque placerat.</p>
			<h4>Ut id ex efficitur risus suscipit fermentum.</h4>
			<p>Proin sed dolor neque. Vestibulum id leo ut ante luctus interdum sed ut sem.</p>
		</React.Fragment>
	);

	it( "matches the snapshot by default", () => {
		const component = renderer.create(
			<Collapsible title="Lorem ipsum dolor sit amet">
				{ content }
			</Collapsible>
		);

		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();

		// After toggling it should be the opposite.
		component.getInstance().toggleCollapse();
		expect( component.toJSON() ).toMatchSnapshot();
	} );

	it( "matches the snapshot by default when the collapsible has an ID", () => {
		const component = renderer.create(
			<Collapsible title="Lorem ipsum dolor sit amet" id={ "yoast-collapsible" }>
				{ content }
			</Collapsible>
		);

		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();

		// After toggling it should be the opposite.
		component.getInstance().toggleCollapse();
		expect( component.toJSON() ).toMatchSnapshot();
	} );

	it( "matches the snapshot when it is open", () => {
		const component = renderer.create(
			<Collapsible title="Lorem ipsum dolor sit amet" initialIsOpen={ true }>
				{ content }
			</Collapsible>
		);

		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();

		// After toggling it should be the opposite.
		component.getInstance().toggleCollapse();
		expect( component.toJSON() ).toMatchSnapshot();
	} );

	it( "matches the snapshot when it is closed", () => {
		const component = renderer.create(
			<Collapsible title="Lorem ipsum dolor sit amet" initialIsOpen={ false }>
				{ content }
			</Collapsible>
		);

		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();

		// After toggling it should be the opposite.
		component.getInstance().toggleCollapse();
		expect( component.toJSON() ).toMatchSnapshot();
	} );

	it( "renders a header help link outside the toggle button", () => {
		const component = renderer.create(
			<Collapsible
				title="Lorem ipsum dolor sit amet"
				initialIsOpen={ true }
				headerHelpLink={ <a className="header-help-link" href="https://example.com/help">Help</a> }
			>
				{ content }
			</Collapsible>
		);

		const button = component.root.findByType( "button" );

		/*
		 * A link inside the button would be invalid HTML, and a click on it would both open the link
		 * and toggle the panel. The link has to be a sibling of the button instead.
		 */
		expect( button.findAllByType( "a" ) ).toHaveLength( 0 );
		expect( component.root.findAllByType( "a" ) ).toHaveLength( 1 );

		expect( component.toJSON() ).toMatchSnapshot();
	} );

	it( "keeps the suffix icon inside the toggle button when a header help link is given", () => {
		const component = renderer.create(
			<Collapsible
				title="Lorem ipsum dolor sit amet"
				initialIsOpen={ true }
				headerHelpLink={ <a className="header-help-link" href="https://example.com/help">Help</a> }
			>
				{ content }
			</Collapsible>
		);

		/*
		 * The suffix icon is positioned at the edge of the header row with CSS, but stays a child of
		 * the button: that keeps it inside the toggle's hit area, and integrations look the icon up
		 * and click its parent element to open a collapsible.
		 */
		const button = component.root.findByType( "button" );
		expect( button.findAllByType( "svg" ).length ).toBeGreaterThan( 0 );
	} );
} );

describe( "CollapsibleStateless", () => {
	const content = (
		<React.Fragment>
			<h4>Vivamus rutrum velit ut nunc dignissim vulputate.</h4>
			<p>In a purus quis leo dictum ultrices. Aenean commodo erat at pellentesque placerat.</p>
			<h4>Ut id ex efficitur risus suscipit fermentum.</h4>
			<p>Proin sed dolor neque. Vestibulum id leo ut ante luctus interdum sed ut sem.</p>
		</React.Fragment>
	);

	it( "matches the snapshot by default", () => {
		const component = renderer.create(
			<CollapsibleStateless title="Lorem ipsum dolor sit amet" isOpen={ true } onToggle={ () => {} }>
				{ content }
			</CollapsibleStateless>
		);

		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );

	it( "matches the snapshot when it is opened and closed", () => {
		let isOpen = true;
		/**
		 * Reverts the modal open state.
		 *
		 * @returns {void}
		 */
		const onToggle = () => {
			isOpen = ! isOpen;
		};
		const component = renderer.create(
			<CollapsibleStateless title="Lorem ipsum dolor sit amet" isOpen={ isOpen } onToggle={ onToggle }>
				{ content }
			</CollapsibleStateless>
		);

		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();

		// After toggling it should be the opposite.
		onToggle();
		expect( component.toJSON() ).toMatchSnapshot();
	} );

	it( "matches the snapshot with prefix seo icon and screen reader text", () => {
		const component = renderer.create(
			<CollapsibleStateless
				title="Lorem ipsum dolor sit amet"
				titleScreenReaderText="bad SEO score"
				prefixIcon={ { icon: "circle", color: "red" } }
				prefixIconCollapsed={ { icon: "circle", color: "red" } }
				isOpen={ true }
				onToggle={ () => {} }
			>
				{ content }
			</CollapsibleStateless>
		);

		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );
} );
