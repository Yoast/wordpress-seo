<?php
/**
 * Presenter of the head.
 *
 * @package Yoast\YoastSEO\Presenters
 */

namespace Yoast\WP\Free\Presenters;

use Yoast\WP\Free\Helpers\Current_Post_Helper;
use Yoast\WP\Free\Models\Indexable;
use Yoast\WP\Free\Presenters\Post_Type\Head_Presenter as Post_Type_Head_Presenter;

/**
 * Class Head_Presenter
 * @package Yoast\WP\Free\Presenters
 */
class Head_Presenter implements Presenter_Interface {

	/**
	 * @var Current_Post_Helper
	 */
	protected $current_post_helper;

	/**
	 * @var Post_Type_Head_Presenter
	 */
	protected $post_type_head_presenter;

	/**
	 * Head_Presenter constructor.
	 *
	 * @param Current_Post_Helper      $current_post_helper
	 * @param Post_Type_Head_Presenter $post_type_head_presenter
	 */
	public function __construct(
		Current_Post_Helper $current_post_helper,
		Post_Type_Head_Presenter $post_type_head_presenter
	) {
		$this->current_post_helper = $current_post_helper;
		$this->post_type_head_presenter = $post_type_head_presenter;
	}

	/**
	 * Presents the head.
	 *
	 * @param Indexable $indexable The indexable.
	 */
	public function present( Indexable $indexable ) {
		if ( $this->current_post_helper->is_simple_page() ) {
			$this->post_type_head_presenter->present( $indexable );
		}
	}
}
