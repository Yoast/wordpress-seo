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
		$robots = \implode( ',', $this->get() );
		$robots = $this->filter( $robots, $this->presentation );

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
		$robots = \array_filter( $this->presentation->robots );
		return $this->remove_defaults( $robots );
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

	/**
	 * If robots index and follow are set, they can be excluded because they are default values.
	 *
	 * @param array $robots The robots to remove defaults from.
	 *
	 * @return array The robots with the removed defaults.
	 */
	private function remove_defaults( array $robots ) {
		if ( ! empty( $robots['index'] ) && $robots['index'] === 'index'
			&& ! empty( $robots['follow'] ) && $robots['follow'] === 'follow'
		) {
			unset( $robots['index'], $robots['follow'] );
		}

		return $robots;
	}
}
