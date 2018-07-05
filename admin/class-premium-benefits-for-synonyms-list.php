<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Class to print out a list of Premium benefits specific for the keyword synonyms.
 */
class WPSEO_Premium_Benefits_For_Synonyms_List {

	/**
	 * Returns the translations for the Premium benefits list.
	 *
	 * @return array Translated text strings for the Premium benefits list.
	 */
	public function get_translations() {
		return array(
			'<strong>' . __( 'Rank for up to 5 focus keywords per page', 'wordpress-seo' ) . '</strong>',
			sprintf(
				/* translators: %1$s expands to a 'strong' start tag, %2$s to a 'strong' end tag. */
				__( '%1$sNo more dead links%2$s: easy redirect manager', 'wordpress-seo' ),
				'<strong>', '</strong>'
			),
			'<strong>' . __( 'Superfast internal links suggestions', 'wordpress-seo' ) . '</strong>',
			sprintf(
				/* translators: %1$s expands to a 'strong' start tag, %2$s to a 'strong' end tag. */
				__( '%1$sSocial media preview%2$s: Facebook & Twitter', 'wordpress-seo' ),
				'<strong>', '</strong>'
			),
			'<strong>' . __( '24/7 support', 'wordpress-seo' ) . '</strong>',
			'<strong>' . __( 'No ads!', 'wordpress-seo' ) . '</strong>',
		);
	}

	/**
	 * Passes translations to JS for the Add Keyword JS component Premium benefits list.
	 *
	 * @return array Translated text strings for the Premium benefits list component.
	 */
	public function get_translations_for_js() {
		$translations = $this->get_translations();
		return array(
			'locale' => WPSEO_Utils::get_user_locale(),
			'intl'   => $translations,
		);
	}

	/**
	 * Prints the localized Premium benefits translations for JS.
	 */
	public function enqueue_translations() {
		wp_localize_script( WPSEO_Admin_Asset_Manager::PREFIX . 'admin-global-script', 'yoastPremiumBenefitsForSynonymsL10n', $this->get_translations_for_js() );
	}
}
