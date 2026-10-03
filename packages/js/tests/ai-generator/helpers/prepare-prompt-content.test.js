import { it } from "@jest/globals";
import { preparePromptContent } from "../../../src/ai-generator/helpers";
import { mockWindow } from "../../test-utils";
import { select } from "@wordpress/data";

jest.mock( "@wordpress/data" );

jest.mock( "yoastseo", () => ( {
	Paper: {
		parse: () => {},
	},
} ) );

import { Paper } from "yoastseo";

describe( "preparePromptContent", () => {
	const mockSetOnStore = jest.fn();
	const mockCollectData = jest.fn( () => "mockedData" );
	const mockParse = jest.fn( () => {
		return mockCollectData();
	} );

	beforeEach( () => {
		// Reset all mocks before each test
		jest.resetAllMocks();
	} );

	it( "should set the first paragraph content on the store, should populate paper if collectData ", async() => {
		select.mockReturnValue( {
			getIsProduct: jest.fn( () => false ),
			getIsTerm: jest.fn( () => false ),
			getIsWooCommerceActive: jest.fn( () => false ),
		} );
		const mockResponse = {
			result: [
				{
					sentences: [
						{ text: "Hello", tokens: [ "Hello" ] },
						{ text: " World", tokens: [ "World" ] },
					],
				},
			],
		};
		const windowSpy = mockWindow( { YoastSEO: { analysis: {
			collectData: mockCollectData,
			worker: { runResearch: () => {
				return Promise.resolve( mockResponse );
			} } } } } );

		jest.spyOn( Paper, "parse" ).mockImplementation( mockParse );

		await preparePromptContent( mockSetOnStore );

		expect( mockSetOnStore ).toHaveBeenCalledWith( "Hello World" );
		expect( mockParse ).toHaveBeenCalledWith( mockCollectData() );

		windowSpy.mockRestore();
	} );

	it( "should not send any text when the first sentence exceeds the maximum token count", async() => {
		select.mockReturnValue( {
			getIsProduct: jest.fn( () => false ),
			getIsTerm: jest.fn( () => false ),
			getIsWooCommerceActive: jest.fn( () => false ),
		} );
		const mockResponse = {
			result: [
				{
					sentences: [
						{ text: "Hello this is a very long text over 300 words", tokens: Array( 350 ).fill( "Hello" ) },
						{ text: "This is also a longer paragraph with 200 words", tokens: Array( 200 ).fill( "World" ) },
					],
				},
			],
		};
		const windowSpy = mockWindow( { YoastSEO: { analysis: { worker: { runResearch: () => {
			return Promise.resolve( mockResponse );
		} } } } } );

		await preparePromptContent( mockSetOnStore );

		expect( mockSetOnStore ).toHaveBeenCalledWith( "." );

		windowSpy.mockRestore();
	} );

	it( "should setOnStore with empty string when there are no sentences", async() => {
		select.mockReturnValue( {
			getIsProduct: jest.fn( () => false ),
			getIsTerm: jest.fn( () => false ),
			getIsWooCommerceActive: jest.fn( () => false ),
		} );
		const mockResponse = {
			result: [
				{
					sentences: [],
				},
			],
		};
		const windowSpy = mockWindow( { YoastSEO: { analysis: { worker: { runResearch: () => {
			return Promise.resolve( mockResponse );
		} } } } } );

		await preparePromptContent( mockSetOnStore );

		expect( mockSetOnStore ).toHaveBeenCalledWith( "." );

		windowSpy.mockRestore();
	} );


	it( "should replace new lines amd carriage returns with space", async() => {
		select.mockReturnValue( {
			getIsProduct: jest.fn( () => false ),
			getIsTerm: jest.fn( () => false ),
			getIsWooCommerceActive: jest.fn( () => false ),
		} );
		const mockResponse = {
			result: [
				{
					sentences: [
						{ text: "Hello\n\r\n\nthis is a text with\n\nnew lines", tokens: Array( 70 ).fill( "a" ) },
					],
				},
			],
		};
		const windowSpy = mockWindow( { YoastSEO: { analysis: { worker: { runResearch: () => {
			return Promise.resolve( mockResponse );
		} } } } } );

		jest.spyOn( Paper, "parse" ).mockImplementation( mockParse );

		// For a regular post, we expect the first 300 tokens to be considered.
		await preparePromptContent( mockSetOnStore );
		expect( mockSetOnStore ).toHaveBeenCalledWith( "Hello this is a text with new lines" );

		windowSpy.mockRestore();
	} );

	it( "should limit the maximum number of tokens for post", async() => {
		select.mockReturnValue( {
			getIsProduct: jest.fn( () => false ),
			getIsTerm: jest.fn( () => false ),
			getIsWooCommerceActive: jest.fn( () => false ),
		} );
		const mockResponse = {
			result: [
				{
					sentences: [
						{ text: "a", tokens: Array( 70 ).fill( "a" ) },
						{ text: "b", tokens: Array( 70 ).fill( "b" ) },
						{ text: "c", tokens: Array( 70 ).fill( "c" ) },
						{ text: "d", tokens: Array( 70 ).fill( "d" ) },
						{ text: "e", tokens: Array( 70 ).fill( "e" ) },
					],
				},
			],
		};
		const windowSpy = mockWindow( { YoastSEO: { analysis: { worker: { runResearch: () => {
			return Promise.resolve( mockResponse );
		} } } } } );

		jest.spyOn( Paper, "parse" ).mockImplementation( mockParse );

		// For a regular post, we expect the first 300 tokens to be considered.
		await preparePromptContent( mockSetOnStore );
		expect( mockSetOnStore ).toHaveBeenCalledWith( "abcd" );

		windowSpy.mockRestore();
	} );
	it( "should limit the maximum number of tokens, for product", async() => {
		const mockResponse = {
			result: [
				{
					sentences: [
						{ text: "a", tokens: Array( 70 ).fill( "a" ) },
						{ text: "b", tokens: Array( 70 ).fill( "b" ) },
						{ text: "c", tokens: Array( 70 ).fill( "c" ) },
						{ text: "d", tokens: Array( 70 ).fill( "d" ) },
						{ text: "e", tokens: Array( 70 ).fill( "e" ) },
					],
				},
			],
		};
		const windowSpy = mockWindow( { YoastSEO: { analysis: { worker: { runResearch: () => {
			return Promise.resolve( mockResponse );
		} } } } } );

		jest.spyOn( Paper, "parse" ).mockImplementation( mockParse );
		select.mockReturnValue( {
			getIsProduct: jest.fn( () => true ),
			getIsTerm: jest.fn( () => false ),
			getIsWooCommerceActive: jest.fn( () => true ),
		} );

		// For a product, we expect only the first 150 tokens to be considered.
		await preparePromptContent( mockSetOnStore );
		expect( mockSetOnStore ).toHaveBeenCalledWith( "ab" );
		windowSpy.mockRestore();
	} );
} );

