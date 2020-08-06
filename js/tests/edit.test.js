import { initializeData } from "../src/initializers/edit.js";
import ClassicEditorData from "../src/analysis/classicEditorData.js";
import BlockEditorData from "../src/analysis/blockEditorData.js";
import isBlockEditor from "../src/helpers/isBlockEditor";

jest.mock( "react-dom" );
jest.mock( "../src/analysis/classicEditorData.js", () => {
	return jest.fn().mockImplementation( () => {
		return {
			initialize: () => {},
		};
	} );
} );

jest.mock( "../src/analysis/data.js", () => {
	return jest.fn().mockImplementation( () => {
		return {
			initialize: () => {},
		};
	} );
} );

jest.mock( "../src/helpers/isBlockEditor", () => {
	return jest.fn();
} );

describe( "initializeData", () => {
	it( "initializes an instance of the Data class if Gutenberg data is available", () => {
		window.wpseoScriptData.metabox = {
			intl: {
				locale: "en_EN",
			},
		};
		isBlockEditor.mockImplementation( () => {
			return true;
		} );
		initializeData( {}, {}, {} );
		expect( BlockEditorData ).toHaveBeenCalledTimes( 1 );
	} );
} );

describe( "initialize", () => {
	it( "initializes all functionality on the edit screen", () => {
		const combineReducers = jest.fn( ()=> {
			return {};
		} );

		const registerStore = jest.fn( () => {
			return {};
		} );

		window.yoast = {
			_wp: {
				data: {
					combineReducers: combineReducers,
					registerStore: registerStore,
				},
			},
		};
	} );

	it( "initializes an instance of the ClassicEditorData class if Gutenberg data is not available", () => {
		window.wpseoScriptData.metabox = {
			intl: {
				locale: "en_EN",
			},
		};
		isBlockEditor.mockImplementation( () => {
			return false;
		} );
		initializeData( {}, {}, {} );
		expect( ClassicEditorData ).toHaveBeenCalledTimes( 1 );
	} );
} );
