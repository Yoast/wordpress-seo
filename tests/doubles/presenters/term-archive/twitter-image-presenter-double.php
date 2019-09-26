<?php

namespace Yoast\WP\Free\Tests\Doubles\Presenters\Term_Archive;

use Yoast\WP\Free\Presenters\Term_Archive\Twitter_Image_Presenter;

/**
 * Test Helper Class.
 */
class Twitter_Image_Presenter_Double extends Twitter_Image_Presenter {

	/**
	 * Retrieve the image that possibly is set by a filter.
	 *
	 * @return string The image url or an empty string when not found.
	 */
	public function retrieve_filter_image() {
		return parent::retrieve_filter_image();
	}
}
