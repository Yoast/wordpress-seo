<?php
/**
 * Abstract presenter class for the Twitter image.
 *
 * @package Yoast\YoastSEO\Presenters
 */

namespace Yoast\WP\Free\Presenters;

use WPSEO_Options;
use WPSEO_Utils;
use Yoast\WP\Free\Models\Indexable;

/**
 * Class Abstract_Twitter_Image_Presenter
 */
abstract class Abstract_Twitter_Image_Presenter implements Presenter_Interface {

	/**
	 * Generates the Twitter image for an indexable.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return string The Twitter image.
	 */
	abstract public function generate( Indexable $indexable );

	/**
	 * Returns the Twitter image meta tag for a post.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return string The Twitter image meta tag.
	 */
	public function present( Indexable $indexable ) {
		$twitter_image = $this->generate( $indexable );
		$twitter_image = $this->format( $twitter_image );
		$twitter_image = $this->filter( $twitter_image );
		$twitter_image = \esc_url( $twitter_image );

		if ( is_string( $twitter_image ) && $twitter_image !== '' ) {
			/**
			 * Filter: 'wpseo_twitter_metatag_key' - Make the Twitter meta tag key filterable.
			 *
			 * @api string $key The Twitter meta tag key.
			 */
			$metatag_key = \apply_filters( 'wpseo_twitter_metatag_key', 'name' );

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
	 * Retrieves the site wide default image.
	 *
	 * @return string The image url or an empty string when not found.
	 */
	protected function retrieve_default_image() {
		if ( $this->opengraph_enabled() !== true ) {
			return '';
		}

		return (string) WPSEO_Options::get( 'og_default_image', '' );
	}

	/**
	 * Retrieves twitter_image from the indexable. If not available, defaults to og_image.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return string The image url or an empty string when not found.
	 */
	protected function retrieve_social_image( Indexable $indexable ) {
		if ( $indexable->twitter_image ) {
			return $indexable->twitter_image;
		}

		if ( $indexable->og_image && $this->opengraph_enabled() ) {
			return $indexable->og_image;
		}

		return '';
	}

	/**
	 * Checks if the opengraph feature is enabled.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return bool True when enabled.
	 */
	protected function opengraph_enabled() {
		return WPSEO_Options::get( 'opengraph' ) === true;
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
		if ( WPSEO_Utils::is_url_relative( $twitter_image ) === true && \strpos( $twitter_image, '/' ) === 0 ) {
			$parsed_url    = \wp_parse_url( \home_url() );
			$twitter_image = $parsed_url['scheme'] . '://' . $parsed_url['host'] . $twitter_image;
		}

		return $twitter_image;
	}
}
