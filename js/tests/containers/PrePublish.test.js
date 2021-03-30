import { mapSelectToProps, mapDispatchToProps } from "../../src/containers/PrePublish";
import { MockSelectors } from "./MockSelectors";

describe( "The PrePublish container", () => {
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
			label: "No focus keyword was entered",
			score: "bad",
		} );

		expect( props.checklist ).toContainEqual( {
			label: "Schema analysis:",
			score: "bad",
			scoreValue: "Needs improvement",
		} );
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
