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
		$robots = \implode( ',', $presentation->robots );
		$robots = $this->filter( $robots, $presentation );

		if ( is_string( $robots ) && $robots !== '' ) {
			return sprintf( '<meta name="robots" content="%s"/>', esc_attr( $robots ) );
		}

		return '';
	}

	/**
	 * Run the robots output content through the `wpseo_robots` filter.
	 *
	 * @param string                 $robots       The meta robots output to filter.
	 * @param Indexable_Presentation $presentation The indexable presentation.
	 *
	 * @return string The filtered meta robots output.
	 */
	private function filter( $robots, Indexable_Presentation $presentation ) {
		/**
		 * Filter: 'wpseo_robots' - Allows filtering of the meta robots output of Yoast SEO.
		 *
		 * @api   string                 $robots       The meta robots directives to be echoed.
		 * @param Indexable_Presentation $presentation The presentation of an indexable.
		 */
		return (string) apply_filters( 'wpseo_robots', $robots, $presentation );
	}
}
