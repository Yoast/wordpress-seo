import { get } from "lodash";

/**
 * Determines if the current SEO data are using default templates.
 *
 * @param {Object} store The Yoast SEO redux store.
 *
 * @returns {Object} Object with booleans for title and description defaults.
 */
export function getCurrentSeoDataDefault( store ) {
    const { isRecentSeoTitlesDefault, isRecentSeoDescriptionsDefault } = store.getPreferences();
    const snippetEditorData = store.getSnippetEditorData();

    const titleDefaultTemplate = get( window, "wpseoScriptData.metabox.title_template", "" );
    const descriptionDefaultTemplate = get( window, "wpseoScriptData.metabox.metadesc_template", "" );

    const isCurrentSeoTitleDefault = snippetEditorData.title.trim() === titleDefaultTemplate.trim();
    const isCurrentSeoDescriptionDefault = snippetEditorData.description.trim() === descriptionDefaultTemplate.trim();

    return {
        isAllSeoTitlesDefault: isRecentSeoTitlesDefault && isCurrentSeoTitleDefault,
        isAllSeoDescriptionsDefault: isRecentSeoDescriptionsDefault && isCurrentSeoDescriptionDefault,
    };
}
