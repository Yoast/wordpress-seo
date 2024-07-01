<?php

namespace Yoast\WP\SEO\Config;

/**
 * Class WordProof_Translations
 *
 * @deprecated 22.10
 * @codeCoverageIgnore
 *
 * @package Yoast\WP\SEO\Config
 */
class Wordproof_Translations {

	/**
	 * Returns no balance notice translation.
	 *
	 * @deprecated 22.10
	 * @codeCoverageIgnore
	 *
	 * @return string The translation.
	 */
	public function getNoBalanceNotice() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 22.10' );

		/* translators: %s expands to WordProof. */
		return \sprintf( \__( 'You are out of timestamps. Please upgrade your account by opening the %s settings.', 'wordpress-seo' ), 'WordProof' );
	}

	/**
	 * Returns no balance notice translation.
	 *
	 * @deprecated 22.10
	 * @codeCoverageIgnore
	 *
	 * @return string The translation.
	 */
	public function getTimestampSuccessNotice() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 22.10' );

		/* translators: %s expands to WordProof. */
		return \sprintf( \__( '%s has successfully timestamped this page.', 'wordpress-seo' ), 'WordProof' );
	}

	/**
	 * Returns timestamp failed notice translation.
	 *
	 * @deprecated 22.10
	 * @codeCoverageIgnore
	 *
	 * @return string The translation.
	 */
	public function getTimestampFailedNotice() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 22.10' );

		/* translators: %s expands to WordProof. */
		return \sprintf( \__( '%1$s failed to timestamp this page. Please check if you\'re correctly authenticated with %1$s and try to save this page again.', 'wordpress-seo' ), 'WordProof' );
	}

	/**
	 * Returns webhook failed notice translation.
	 *
	 * @deprecated 22.10
	 * @codeCoverageIgnore
	 *
	 * @return string The translation.
	 */
	public function getWebhookFailedNotice() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 22.10' );

		/* translators: %s expands to WordProof. */
		return \sprintf( \__( 'The timestamp is not retrieved by your site. Please try again or contact %1$s support.', 'wordpress-seo' ), 'WordProof' );
	}

	/**
	 * Returns no authentication notice translation.
	 *
	 * @deprecated 22.10
	 * @codeCoverageIgnore
	 *
	 * @return string The translation.
	 */
	public function getNotAuthenticatedNotice() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 22.10' );

		/* translators: %s expands to WordProof. */
		return \sprintf( \__( 'The timestamp is not created because you need to authenticate with %s first.', 'wordpress-seo' ), 'WordProof' );
	}

	/**
	 * Returns authenticate button text.
	 *
	 * @deprecated 22.10
	 * @codeCoverageIgnore
	 *
	 * @return string The translation.
	 */
	public function getOpenAuthenticationButtonText() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 22.10' );

		return \__( 'Open authentication', 'wordpress-seo' );
	}

	/**
	 * Returns open settings button translation.
	 *
	 * @deprecated 22.10
	 * @codeCoverageIgnore
	 *
	 * @return string The translation.
	 */
	public function getOpenSettingsButtonText() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 22.10' );

		return \__( 'Open settings', 'wordpress-seo' );
	}

	/**
	 * Returns get contact WordProof Support button translation.
	 *
	 * @deprecated 22.10
	 * @codeCoverageIgnore
	 *
	 * @return string The translation.
	 */
	public function getContactWordProofSupportButtonText() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 22.10' );

		return \__( 'Contact WordProof support', 'wordpress-seo' );
	}
}
