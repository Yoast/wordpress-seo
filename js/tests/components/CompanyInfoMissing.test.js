import React from "react";
import renderer from "react-test-renderer";
import CompanyInfoMissing from "../../src/components/CompanyInfoMissing";

describe( "CompanyInfoMissing", () => {
	it( "matches the snapshot", () => {
		const component = renderer.create(
			<CompanyInfoMissing message="Testing." link="https://example.com/" />,
		);

		const tree = component.toJSON();

		expect( tree.props.className.startsWith( "Alert" ) ).toBe( true );
		expect( tree ).toMatchSnapshot();
	} );
} );
