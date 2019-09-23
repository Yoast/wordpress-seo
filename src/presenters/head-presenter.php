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

class Head_Presenter implements Presenter_Interface {

	protected $current_post_helper;

	protected $post_type_head_presenter;

	public function __construct(
		Current_Post_Helper $current_post_helper,
		Post_Type_Head_Presenter $post_type_head_presenter
	) {
		$this->current_post_helper = $current_post_helper;
		$this->post_type_head_presenter = $post_type_head_presenter;
	}

	public function present( Indexable $indexable ) {
		if ( $this->current_post_helper->is_simple_page() ) {
			$this->post_type_head_presenter->present( $indexable );
		}
	}
}
