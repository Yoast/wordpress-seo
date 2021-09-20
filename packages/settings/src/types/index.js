/**
 * @typedef {Object} Action
 * @property {string} type The action type.
 * @property {*} payload The action payload.
 */

/**
 * @typedef {Object} FieldArrayInterface
 * @property {string[]|number[]} items Current field array in store.
 * @property {Function} add Dispatch helper to add item to field array.
 * @property {Function} insert Dispatch helper to insert item at index in field array.
 * @property {Function} remove Dispatch helper to remove item at index from field array.
 */

/**
 * @typedef {Object} ContentTypeSchema
 * @property {string} pageType Schema page type of content type.
 * @property {string} articleType Schema article type of content type.
 */

/**
 * @typedef {Object} ContentTypeTemplate
 * @property {string} singleTitle Title for single pages.
 * @property {string} singleDescription Description for single pages.
 * @property {string} [singleImage] Image for single pages.
 * @property {string} archiveTitle Title for archive page.
 * @property {string} archiveDescription Description for archive page.
 * @property {string} [archiveImage] Image for archive page.
 */

/**
 * @typedef {Object} ContentTypeTemplates
 * @property {ContentTypeTemplate} seo Template for SEO.
 * @property {ContentTypeTemplate} social Template for Facebook and Twitter.
 */

/**
 * @typedef {Object} ContentTypeOptionsDefaults
 * @param {ContentTypeSchema} schema Default fallback for schema settings.
 * @param {ContentTypeTemplates} templates Default fallback for templates settings.
 */

/**
 * @typedef {Object} ContentTypeOptions
 * @property {string} slug The plural slug of the content type.
 * @property {string} label The plural label of the content type.
 * @property {bool} hasSinglePage Whether the content type supports single pages.
 * @property {bool} hasArchive Whether the content type supports an archive page.
 * @property {bool} hasCustomFields Whether the content type supports custom fields.
 * @property {bool} hasBreadcrumbs Whether the content type supports breadcrumbs.
 * @property {bool} hasSchemaPageTypes Whether the content type supports schema page types.
 * @property {bool} hasSchemaArticleTypes  Whether the content type supports schema article types.
 * @property {bool} hasAutomaticSchemaTypes Whether the content type supports automatic schema types.
 * @property {Object} defaults Default fallback values for content type data.
 */

/**
 * @typedef {Object} ContentTypeData
 * @property {string} slug The plural slug of the content type.
 * @property {bool} showSingleInSearchResults Wether the content type should show single pages in search results.
 * @property {bool} showArchiveInSearchResults Wether the content type should show archive page in search results.
 * @property {bool} showSEOSettings Wether the content type should enable SEO settings.
 * @property {ContentTypeSchema} schema The content type schema settings.
 * @property {ContentTypeTemplates} templates Templates settings.
 */
