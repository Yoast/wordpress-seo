import { getDirectionalStyle } from "./styled-components";
import sendRequest from "./ajaxHelper";
import decodeHTML from "./htmlDecoder";
import getCourseFeed from "./getCourseFeed";
import getPostFeed from "./getPostFeed";
import createSvgIconComponent from "./createSvgIconComponent";
import getWordBoundaries from "./wordBoundaries";
import * as strings from "./strings";
import join from "./join";

export {
	createSvgIconComponent,
	getDirectionalStyle,
	sendRequest,
	decodeHTML,
	getPostFeed,
	getCourseFeed,
	getWordBoundaries,
	strings,
	join,
};

/**
 * Grabs an RSS feed from the requested URL and parses it.
 *
 * @deprecated Use `getPostFeed` or `getCourseFeed` instead.
 */
export { default as getFeed } from "./getFeed";

export { makeOutboundLink } from "./makeOutboundLink";
export { default as validateFacebookImage } from "./social-preview-image-validation/facebookValidation";
export { default as validateTwitterImage } from "./social-preview-image-validation/twitterValidation";
export * from "./hiddenInputHelper";
