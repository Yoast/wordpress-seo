/* global wpseoScriptData */
import { Fragment, render } from "@wordpress/element";
import { ThemeProvider } from "styled-components";
import CompanyInfoMissingPortal from "../components/portals/CompanyInfoMissingPortal";
import ImageSelectPortal from "../components/portals/ImageSelectPortal";
import LocalSEOUpsellPortal from "../components/portals/LocalSEOUpsellPortal";
import UserSelectPortal from "../components/portals/UserSelectPortal";
import SettingsReplacementVariableEditors from "../components/SettingsReplacementVariableEditors";
import SchemaSettings from "../containers/SchemaSettings";
import { __ } from "@wordpress/i18n";

/**
 * @summary Initializes the search appearance settings script.
 * @returns {void}
 */
export default function initSearchAppearance() {
	const editorElements = document.querySelectorAll( "[data-react-replacevar-editor]" );
	const singleFieldElements = document.querySelectorAll( "[data-react-replacevar-field]" );
	const imagePortals = Array.from( document.querySelectorAll( "[data-react-image-portal]" ) );

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
					label={ __( "Organization logo", "wordpress-seo" ) }
					hasPreview={ true }
					target="yoast-organization-image-select"
					hiddenField="company_logo"
					hiddenFieldImageId="company_logo_id"
					selectImageButtonId="yoast-organization-image-select-button"
					replaceImageButtonId="yoast-organization-image-replace-button"
					removeImageButtonId="yoast-organization-image-remove-button"
				/>
				<ImageSelectPortal
					label={ __( "Person logo / avatar", "wordpress-seo" ) }
					hasPreview={ true }
					target="yoast-person-image-select"
					hiddenField="person_logo"
					hiddenFieldImageId="person_logo_id"
					selectImageButtonId="yoast-person-image-select-button"
					replaceImageButtonId="yoast-person-image-replace-button"
					removeImageButtonId="yoast-person-image-remove-button"
				/>

				{ imagePortals.map( ( portal ) => {
					return ( <ImageSelectPortal
						key={ portal.id }
						label={ portal.dataset.reactImagePortalLabel || __( "Social image", "wordpress-seo" ) }
						hasPreview={ true }
						target={ portal.id }
						hiddenField={ portal.dataset.reactImagePortalTargetImage }
						hiddenFieldImageId={ portal.dataset.reactImagePortalTargetImageId }
						selectImageButtonId={ portal.id + "-select-button" }
						replaceImageButtonId={ portal.id + "-replace-button" }
						removeImageButtonId={ portal.id + "-remove-button" }
						hasNewBadge={ portal.dataset.reactImagePortalHasNewBadge === "1" }
						isDisabled={ portal.dataset.reactImagePortalIsDisabled === "1" }
						hasPremiumBadge={ portal.dataset.reactImagePortalHasPremiumBadge === "1" }
						hasImageValidation={ portal.dataset.reactImagePortalHasImageValidation === "1" }
					/> );
				} ) }

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
		element
	);
}
