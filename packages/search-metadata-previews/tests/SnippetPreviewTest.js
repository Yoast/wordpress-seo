import React from "react";
import { MODE_DESKTOP, MODE_MOBILE } from "../src/snippet-preview/constants";
import SnippetPreview from "../src/snippet-preview/SnippetPreview";
import { render, screen } from "./test-utils";

const baseArgs = {
	description: "Description",
	siteName: "Test site name",
	title: "Title",
	onMouseUp: jest.fn(),
};

/**
 * Returns an element matching the given string in the text content.
 * @param {string} matcher - The string to match in the element's text.
 * @returns {HTMLElement|null} The element or null if not found.
 */
const getByNormalizedText = ( matcher ) =>
	screen.queryByText( content => content.replace( /\s+/g, " " ).trim().includes( matcher ) );

/**
 * Returns the StarRating component element if present.
 * @returns {HTMLElement|null} The StarRating element or null if not found.
 */
const getStarRating = () =>
	document.querySelector( '.yoast-star-rating__placeholder[role="img"]' );

/**
 * Asserts that rating, review count, and StarRating are present.
 */
const expectRatingPresent = ( ratingMatcher, reviewMatcher ) => {
	expect( getByNormalizedText( ratingMatcher ) ).toBeInTheDocument();
	expect( getByNormalizedText( reviewMatcher ) ).toBeInTheDocument();
	expect( getStarRating() ).toBeInTheDocument();
};

/**
 * Asserts that rating, review count, and StarRating are absent.
 */
const expectRatingAbsent = ( ratingMatcher, reviewMatcher ) => {
	expect( getByNormalizedText( ratingMatcher ) ).not.toBeInTheDocument();
	expect( getByNormalizedText( reviewMatcher ) ).not.toBeInTheDocument();
	expect( getStarRating() ).not.toBeInTheDocument();
};

// Parameterized test cases for negative scenarios
// Each case describes a scenario where rating, review count, or StarRating should NOT be rendered.
// The matcher arrays are used to query for the expected text in desktop and mobile views.
const negativeCases = [
	{
		description: "rating is 0",
		shoppingData: { rating: 0, reviewCount: 10 },
		desktopMatcher: [ "Rating: 0", "10 reviews" ],
		mobileMatcher: [ "Rating", "(10)" ],
	},
	{
		description: "reviewCount is 0",
		shoppingData: { rating: 4.5, reviewCount: 0 },
		desktopMatcher: [ "Rating: 4.5", "0 reviews" ],
		mobileMatcher: [ "Rating", "(0)" ],
	},
	{
		description: "rating is negative",
		shoppingData: { rating: -1, reviewCount: 10 },
		desktopMatcher: [ "Rating: -1", "10 reviews" ],
		mobileMatcher: [ "Rating", "(10)" ],
	},
	{
		description: "rating is higher than bestRating",
		shoppingData: { rating: 6, reviewCount: 10, bestRating: 5 },
		desktopMatcher: [ "Rating: 6", "10 reviews" ],
		mobileMatcher: [ "Rating", "(10)" ],
	},
	{
		description: "reviewCount is undefined",
		shoppingData: { rating: 4.5 },
		desktopMatcher: [ "Rating: 4.5", "undefined reviews" ],
		mobileMatcher: [ "Rating", "(undefined)" ],
	},
	{
		description: "rating is undefined",
		shoppingData: { reviewCount: 10 },
		desktopMatcher: [ "Rating: undefined", "10 reviews" ],
		mobileMatcher: [ "Rating", "(10)" ],
	},
];

// Parameterized test cases for positive edge scenarios
// Each case describes a positive edge scenario where rating, review count, and StarRating SHOULD be rendered.
// The matcher arrays are used to query for the expected text in desktop and mobile views.
const positiveEdgeCases = [
	{
		description: "rating equals bestRating",
		shoppingData: { rating: 5, reviewCount: 10, bestRating: 5 },
		desktopMatcher: [ "Rating: 5", "10 reviews" ],
		mobileMatcher: [ "5", "(10)" ],
	},
	{
		description: "reviewCount is 1",
		shoppingData: { rating: 4.5, reviewCount: 1 },
		desktopMatcher: [ "Rating: 4.5", "1 review" ],
		mobileMatcher: [ "Rating", "(1)" ],
	},
];

describe( "SnippetPreview", () => {
	describe( "breadcrumbs", () => {
		it( "should not render breadcrumbs in mobile view", () => {
			render( <SnippetPreview { ...baseArgs } url={ "http://www.google.nl/about" } mode={ MODE_MOBILE } /> );
			const baseURL = screen.getByText( "www.google.nl" );
			expect( baseURL ).toBeInTheDocument();
			expect( screen.queryByText( "› about" ) ).toBeNull();
		} );

		it( "doesn't percent encode characters that are percent encoded by node's url.parse in desktop view", () => {
			render( <SnippetPreview { ...baseArgs } url={ "http://www.google.nl/`^ {}" } mode={ MODE_DESKTOP } /> );
			const baseURL = screen.getByText( "www.google.nl" );
			const subFolder = screen.getByText( "› `^ {}" );
			expect( baseURL ).toBeInTheDocument();
			expect( subFolder ).toBeInTheDocument();
		} );

		it( "properly renders multiple breadcrumbs in desktop view", () => {
			render( <SnippetPreview { ...baseArgs } url={ "http://www.google.nl/about" } mode={ MODE_DESKTOP } /> );
			const baseURL = screen.getByText( "www.google.nl" );
			const subFolder = screen.getByText( "› about" );
			expect( baseURL ).toBeInTheDocument();
			expect( subFolder ).toBeInTheDocument();
		} );

		it( "properly renders multiple breadcrumbs in desktop view without a trailing slash", () => {
			render( <SnippetPreview { ...baseArgs } url={ "http://www.google.nl/about/" } mode={ MODE_DESKTOP } /> );
			const baseURL = screen.getByText( "www.google.nl" );
			const subFolder = screen.getByText( "› about" );
			const subFolderWithTrailingSlash = screen.queryByText( "› about/" );
			expect( baseURL ).toBeInTheDocument();
			expect( subFolder ).toBeInTheDocument();
			expect( subFolderWithTrailingSlash ).not.toBeInTheDocument();
		} );

		it( "strips http protocol in desktop view", () => {
			render( <SnippetPreview { ...baseArgs } url={ "http://www.google.nl/subdir" } mode={ MODE_DESKTOP } /> );
			const baseURL = screen.getByText( "www.google.nl" );
			const baseUrlWithProtocol = screen.queryByText( "http://www.google.nl" );
			const subFolder = screen.getByText( "› subdir" );
			expect( baseURL ).toBeInTheDocument();
			expect( baseUrlWithProtocol ).not.toBeInTheDocument();
			expect( subFolder ).toBeInTheDocument();
		} );

		it( "strips https protocol in desktop view", () => {
			render( <SnippetPreview { ...baseArgs } url={ "https://www.google.nl/subdir" } mode={ MODE_DESKTOP } /> );
			const baseURL = screen.getByText( "www.google.nl" );
			const baseUrlWithProtocol = screen.queryByText( "https://www.google.nl" );
			const subFolder = screen.getByText( "› subdir" );
			expect( baseURL ).toBeInTheDocument();
			expect( baseUrlWithProtocol ).not.toBeInTheDocument();
			expect( subFolder ).toBeInTheDocument();
		} );
	} );
	describe( "rating", () => {
		describe( "desktop view", () => {
			it( "should render rating, review count, and StarRating in desktop view", () => {
				render( <SnippetPreview
					{ ...baseArgs } url={ "http://www.google.nl/subdir" } mode={ MODE_DESKTOP }
					shoppingData={ { rating: 4.5, reviewCount: 10 } }
				/> );
				expectRatingPresent( "Rating: 4.5", "10 reviews" );
			} );

			it( "should render rating but not scale when best rating is default in desktop view", () => {
				render( <SnippetPreview
					{ ...baseArgs } url={ "http://www.google.nl/subdir" } mode={ MODE_DESKTOP }
					shoppingData={ { rating: 4.3, reviewCount: 10, bestRating: 5 } }
				/> );
				expectRatingPresent( "Rating: 4.3", "10 reviews" );
				expect( getByNormalizedText( "4.3/5" ) ).not.toBeInTheDocument();
			} );

			it( "should render rating and scale when best rating is not default in desktop view", () => {
				render( <SnippetPreview
					{ ...baseArgs } url={ "http://www.google.nl/subdir" } mode={ MODE_DESKTOP }
					shoppingData={ { rating: 3.5, reviewCount: 10, bestRating: 8 } }
				/> );
				expectRatingPresent( "3.5/8", "10 reviews" );
			} );

			it( "should round rating to 1 decimal in desktop view", () => {
				render( <SnippetPreview
					{ ...baseArgs } url={ "http://www.google.nl/subdir" } mode={ MODE_DESKTOP }
					shoppingData={ { rating: 4.3333, reviewCount: 10 } }
				/> );
				expectRatingPresent( "Rating: 4.3", "10 reviews" );
				expect( getByNormalizedText( "4.3/5" ) ).not.toBeInTheDocument();
			} );

			// Parameterized negative cases: test that elements are NOT rendered for invalid/edge scenarios.
			it.each( negativeCases )( "should not render rating, review count, or StarRating when $description in desktop view", ( { shoppingData, desktopMatcher } ) => {
				// Render with scenario-specific shoppingData
				render( <SnippetPreview { ...baseArgs } url={ "http://www.google.nl/subdir" } mode={ MODE_DESKTOP } shoppingData={ shoppingData } /> );
				// Assert absence of rating, review count, and StarRating
				expectRatingAbsent( desktopMatcher[ 0 ], desktopMatcher[ 1 ] );
			} );

			// Parameterized positive edge cases: test that elements ARE rendered for valid edge scenarios.
			it.each( positiveEdgeCases )( "should render rating, review count, and StarRating when $description in desktop view", ( { shoppingData, desktopMatcher } ) => {
				// Render with scenario-specific shoppingData
				render( <SnippetPreview { ...baseArgs } url={ "http://www.google.nl/subdir" } mode={ MODE_DESKTOP } shoppingData={ shoppingData } /> );
				// Assert presence of rating, review count, and StarRating
				expectRatingPresent( desktopMatcher[ 0 ], desktopMatcher[ 1 ] );
			} );
		} );

		describe( "mobile view", () => {
			it( "should render rating, review count, and StarRating in mobile view", () => {
				render( <SnippetPreview
					{ ...baseArgs }
					url={ "http://www.google.nl/subdir" }
					mode={ MODE_MOBILE }
					shoppingData={ { rating: 4.5, reviewCount: 10 } }
				/> );
				expectRatingPresent( "Rating", "(10)" );
			} );

			it( "should render rating but not scale when best rating is default in mobile view", () => {
				render( <SnippetPreview
					{ ...baseArgs }
					url={ "http://www.google.nl/subdir" }
					mode={ MODE_MOBILE }
					shoppingData={ { rating: 4.3, reviewCount: 10, bestRating: 5 } }
				/> );
				expectRatingPresent( "4.3", "(10)" );
				expect( getByNormalizedText( "4.3/5" ) ).not.toBeInTheDocument();
			} );

			it( "should render rating and scale when best rating is not default in mobile view", () => {
				render( <SnippetPreview
					{ ...baseArgs }
					url={ "http://www.google.nl/subdir" }
					mode={ MODE_MOBILE }
					shoppingData={ { rating: 3.5, reviewCount: 10, bestRating: 8 } }
				/> );
				expectRatingPresent( "3.5/8", "(10)" );
			} );

			it( "should round rating to 1 decimal in mobile view", () => {
				render( <SnippetPreview
					{ ...baseArgs }
					url={ "http://www.google.nl/subdir" }
					mode={ MODE_MOBILE }
					shoppingData={ { rating: 4.3333, reviewCount: 10 } }
				/> );
				expect( getByNormalizedText( "4.3" ) ).toBeInTheDocument();
			} );

			// Parameterized negative cases: test that elements are NOT rendered for invalid/edge scenarios.
			it.each( negativeCases )( "should not render rating, review count, or StarRating when $description in mobile view", ( { shoppingData, mobileMatcher } ) => {
				// Render with scenario-specific shoppingData
				render( <SnippetPreview { ...baseArgs } url={ "http://www.google.nl/subdir" } mode={ MODE_MOBILE } shoppingData={ shoppingData } /> );
				// Assert absence of rating, review count, and StarRating
				expectRatingAbsent( mobileMatcher[ 0 ], mobileMatcher[ 1 ] );
			} );

			// Parameterized positive edge cases: test that elements ARE rendered for valid edge scenarios.
			it.each( positiveEdgeCases )( "should render rating, review count, and StarRating when $description in mobile view", ( { shoppingData, mobileMatcher } ) => {
				render( <SnippetPreview { ...baseArgs } url={ "http://www.google.nl/subdir" } mode={ MODE_MOBILE } shoppingData={ shoppingData } /> );
				expectRatingPresent( mobileMatcher[ 0 ], mobileMatcher[ 1 ] );
			} );
		} );
	} );
} );
