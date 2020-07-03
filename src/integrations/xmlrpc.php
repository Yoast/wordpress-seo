<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend
 */

namespace Yoast\WP\SEO\Integrations;

use Yoast\WP\SEO\Conditionals\XMLRPC_Conditional;

/**
 * Noindexes the xmlrpc.php file and all ways to request it.
 */
class XMLRPC implements Integration_Interface {

	/**
	 * @codeCoverageIgnore
	 * @inheritDoc
	 */
	public static function get_conditionals() {
		return [ XMLRPC_Conditional::class ];
	}

	/**
	 * Initializes the integration.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'xmlrpc_methods', [ $this, 'robots_header' ] );
	}

	/**
	 * Sets a noindex, follow x-robots-tag header on all XMLRPC requests.
	 *
	 * @codeCoverageIgnore Basically impossible to test from the command line.
	 *
	 * @return void
	 */
	public function robots_header() {
		if ( \headers_sent() === false ) {
			\header( 'X-Robots-Tag: noindex, follow', true );
		}
	}
}

