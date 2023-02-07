/* global wpseoScriptData */
import { Fragment, render } from "@wordpress/element";
import { SlotFillProvider } from "@wordpress/components";
import { ThemeProvider } from "styled-components";
import CompanyInfoMissingPortal from "../components/portals/CompanyInfoMissingPortal";

/**
 * @summary Initializes the search appearance settings script.
 * @returns {void}
 */
export default function initSearchAppearance() {
	const element = document.createElement( "div" );
	document.body.appendChild( element );

	const theme = {
		isRtl: wpseoScriptData.searchAppearance.isRtl,
	};

	const {
		knowledgeGraphCompanyInfoMissing,
	} = wpseoScriptData.searchAppearance;

	render(
		<ThemeProvider theme={ theme }>
			<SlotFillProvider>
				<Fragment>
					<CompanyInfoMissingPortal
						target="knowledge-graph-company-warning"
						message={ knowledgeGraphCompanyInfoMissing.message }
						link={ knowledgeGraphCompanyInfoMissing.URL }
					/>
				</Fragment>
			</SlotFillProvider>
		</ThemeProvider>,
		element
	);
}
