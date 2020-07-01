<?php
/**
 * WPSEO plugin file.
 *
 * @package Yoast\WP\SEO\Integrations\Front_End
 */

namespace Yoast\WP\SEO\Integrations\Front_End;

use Yoast\WP\SEO\Conditionals\Front_End_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Wrappers\WP_Query_Wrapper;

/**
 * Class Indexing_Controls
 */
class Invalid_Pagination implements Integration_Interface {

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
	 * @param WP_Query_Wrapper $wp_query WP query wrapper.
	 */
	public function __construct( WP_Query_Wrapper $wp_query ) {
		$this->wp_query = $wp_query;
	}

	/**
	 * @inheritDoc
	 */
	public static function get_conditionals() {
		return [ Front_End_Conditional::class ];
	}

	/**
	 * Hooks our potential redirect.
	 */
	public function register_hooks() {
		add_action( 'template_redirect', [ $this, 'redirect_out_of_bounds' ] );
	}

	/**
	 *
	 */
	public function redirect_out_of_bounds() {
		global $wp_query, $wp_rewrite;
		if ( $wp_query->is_404 && $wp_query->query['paged'] > $wp_query->max_num_pages ) {
			$current_url = get_site_url() . $_SERVER['REQUEST_URI'];
			$format      = $wp_rewrite->using_permalinks() ? user_trailingslashit( $wp_rewrite->pagination_base . '/%#%', 'paged' ) : '?paged=%#%';
			$needle      = str_replace( '%#%', $wp_query->query['paged'], $format );
			$new_url     = user_trailingslashit( str_replace( $needle, '', $current_url ) );
			wp_safe_redirect( $new_url );
		}
	}
}
