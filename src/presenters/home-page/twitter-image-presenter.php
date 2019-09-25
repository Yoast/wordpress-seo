<?php
/**
 * Presenter of the Twitter image for the homepage.
 *
 * @package Yoast\YoastSEO\Presenters
 */

namespace Yoast\WP\Free\Presenters\Home_Page;

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

		// When image is empty just retrieve the sidewide default.
		if ( ! $image_url ) {
			$image_url = $this->retrieve_default_image();
		}

		return $image_url;
	}
}
