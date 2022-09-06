import { Slot } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { BetaBadge } from "@yoast/components";
import PropTypes from "prop-types";
import getContentLocale from "../../analysis/getContentLocale";
import getL10nObject from "../../analysis/getL10nObject";
import styled from "styled-components";

import TextFormalityUpsell from "./text-formality-upsell";

const Badge = styled( BetaBadge )`
	margin: 0 2px 0 4px;
`;
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

	if ( ! isFormalityAvailable ) {
		return null;
	}

	return (
		<div className="yoast-text-formality">
			<div className="yoast-field-group__title">
				<b>{ __( "Text formality", "wordpress-seo" ) }</b>
				<Badge className={ "yoast-beta-badge" } />
			</div>
			{ isPremium ? <Slot name="YoastTextFormality" /> : <TextFormalityUpsell location={ location } /> }
		</div>
	);
};

TextFormality.propTypes = {
	location: PropTypes.string.isRequired,
};

export default TextFormality;
