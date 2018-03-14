import React from "react";
import renderer from "react-test-renderer";
import Collapsible from "../components/Collapsible";

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

		let tree = component.toJSON();
		expect( tree ).toMatchSnapshot();

		// After toggling it should be the opposite.
		component.getInstance().toggleOpen();
		expect( component.toJSON() ).toMatchSnapshot();
	} );

	it( "matches the snapshot with a heading", () => {
		const component = renderer.create(
			<Collapsible title="Lorem ipsum dolor sit amet" hasHeading={ true }>
				{ content }
			</Collapsible>
		);

		let tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );

	it( "matches the snapshot when it is open", () => {
		const component = renderer.create(
			<Collapsible title="Lorem ipsum dolor sit amet" initialIsOpen={ true }>
				{ content }
			</Collapsible>
		);

		let tree = component.toJSON();
		expect( tree ).toMatchSnapshot();

		// After toggling it should be the opposite.
		component.getInstance().toggleOpen();
		expect( component.toJSON() ).toMatchSnapshot();
	} );

	it( "matches the snapshot when it is closed", () => {
		const component = renderer.create(
			<Collapsible title="Lorem ipsum dolor sit amet" initialIsOpen={ false }>
				{ content }
			</Collapsible>
		);

		let tree = component.toJSON();
		expect( tree ).toMatchSnapshot();

		// After toggling it should be the opposite.
		component.getInstance().toggleOpen();
		expect( component.toJSON() ).toMatchSnapshot();
	} );
} );
