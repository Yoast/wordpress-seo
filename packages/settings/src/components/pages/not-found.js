import { useSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { Section } from "@yoast/admin-ui-toolkit/components";
import { REDUX_STORE_KEY } from "../../constants";
import Page from "../page";
import ReplacementVariableEditors from "../replacement-variable-editors";

/**
 * The Search Pages page.
 *
 * @returns {*} The Search Pages page.
 */
export default function NotFound() {
	const supportedVariables = useSelect( select => select( REDUX_STORE_KEY ).getOption( "advancedSettings.notFoundPages.supportedVariables", [] ) );

	return (
		<Page title={ __( "404 pages", "admin-ui" ) }>
			<Section
				title={ __( "Search appearance", "admin-ui" ) }
				description={ __( "Choose how your 404 pages should look in search engines.", "admin-ui" ) }
			>
				<ReplacementVariableEditors
					dataPath="advancedSettings.notFoundPages"
					fieldIds={ { title: "yst-404-not-found-templates-seo-title" } }
					labels={ { title: "SEO title" } }
					showDescription={ false }
					scope="notFoundPages"
					supportedVariables={ supportedVariables }
				/>
			</Section>
		</Page>
	);
}
