<?php
namespace Yoast\WP\Free\Tests\Doubles\Presenters;

use Yoast\WP\Free\Models\Indexable;
use Yoast\WP\Free\Presenters\Abstract_Twitter_Image_Presenter;

/**
 * Test Helper Class.
 */
class Abstract_Twitter_Image_Presenter_Double extends Abstract_Twitter_Image_Presenter {

	/**
	 * Generates the Twitter image for an indexable.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return string The Twitter image.
	 */
	public function generate( Indexable $indexable ) {
		// Do nothing.
		return '';
	}

	/**
	 * Retrieves the site wide default image/
	 *
	 * @return string The image url or an empty string when not found.
	 */
	public function retrieve_default_image() {
		return parent::retrieve_default_image();
	}

	/**
	 * Retrieves twitter_image from the indexable. If not available, defaults to og_image.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return string The image url or an empty string when not found.
	 */
	public function retrieve_social_image( Indexable $indexable ) {
		return parent::retrieve_social_image( $indexable );
	}
}
