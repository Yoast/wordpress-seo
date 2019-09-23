<?php
/**
 * Presenter of the meta description for post type singles.
 *
 * @package Yoast\YoastSEO\Presenters
 */

namespace Yoast\WP\Free\Presenters\Post_Type;

use Yoast\WP\Free\Models\Indexable;
use Yoast\WP\Free\Presenters\Abstract_Canonical_Presenter;

class Canonical_Presenter extends Abstract_Canonical_Presenter {
	/**
	 * Gets or generates the canonical URL for an indexable.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return string The canonical URL.
	 */
	protected function generate( Indexable $indexable ) {
		$canonical = $indexable->canonical;

		if ( ! $canonical ) {
			$post      = \get_post( \get_queried_object_id() );
			$canonical = \get_permalink( $post->ID );

			// Fix paginated pages canonical, but only if the page is truly paginated.
			if ( \get_query_var( 'page' ) > 1 ) {
				$canonical = $this->add_pagination( $canonical, $post );
			}
		}

		return $canonical;
	}

	/**
	 * Makes sure that if the current page is paginated, we add the current page to the canonical URL.
	 *
	 * @param string   $canonical The canonical URL.
	 * @param \WP_Post $post      The post object.
	 *
	 * @return string The canonical URL.
	 */
	private function add_pagination( $canonical, $post ) {
		$num_pages = ( substr_count( $post->post_content, '<!--nextpage-->' ) + 1 );
		if ( $num_pages && \get_query_var( 'page' ) <= $num_pages ) {
			if ( ! $GLOBALS['wp_rewrite']->using_permalinks() ) {
				return \add_query_arg( 'page', \get_query_var( 'page' ), $canonical );
			}

			return \user_trailingslashit( \trailingslashit( $canonical ) . \get_query_var( 'page' ) );
		}

		return $canonical;
	}
}
