import {mapDispatchToProps, mapSelectToProps} from "../../src/containers/DocumentSidebar";
import {MockSelectors} from "./MockSelectors";

describe( "The DocumentSidebar container", () => {
	it( "maps the select function to props", () => {
		const select = MockSelectors( name );

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
			label: "Schema analysis:",
			score: "bad",
			scoreValue: "Needs improvement",
		} );

		expect( props.intro ).toEqual( undefined );
	} );

	it( "maps the select function to props when no schema validation results are present", () => {
		const select = MockSelectors( name, { "1234-abcde": { result: 0 } } );

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
			label: "Schema analysis:",
			score: "good",
			scoreValue: "Good",
		} );

		expect( props.intro ).toEqual( undefined );
	} );

	it( "maps the dispatch function to props", () => {
		const dispatchers = {
			openGeneralSidebar: jest.fn(),
		};

		const dispatch = jest.fn();

		dispatch.mockReturnValue( dispatchers );

		const { onClick } = mapDispatchToProps( dispatch );

		onClick();

		expect( dispatchers.openGeneralSidebar ).toHaveBeenCalledWith( "yoast-seo/seo-sidebar" );
	} );
} );
