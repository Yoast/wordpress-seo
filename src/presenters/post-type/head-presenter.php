<?php
/**
 * Presenter of the head.
 *
 * @package Yoast\YoastSEO\Presenters
 */

namespace Yoast\WP\Free\Presenters\Post_Type;

use Yoast\WP\Free\Models\Indexable;
use Yoast\WP\Free\Presenters\Post_Type\Meta_Description_Presenter as Post_Type_Meta_Description_Presenter;
use Yoast\WP\Free\Presenters\Presenter_Interface;

class Head_Presenter implements Presenter_Interface {
	/**
	 * @var Meta_Description_Presenter
	 */
	protected $post_type_meta_description_presenter;

	/**
	 * Head_Presenter constructor.
	 *
	 * @param Meta_Description_Presenter $post_type_meta_description_presenter
	 */
	public function __construct(
		Post_Type_Meta_Description_Presenter $post_type_meta_description_presenter
	) {
		$this->post_type_meta_description_presenter = $post_type_meta_description_presenter;
	}

	public function present( Indexable $indexable ) {
		$this->post_type_meta_description_presenter->present( $indexable );
	}
}
