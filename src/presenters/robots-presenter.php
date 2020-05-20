<?php
/**
 * Abstract presenter class for the robots output.
 *
 * @package Yoast\YoastSEO\Presenters
 */

namespace Yoast\WP\SEO\Presenters;

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
}
