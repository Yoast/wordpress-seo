<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Class to print out the translatable strings for the Multiple Keywords modal.
 */
class WPSEO_Multiple_Keywords_Modal {

	/**
	 * Returns the translations for the Multiple Keywords modal.
	 *
	 * These strings are not escaped because they're meant to be used with React
	 * which already takes care of that. If used in PHP, they should be escaped.
	 *
	 * @return array Translated text strings for the Multiple Keywords modal.
	 */
	public function get_translations() {
		return array(
			'title'                    => __( 'Would you like to add another keyphrase?', 'wordpress-seo' ),
			'intro'                    => sprintf(
				/* translators: %s expands to a 'Yoast SEO Premium' text linked to the yoast.com website. */
				__( 'Great news: you can, with %s!', 'wordpress-seo' ),
				'{{link}}Yoast SEO Premium{{/link}}'
			),
			'link'                     => WPSEO_Shortlinker::get( 'https://yoa.st/pe-premium-page' ),
			'other'                    => sprintf(
				/* translators: %s expands to 'Yoast SEO Premium'. */
				__( 'Other benefits of %s for you:', 'wordpress-seo' ),
				'Yoast SEO Premium'
			),
			'buylink'                  => WPSEO_Shortlinker::get( 'https://yoa.st/add-keywords-popup' ),
			'buy'                      => sprintf(
				/* translators: %s expands to 'Yoast SEO Premium'. */
				__( 'Get %s', 'wordpress-seo' ),
				'Yoast SEO Premium'
			),
			'small'                    => __( '1 year free support and updates included!', 'wordpress-seo' ),
			'a11yNotice.opensInNewTab' => __( '(Opens in a new browser tab)', 'wordpress-seo' ),
		);
	}

	/**
	 * Passes translations to JS for the Multiple Keywords modal component.
	 *
	 * @return array Translated text strings for the Multiple Keywords modal component.
	 */
	public function get_translations_for_js() {
		$translations = $this->get_translations();

		return array(
			'locale' => WPSEO_Language_Utils::get_user_locale(),
			'intl'   => $translations,
		);
	}

	/**
	 * Prints the localized Multiple Keywords modal translations for JS.
	 *
	 * @return void
	 */
	public function enqueue_translations() {
		wp_localize_script( WPSEO_Admin_Asset_Manager::PREFIX . 'admin-global-script', 'yoastMultipleKeywordsModalL10n', $this->get_translations_for_js() );
	}
}
