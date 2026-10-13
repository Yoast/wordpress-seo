export { fixWordPressMenuScrolling } from "./fix-wordpress-menu-scrolling";
export { updateNotificationsCount } from "./notifications-count";
export * from "./i18n";
export { removesLocaleVariantSuffixes } from "./locale";
export { getModalNotificationPosition } from "./get-modal-notification-position";
export { collectPromptContent, MAX_TOKENS_DEFAULT, MAX_TOKENS_IRREGULAR } from "./prompt-content";
/*
 * getVisibleContentLength is deliberately NOT re-exported here. It imports `yoastseo`, and this barrel is
 * imported by entrypoints that only want fixWordPressMenuScrolling (settings, support, academy, plans) --
 * re-exporting it makes the analysis package a script dependency of those pages. Import it from
 * ./get-visible-content-length directly instead.
 */

