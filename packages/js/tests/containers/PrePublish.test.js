import { mapSelectToProps, mapDispatchToProps } from "../../src/containers/PrePublish";
import { mockSelectors } from "./mockSelectors";

describe( "The PrePublish container", () => {
	it( "maps the select function to props", () => {
		const select = mockSelectors( name );

		const props = mapSelectToProps( select );

		expect( props.checklist ).toContainEqual( {
			label: "Readability analysis:",
			score: "good",
			scoreValue: "Good",
		} );

		expect( props.checklist ).toContainEqual( {
			label: "SEO analysis:",
			score: "ok",
			scoreValue: "OK",
		} );

		expect( props.checklist ).toContainEqual( {
			label: "No focus keyword was entered",
			score: "bad",
		} );
	} );

	it( "returns the same checklist reference when called twice with the same content", () => {
		const select = mockSelectors();

		const first = mapSelectToProps( select );
		const second = mapSelectToProps( select );

		expect( second.checklist ).toBe( first.checklist );
	} );

	it( "returns a new checklist reference when the content changes", () => {
		const selectA = mockSelectors();
		const selectB = mockSelectors();
		selectB( "yoast-seo/editor" ).getResultsForFocusKeyword.mockReturnValue( { overallScore: 0 } );

		const first = mapSelectToProps( selectA );
		const second = mapSelectToProps( selectB );

		expect( second.checklist ).not.toBe( first.checklist );
	} );

	it( "maps the dispatch function to props", () => {
		const dispatchers = {
			closePublishSidebar: jest.fn(),
			openGeneralSidebar: jest.fn(),
		};

		const dispatch = jest.fn();

		dispatch.mockReturnValue( dispatchers );

		const { onClick } = mapDispatchToProps( dispatch );

		onClick();

		expect( dispatchers.closePublishSidebar ).toHaveBeenCalled();
		expect( dispatchers.openGeneralSidebar ).toHaveBeenCalledWith( "yoast-seo/seo-sidebar" );
	} );
} );
