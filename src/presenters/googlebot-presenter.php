<?php
/**
 * Abstract presenter class for the googlebot output.
 *
 * @package Yoast\YoastSEO\Presenters
 */

namespace Yoast\WP\Free\Presenters;

use Yoast\WP\Free\Presentations\Indexable_Presentation;

/**
 * Class Googlebot_Presenter
 */
class Googlebot_Presenter extends Abstract_Indexable_Presenter {

	/**
	 * Returns the googlebot output.
	 *
	 * @param Indexable_Presentation $presentation The indexable presentation.
	 *
	 * @return string The googlebot output tag.
	 */
	public function present( Indexable_Presentation $presentation ) {
		$googlebot = \implode( ', ', $presentation->googlebot );
		$googlebot = $this->filter( $googlebot, $presentation );

		if ( \is_string( $googlebot ) && $googlebot !== '' ) {
			return \sprintf( '<meta name="googlebot" content="%s"/>', \esc_attr( $googlebot ) );
		}

		return '';
	}

	/**
	 * Run the googlebot output content through the `wpseo_googlebot` filter.
	 *
	 * @param string                 $googlebot    The meta googlebot output to filter.
	 * @param Indexable_Presentation $presentation The presentation of an indexable.
	 *
	 * @return string The filtered meta googlebot output.
	 */
	private function filter( $googlebot, Indexable_Presentation $presentation ) {
		/**
		 * Filter: 'wpseo_googlebot' - Allows filtering of the meta googlebot output of Yoast SEO.
		 *
		 * @api string $googlebot The meta googlebot directives to be echoed.
		 *
		 * @param Indexable_Presentation $presentation The presentation of an indexable.
		 */
		return (string) \apply_filters( 'wpseo_googlebot', $googlebot, $presentation );
	}
}
