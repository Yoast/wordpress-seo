import { describe, expect, it } from "@jest/globals";
import { PageTitle } from "../../../src/dashboard/components/page-title";
import { render } from "../../test-utils";

/**
 * @param {Container} container The container.
 * @param {Function} getByRole The getByRole function.
 * @returns {void}
 */
const verifyDefaultContent = ( container, getByRole ) => {
	expect( getByRole( "heading", { name: "Hi John," } ) ).toBeInTheDocument();

	const text = {
		description: "Welcome to your dashboard! Check your content's SEO performance, readability, and overall strengths and opportunities.",
		dashboardLearnMoreLink: "Learn more about the dashboard",
		dashboardLearnMoreLinkScreenReader: "(Opens in a new browser tab)",
	};

	// The text is not retrievable with getByText due to the HTML. So below is a bit strange with the joins with and without spaces.
	expect( container.querySelector( "p" ).textContent )
		.toBe( [ [ text.description, text.dashboardLearnMoreLink ].join( " " ), text.dashboardLearnMoreLinkScreenReader, "." ].join( "" ) );

	const dashboardLearnMoreLink = getByRole( "link", {
		name: [ text.dashboardLearnMoreLink, text.dashboardLearnMoreLinkScreenReader ].join( " " ),
	} );
	expect( dashboardLearnMoreLink ).toHaveAttribute( "href", "https://example.com/content-analysis" );
	expect( dashboardLearnMoreLink ).toHaveAttribute( "target", "_blank" );
	expect( dashboardLearnMoreLink ).toHaveTextContent( text.dashboardLearnMoreLink );
};

describe( "PageTitle", () => {
	it( "should render the component", () => {
		const { container, getByRole } = render(
			<PageTitle
				userName="John"
				features={ { indexables: true, seoAnalysis: true, readabilityAnalysis: true } }
				links={ { dashboardLearnMore: "https://example.com/content-analysis" } }
			/>
		);

		verifyDefaultContent( container, getByRole );
	} );

	it( "should show a warning with SEO and readability both disabled", () => {
		const { container, getByRole } = render(
			<PageTitle
				userName="Bob"
				features={ { indexables: true, seoAnalysis: false, readabilityAnalysis: false } }
				links={ { dashboardLearnMore: "https://example.com/content-analysis" } }
			/>
		);

		expect( getByRole( "heading", { name: "Hi Bob," } ) ).toBeInTheDocument();

		// The text is not retrievable with getByText due to the HTML.
		expect( container.querySelector( "p" ).textContent )
			.toBe( "It looks like the ‘SEO analysis’ and the ‘Readability analysis’ are currently disabled in your Site features or your user profile settings. Enable these features to start seeing all the insights you need right here!" );

		const siteFeaturesLink = getByRole( "link", { name: "Site features" } );
		expect( siteFeaturesLink ).toHaveAttribute( "href", "admin.php?page=wpseo_page_settings#/site-features" );
		expect( siteFeaturesLink ).not.toHaveAttribute( "target", "_blank" );

		const userProfileLink = getByRole( "link", { name: "user profile settings" } );
		expect( userProfileLink ).toHaveAttribute( "href", "profile.php" );
		expect( userProfileLink ).not.toHaveAttribute( "target", "_blank" );
	} );

	it( "should show a warning when the indexables are disabled", () => {
		const { container, getByRole } = render(
			<PageTitle
				userName="John"
				features={ { indexables: false, seoAnalysis: true, readabilityAnalysis: true } }
				links={ { dashboardLearnMore: "https://example.com/content-analysis" } }
			/>
		);

		verifyDefaultContent( container, getByRole );

		const alert = getByRole( "status", { type: "info" } );
		expect( alert )
			.toHaveTextContent( "Oops! You can’t see the overview of your SEO scores and readability scores right now because you’re in a non-production environment." );
	} );
} );
