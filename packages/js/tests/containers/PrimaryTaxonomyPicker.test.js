import { makeWithSelectProps } from "../../src/containers/PrimaryTaxonomyPicker";

const taxonomy = { name: "category", restBase: "categories" };

/**
 * Creates a mock select function for the PrimaryTaxonomyPicker container.
 *
 * @param {Object} overrides Override specific return values.
 * @param {Array|null} overrides.termIds The term IDs to return from getEditedPostAttribute.
 * @param {number|null} overrides.primaryId The primary taxonomy ID.
 * @param {string} overrides.link The learn-more link.
 *
 * @returns {jest.Mock} A mock select function.
 */
const makeSelect = ( { termIds = [ 1, 2 ], primaryId = 5, link = "https://example.com" } = {} ) => {
	return jest.fn( storeName => {
		if ( storeName === "core/editor" ) {
			return { getEditedPostAttribute: jest.fn().mockReturnValue( termIds ) };
		}
		if ( storeName === "yoast-seo/editor" ) {
			return {
				getPrimaryTaxonomyId: jest.fn().mockReturnValue( primaryId ),
				selectLink: jest.fn().mockReturnValue( link ),
			};
		}
	} );
};

describe( "PrimaryTaxonomyPicker container withSelect", () => {
	it( "returns selectedTermIds, primaryTaxonomyId and learnMoreLink", () => {
		const withSelectProps = makeWithSelectProps();

		const props = withSelectProps( makeSelect(), { taxonomy } );

		expect( props.selectedTermIds ).toEqual( [ 1, 2 ] );
		expect( props.primaryTaxonomyId ).toBe( 5 );
		expect( props.learnMoreLink ).toBe( "https://example.com" );
	} );

	it( "uses EMPTY_TERM_IDS when getEditedPostAttribute returns null", () => {
		const withSelectProps = makeWithSelectProps();

		const props = withSelectProps( makeSelect( { termIds: null } ), { taxonomy } );

		expect( props.selectedTermIds ).toEqual( [] );
	} );

	it( "returns the same reference when called twice with the same content", () => {
		const withSelectProps = makeWithSelectProps();
		const select = makeSelect();

		const first = withSelectProps( select, { taxonomy } );
		const second = withSelectProps( select, { taxonomy } );

		expect( second ).toBe( first );
	} );

	it( "returns a new reference when selectedTermIds changes", () => {
		const withSelectProps = makeWithSelectProps();

		const first = withSelectProps( makeSelect( { termIds: [ 1 ] } ), { taxonomy } );
		const second = withSelectProps( makeSelect( { termIds: [ 2 ] } ), { taxonomy } );

		expect( second ).not.toBe( first );
	} );

	it( "returns the same reference when primaryTaxonomyId is NaN on consecutive calls", () => {
		const withSelectProps = makeWithSelectProps();
		const select = makeSelect( { primaryId: NaN } );

		const first = withSelectProps( select, { taxonomy } );
		const second = withSelectProps( select, { taxonomy } );

		expect( second ).toBe( first );
	} );

	it( "returns a new reference when primaryTaxonomyId changes", () => {
		const withSelectProps = makeWithSelectProps();

		const first = withSelectProps( makeSelect( { primaryId: 1 } ), { taxonomy } );
		const second = withSelectProps( makeSelect( { primaryId: 2 } ), { taxonomy } );

		expect( second ).not.toBe( first );
	} );

	it( "returns a new reference when learnMoreLink changes", () => {
		const withSelectProps = makeWithSelectProps();

		const first = withSelectProps( makeSelect( { link: "https://a.com" } ), { taxonomy } );
		const second = withSelectProps( makeSelect( { link: "https://b.com" } ), { taxonomy } );

		expect( second ).not.toBe( first );
	} );

	it( "keeps separate caches for different taxonomy names", () => {
		const withSelectProps = makeWithSelectProps();
		const categoryTaxonomy = { name: "category", restBase: "categories" };
		const tagTaxonomy = { name: "post_tag", restBase: "tags" };

		const categoryResult = withSelectProps( makeSelect( { primaryId: 1 } ), { taxonomy: categoryTaxonomy } );
		// A call for a different taxonomy must not corrupt the category cache.
		withSelectProps( makeSelect( { primaryId: 99 } ), { taxonomy: tagTaxonomy } );
		const categoryResultAgain = withSelectProps( makeSelect( { primaryId: 1 } ), { taxonomy: categoryTaxonomy } );

		expect( categoryResultAgain ).toBe( categoryResult );
	} );
} );
