import { compose } from "@wordpress/compose";
import { withDispatch, withSelect } from "@wordpress/data";
import { __, sprintf } from "@wordpress/i18n";
import { Section, Switch } from "@yoast/admin-ui-toolkit/components";
import { REDUX_STORE_KEY } from "../../constants";
import Page from "../page";

/**
 * The Schema Output page that adds toggles to disable part of our Schema Output.
 * @returns {*} The Schema Output page.
 */
export default function SchemaOutput() {
	const schemaOutputDescription = sprintf(
		// translators: %1$s is replaced by Schema.org
		__( "Choose which parts of %1$s markup you would like to disable for your site. Changing these settings can have impact on other parts of the %1$s markup.", "admin-ui" ),
		"Schema.org",
	);

	const schemaOrganizationDescription = sprintf(
		// translators: %1$s is replaced by Schema.org, %2$s, %3$s, %4$s, %5$s and %6$S are replaced with Schema.org types.
		__( "By disabling %1$s markup for %2$s, Schema for %3$s, %4$s, %5$s and %6$s will be disabled too.", "admin-ui" ),
		"Schema.org",
		"Organization",
		"Website",
		"WebPage",
		"Article",
		"BreadcrumbList",
	);

	const schemaWebpageDescription = sprintf(
		// translators: %1$s is replaced by Schema.org, %2$s, %3$s and %4$s are replaced with Schema.org types.
		__( "By disabling %1$s markup for %2$s, Schema for %3$s and %4$s will be disabled too.", "admin-ui" ),
		"Schema.org",
		"WebPage",
		"Article",
		"BreadcrumbList",
	);

	return (
		<Page title={ __( "Schema output", "admin-ui" ) }>
			<Section
				title={ __( "Schema output", "admin-ui" ) }
				description={ schemaOutputDescription }
			>
				<SchemaSwitch
					dataPath="schema.outputControls.schema"
					disableAlso={ [
						"schema.outputControls.organization",
						"schema.outputControls.website",
						"schema.outputControls.webpage",
						"schema.outputControls.product",
						"schema.outputControls.article",
						"schema.outputControls.breadcrumb",
					] }
					label={ __( "All Schema", "admin-ui" ) }
				/>
				<SchemaSwitch
					dataPath="schema.outputControls.organization"
					disableAlso={ [
						"schema.outputControls.website",
						"schema.outputControls.webpage",
						"schema.outputControls.article",
						"schema.outputControls.breadcrumb",
					] }
					label={ __( "Organization", "admin-ui" ) }
					description={ schemaOrganizationDescription }
				/>
				<SchemaSwitch
					dataPath="schema.outputControls.website"
					disabledBy={ [ "schema.outputControls.organization" ] }
					label={ __( "Website", "admin-ui" ) }
				/>
				<SchemaSwitch
					dataPath="schema.outputControls.webpage"
					disableAlso={ [
						"schema.outputControls.article",
						"schema.outputControls.breadcrumb",
					] }
					disabledBy={ [ "schema.outputControls.organization" ] }
					label={ __( "Web Page", "admin-ui" ) }
					description={ schemaWebpageDescription }
				/>
				<SchemaSwitch
					dataPath="schema.outputControls.article"
					disabledBy={ [
						"schema.outputControls.organization",
						"schema.outputControls.webpage",
					] }
					label={ __( "Article", "admin-ui" ) }
				/>
				<SchemaSwitch
					dataPath="schema.outputControls.product"
					label={ __( "Product", "admin-ui" ) }
				/>
				<SchemaSwitch
					dataPath="schema.outputControls.breadcrumb"
					disabledBy={ [
						"schema.outputControls.organization",
						"schema.outputControls.webpage",
					] }
					label={ __( "Breadcrumb", "admin-ui" ) }
				/>
			</Section>
		</Page>
	);
}

/**
 * The container connecting the Switch component to the store.
 *
 * @param {Object} props The props to pass to the Switch component.
 *
 * @returns {JSX.Element} The connected Switch.
 */
const SchemaSwitch = compose( [
	withSelect( ( select, { dataPath, disabledBy = [] } ) => {
		const { getData } = select( REDUX_STORE_KEY );

		return {
			isChecked: getData( dataPath, true ),
			isDisabled: disabledBy.some( disabledByDataPath => ! getData( disabledByDataPath, true ) ),
		};
	} ),
	withDispatch( ( dispatch, { dataPath, disableAlso } ) => {
		const { setData } = dispatch( REDUX_STORE_KEY );

		return {
			onChange: ( value ) => {
				// Disabling a setting will also disable some other settings, if specified.
				// But only disable them all at once, do not enable them together, except when setting "All Schema".
				if ( disableAlso && ( ! value || dataPath === "schema.outputControls.schema" ) ) {
					disableAlso.forEach( ( path ) => {
						setData( path, value );
					} );
				}
				setData( dataPath, value );
			},
		};
	} ),
] )( Switch );
