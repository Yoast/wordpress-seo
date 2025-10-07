/**
 * Determines if the AI Generate check should be shown.
 *
 * @param {Object} store The Yoast SEO redux store.
 *
 * @returns {boolean} Whether to show the AI Generate check.
 */
export function shouldShowAiGenerateCheck( store ) {
    const { isRecentSeoTitlesDefault, isRecentSeoDescriptionsDefault } = store.getPreferences();

    console.log( 'isRecentSeoTitlesDefault:', isRecentSeoTitlesDefault );
    console.log( 'isRecentSeoDescriptionsDefault:', isRecentSeoDescriptionsDefault );
    
    return true;
}