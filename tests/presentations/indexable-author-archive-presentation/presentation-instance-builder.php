<?php

namespace Yoast\WP\Free\Tests\Presentations\Indexable_Author_Archive_Presentation;

use Mockery;
use Yoast\WP\Free\Helpers\Post_Type_Helper;
use Yoast\WP\Free\Presentations\Indexable_Author_Archive_Presentation;
use Yoast\WP\Free\Tests\Mocks\Indexable;
use Yoast\WP\Free\Tests\Presentations\Presentation_Instance_Helpers;
use Yoast\WP\Free\Wrappers\WP_Query_Wrapper;

/**
 * Trait Presentation_Instance_Builder
 */
trait Presentation_Instance_Builder {
	use Presentation_Instance_Helpers;

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
	protected $wp_query_wrapper;

	/**
	 * @var Mockery\Mock
	 */
	protected $post_type_helper;

	/**
	 * Builds an instance of Indexable_Author_Presentation.
	 */
	protected function setInstance() {
		$this->indexable = new Indexable();

		$this->wp_query_wrapper    = Mockery::mock( WP_Query_Wrapper::class );
		$this->post_type_helper    = Mockery::mock( Post_Type_Helper::class );

		$instance = new Indexable_Author_Archive_Presentation(
			$this->wp_query_wrapper,
			$this->post_type_helper
		);

		$this->instance = $instance->of( [ 'model' => $this->indexable ] );

		$this->set_instance_helpers( $this->instance );
	}
}
