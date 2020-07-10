import { getDirectionalStyle } from "./styled-components";
import sendRequest from "./ajaxHelper";
import decodeHTML from "./htmlDecoder";
import getFeed from "./getFeed";
import getCourseFeed from "./getCourseFeed";
import getPostFeed from "./getPostFeed";
import createSvgIconComponent from "./createSvgIconComponent";
import getWordBoundaries from "./wordBoundaries";

import * as strings from "./strings";

export {
	createSvgIconComponent,
	getDirectionalStyle,
	sendRequest,
	decodeHTML,
	getPostFeed,
	getCourseFeed,
	getFeed,
	getWordBoundaries,
	strings,
};

export { makeOutboundLink } from "./makeOutboundLink";
export { default as validateFacebookImage } from "./social-preview-image-validation/facebookValidation";
export { default as validateTwitterImage } from "./social-preview-image-validation/twitterValidation";
export * from "./hiddenInputHelper";


