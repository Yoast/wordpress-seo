/* External dependencies */
import React from "react";
import renderer from "react-test-renderer";

/* Internal dependencies */
import LanguageNotice from "../components/LanguageNotice";

describe( "LanguageNotice", () => {
	it( "matches the snapshot by default", () => {
		const component = renderer.create(
			<LanguageNotice
				changeLanguageLink="#"
				language="English"
			/>
		);

		let tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );

	it( "matches the snapshot when showLanguageNotice equals true", () => {
		const component = renderer.create(
			<LanguageNotice
				changeLanguageLink="#"
				language="English"
				showLanguageNotice={ true }
			/>
		);

		let tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );

	it( "matches the snapshot with a changed language link", () => {
		const component = renderer.create(
			<LanguageNotice
				changeLanguageLink="http://www.example.com"
				canChangeLanguage={ true }
				language="English"
				showLanguageNotice={ true }
			/>
		);

		let tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );

	it( "matches the snapshot with another language", () => {
		const component = renderer.create(
			<LanguageNotice
				changeLanguageLink="http://www.example.com"
				canChangeLanguage={ true }
				language="Nederlands"
				showLanguageNotice={ true }
			/>
		);

		let tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );
} );
