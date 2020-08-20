<?php
/**
 * Abstract presenter class for the googlebot output.
 *
 * @package Yoast\YoastSEO\Presenters
 */

namespace Yoast\WP\SEO\Presenters;

use Yoast\WP\SEO\Presentations\Indexable_Presentation;

_deprecated_file( basename( __FILE__ ), 'WPSEO 14.9' );

/**
 * Class Googlebot_Presenter
 */
class Googlebot_Presenter extends Abstract_Indexable_Presenter {

	/**
	 * Returns the googlebot output.
	 *
	 * @deprecated 14.9 Values merged into the robots meta tag.
	 *
	 * @return string The googlebot output tag.
	 */
	public function present() {
		_deprecated_function( __METHOD__, 'WPSEO 14.9' );

		$googlebot = \implode( ', ', $this->get() );
		$googlebot = $this->filter( $googlebot );

		if ( \is_string( $googlebot ) && $googlebot !== '' ) {
			return \sprintf( '<meta name="googlebot" content="%s" />', \esc_attr( $googlebot ) );
		}

		return '';
	}

	/**
	 * Gets the raw value of a presentation.
	 *
	 * @deprecated 14.9 Values merged into the robots meta tag.
	 *
	 * @return array The raw value.
	 */
	public function get() {
		_deprecated_function( __METHOD__, 'WPSEO 14.9' );

		return $this->presentation->googlebot;
	}

	/**
	 * Run the googlebot output content through the `wpseo_googlebot` filter.
	 *
	 * @param string $googlebot The meta googlebot output to filter.
	 *
	 * @return string The filtered meta googlebot output.
	 */
	private function filter( $googlebot ) {
		/**
		 * Filter: 'wpseo_googlebot' - Allows filtering of the meta googlebot output of Yoast SEO.
		 *
		 * @api string $googlebot The meta googlebot directives to be echoed.
		 *
		 * @param Indexable_Presentation $presentation The presentation of an indexable.
		 */
		return (string) \apply_filters( 'wpseo_googlebot', $googlebot, $this->presentation );
	}
}
