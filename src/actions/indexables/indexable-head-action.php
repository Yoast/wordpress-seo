<?php
/**
 * Get ehad action for indexables.
 *
 * @package Yoast\WP\SEO\Actions\Indexables
 */

namespace Yoast\WP\SEO\Actions\Indexables;

use Yoast\WP\SEO\Surfaces\Meta_Surface;

/**
 * Indexable_Head_Action class
 */
class Indexable_Head_Action {

	/**
	 * The meta surface.
	 *
	 * @var Meta_Surface
	 */
	private $meta_surface;

	/**
	 * Indexable_Indexation_Route constructor.
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
	 * @return object Object with head and found properties.
	 */
	public function for_url( $url ) {
		$meta = $this->meta_surface->for_url( $url );

		if ( $meta === false ) {
			$meta = $this->meta_surface->for_404();
			return (object) [ 'head' => $meta->get_head(), 'status' => 404 ];
		}

		return (object) [ 'head' => $meta->get_head(), 'status' => 200 ];
	}
}
