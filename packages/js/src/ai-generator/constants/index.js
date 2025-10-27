import { mapValues } from "lodash";

/**
 * The Redux store name of the AI generator.
 * @type {string}
 */
export const STORE_NAME_AI = "yoast-seo/ai-generator";

/**
 * The Redux store name of the editor.
 * @type {string}
 */
export const STORE_NAME_EDITOR = "yoast-seo/editor";

/**
 * The preview type. Used to determine the platform for the preview.
 * @type {{google: string, social: string, twitter: string}}
 */
export const PREVIEW_TYPE = {
	google: "google",
	social: "social",
	twitter: "twitter",
};

/**
 * The field of the content being edited, either a title or a description.
 * @type {{title: string, description: string}}
 */
export const EDIT_TYPE = {
	title: "title",
	description: "description",
};

/**
 * The post type of the content being edited. For terms, the taxonomy is used as post type.
 * Contains only the default (post) and irregular post types.
 * @type {{post: string, product: string, attachment: string, productCategory: string, productTag: string}}
 */
export const POST_TYPE = {
	post: "post",
	product: "product",
	attachment: "attachment",
	productCategory: "product_cat",
	productTag: "product_tag",
};

/**
 * The type of the content being edited, either a post or a term.
 * @type {{post: string, term: string}}
 */
export const CONTENT_TYPE = {
	post: "post",
	term: "term",
};

/**
 * The title variable that will be replaced for posts and terms.
 * @type {{post: string, term: string}}
 */
export const TITLE_VARIABLE = {
	post: "title",
	term: "term_title",
};
/**
 * The title variable that will be replaced for posts and terms in the replacement variable syntax.
 * @type {{post: string, term: string}}
 */
export const TITLE_VARIABLE_REPLACE = mapValues( TITLE_VARIABLE, variable => `%%${variable}%%` );

/**
 * The preview mode. Used to determine the device for the preview.
 * @type {{mobile: string, desktop: string}}
 */
export const PREVIEW_MODE = {
	mobile: "mobile",
	desktop: "desktop",
};

/**
 * The maximum number of suggestions to fetch per page.
 * @type {number}
 */
export const SUGGESTIONS_PER_PAGE = 5;

/**
 * The status of the async action.
 * @type {{idle: string, loading: string, success: string, error: string}}
 */
export const ASYNC_ACTION_STATUS = {
	idle: "idle",
	loading: "loading",
	success: "success",
	error: "error",
};

/**
 * The status of the fetch response.
 * @type {{success: string, error: string, abort: string}}
 */
export const FETCH_RESPONSE_STATUS = {
	success: "success",
	error: "error",
	abort: "abort",
};

/**
 * The maximum number of tokens to consider for default content types.
 * @type {number}
 */
export const MAX_TOKENS_DEFAULT = 300;
/**
 * The maximum number of tokens to consider for irregular content types (e.g. products or terms).
 * @type {number}
 */
export const MAX_TOKENS_IRREGULAR = 150;

/**
 * The expected minimum character length of content for default content types.
 * @type {number}
 */
export const MIN_CHARACTERS_DEFAULT = 300;
/**
 * The expected minimum character length of content for irregular content types (e.g. products or terms).
 * @type {number}
 */
export const MIN_CHARACTERS_IRREGULAR = 150;
