<?php

namespace Yoast\WP\SEO\Actions\Indexables;

use Yoast\WP\SEO\Surfaces\Meta_Surface;

/**
 * Get head action for indexables.
 */
class Indexable_Head_Action {

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
		$meta = $this->meta_surface->for_url( $url );

		if ( $meta === false ) {
			return $this->for_404();
		}

		return (object) [
			'head'   => $meta->get_head(),
			'status' => 200,
		];
	}

	/**
	 * Retrieves the head for a post.
	 *
	 * @param int $id The id.
	 *
	 * @return object Object with head and status properties.
	 */
	public function for_post( $id ) {
		$meta = $this->meta_surface->for_post( $id );

		if ( $meta === false ) {
			return $this->for_404();
		}

		return (object) [
			'head'   => $meta->get_head(),
			'status' => 200,
		];
	}

	/**
	 * Retrieves the head for a term.
	 *
	 * @param int $id The id.
	 *
	 * @return object Object with head and status properties.
	 */
	public function for_term( $id ) {
		$meta = $this->meta_surface->for_term( $id );

		if ( $meta === false ) {
			return $this->for_404();
		}

		return (object) [
			'head'   => $meta->get_head(),
			'status' => 200,
		];
	}

	/**
	 * Retrieves the head for an author.
	 *
	 * @param int $id The id.
	 *
	 * @return object Object with head and status properties.
	 */
	public function for_author( $id ) {
		$meta = $this->meta_surface->for_author( $id );

		if ( $meta === false ) {
			return $this->for_404();
		}

		return (object) [
			'head'   => $meta->get_head(),
			'status' => 200,
		];
	}

	/**
	 * Retrieves the head for a post type archive.
	 *
	 * @param int $type The id.
	 *
	 * @return object Object with head and status properties.
	 */
	public function for_post_type_archive( $type ) {
		$meta = $this->meta_surface->for_post_type_archive( $type );

		if ( $meta === false ) {
			return $this->for_404();
		}

		return (object) [
			'head'   => $meta->get_head(),
			'status' => 200,
		];
	}

	/**
	 * Retrieves the head for the posts page.
	 *
	 * @return object Object with head and status properties.
	 */
	public function for_posts_page() {
		$meta = $this->meta_surface->for_posts_page();

		if ( $meta === false ) {
			return $this->for_404();
		}

		return (object) [
			'head'   => $meta->get_head(),
			'status' => 200,
		];
	}

	/**
	 * Retrieves the head for the 404 page. Always sets the status to 404.
	 *
	 * @return object Object with head and status properties.
	 */
	public function for_404() {
		$meta = $this->meta_surface->for_404();
		return (object) [
			'head'   => $meta->get_head(),
			'status' => 404,
		];
	}
}
