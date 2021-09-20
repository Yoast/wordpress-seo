import { RadioGroup } from "@headlessui/react";
import { compose } from "@wordpress/compose";
import { withDispatch, withSelect } from "@wordpress/data";
import { __, sprintf } from "@wordpress/i18n";
import { Alert, Section } from "@yoast/admin-ui-toolkit/components";
import { SEPARATORS } from "@yoast/admin-ui-toolkit/helpers";
import classNames from "classnames";
import { toPairs } from "lodash";
import { PropTypes } from "prop-types";
import { REDUX_STORE_KEY } from "../../constants";
import { withHideForOptions } from "../../helpers";
import ImageSelect from "../image-select";
import Page from "../page";

// Made the div into a component because otherwise it will pass on all the props, including the optionPath, which is invalid HTML.
const HideForOptionsDiv = withHideForOptions()( ( { className, children } ) => <div className={ className }>{ children }</div> );

/**
 * This component contains the Separator Selector.
 *
 * @returns {JSX.Element} The Separator Selector component.
 */
function SeparatorSelector( { value, onChange } ) {
	return (
		<RadioGroup value={ value } onChange={ onChange } className="yst-mb-8">
			<RadioGroup.Label className="yst-block yst-mb-2">{ __( "Separators", "admin-ui" ) }</RadioGroup.Label>
			<ul className="space-y-4">
				{
					toPairs( SEPARATORS ).map( ( [ sepLabel, sepValue ] ) => {
						return (
							<RadioGroup.Option
								key={ sepValue }
								value={ sepValue }
								as="li"
								className="yst-inline-block yst-mr-2 yst-mb-2 focus:yst-outline-none"
							>
								{ ( { checked } ) => (
									<>
										<RadioGroup.Label
											className={ classNames(
												checked
													? "yst-ring-2 yst-ring-primary-500 yst-border-none"
													: "",
												"yst-flex yst-items-center yst-justify-center yst-w-10 yst-h-10",
												"yst-border yst-shadow-sm yst-rounded-md yst-bg-white yst-border-gray-300",
												"yst-text-sm yst-font-medium yst-text-gray-800",
												"yst-cursor-pointer hover:yst-bg-gray-50",
											) }
										>
											{ sepLabel }
										</RadioGroup.Label>
									</>
								) }
							</RadioGroup.Option>
						);
					} )
				}
			</ul>
		</RadioGroup>
	);
}

SeparatorSelector.propTypes = {
	value: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
};

/**
 * The SiteDefaults Page component.
 *
 * @returns {Component} The SiteDefaults Page.
 */
function SiteDefaults( { siteTitle, siteTitleLink, hasTagline, tagLine, tagLineLink, separator, separatorOnChange } ) {
	return (
		<Page
			title={ __( "Site defaults", "admin-ui" ) }
		>
			<Section>

				<Alert type="info">
					<p>{ sprintf(
						// translators: %s is replaced with Tagline when present
						__( "You can use Site title%s and Separator as variables when configuring the search appearance of your content.", "admin-ui" ),
						hasTagline ? `, ${ __( "Tagline", "admin-ui" ) }` : "",
					) }</p>
				</Alert>

				<div className="yst-mb-8">
					<strong className="yst-block yst-mb-2">{ __( "Site title", "admin-ui" ) }</strong>
					<span>{ siteTitle }</span> <a href={ siteTitleLink } target="_blank" rel="noopener noreferrer">{ __( "Edit", "admin-ui" ) }</a>
				</div>

				<HideForOptionsDiv optionPath="siteDefaults.tagLine" className="yst-mb-8">
					<strong className="yst-block yst-mb-2">{ __( "Tagline", "admin-ui" ) }</strong>
					<span>{ tagLine }</span> <a href={ tagLineLink }>{ __( "Edit", "admin-ui" ) }</a>
				</HideForOptionsDiv>

				<SeparatorSelector value={ separator } onChange={ separatorOnChange } />

				<ImageSelect
					label={ __( "Site image", "admin-ui" ) }
					id="site-image"
					dataPath="siteSettings.siteDefaults.siteImage"
					imageAltText={ __( "The site image", "admin-ui" ) }
				/>
				<p className="yst-mt-4 yst-max-w-sm">
					{ __( "This image is used as a fallback for posts/pages that don't have a featured image set.", "admin-ui" ) }
				</p>

			</Section>
		</Page>
	);
}

SiteDefaults.propTypes = {
	siteTitle: PropTypes.string.isRequired,
	siteTitleLink: PropTypes.string.isRequired,
	hasTagline: PropTypes.bool.isRequired,
	tagLine: PropTypes.string.isRequired,
	tagLineLink: PropTypes.string.isRequired,
	separator: PropTypes.string.isRequired,
	separatorOnChange: PropTypes.func.isRequired,
};

/**
 * Connects the data for the SeparatorSelector component to the settings store.
 */
export default compose( [
	withSelect( ( select ) => {
		const {
			getData,
			getOption,
		} = select( REDUX_STORE_KEY );

		return {
			siteTitle: getOption( "siteDefaults.siteTitleValue", "" ),
			siteTitleLink: getOption( "siteDefaults.siteTitleLink", "" ),
			hasTagline: getOption( "siteDefaults.tagLine", false ),
			tagLine: getOption( "siteDefaults.tagLineValue", "" ),
			tagLineLink: getOption( "siteDefaults.tagLineLink", "" ),
			separator: getData( "siteSettings.siteDefaults.separator", "" ),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const {
			setData,
		} = dispatch( REDUX_STORE_KEY );

		return {
			separatorOnChange: ( event ) => setData( "siteSettings.siteDefaults.separator", event ),
		};
	} ),
] )( SiteDefaults );
