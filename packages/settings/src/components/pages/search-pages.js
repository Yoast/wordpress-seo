import { useSelect } from "@wordpress/data";
import { createInterpolateElement, useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Alert, Section } from "@yoast/admin-ui-toolkit/components";
import { REDUX_STORE_KEY } from "../../constants";
import Page from "../page";
import ReplacementVariableEditors from "../replacement-variable-editors";

/**
 * The Search Pages page.
 *
 * @returns {*} The Search Pages page.
 */
export default function SearchPages() {
	const supportedVariables = useSelect( select => select( REDUX_STORE_KEY ).getOption( "advancedSettings.searchPages.supportedVariables", [] ) );
	const learnMoreLink = useSelect( select => select( REDUX_STORE_KEY ).getOption( "advancedSettings.searchPages.learnMoreLink", [] ) );

	const alertText = useMemo( () => createInterpolateElement(
		// translators: %1$s is replaced by an opening idiomatic text tag. %2$s is replaced by a closing idiomatic text tag.
		// %3$s is replaced by an opening anchor tag. %4$s is replaced by a closing anchor tag.
		// %5$s is replaced by "CollectionPage". %6$s is replaced by SearchResultsPage.
		sprintf(
			__( "For Search pages we automatically output %1$s%5$s%2$s and %1$s%6$s%2$s Schema. %3$sLearn more about our Schema output.%4$s", "admin-ui" ),
			"<i>",
			"</i>",
			"<a>",
			"</a>",
			"CollectionPage",
			"SearchResultsPage",
		),
		{
			i: <i />,
			/* eslint-disable-next-line jsx-a11y/anchor-has-content */
			a: <a href={ learnMoreLink } target="_blank" rel="noopener noreferrer" className="yst-font-medium" />,
		},
	) );

	return (
		<Page title={ __( "Search pages", "admin-ui" ) }>
			<Section
				title={ __( "Search appearance", "admin-ui" ) }
				description={ __( "Choose how your Search pages should look in search engines.", "admin-ui" ) }
			>
				<ReplacementVariableEditors
					dataPath="advancedSettings.searchPages"
					fieldIds={ { title: "yst-search-pages-seo-title" } }
					labels={ { title: "SEO title" } }
					showDescription={ false }
					scope="searchPages"
					supportedVariables={ supportedVariables }
				/>
			</Section>
			<Section
				title={ __( "Schema", "admin-ui" ) }
				description={ __( "Choose how your Search pages should be described by default in your site's Schema.org markup.", "admin-ui" ) }
			>
				<Alert type="info">
					<p>
						{ alertText }
					</p>
				</Alert>
			</Section>
		</Page>
	);
}
