/* global wpseoScriptData */
import { Fragment, render } from "@wordpress/element";
import { ThemeProvider } from "styled-components";
import CompanyInfoMissingPortal from "../components/portals/CompanyInfoMissingPortal";
import ImageSelectPortal from "../components/portals/ImageSelectPortal";
import LocalSEOUpsellPortal from "../components/portals/LocalSEOUpsellPortal";
import UserSelectPortal from "../components/portals/UserSelectPortal";
import SettingsReplacementVariableEditors from "../components/SettingsReplacementVariableEditors";
import SchemaSettings from "../containers/SchemaSettings";
import { setWordPressSeoL10n, setYoastComponentsL10n } from "../helpers/i18n";

/**
 * @summary Initializes the search appearance settings script.
 * @returns {void}
 */
export default function initSearchAppearance() {
	setYoastComponentsL10n();
	setWordPressSeoL10n();

	const editorElements = document.querySelectorAll( "[data-react-replacevar-editor]" );
	const singleFieldElements = document.querySelectorAll( "[data-react-replacevar-field]" );

	const schemaSettingsElements = document.querySelectorAll( "[data-schema-settings]" );

	const element = document.createElement( "div" );
	document.body.appendChild( element );

	const theme = {
		isRtl: wpseoScriptData.searchAppearance.isRtl,
	};

	const {
		showLocalSEOUpsell,
		localSEOUpsellURL,
		brushstrokeBackgroundURL,
		knowledgeGraphCompanyInfoMissing,
	} = wpseoScriptData.searchAppearance;

	render(
		<ThemeProvider theme={ theme }>
			<Fragment>
				<SettingsReplacementVariableEditors
					singleFieldElements={ singleFieldElements }
					editorElements={ editorElements }
				/>
				<UserSelectPortal target="wpseo-person-selector" />
				<CompanyInfoMissingPortal
					target="knowledge-graph-company-warning"
					message={ knowledgeGraphCompanyInfoMissing.message }
					link={ knowledgeGraphCompanyInfoMissing.URL }
				/>
				<ImageSelectPortal
					label="Organization logo"
					hasPreview={ true }
					target="yoast-organization-image-select"
					hiddenField="company_logo"
					hiddenFieldImageId="company_logo_id"
				/>
				<ImageSelectPortal
					label="Person logo / avatar"
					hasPreview={ true }
					target="yoast-person-image-select"
					hiddenField="person_logo"
					hiddenFieldImageId="person_logo_id"
				/>
				{ showLocalSEOUpsell && (
					<LocalSEOUpsellPortal
						target="wpseo-local-seo-upsell"
						url={ localSEOUpsellURL }
						backgroundUrl={ brushstrokeBackgroundURL }
					/>
				) }
				<SchemaSettings targets={ schemaSettingsElements } />
			</Fragment>
		</ThemeProvider>,
		element,
	);
}
