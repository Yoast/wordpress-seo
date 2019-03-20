/* External dependencies */
import React from "react";
import renderer from "react-test-renderer";

/* Internal dependencies */
import FacebookSiteAndAuthorNames from "../components/FacebookSiteAndAuthorNames";

describe( "FacebookSiteAndAuthorNames", () => {
	it( "matches the snapshot by default", () => {
		const component = renderer.create(
			<FacebookSiteAndAuthorNames siteName="sitename.com" authorName="John Doe" />
		);

		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );

	it( "does not contain the author name when no author name was given", () => {
		const component = renderer.create(
			<FacebookSiteAndAuthorNames siteName="sitename.com" />
		);

		const tree = component.toJSON();

		/*
		 * Not optimal, but the TestRenderer does not have support for function components. which FacebookAuthorName is.
		 * See: https://reactjs.org/docs/test-renderer.html#testrenderergetinstance
		 */
		const facebookAuthorNameExists = tree.children.some( el => el.type === "span" && el.props.className.startsWith( "FacebookAuthorName" ) );
		expect( facebookAuthorNameExists ).toEqual( false );
	} );
} );
