import { initializeData } from "../src/edit.js";
import ClassicEditorData from "../src/analysis/classicEditorData.js";
import Data from "../src/analysis/data.js";
import isGutenbergDataAvailable from "../src/helpers/isGutenbergDataAvailable";

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
jest.mock( "../src/helpers/isGutenbergDataAvailable", () => {
	return jest.fn();
} );

describe( "initializeData", () => {
	it( "initializes an instance of the Data class if Gutenberg data is available", () => {
		window.wpseoPostScraperL10n = {
			intl: {
				locale: "en_EN",
			},
		};
		isGutenbergDataAvailable.mockImplementation( () => {
			return true;
		} );
		initializeData( {}, {}, {} );
		expect( Data ).toHaveBeenCalledTimes( 1 );
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
		window.wpseoPostScraperL10n = {
			intl: {
				locale: "en_EN",
			},
		};
		isGutenbergDataAvailable.mockImplementation( () => {
			return false;
		} );
		initializeData( {}, {}, {} );
		expect( ClassicEditorData ).toHaveBeenCalledTimes( 1 );
	} );
} );
