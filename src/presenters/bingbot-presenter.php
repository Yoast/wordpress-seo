<?php
/**
 * Abstract presenter class for the bingbot output.
 *
 * @package Yoast\YoastSEO\Presenters
 */

namespace Yoast\WP\SEO\Presenters;

use Yoast\WP\SEO\Presentations\Indexable_Presentation;

/**
 * Class Bingbot_Presenter
 */
class Bingbot_Presenter extends Abstract_Indexable_Presenter {

	/**
	 * Returns the bingbot output.
	 *
	 * @return string The bingbot output tag.
	 */
	public function present() {
		$bingbot = \implode( ', ', $this->get() );
		$bingbot = $this->filter( $bingbot );

		if ( \is_string( $bingbot ) && $bingbot !== '' ) {
			return \sprintf( '<meta name="bingbot" content="%s" />', \esc_attr( $bingbot ) );
		}

		return '';
	}

	/**
	 * Gets the raw value of a presentation.
	 *
	 * @return array The raw value.
	 */
	public function get() {
		return $this->presentation->bingbot;
	}

	/**
	 * Run the bingbot output content through the `wpseo_bingbot` filter.
	 *
	 * @param string $bingbot The meta bingbot output to filter.
	 *
	 * @return string The filtered meta bingbot output.
	 */
	private function filter( $bingbot ) {
		/**
		 * Filter: 'wpseo_bingbot' - Allows filtering of the meta bingbot output of Yoast SEO.
		 *
		 * @api string $bingbot The meta bingbot directives to be echoed.
		 *
		 * @param Indexable_Presentation $presentation The presentation of an indexable.
		 */
		return (string) \apply_filters( 'wpseo_bingbot', $bingbot, $this->presentation );
	}
}
