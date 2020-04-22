<?php
/**
 * Abstract presenter class for the robots output.
 *
 * @package Yoast\YoastSEO\Presenters
 */

namespace Yoast\WP\SEO\Presenters;

use Yoast\WP\SEO\Presentations\Indexable_Presentation;

/**
 * Class Robots_Presenter
 */
class Robots_Presenter extends Abstract_Indexable_Presenter {

	/**
	 * Returns the robots output.
	 *
	 * @return string The robots output tag.
	 */
	public function present() {
		$robots = \implode( ', ', $this->get() );
		$robots = $this->filter( $robots );

		if ( \is_string( $robots ) && $robots !== '' ) {
			return \sprintf( '<meta name="robots" content="%s" />', \esc_attr( $robots ) );
		}

		return '';
	}

	/**
	 * Gets the raw value of a presentation.
	 *
	 * @return array The raw value.
	 */
	public function get() {
		return $this->presentation->robots;
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
		 *
		 * @param Indexable_Presentation $presentation The presentation of an indexable.
		 */
		return (string) \apply_filters( 'wpseo_robots', $robots, $this->presentation );
	}
}
