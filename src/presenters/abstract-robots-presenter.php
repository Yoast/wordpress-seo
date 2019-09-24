<?php
/**
 * Abstract presenter class for the robots output.
 *
 * @package Yoast\YoastSEO\Presenters
 */

namespace Yoast\WP\Free\Presenters;

use Yoast\WP\Free\Models\Indexable;

/**
 * Class Abstract_Meta_Robots_Presenter
 */
abstract class Abstract_Robots_Presenter implements Presenter_Interface {

	/**
	 * Returns the robots output.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return string The robots output tag.
	 */
	public function present( Indexable $indexable ) {
		$robots = $this->filter( $this->generate( $indexable ) );

		if ( is_string( $robots ) && $robots !== '' ) {
			return sprintf( '<meta name="robots" content="%s"/>', esc_attr( $robots ) );
		}

		return '';
	}

	/**
	 * Run the robots output content through the `wpseo_robots` filter.
	 *
	 * @param string $robots The meta robots output to filter.
	 *
	 * @return string The filtered meta robots output.
	 */
	private function filter( $robots ) {
		/**
		 * Filter: 'wpseo_robots' - Allows filtering of the meta robots output of Yoast SEO.
		 *
		 * @api string $robots The meta robots directives to be echoed.
		 */
		return (string) apply_filters( 'wpseo_robots', $robots );
	}

	/**
	 * Generates the robots output for an indexable.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return string The robots output.
	 */
	protected abstract function generate( Indexable $indexable );
}
