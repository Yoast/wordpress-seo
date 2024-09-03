<?php

namespace Yoast\WP\SEO\Config;

/**
 * Class WordProof_App_Config.
 *
 * @deprecated 22.10
 * @codeCoverageIgnore
 *
 * @package Yoast\WP\SEO\Config
 */
class Wordproof_App_Config {

	/**
	 * Returns the partner.
	 *
	 * @deprecated 22.10
	 * @codeCoverageIgnore
	 *
	 * @return string The partner.
	 */
	public function getPartner() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 22.10' );

		return 'yoast';
	}

	/**
	 * Returns if the WordProof Uikit should be loaded from a cdn.
	 *
	 * @deprecated 22.10
	 * @codeCoverageIgnore
	 *
	 * @return bool True or false.
	 */
	public function getLoadUikitFromCdn() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 22.10' );

		return false;
	}
}
