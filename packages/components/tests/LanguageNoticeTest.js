/* External dependencies */
import React, { act } from "react";
import renderer from "react-test-renderer";

/* Internal dependencies */
import LanguageNotice from "../src/LanguageNotice";

describe( "LanguageNotice", () => {
	it( "matches the snapshot by default", () => {
		let component;
		act( () => {
			component = renderer.create(
				<LanguageNotice
					changeLanguageLink="#"
					language="English"
				/>
			);
		} );

		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );

	it( "matches the snapshot when showLanguageNotice equals true", () => {
		let component;
		act( () => {
			component = renderer.create(
				<LanguageNotice
					changeLanguageLink="#"
					language="English"
					showLanguageNotice={ true }
				/>
			);
		} );

		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );

	it( "matches the snapshot with a changed language link", () => {
		let component;
		act( () => {
			component = renderer.create(
				<LanguageNotice
					changeLanguageLink="http://www.example.com"
					canChangeLanguage={ true }
					language="English"
					showLanguageNotice={ true }
				/>
			);
		} );

		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );

	it( "matches the snapshot with another language", () => {
		let component;
		act( () => {
			component = renderer.create(
				<LanguageNotice
					changeLanguageLink="http://www.example.com"
					canChangeLanguage={ true }
					language="Nederlands"
					showLanguageNotice={ true }
				/>
			);
		} );

		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );
} );
