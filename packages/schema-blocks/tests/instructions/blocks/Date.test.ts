import * as renderer from "react-test-renderer";
import { mocked } from "ts-jest/utils";

import { __experimentalGetSettings, dateI18n, DateSettings } from "@wordpress/date";

import Date from "../../../src/instructions/blocks/Date";
import { RenderEditProps, RenderSaveProps } from "../../../src/core/blocks/BlockDefinition";

jest.mock( "@wordpress/date", () => ( {
	__experimentalGetSettings: jest.fn(),
	dateI18n: jest.fn(),
} ) );

const mockedGetSettings = mocked( __experimentalGetSettings, false );
const mockedDateI18n = mocked( dateI18n, false );

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

		const tree = renderer
			.create( dateInstruction.edit( props ) )
			.toJSON();

		expect( tree ).toMatchSnapshot();
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
		} as DateSettings;

		mockedGetSettings.mockReturnValue( dateSettings );

		mockedDateI18n.mockReturnValue( "2020-21-01" );

		const tree = renderer.create( dateInstruction.save( props ) ).toJSON();

		expect( tree ).toMatchSnapshot();
	} );
} );
