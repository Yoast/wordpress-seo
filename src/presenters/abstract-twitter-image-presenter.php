<?php
/**
 * Abstract presenter class for the Twitter image.
 *
 * @package Yoast\YoastSEO\Presenters
 */

namespace Yoast\WP\Free\Presenters;

use Yoast\WP\Free\Models\Indexable;

/**
 * Class Abstract_Twitter_Image_Presenter
 */
abstract class Abstract_Twitter_Image_Presenter implements Presenter_Interface {

	/**
	 * Returns the meta description for a post.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return string The meta description tag.
	 */
	public function present( Indexable $indexable ) {
		$twitter_image = $this->generate( $indexable );
		$twitter_image = $this->format( $twitter_image );
		$twitter_image = $this->filter( $twitter_image );
		$twitter_image = \esc_url( $twitter_image );

		if ( is_string( $twitter_image ) && $twitter_image !== '' ) {
			/**
			 * Filter: 'wpseo_twitter_metatag_key' - Make the Twitter metatag key filterable.
			 *
			 * @api string $key The Twitter metatag key.
			 */
			$metatag_key = apply_filters( 'wpseo_twitter_metatag_key', 'name' );

			// Output meta.
			return sprintf(
				'<meta %1$s="twitter:image" content="%2$s" />',
				esc_attr( $metatag_key ),
				esc_attr( $twitter_image )
			);
		}

		return '';
	}

	/**
	 * Run the Twitter image value through the `wpseo_twitter_image` filter.
	 *
	 * @param string $twitter_image The Twitter image to filter.
	 *
	 * @return string The filtered Twitter image.
	 */
	private function filter( $twitter_image ) {
		/**
		 * Filter: 'wpseo_twitter_image' - Allow changing the Twitter Card image.
		 *
		 * @api string $img Image URL string.
		 */
		return (string) apply_filters( 'wpseo_twitter_image', $twitter_image );
	}

	/**
	 * Formats the Twitter images to make sure we have an absolute image url.
	 *
	 * @param string $twitter_image The Twitter image to format.
	 *
	 * @return string The formatted Twitter image.
	 */
	private function format( $twitter_image ) {
		if ( \WPSEO_Utils::is_url_relative( $twitter_image ) === true && strpos( $twitter_image, '/' ) === 0 ) {
			$parsed_url    = wp_parse_url( home_url() );
			$twitter_image = $parsed_url['scheme'] . '://' . $parsed_url['host'] . $twitter_image;
		}

		return $twitter_image;
	}

	/**
	 * Generates the Twitter image for an indexable.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return string The Twitter image.
	 */
	abstract protected function generate( Indexable $indexable );
}
