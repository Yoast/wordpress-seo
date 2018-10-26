import * as importedData from "@wordpress/data";
import * as importedElement from "@wordpress/element";
import * as importedComponents from "@wordpress/components";
import * as importedI18n from "@wordpress/i18n";
import * as importedApiFetch from "@wordpress/api-fetch";
import * as styledComponents from "styled-components";

import get from "lodash/get";

/*
 * If Gutenberg is present we can just use their wp.element and wp.data. Otherwise
 * we use the imported objects.
 */
const element = get( window, "wp.element", importedElement );
const data = get( window, "wp.data", importedData );
const components = get( window, "wp.components", importedComponents );
const i18n = get( window, "wp.i18n", importedI18n );
const apiFetch = get( window, "wp.apiFetch", importedApiFetch );

// Create our own global.
const yoast = window.yoast || {};

// Backport all wp globals on our own private `_wp` for isolation.
yoast._wp = {
	element,
	data,
	components,
	i18n,
	apiFetch,
};

yoast.styledComponents = styledComponents;

// Put it all actually on the global.
window.yoast = yoast;
