<?php
/**
 * Presenter of the Twitter image for a term archive.
 *
 * @package Yoast\YoastSEO\Presenters
 */

namespace Yoast\WP\Free\Presenters\Term_Archive;

use Yoast\WP\Free\Models\Indexable;
use Yoast\WP\Free\Presenters\Abstract_Twitter_Image_Presenter;

/**
 * Class Twitter_Image_Presenter
 */
class Twitter_Image_Presenter extends Abstract_Twitter_Image_Presenter {

	/**
	 * Generates the Twitter image url for an indexable.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return string The Twitter image url.
	 */
	public function generate( Indexable $indexable ) {
		$image_url = $this->retrieve_social_image( $indexable );
		if ( $image_url ) {
			return $image_url;
		}

		$image_url = $this->retrieve_filter_image();
		if ( $image_url ) {
			return $image_url;
		}

		// When image is empty just retrieve the sidewide default.
		return $this->retrieve_default_image();
	}

	/**
	 * Retrieve the image that possibly is set by a filter.
	 *
	 * @return string The image url or an empty string when not found.
	 */
	protected function retrieve_filter_image() {
		/**
		 * Filter: wpseo_twitter_taxonomy_image - Allow developers to set a custom Twitter image for taxonomies.
		 *
		 * @api bool|string $unsigned Return string to supply image to use, false to use no image.
		 */
		$image = \apply_filters( 'wpseo_twitter_taxonomy_image', false );
		if ( is_string( $image ) && $image !== '' ) {
			return $image;
		}

		return '';
	}
}
