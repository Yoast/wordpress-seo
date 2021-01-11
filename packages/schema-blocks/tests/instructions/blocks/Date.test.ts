import * as renderer from "react-test-renderer";

// @ts-ignore -- __experimentalGetSettings is defined.
import { __experimentalGetSettings, dateI18n } from "@wordpress/date";

import Date from "../../../src/instructions/blocks/Date";
import { RenderEditProps } from "../../../src/core/blocks/BlockDefinition";
import { RenderSaveProps } from "../../../dist/core/blocks/BlockDefinition";

jest.mock( "@wordpress/date", () => ( {
	__experimentalGetSettings: jest.fn(),
	dateI18n: jest.fn(),
} ) );

describe( "The Date instruction", () => {
	/**
	 * Skipped because the `useState` hook does not work with the test renderer.
	 */
	it.skip( "returns the React components for in the editor correctly.", () => {
		const options = {
			name: "publishedDate",
		};
		const dateInstruction = new Date( 12, options );

		const setAttributes = jest.fn();

		const props: RenderEditProps = {
			clientId: "1234-abc",
			className: "",
			isSelected: false,
			setAttributes,
			attributes: {
				publishedDate: "2020-21-01",
			},
		};

		const wrapper = renderer.create( dateInstruction.edit( props ) );
	} );

	it( "returns the correct configuration to add to the schema block.", () => {
		const options = {
			name: "publishedDate",
		};

		const dateInstruction = new Date( 12, options );

		const expectedConfiguration = {
			attributes: {
				publishedDate: {
					type: "string",
				},
			},
		};

		const actualConfiguration = dateInstruction.configuration();

		expect( actualConfiguration ).toEqual( expectedConfiguration );
	} );

	it( "returns the correct React components to render when the post is saved.", () => {
		const options = {
			name: "publishedDate",
		};

		const dateInstruction = new Date( 12, options );

		const props: RenderSaveProps = {
			clientId: "1234-abc",
			attributes: {
				publishedDate: "2020-21-01",
			},
		};

		const dateSettings = {
			formats: {
				date: "y-m-d",
			},
		};

		__experimentalGetSettings.mockReturnValue( dateSettings );

		// @ts-ignore -- Actually a mocked function, so `mockReturnValue` exists.
		dateI18n.mockReturnValue( "2020-21-01" );

		const tree = renderer.create( dateInstruction.save( props ) ).toJSON();

		expect( tree ).toMatchSnapshot();
	} );

	it( "can set the date on the attributes using the `setDate` method.", () => {
		const options = {
			name: "publishedDate",
		};

		const dateInstruction = new Date( 12, options );

		const setAttributes = jest.fn();

		dateInstruction.setDate( "2020-21-01", setAttributes );

		expect( setAttributes ).toHaveBeenCalledWith( {
			publishedDate: "2020-21-01",
		} );
	} );
} );
