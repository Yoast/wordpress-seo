/**
 * Keep constants centralized to avoid circular dependency problems.
 */
export const STORE_NAME = "@yoast/bulk-editor";

export const ROOT_ID = "yoast-seo-bulk-editor";

// How many rows the bulk editor shows per page; also sizes the loading skeleton.
export const PAGE_SIZE = 20;

// The field sets behind the two tabs: which editable fields the table shows.
export const FIELD_SET_SEARCH = "search";
export const FIELD_SET_SOCIAL = "social";

// The SlotFill name Premium fills with its bulk actions.
export const BULK_ACTIONS_SLOT = "yoast.bulkEditor.bulkActions";

// The filter Premium uses to add items to the Select menu.
export const SELECT_MENU_ITEMS_FILTER = "yoast.bulkEditor.selectMenuItems";
