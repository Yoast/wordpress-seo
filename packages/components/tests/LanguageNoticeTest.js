/* External dependencies */
import React from "react";
import { render } from "@testing-library/react";

/* Internal dependencies */
import LanguageNotice from "../src/LanguageNotice";

describe( "LanguageNotice", () => {
	it( "matches the snapshot by default", () => {
		const { container } = render(
			<LanguageNotice
				changeLanguageLink="#"
				language="English"
			/>
		);

		expect( container.firstChild ).toMatchSnapshot();
	} );

	it( "matches the snapshot when showLanguageNotice equals true", () => {
		const { container } = render(
			<LanguageNotice
				changeLanguageLink="#"
				language="English"
				showLanguageNotice={ true }
			/>
		);

		expect( container.firstChild ).toMatchSnapshot();
	} );

	it( "matches the snapshot with a changed language link", () => {
		const { container } = render(
			<LanguageNotice
				changeLanguageLink="http://www.example.com"
				canChangeLanguage={ true }
				language="English"
				showLanguageNotice={ true }
			/>
		);

		expect( container.firstChild ).toMatchSnapshot();
	} );

	it( "matches the snapshot with another language", () => {
		const { container } = render(
			<LanguageNotice
				changeLanguageLink="http://www.example.com"
				canChangeLanguage={ true }
				language="Nederlands"
				showLanguageNotice={ true }
			/>
		);

		expect( container.firstChild ).toMatchSnapshot();
	} );
} );
