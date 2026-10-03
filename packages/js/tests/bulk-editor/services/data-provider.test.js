import { describe, expect, test } from "@jest/globals";
import { DataProvider } from "../../../src/bulk-editor/services/data-provider";

describe( "DataProvider", () => {
	const contentTypes = [
		{ name: "post", label: "Posts" },
		{ name: "page", label: "Pages" },
	];
	const endpoints = { posts: "https://example.com/wp-json/yoast/v1/bulk-editor/posts" };
	const links = { learnMore: "https://yoa.st/bulk-editor-learn-more" };

	test( "should return the content types", () => {
		const dataProvider = new DataProvider( { contentTypes, endpoints, links } );
		expect( dataProvider.getContentTypes() ).toEqual( contentTypes );
	} );

	test( "should return an endpoint and the endpoints", () => {
		const dataProvider = new DataProvider( { contentTypes, endpoints, links } );
		expect( dataProvider.getEndpoint( "posts" ) ).toBe( endpoints.posts );
		expect( dataProvider.getEndpoints() ).toEqual( endpoints );
	} );

	test( "should return a link and the links", () => {
		const dataProvider = new DataProvider( { contentTypes, endpoints, links } );
		expect( dataProvider.getLink( "learnMore" ) ).toBe( links.learnMore );
		expect( dataProvider.getLinks() ).toEqual( links );
	} );

	test( "should fall back to empty values when constructed without data", () => {
		const dataProvider = new DataProvider();
		expect( dataProvider.getContentTypes() ).toEqual( [] );
		expect( dataProvider.getEndpoint( "posts" ) ).toBe( "" );
		expect( dataProvider.getLink( "learnMore" ) ).toBe( "" );
	} );
} );
