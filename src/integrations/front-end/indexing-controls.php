<?php
/**
 * WPSEO plugin file.
 *
 * @package Yoast\WP\Free\Integrations\Front_End
 */

namespace Yoast\WP\Free\Integrations\Front_End;

use Yoast\WP\Free\Conditionals\Front_End_Conditional;
use Yoast\WP\Free\Helpers\Options_Helper;
use Yoast\WP\Free\Integrations\Integration_Interface;

/**
 * Class Indexing_Controls
 */
class Indexing_Controls implements Integration_Interface {

	/**
	 * @codeCoverageIgnore
	 * @inheritDoc
	 */
	public static function get_conditionals() {
		return [ Front_End_Conditional::class ];
	}

	/**
	 * @codeCoverageIgnore
	 * @inheritDoc
	 */
	public function register_hooks() {
		\add_action( 'template_redirect', [ $this, 'noindex_robots' ] );
		\add_filter( 'loginout', [ $this, 'nofollow_link' ] );
		\add_filter( 'register', [ $this, 'nofollow_link' ] );
	}

	/**
	 * Send a Robots HTTP header preventing URL from being indexed in the search results while allowing search engines
	 * to follow the links in the object at the URL.
	 *
	 * @since 1.1.7
	 *
	 * @return boolean Boolean indicating whether the noindex header was sent.
	 */
	public function noindex_robots() {
		if ( ! is_robots() ) {
			return false;
		}

		return $this->set_robots_header();
	}

	/**
	 * Adds rel="nofollow" to a link, only used for login / registration links.
	 *
	 * @param string $input The link element as a string.
	 *
	 * @return string
	 */
	public function nofollow_link( $input ) {
		return str_replace( '<a ', '<a rel="nofollow" ', $input );
	}

	/**
	 * Sets the x-robots-tag to noindex follow.
	 *
	 * @codeCoverageIgnore To difficult to test.
	 */
	protected function set_robots_header() {
		if ( headers_sent() === false ) {
			header( 'X-Robots-Tag: noindex, follow', true );

			return true;
		}

		return false;
	}
}
