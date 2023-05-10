<?php
/**
 * Yoast I18n module.
 *
 * @package Yoast\I18n-module
 */

/**
 * This class defines a promo box and checks your translation site's API for stats about it,
 * then shows them to the user.
 *
 * @deprecated 19.12
 * @codeCoverageIgnore
 * @phpcs:disable PEAR.NamingConventions.ValidClassName.Invalid
 */
class Yoast_I18n_v3 {

	/**
	 * Class constructor.
	 *
	 * @deprecated 19.12
	 * @codeCoverageIgnore
	 *
	 * @param array $args                 Contains the settings for the class.
	 * @param bool  $show_translation_box Whether the translation box should be shown.
	 */
	public function __construct( $args, $show_translation_box = true ) {
		_deprecated_function( __METHOD__, 'Yoast SEO 19.12' );
	}

	/**
	 * Returns whether the language is en_US.
	 *
	 * @deprecated 19.12
	 * @codeCoverageIgnore
	 *
	 * @param string $language The language to check.
	 *
	 * @return bool Returns true if the language is en_US.
	 */
	protected function is_default_language( $language ) {
		_deprecated_function( __METHOD__, 'Yoast SEO 19.12' );
		return true;
	}

	/**
	 * Returns the i18n_promo message from the i18n_module. Returns en empty string if the promo shouldn't be shown.
	 *
	 * @deprecated 19.12
	 * @codeCoverageIgnore
	 *
	 * @return string The i18n promo message.
	 */
	public function get_promo_message() {
		_deprecated_function( __METHOD__, 'Yoast SEO 19.12' );
		return '';
	}

	/**
	 * Returns a button that can be used to dismiss the i18n-message.
	 *
	 * @deprecated 19.12
	 * @codeCoverageIgnore
	 *
	 * @return string
	 */
	public function get_dismiss_i18n_message_button() {
		_deprecated_function( __METHOD__, 'Yoast SEO 19.12' );
		return '';
	}

	/**
	 * Outputs a promo box.
	 *
	 * @deprecated 19.12
	 * @codeCoverageIgnore
	 */
	public function promo() {
		_deprecated_function( __METHOD__, 'Yoast SEO 19.12' );
	}

	/**
	 * The API URL to use when requesting translation information.
	 *
	 * @deprecated 19.12
	 * @codeCoverageIgnore
	 *
	 * @param string $api_url The new API URL.
	 */
	public function set_api_url( $api_url ) {
		_deprecated_function( __METHOD__, 'Yoast SEO 19.12' );
	}
}
