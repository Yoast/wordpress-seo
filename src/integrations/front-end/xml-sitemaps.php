<?php
/**
 * WPSEO plugin file.
 *
 * @package Yoast\WP\SEO\Integrations\Front_End
 */

namespace Yoast\WP\SEO\Integrations\Front_End;

use Yoast\WP\SEO\Conditionals\Front_End_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Wrappers\WP_Query_Wrapper;

/**
 * Class XML_Sitemaps
 */
class XML_Sitemaps implements Integration_Interface {

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options;

	/**
	 * The WP Query wrapper.
	 *
	 * @var WP_Query_Wrapper
	 */
	private $wp_query;

	/**
	 * Sets the helpers.
	 *
	 * @codeCoverageIgnore It just handles dependencies.
	 *
	 * @param Options_Helper   $options  Options helper.
	 * @param WP_Query_Wrapper $wp_query WP query wrapper.
	 */
	public function __construct( Options_Helper $options, WP_Query_Wrapper $wp_query ) {
		$this->options  = $options;
		$this->wp_query = $wp_query;
	}

	/**
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
		global $wp;

		$wp->add_query_var( 'sitemap' );
		$wp->add_query_var( 'sitemap_n' );
		$wp->add_query_var( 'yoast-sitemap-xsl' );

		add_rewrite_rule( 'sitemap_index\.xml$', 'index.php?sitemap=1', 'top' );
		add_rewrite_rule( '([^/]+?)-sitemap([0-9]+)?\.xml$', 'index.php?sitemap=$matches[1]&sitemap_n=$matches[2]', 'top' );
		add_rewrite_rule( '([a-z]+)?-?sitemap\.xsl$', 'index.php?yoast-sitemap-xsl=$matches[1]', 'top' );
	}
}
