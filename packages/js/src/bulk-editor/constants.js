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

// The focus keyphrase field key; also used to give that column its own text styling.
export const FOCUS_KEYPHRASE_KEY = "focusKeyphrase";

// The SlotFill name Premium fills with its bulk actions.
export const BULK_ACTIONS_SLOT = "yoast.bulkEditor.bulkActions";

// The SlotFill name Premium fills with a full-width notice (e.g. the missing-keyphrase alert), shown as its own
// row above the bulk-actions buttons.
export const BULK_NOTICES_SLOT = "yoast.bulkEditor.bulkNotices";

// The PluginArea scope Premium registers its fills under, so they mount inside this page's React tree.
export const PLUGIN_SCOPE = "yoast-seo-bulk-editor";

// The filter Premium uses to add items to the Select menu.
export const SELECT_MENU_ITEMS_FILTER = "yoast.bulkEditor.selectMenuItems";

// The slot base name Premium fills to replace the content of a table cell that has fields (keyphrase, title, meta description).
// The rendered slot name is `${TABLE_CELL_FIELD_SLOT}/${field.key}/${item.id}` (one slot per cell).
// fillProps: { field, item, value, isSaving, onSaveField, onDiscardField }.
export const TABLE_CELL_FIELD_SLOT = "yoast.bulkEditor.TableCellWithField";

// The slot Premium fills with its own pending-changes confirmation modal (e.g. unapplied AI suggestions), shown when a
// tab switch is deferred because an external plugin reports pending changes. fillProps: { isOpen, onCommit, onCancel }.
export const PENDING_CHANGES_MODAL_SLOT = "yoast.bulkEditor.pendingChangesModal";

// The slot base name Premium fills with a per-row indicator shown before the row title (e.g. an AI status icon).
// The rendered slot name is `${TABLE_ROW_INDICATOR_SLOT}/${fieldSetId}/${item.id}`. Generic so any row-level marker (the missing-keyphrase
// info icon, a generation-error icon) can fill the same spot.
export const TABLE_ROW_INDICATOR_SLOT = "yoast.bulkEditor.TableRowIndicator";

// The WooCommerce product post type.
export const PRODUCT_CONTENT_TYPE = "product";

// The Free bulk AI upsell: the shortlinks and click-to-buy ids per target plugin.
export const AI_UPSELL = {
	premium: { link: "https://yoa.st/bulk-editor-ai-upsell", ctbId: "f6a84663-465f-4cb5-8ba5-f7a6d72224b2" },
	woo: { link: "https://yoa.st/bulk-editor-ai-upsell-woo", ctbId: "5b32250e-e6f0-44ae-ad74-3cefc8e427f9" },
};
