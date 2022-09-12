import { Slot } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { HelpIcon } from "@yoast/components";
import { get } from "lodash";
import PropTypes from "prop-types";
import getContentLocale from "../../analysis/getContentLocale";
import getL10nObject from "../../analysis/getL10nObject";

import TextFormalityUpsell from "./text-formality-upsell";

/**
 * TextFormality component.
 *
 * @param {string} location The location of this component.
 *
 * @returns {JSX.Element} The element.
 */
const TextFormality = ( { location } ) => {
	const isFormalityAvailable = getContentLocale().split( "_" )[ 0 ] === "en";
	const isPremium = getL10nObject().isPremium;
	const infoLink = isPremium
		? get( window, "wpseoAdminL10n.shortlinks-insights-text_formality_info_premium", "" )
		: get( window, "wpseoAdminL10n.shortlinks-insights-text_formality_info_free", "" );

	const linkText = isPremium
		? __( "Read our article on text formality to learn more about how to change the formality level of a text.", "wordpress-seo" )
		: __( "Read more about text formality.", "wordpress-seo" );

	if ( ! isFormalityAvailable ) {
		return null;
	}

	return (
		<div className="yoast-text-formality">
			<div className="yoast-field-group__title">
				<b>{ __( "Text formality", "wordpress-seo" ) }</b>
				<HelpIcon
					linkTo={ infoLink }
					linkText={ linkText }
				/>
			</div>
			{ isPremium ? <Slot name="YoastTextFormality" /> : <TextFormalityUpsell location={ location } /> }
		</div>
	);
};

TextFormality.propTypes = {
	location: PropTypes.string.isRequired,
};

export default TextFormality;
