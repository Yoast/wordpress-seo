<?php

namespace Yoast\WP\SEO\Actions\Indexables;

use Yoast\WP\SEO\Surfaces\Meta_Surface;

/**
 * Get head action for indexables.
 */
class Indexable_Head_Action {

	/**
	 * Caches the output.
	 *
	 * @var mixed
	 */
	protected $cache;

	/**
	 * The meta surface.
	 *
	 * @var Meta_Surface
	 */
	private $meta_surface;

	/**
	 * Indexable_Head_Action constructor.
	 *
	 * @param Meta_Surface $meta_surface The meta surface.
	 */
	public function __construct( Meta_Surface $meta_surface ) {
		$this->meta_surface = $meta_surface;
	}

	/**
	 * Retrieves the head for a url.
	 *
	 * @param string $url The url to get the head for.
	 *
	 * @return object Object with head and status properties.
	 */
	public function for_url( $url ) {
		return $this->with_cache( 'url', $url );
	}

	/**
	 * Retrieves the head for a post.
	 *
	 * @param int $id The id.
	 *
	 * @return object Object with head and status properties.
	 */
	public function for_post( $id ) {
		return $this->with_cache( 'post', $id );
	}

	/**
	 * Retrieves the head for a term.
	 *
	 * @param int $id The id.
	 *
	 * @return object Object with head and status properties.
	 */
	public function for_term( $id ) {
		return $this->with_cache( 'term', $id );
	}

	/**
	 * Retrieves the head for an author.
	 *
	 * @param int $id The id.
	 *
	 * @return object Object with head and status properties.
	 */
	public function for_author( $id ) {
		return $this->with_cache( 'author', $id );
	}

	/**
	 * Retrieves the head for a post type archive.
	 *
	 * @param int $type The id.
	 *
	 * @return object Object with head and status properties.
	 */
	public function for_post_type_archive( $type ) {
		return $this->with_cache( 'post_type_archive', $type );
	}

	/**
	 * Retrieves the head for the posts page.
	 *
	 * @return object Object with head and status properties.
	 */
	public function for_posts_page() {
		return $this->with_cache( 'posts_page' );
	}

	/**
	 * Retrieves the head for the 404 page. Always sets the status to 404.
	 *
	 * @return object Object with head and status properties.
	 */
	public function for_404() {
		return $this->with_cache( '404' );
	}

	/**
	 * Retrieves the head for a successful page load.
	 *
	 * @param \stdObject $head The calculated Yoast head.
	 *
	 * @return object
	 */
	protected function for_200( $head ) {
		return (object) [
			'head_html' => $head->head_html,
			'head_json' => $head->head_json,
			'status'    => 200,
		];
	}

	/**
	 * Retrieves a value from the meta surface cached.
	 *
	 * @param string $type     The type of value to retrieve.
	 * @param string $argument Optional. The argument for the value.
	 *
	 * @return array
	 */
	protected function with_cache( $type, $argument = '' ) {
		if ( ! isset( $this->cache[ $type ][ $argument ] ) ) {
			$meta = \call_user_func( [ $this->meta_surface, "for_$type" ], $argument );
			if ( $meta === false ) {
				$value = $this->for_404();
			}
			else {
				$value = $this->for_200( $meta->get_head() );
			}

			$this->cache[ $type ][ $argument ] = $value;
		}

		return $this->cache[ $type ][ $argument ];
	}
}
