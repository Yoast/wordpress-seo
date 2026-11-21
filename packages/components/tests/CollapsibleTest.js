import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { noop } from "lodash";
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
		const { container, asFragment } = render(
			<Collapsible title="Lorem ipsum dolor sit amet">
				{ content }
			</Collapsible>
		);

		expect( container.firstChild ).toMatchSnapshot();

		// After toggling it should be the opposite.
		fireEvent.click( container.querySelector( "button" ) );
		expect( asFragment().firstChild ).toMatchSnapshot();
	} );

	it( "matches the snapshot by default when the collapsible has an ID", () => {
		const { container, asFragment } = render(
			<Collapsible title="Lorem ipsum dolor sit amet" id={ "yoast-collapsible" }>
				{ content }
			</Collapsible>
		);

		expect( container.firstChild ).toMatchSnapshot();

		// After toggling it should be the opposite.
		fireEvent.click( container.querySelector( "button" ) );
		expect( asFragment().firstChild ).toMatchSnapshot();
	} );

	it( "matches the snapshot when it is open", () => {
		const { container, asFragment } = render(
			<Collapsible title="Lorem ipsum dolor sit amet" initialIsOpen={ true }>
				{ content }
			</Collapsible>
		);

		expect( container.firstChild ).toMatchSnapshot();

		// After toggling it should be the opposite.
		fireEvent.click( container.querySelector( "button" ) );
		expect( asFragment().firstChild ).toMatchSnapshot();
	} );

	it( "matches the snapshot when it is closed", () => {
		const { container, asFragment } = render(
			<Collapsible title="Lorem ipsum dolor sit amet" initialIsOpen={ false }>
				{ content }
			</Collapsible>
		);

		expect( container.firstChild ).toMatchSnapshot();

		// After toggling it should be the opposite.
		fireEvent.click( container.querySelector( "button" ) );
		expect( asFragment().firstChild ).toMatchSnapshot();
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
		const { container } = render(
			<CollapsibleStateless title="Lorem ipsum dolor sit amet" isOpen={ true } onToggle={ noop }>
				{ content }
			</CollapsibleStateless>
		);

		expect( container.firstChild ).toMatchSnapshot();
	} );

	it( "matches the snapshot when it is opened and closed", () => {
		let isOpen = true;
		/**
		 * Reverts the modal open state.
		 *
		 * @returns {void}
		 */
		const onToggle = jest.fn( () => {
			isOpen = ! isOpen;
		} );
		const renderCollapsible = () => (
			<CollapsibleStateless title="Lorem ipsum dolor sit amet" isOpen={ isOpen } onToggle={ onToggle }>
				{ content }
			</CollapsibleStateless>
		);
		const { container, asFragment, rerender } = render( renderCollapsible() );

		expect( container.firstChild ).toMatchSnapshot();

		// After toggling it should be the opposite.
		fireEvent.click( container.querySelector( "button" ) );
		expect( onToggle ).toHaveBeenCalledTimes( 1 );
		rerender( renderCollapsible() );
		expect( asFragment().firstChild ).toMatchSnapshot();
	} );

	it( "matches the snapshot with prefix seo icon and screen reader text", () => {
		const { container } = render(
			<CollapsibleStateless
				title="Lorem ipsum dolor sit amet"
				titleScreenReaderText="bad SEO score"
				prefixIcon={ { icon: "circle", color: "red" } }
				prefixIconCollapsed={ { icon: "circle", color: "red" } }
				isOpen={ true }
				onToggle={ noop }
			>
				{ content }
			</CollapsibleStateless>
		);

		expect( container.firstChild ).toMatchSnapshot();
	} );
} );
