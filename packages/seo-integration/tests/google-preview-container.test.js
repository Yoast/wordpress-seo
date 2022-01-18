describe( "Google Preview container", () => {
	it( "maps select to the props", () => {
		const select = jest.fn( name => {
			if ( name === "@yoast/seo" ) {
				return {
					selectSeoTitle: jest.fn().mockReturnValue( "title" ),
					selectMetaDescription: jest.fn().mockReturnValue( "metadescription" ),
					selectSlug: jest.fn().mockReturnValue( "slug" ),
					selectDate: jest.fn().mockReturnValue( "23/12/2014 10:22:12 PM" ),
					selectKeyphrase: jest.fn().mockReturnValue( "cats" ),
					selectResearchResults: jest.fn().mockReturnValue( { data: {}, result: { keyphraseForms: [ "cats", "cat" ], synonymForms: [] } } ),
					selectIsCornerstone: jest.fn().mockReturnValue( true ),
				};
			}
		} );

		const expected = {
			selectSeoTitle: "title",
			selectMetaDescription: "metadescription",
			selectSlug: "slug",
			selectDate: "23/12/2014 10:22:12 PM",
			selectKeyphrase: "cats",
			selectResearchResults: { data: {}, result: { keyphraseForms: [ "cats", "cat" ], synonymForms: [] } }
			selectIsCornerstone: true,
		}

		const result = GooglePreviewContainer( )

		expect( result ).toEqual( expected );
	} )
} );




