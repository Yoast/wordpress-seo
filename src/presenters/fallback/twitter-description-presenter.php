<?php
/**
 * Fallback presenter of the Twitter description.
 *
 * @package Yoast\YoastSEO\Presenters
 */

namespace Yoast\WP\Free\Presenters\Fallback;

use Yoast\WP\Free\Models\Indexable;;
use Yoast\WP\Free\Presenters\Abstract_Twitter_Description_Presenter;

/**
 * Class Meta_Description_Presenter
 */
class Twitter_Description_Presenter extends Abstract_Twitter_Description_Presenter {

	/**
	 * Sets the meta description presenter for fallback purposes.
	 *
	 * @param Meta_Description_Presenter $meta_description_presenter
	 */
	public function __construct( Meta_Description_Presenter $meta_description_presenter ) {
		$this->meta_description_presenter = $meta_description_presenter;
	}

	/**
	 * Generates the Twitter description for an indexable.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return string The meta description.
	 */
	public function generate( Indexable $indexable ) {
		return $this->meta_description_presenter->generate( $indexable );
	}
}
