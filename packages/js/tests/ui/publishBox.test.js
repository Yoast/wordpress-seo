import { select } from "@wordpress/data";
import { get } from "lodash";
import { createSEOScoreLabel } from "../../src/ui/publishBox";

jest.mock( "@wordpress/data", () => ( {
	select: jest.fn(),
} ) );

jest.mock( "@wordpress/i18n", () => ( {
	__: jest.fn( ( text ) => text ),
} ) );

jest.mock( "lodash", () => ( {
	get: jest.fn(),
} ) );

describe( "createSEOScoreLabel", () => {
	const mockSelect = select;
	const mockGet = get;

	beforeEach( () => {
		jest.clearAllMocks();
	} );

	const dataProvider = [
		// Test case 1: labels are provided and status exists in labels
		{
			description: "returns label from provided labels when labels are provided",
			scoreType: "keyword",
			status: "good",
			labels: { good: "Custom Good Label" },
			expectedResult: "Custom Good Label",
		},
		// Test case 2: no labels provided, isPremium is false, status is 'good'
		{
			description: "returns correct label for keyword when isPremium is false and status is good",
			scoreType: "keyword",
			status: "good",
			labels: null,
			expectedResult: '<a href="#yoast-seo-analysis-collapsible-metabox">SEO analysis:</a> <strong>Good</strong>',
			isPremium: false,
		},
		// Test case 3: no labels provided, isPremium is true, status is 'bad'
		{
			description: "returns correct label for keyword when isPremium is true and status is bad",
			scoreType: "keyword",
			status: "bad",
			labels: null,
			expectedResult: '<a href="#yoast-seo-analysis-collapsible-metabox">Premium SEO analysis:</a> <strong>Needs improvement</strong>',
			isPremium: true,
		},
		// Test case 4: no labels provided, scoreType is 'content', status is 'na'
		{
			description: "returns correct label for content when status is na",
			scoreType: "content",
			status: "na",
			labels: null,
			expectedResult: '<a href="#yoast-readability-analysis-collapsible-metabox">Readability analysis:</a> <strong>Not available</strong>',
			isPremium: false,
		},
		// Test case 5: no labels provided, scoreType is 'inclusive-language', status is 'ok'
		{
			description: "returns correct label for inclusive-language when status is ok",
			scoreType: "inclusive-language",
			status: "ok",
			labels: null,
			expectedResult: '<a href="#yoast-inclusive-language-analysis-collapsible-metabox">Inclusive language:</a> <strong>Potentially non-inclusive</strong>',
			isPremium: false,
		},
		// Test case 6: no labels provided, invalid status
		{
			description: "returns empty string when status is invalid",
			scoreType: "keyword",
			status: "invalid-status",
			labels: null,
			expectedResult: "",
			isPremium: false,
		},
	];

	dataProvider.forEach( ( { description, scoreType, status, labels, expectedResult, isPremium } ) => {
		test( description, () => {
			mockGet.mockReturnValue( expectedResult );
			mockSelect.mockReturnValue( {
				getIsPremium: () => isPremium,
			} );

			const result = createSEOScoreLabel( scoreType, status, labels );
			expect( result ).toBe( expectedResult );
		} );
	} );
} );
