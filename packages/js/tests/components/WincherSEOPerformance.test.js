global.wpseoAdminL10n = { "shortlinks.wincher.seo_performance": "" };
global.wpseoAdminGlobalL10n = {
	"links.wincher.website": "",
	"links.wincher.login": "",
};

import WincherSEOPerformance from "../../src/components/WincherSEOPerformance";
import { render, screen } from "../test-utils";
import { noop } from "lodash";
import { useTrackingInfo } from "../../src/components/modals/WincherUpgradeCallout";

jest.mock( "../../src/containers/WincherKeyphrasesTable", () => ( {
	__esModule: true,
	"default": () => null,
} ) );

jest.mock( "../../src/components/WincherRankingHistoryChart", () => ( {
	__esModule: true,
	"default": () => null,
} ) );

jest.mock( "../../src/components/modals/WincherUpgradeCallout", () => ( {
	__esModule: true,
	"default": () => null,
	useTrackingInfo: jest.fn(),
} ) );

const defaultProps = {
	addTrackedKeyphrase: noop,
	isLoggedIn: true,
	keyphrases: [ "yoast seo" ],
	permalink: "https://example.com/post",
	allKeyphrasesMissRanking: false,
	isSuccess: true,
	keyphraseLimitReached: false,
	limit: 0,
	setRequestSucceeded: noop,
	setRequestFailed: noop,
	setKeyphraseLimitReached: noop,
	onAuthentication: noop,
};

describe( "WincherSEOPerformance - period options", () => {
	it( "renders all four period options when historyDaysLimit allows the full range", () => {
		useTrackingInfo.mockReturnValue( { historyDays: 400 } );

		render( <WincherSEOPerformance { ...defaultProps } /> );

		expect( screen.getByRole( "option", { name: "Last day" } ) ).toBeInTheDocument();
		expect( screen.getByRole( "option", { name: "Last week" } ) ).toBeInTheDocument();
		expect( screen.getByRole( "option", { name: "Last month" } ) ).toBeInTheDocument();
		expect( screen.getByRole( "option", { name: "Last year" } ) ).toBeInTheDocument();
		expect( screen.getAllByRole( "option" ) ).toHaveLength( 4 );
	} );

	it( "excludes 'Last year' when historyDaysLimit is 32", () => {
		useTrackingInfo.mockReturnValue( { historyDays: 32 } );

		render( <WincherSEOPerformance { ...defaultProps } /> );

		expect( screen.queryByRole( "option", { name: "Last year" } ) ).not.toBeInTheDocument();
		expect( screen.getAllByRole( "option" ) ).toHaveLength( 3 );
	} );

	it( "shows only 'Last day' and 'Last week' when historyDaysLimit is 8", () => {
		useTrackingInfo.mockReturnValue( { historyDays: 8 } );

		render( <WincherSEOPerformance { ...defaultProps } /> );

		expect( screen.getByRole( "option", { name: "Last day" } ) ).toBeInTheDocument();
		expect( screen.getByRole( "option", { name: "Last week" } ) ).toBeInTheDocument();
		expect( screen.queryByRole( "option", { name: "Last month" } ) ).not.toBeInTheDocument();
		expect( screen.queryByRole( "option", { name: "Last year" } ) ).not.toBeInTheDocument();
		expect( screen.getAllByRole( "option" ) ).toHaveLength( 2 );
	} );

	it( "period option values use the ISO format without milliseconds", () => {
		useTrackingInfo.mockReturnValue( { historyDays: 400 } );

		render( <WincherSEOPerformance { ...defaultProps } /> );

		const options = screen.getAllByRole( "option" );
		options.forEach( opt => {
			expect( opt.value ).toMatch( /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+00:00$/ );
		} );
	} );
} );
