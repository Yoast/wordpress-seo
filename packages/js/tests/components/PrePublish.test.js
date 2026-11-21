import PrePublish from "../../src/components/PrePublish";
import { render, screen } from "../test-utils";
import { select, useDispatch } from "@wordpress/data";

// Mock WordPress dependencies
jest.mock( "@wordpress/data", () => ( {
	useDispatch: jest.fn(),
	select: jest.fn(),
} ) );

describe( "The PrePublish component", () => {
	const mockClosePublishSidebar = jest.fn();
	const mockOpenGeneralSidebar = jest.fn();
	const mockOpenEditorModal = jest.fn();

	beforeEach( () => {
		jest.clearAllMocks();
		useDispatch.mockReturnValue(
			{ closePublishSidebar: mockClosePublishSidebar, openGeneralSidebar: mockOpenGeneralSidebar, openEditorModal: mockOpenEditorModal }
		);
		select.mockReturnValue( {
			getPostType: jest.fn( () => "post" ),
		} );
	} );

	afterEach( () => {
		jest.clearAllMocks();
	} );

	it( "renders a checklist with an introduction text indicating that there is room for improvement when not all checks are good", () => {
		const checks = [
			{
				label: "Readability analysis:",
				score: "good",
				scoreValue: "Good",
			},
			{
				label: "SEO analysis:",
				score: "bad",
				scoreValue: "Needs improvement",
			},
			{
				label: "Schema analysis:",
				score: "good",
				scoreValue: "Good",
			},
		];
		const onClick = jest.fn();

		const isSeoDataDefault = {
			isAllTitlesDefault: false,
			isAllDescriptionsDefault: false,
		};

		render( <PrePublish checklist={ checks } onClick={ onClick } isSeoDataDefault={ isSeoDataDefault } /> );

		expect( screen.getByText( "We've analyzed your post. There is still room for improvement!" ) ).toBeInTheDocument();
	} );

	it( "renders a checklist with an introduction text indicating that there everything is OK when all checks are good", () => {
		const checks = [
			{
				label: "Readability analysis:",
				score: "good",
				scoreValue: "Good",
			},
			{
				label: "SEO analysis:",
				score: "good",
				scoreValue: "Needs improvement",
			},
		];
		const onClick = jest.fn();

		render( <PrePublish checklist={ checks } onClick={ onClick } /> );

		expect( screen.getByText( "We've analyzed your post. Everything looks good. Well done!" ) ).toBeInTheDocument();
	} );
} );
