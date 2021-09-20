/* eslint-disable complexity */
import { createReplacevarFunctions } from "@yoast/admin-ui-toolkit/helpers";
import { detail, list, pageNumber, separator, siteName } from "../config/replacevars";

/**
 * Gets the replacement variables for a scope.
 *
 * @param {Object} options The options.
 * @param {string} options.scope The scope, i.e. post, page, etc.
 *
 * @returns {Object[]} The list of replacement variables for the given scope.
 */
const getReplacevars = ( { scope } ) => {
	switch ( scope ) {
		case "homepage":
			return [
				detail.title,
				siteName,
				separator,
				pageNumber,
			];
		case "products":
			return [
				detail.focusKeyphrase,
				detail.title,
				detail.collectionTitle,
				detail.productTags,
				siteName,
				separator,
				pageNumber,
			];
		case "collections":
			return [
				detail.focusKeyphrase,
				detail.title,
				siteName,
				separator,
				pageNumber,
			];
		case "pages":
			return [
				detail.focusKeyphrase,
				detail.title,
				siteName,
				separator,
				pageNumber,
			];
		case "blogs":
			return [
				detail.focusKeyphrase,
				detail.title,
				siteName,
				separator,
				pageNumber,
			];
		case "blog-posts":
			return [
				detail.focusKeyphrase,
				detail.title,
				detail.blogTitle,
				detail.postTags,
				siteName,
				separator,
				pageNumber,
			];
		case "list.homepage":
			return [
				list.title,
				siteName,
				separator,
				pageNumber,
			];
		case "list.products":
			return [
				list.focusKeyphrase,
				list.title,
				list.collectionTitle,
				list.productTags,
				siteName,
				separator,
				pageNumber,
			];
		case "list.collections":
			return [
				list.focusKeyphrase,
				list.title,
				siteName,
				separator,
				pageNumber,
			];
		case "list.pages":
			return [
				list.focusKeyphrase,
				list.title,
				siteName,
				separator,
				pageNumber,
			];
		case "list.blogs":
			return [
				list.focusKeyphrase,
				list.title,
				siteName,
				separator,
				pageNumber,
			];
		case "list.blog-posts":
			return [
				list.focusKeyphrase,
				list.title,
				list.blogTitle,
				list.postTags,
				siteName,
				separator,
				pageNumber,
			];
	}

	return [];
};

export const {
	getReplacevarsForEditor,
	applyReplacevars,
} = createReplacevarFunctions( getReplacevars );
