<?php
/**
 * A helper object for the canonical meta tag.
 *
 * @package Yoast\WP\Free\Helpers
 */

namespace Yoast\WP\Free\Helpers;

/**
 * Class Canonical_Helper
 */
class Canonical_Helper {

	/**
	 * @var Url_Helper
	 */
	protected $url;

	/**
	 * Sets the required helpers.
	 *
	 * @required
	 * @codeCoverageIgnore
	 *
	 * @param Url_Helper $url The url helper.
	 */
	public function set_helpers( Url_Helper $url ) {
		$this->url = $url;
	}

	/**
	 * Applies global settings and does clean-up for the robots settings for all types of pages.
	 *
	 * @param string $canonical The robots settings.
	 *
	 * @return string The page's canonical.
	 */
	public function after_generate( $canonical ) {
		if ( is_string( $canonical ) && $canonical !== '' ) {
			// Force canonical links to be absolute, relative is NOT an option.
			if ( $this->url->is_relative( $canonical ) === true ) {
				return $this->url->build_absolute_url( $canonical );
			}
		}

		return $canonical;
	}
}
