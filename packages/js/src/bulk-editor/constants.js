/**
 * Keep constants centralized to avoid circular dependency problems.
 */
export const STORE_NAME = "@yoast/bulk-editor";

export const ROOT_ID = "yoast-seo-bulk-editor";

// How many rows the bulk editor shows per page; also sizes the loading skeleton.
export const PAGE_SIZE = 20;

// The minimum term length before the debounced as-you-type search runs; the Search button has no minimum.
export const MIN_SEARCH_LENGTH = 3;

// The field sets behind the two tabs: which editable fields the table shows.
export const FIELD_SET_SEARCH = "search";
export const FIELD_SET_SOCIAL = "social";
