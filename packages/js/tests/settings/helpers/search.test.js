import { createPostTypeSearchIndex } from "../../../src/settings/helpers/search";

describe( "createPostTypeSearchIndex", () => {
	const postType = { name: "book", label: "Books", route: "books", hasArchive: false };

	it( "includes the noimageindex default of the post type", () => {
		const searchIndex = createPostTypeSearchIndex( postType, { userLocale: "en-US" } );

		expect( searchIndex[ "noimageindex-book" ] ).toEqual( {
			route: "/post-type/books",
			routeLabel: "Books",
			fieldId: "input-wpseo_titles-noimageindex-book",
			fieldLabel: "Allow search engines to index images on books",
			keywords: [ "robots", "noimageindex" ],
		} );
	} );

	it( "includes the noarchive default of the post type", () => {
		const searchIndex = createPostTypeSearchIndex( postType, { userLocale: "en-US" } );

		expect( searchIndex[ "noarchive-book" ] ).toEqual( {
			route: "/post-type/books",
			routeLabel: "Books",
			fieldId: "input-wpseo_titles-noarchive-book",
			fieldLabel: "Allow search engines to show cached copies of books",
			keywords: [ "robots", "noarchive" ],
		} );
	} );
} );
