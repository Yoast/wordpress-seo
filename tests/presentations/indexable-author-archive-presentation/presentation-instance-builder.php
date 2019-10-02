<?php

namespace Yoast\WP\Free\Tests\Presentations\Indexable_Author_Archive_Presentation;

use Mockery;
use Yoast\WP\Free\Helpers\Current_Page_Helper;
use Yoast\WP\Free\Helpers\Image_Helper;
use Yoast\WP\Free\Helpers\Options_Helper;
use Yoast\WP\Free\Helpers\Post_Type_Helper;
use Yoast\WP\Free\Helpers\Robots_Helper;
use Yoast\WP\Free\Helpers\User_Helper;
use Yoast\WP\Free\Presentations\Indexable_Author_Archive_Presentation;
use Yoast\WP\Free\Tests\Mocks\Indexable;
use Yoast\WP\Free\Wrappers\WP_Query_Wrapper;

/**
 * Trait Presentation_Instance_Builder
 */
trait Presentation_Instance_Builder {

	/**
	 * @var Indexable
	 */
	protected $indexable;

	/**
	 * @var Indexable_Author_Archive_Presentation
	 */
	protected $instance;

	/**
	 * @var Mockery\Mock
	 */
	protected $options_helper;

	/**
	 * @var Mockery\Mock
	 */
	protected $robots_helper;

	/**
	 * @var Mockery\Mock
	 */
	protected $image_helper;

	/**
	 * @var Mockery\Mock
	 */
	protected $current_page_helper;

	/**
	 * @var Mockery\Mock
	 */
	protected $wp_query_wrapper;

	/**
	 * @var Mockery\Mock
	 */
	protected $user_helper;

	/**
	 * @var Mockery\Mock
	 */
	protected $post_type_helper;

	/**
	 * Builds an instance of Indexable_Author_Presentation.
	 */
	protected function setInstance() {
		$this->indexable = new Indexable();

		$this->options_helper      = Mockery::mock( Options_Helper::class );
		$this->image_helper        = Mockery::mock( Image_Helper::class );
		$this->robots_helper       = Mockery::mock( Robots_Helper::class );
		$this->current_page_helper = Mockery::mock( Current_Page_Helper::class );
		$this->wp_query_wrapper    = Mockery::mock( WP_Query_Wrapper::class );
		$this->user_helper         = Mockery::mock( User_Helper::class );
		$this->post_type_helper    = Mockery::mock( Post_Type_Helper::class );

		$instance = new Indexable_Author_Archive_Presentation(
			$this->wp_query_wrapper,
			$this->user_helper,
			$this->post_type_helper
		);

		$this->instance = $instance->of( $this->indexable );
		$this->instance->set_helpers(
			$this->robots_helper,
			$this->image_helper,
			$this->options_helper,
			$this->current_page_helper
		);
	}
}
