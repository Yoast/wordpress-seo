/* global yoastIndexingData */
import { useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

import IndexationView from "./components/indexation-view";
import IndexablesPage from "./indexables-page";
import { Alert } from "@yoast/ui-library";

/**
 * Renders the four indexable tables.
 *
 * @returns {WPElement} A div containing the empty state page.
 */
function LandingPage() {
	const [ indexingState, setIndexingState ] = useState( () => parseInt( yoastIndexingData.amount, 10 ) === 0 ? "already_done" : "idle" );
	if ( window.wpseoIndexablesPageData?.environment === "staging" ) {
		return <div
			className="yst-max-w-full yst-mt-6 "
		>
			<Alert variant="info">{ __( "This functionality is disabled in staging environments.", "wordpress-seo" ) }</Alert>
		</div>;
	}
	return ( indexingState === "already_done" || indexingState === "completed" ) ? <IndexablesPage /> : <EmptyState setIndexingState={ setIndexingState } />;
}

export default LandingPage;
