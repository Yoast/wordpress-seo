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

// The SlotFill name Premium fills with its bulk actions.
export const BULK_ACTIONS_SLOT = "yoast.bulkEditor.bulkActions";

// The PluginArea scope Premium registers its fills under, so they mount inside this page's React tree.
export const PLUGIN_SCOPE = "yoast-seo-bulk-editor";

// The filter Premium uses to add items to the Select menu.
export const SELECT_MENU_ITEMS_FILTER = "yoast.bulkEditor.selectMenuItems";

// The slot base name Premium fills to replace the content of a table cell that has fields (keyphrase, title, meta description).
// The rendered slot name is `${TABLE_CELL_FIELD_SLOT}/${field.key}/${item.id}` (one slot per cell).
// fillProps: { field, item, value, isSaving, onSaveField, onDiscardField }.
export const TABLE_CELL_FIELD_SLOT = "yoast.bulkEditor.TableCellWithField";

// The WooCommerce product post type.
export const PRODUCT_CONTENT_TYPE = "product";

// The Free bulk AI upsell: the shortlinks and click-to-buy ids per target plugin.
export const AI_UPSELL = {
	premium: { link: "https://yoa.st/bulk-editor-ai-upsell", ctbId: "f6a84663-465f-4cb5-8ba5-f7a6d72224b2" },
	woo: { link: "https://yoa.st/bulk-editor-ai-upsell-woo", ctbId: "5b32250e-e6f0-44ae-ad74-3cefc8e427f9" },
};
