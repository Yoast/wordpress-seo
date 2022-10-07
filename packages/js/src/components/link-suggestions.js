import PropTypes from "prop-types";

import styled from "styled-components";
import { __, sprintf } from "@wordpress/i18n";
import { createInterpolateElement } from "@wordpress/element";
import { makeOutboundLink } from "@yoast/helpers";

import LinkSuggestion from "./link-suggestion";

const introMessage =  createInterpolateElement(
	sprintf(
		/**
		 * translators: %1$s expands to an opening anchor tag.
		 * %2$s expands to a closing anchor tag.
		 */
		__( "To improve your site structure, consider linking to other relevant posts or pages on your website. %1$sRead our guide on internal linking for SEO%2$s to learn more.", "wordpress-seo" ),
		"<a>",
		"</a>"
	),
	{
		// eslint-disable-next-line jsx-a11y/anchor-has-content, jsx-a11y/anchor-is-valid
		a: <a href="#" target="_blank" rel="noreferrer" style={ { cursor: "default", pointerEvents: "none" } } />,
	}
);

const OutboundLink = makeOutboundLink();
const upsellLink = "http://yoa.st/link-suggestions-upsell";

const LinkSuggestionsWrapper = styled.div`
display: table-cell;
`;

const suggestions = [
	{ value: "Upgrade to", url: "#", isActive: false, labels: [ "post" ], isEnabled: false },
	{ value: "Yoast SEO Premium", url: "#", isActive: false, labels: [ "post" ], isEnabled: false },
	{ value: "To make use of", url: "#", isActive: false, labels: [ "post" ], isEnabled: false },
	{ value: "Internal linking suggestions", url: "#", isActive: false, labels: [ "post" ], isEnabled: false },
	{ value: "For this post", url: "#", isActive: false, labels: [ "post" ], isEnabled: false },
];

/**
 *
 * @returns {void}
 */
const LinkSuggestions = ( { location } ) => {
	const additionalStyle = { minHeight: "revert", maxHeight: "30px" };
	if ( location === "metabox" ) {
		additionalStyle.marginTop = "8px";
	}
	return (
		<LinkSuggestionsWrapper>
			<OutboundLink href={ upsellLink } className="yoast-button yoast-button-upsell" style={ additionalStyle }>
				{ sprintf(
					// translators: %s expands to `Premium` (part of add-on name).
					__( "Unlock with %s", "wordpress-seo" ),
					"Premium"
				) }
				<span aria-hidden="true" className="yoast-button-upsell__caret" />
			</OutboundLink>
			<div style={ { opacity: 0.5 } }>
				<p style={ { marginTop: 10 } }>{ introMessage }</p>
				<div>
					{ suggestions.map( ( suggestion, key ) => <LinkSuggestion key={ key } { ...suggestion } /> ) }
				</div>
			</div>
		</LinkSuggestionsWrapper>
	);
};

LinkSuggestions.propTypes = {
	location: PropTypes.string,
};

LinkSuggestions.defaultProps = {
	location: "sidebar",
};

export default LinkSuggestions;
