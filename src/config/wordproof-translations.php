<?php

namespace Yoast\WP\SEO\Config;

use YoastSEO_Vendor\WordProof\SDK\Translations\TranslationsInterface;

/**
 * Class WordProof_Translations
 *
 * @package Yoast\WP\SEO\Config
 */
class Wordproof_Translations implements TranslationsInterface {

	/**
	 * Returns no balance notice translation.
	 *
	 * @return string The translation.
	 */
	public function getNoBalanceNotice() {
		/* translators: %s expands to WordProof. */
		return \sprintf( \__( 'You are out of timestamps. Please upgrade your account by opening the %s settings.', 'wordpress-seo' ), 'WordProof' );
	}

	/**
	 * Returns no balance notice translation.
	 *
	 * @return string The translation.
	 */
	public function getTimestampSuccessNotice() {
		/* translators: %s expands to WordProof. */
		return \sprintf( \__( '%s has successfully timestamped this page.', 'wordpress-seo' ), 'WordProof' );
	}

	/**
	 * Returns timestamp failed notice translation.
	 *
	 * @return string The translation.
	 */
	public function getTimestampFailedNotice() {
		/* translators: %s expands to WordProof. */
		return \sprintf( \__( '%1$s failed to timestamp this page. Please check if you\'re correctly authenticated with %1$s and try to save this page again.', 'wordpress-seo' ), 'WordProof' );
	}

	/**
	 * Returns webhook failed notice translation.
	 *
	 * @return string The translation.
	 */
	public function getWebhookFailedNotice() {
		/* translators: %s expands to WordProof. */
		return \sprintf( \__( 'The timestamp is not retrieved by your site. Please try again or contact %1$s support.', 'wordpress-seo' ), 'WordProof' );
	}

	/**
	 * Returns no authentication notice translation.
	 *
	 * @return string The translation.
	 */
	public function getNotAuthenticatedNotice() {
		/* translators: %s expands to WordProof. */
		return \sprintf( \__( 'The timestamp is not created because you need to authenticate with %s first.', 'wordpress-seo' ), 'WordProof' );
	}

	/**
	 * Returns authenticate button text.
	 *
	 * @return string The translation.
	 */
	public function getOpenAuthenticationButtonText() {
		return \__( 'Open authentication', 'wordpress-seo' );
	}

	/**
	 * Returns open settings button translation.
	 *
	 * @return string The translation.
	 */
	public function getOpenSettingsButtonText() {
		return \__( 'Open settings', 'wordpress-seo' );
	}
}
