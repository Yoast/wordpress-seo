import { startsWith, uniq } from "lodash";
import { __, sprintf } from "@wordpress/i18n";
import {
	getProtocol,
	isValidProtocol,
	getAuthority,
	isValidAuthority,
	getPath,
	isValidPath,
	getQueryString,
	isValidQueryString,
	getFragment,
	isValidFragment,
} from "@wordpress/url";

/* eslint-disable complexity */
/**
 * Check for issues with the provided href.
 *
 * @param {string} href The href.
 *
 * @returns {boolean} Is the href invalid?
 */
export function isValidHref( href ) {
	if ( ! href ) {
		return false;
	}

	const trimmedHref = href.trim();

	if ( ! trimmedHref ) {
		return false;
	}

	// Does the href start with something that looks like a URL protocol?
	if ( /^\S+:/.test( trimmedHref ) ) {
		const protocol = getProtocol( trimmedHref );
		if ( ! isValidProtocol( protocol ) ) {
			return false;
		}

		// Add some extra checks for http(s) URIs, since these are the most common use-case.
		// This ensures URIs with an http protocol have exactly two forward slashes following the protocol.
		// eslint-disable-next-line no-useless-escape
		if ( startsWith( protocol, "http" ) && ! /^https?:\/\/[^\/\s]/i.test( trimmedHref ) ) {
			return false;
		}

		const authority = getAuthority( trimmedHref );
		if ( ! isValidAuthority( authority ) ) {
			return false;
		}

		const path = getPath( trimmedHref );
		if ( path && ! isValidPath( path ) ) {
			return false;
		}

		const queryString = getQueryString( trimmedHref );
		if ( queryString && ! isValidQueryString( queryString ) ) {
			return false;
		}

		const fragment = getFragment( trimmedHref );
		if ( fragment && ! isValidFragment( fragment ) ) {
			return false;
		}
	}

	// Validate anchor links.
	if ( startsWith( trimmedHref, "#" ) && ! isValidFragment( trimmedHref ) ) {
		return false;
	}

	return true;
}
/* eslint-enable complexity */

/**
 * Generates the format object that will be applied to the link text.
 *
 * @param {Object}  options                  The options object.
 * @param {string}  options.url              The href of the link.
 * @param {boolean} options.opensInNewWindow Whether this link will open in a new window.
 * @param {Object}  options.text             The text that is being hyperlinked.
 *
 * @returns {Object} The final format object.
 */
export function createLinkFormat( { url, opensInNewWindow, noFollow, sponsored, text } ) {
	const format = {
		type: "core/link",
		attributes: {
			url,
		},
	};

	let relAttributes = [];

	if ( opensInNewWindow ) {
		// translators: accessibility label for external links, where the argument is the link text
		const label = sprintf( __( "%s (opens in a new tab)", "wordpress-seo" ), text );

		format.attributes.target = "_blank";
		format.attributes[ "aria-label" ] = label;

		relAttributes.push( "noreferrer noopener" );
	}

	if ( sponsored ) {
		relAttributes.push( "sponsored" );
		relAttributes.push( "nofollow" );
	}

	if ( noFollow ) {
		relAttributes.push( "nofollow" );
	}

	if ( relAttributes.length > 0 ) {
		relAttributes = uniq( relAttributes );
		format.attributes.rel = relAttributes.join( " " );
	}

	return format;
}
