<?php

namespace Yoast\WP\Free\Tests\Presentations\Indexable_Static_Posts_Page_Presentation;

use Mockery;
use Yoast\WP\Free\Helpers\Date_Helper;
use Yoast\WP\Free\Helpers\Pagination_Helper;
use Yoast\WP\Free\Helpers\Post_Type_Helper;
use Yoast\WP\Free\Presentations\Indexable_Static_Posts_Page_Presentation;
use Yoast\WP\Free\Tests\Mocks\Indexable;
use Yoast\WP\Free\Tests\Presentations\Presentation_Instance_Dependencies;

/**
 * Trait Presentation_Instance_Builder
 */
trait Presentation_Instance_Builder {
	use Presentation_Instance_Dependencies;

	/**
	 * @var Indexable
	 */
	protected $indexable;

	/**
	 * @var Indexable_Static_Posts_Page_Presentation
	 */
	protected $instance;

	/**
	 * @var Mockery\MockInterface|Post_Type_Helper
	 */
	protected $post_type;

	/**
	 * @var Mockery\MockInterface|Date_Helper
	 */
	protected $date;

	/**
	 * @var Mockery\MockInterface|Pagination_Helper
	 */
	protected $pagination;

	/**
	 * Builds an instance of Indexable_Search_Result_Page_Presentation.
	 */
	protected function set_instance() {
		$this->indexable = new Indexable();

		$this->post_type  = Mockery::mock( Post_Type_Helper::class );
		$this->date       = Mockery::mock( Date_Helper::class );
		$this->pagination = Mockery::mock( Pagination_Helper::class );

		$instance = new Indexable_Static_Posts_Page_Presentation(
			$this->post_type,
			$this->date,
			$this->pagination
		);

		$this->instance = $instance->of( [ 'model' => $this->indexable ] );

		$this->set_instance_dependencies( $this->instance );
	}
}
