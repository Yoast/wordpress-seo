<?php
/**
 * Abstract presenter class for the robots output.
 *
 * @package Yoast\YoastSEO\Presenters
 */

namespace Yoast\WP\Free\Presenters;

use Yoast\WP\Free\Presentations\Indexable_Presentation;

/**
 * Class Robots_Presenter
 */
class Robots_Presenter extends Abstract_Indexable_Presenter {

	/**
	 * Returns the robots output.
	 *
	 * @param Indexable_Presentation $presentation The indexable presentation.
	 *
	 * @return string The robots output tag.
	 */
	public function present( Indexable_Presentation $presentation ) {
		$robots = $this->filter( \implode( ',', $presentation->robots ) );

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
}
