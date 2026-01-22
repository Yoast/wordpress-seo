import { startsWith, uniq } from "lodash";
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
 * @param {string}  options.type             The type of the link.
 * @param {string}  options.id               The id of the linked resource.
 * @param {boolean} options.opensInNewWindow Whether this link will open in a new window.
 * @param {boolean} options.noFollow         Whether the link should have nofollow.
 * @param {boolean} options.sponsored        Whether the link should be marked as sponsored.
 * @param {string}  options.className        CSS classes for the link.
 *
 * @returns {Object} The final format object.
 */
export function createLinkFormat( { url, type, id, opensInNewWindow, noFollow, sponsored, className } ) {
	const format = {
		type: "core/link",
		attributes: {
			url,
		},
	};

	if ( type ) {
		format.attributes.type = type;
	}

	if ( id ) {
		format.attributes.id = id;
	}

	let relAttributes = [];

	if ( opensInNewWindow ) {
		format.attributes.target = "_blank";

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

	if ( className ) {
		format.attributes.class = className;
	}

	return format;
}
