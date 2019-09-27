<?php
namespace Yoast\WP\Free\Tests\Doubles\Presenters;

use Yoast\WP\Free\Models\Indexable;
use Yoast\WP\Free\Presenters\Abstract_Meta_Description_Presenter;
use Yoast\WP\Free\Presenters\Abstract_Twitter_Description_Presenter;

/**
 * Test Helper Class.
 */
abstract class Abstract_Twitter_Description_Presenter_Double extends Abstract_Twitter_Description_Presenter {

	/**
	 * Sets the meta description presenter for fallback purposes.
	 *
	 * @param Abstract_Meta_Description_Presenter $meta_description_presenter
	 */
	public function __construct( Abstract_Meta_Description_Presenter $meta_description_presenter ) {
		$this->meta_description_presenter = $meta_description_presenter;
	}

	/**
	 * Retrieves the meta description.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return string The meta description.
	 */
	public function get_meta_description( Indexable $indexable ) {
		return parent::get_meta_description( $indexable );
	}
}
