import React from "react";
import renderer from "react-test-renderer";
import AnalysisCollapsible from "../components/AnalysisCollapsible";

describe( "AnalysisCollapsible", () => {
	it( "matches the snapshot by default", () => {
		const component = renderer.create(
			<AnalysisCollapsible title="Problems">
				<li> First item </li>
				<li> Second item </li>
				<li> Third item </li>
				<li> Fourth item </li>
			</AnalysisCollapsible>
		);

		let tree = component.toJSON();
		expect( tree ).toMatchSnapshot();

		// After toggling it should be the opposite.
		component.getInstance().toggleOpen();
		expect( component.toJSON() ).toMatchSnapshot();
	} );

	it( "matches the snapshot with a heading", () => {
		const component = renderer.create(
			<AnalysisCollapsible title="Problems" hasHeading={ true }>
				<li> First item </li>
				<li> Second item </li>
				<li> Third item </li>
				<li> Fourth item </li>
			</AnalysisCollapsible>
		);

		let tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );

	it( "matches the snapshot when it is open", () => {
		const component = renderer.create(
			<AnalysisCollapsible title="Problems" initialIsOpen={ true }>
				<li> First item </li>
				<li> Second item </li>
				<li> Third item </li>
				<li> Fourth item </li>
			</AnalysisCollapsible>
		);

		let tree = component.toJSON();
		expect( tree ).toMatchSnapshot();

		// After toggling it should be the opposite.
		component.getInstance().toggleOpen();
		expect( component.toJSON() ).toMatchSnapshot();
	} );

    it( "matches the snapshot when it is closed", () => {
        const component = renderer.create(
            <AnalysisCollapsible title="Problems" initialIsOpen={ false }>
                <li> First item </li>
                <li> Second item </li>
                <li> Third item </li>
                <li> Fourth item </li>
            </AnalysisCollapsible>
        );

        let tree = component.toJSON();
        expect( tree ).toMatchSnapshot();

        // After toggling it should be the opposite.
        component.getInstance().toggleOpen();
        expect( component.toJSON() ).toMatchSnapshot();
    } );
} );
