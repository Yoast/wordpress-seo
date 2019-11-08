<?php

namespace Yoast\WP\Free\Tests\Presentations\Indexable_Post_Type_Archive_Presentation;

use Mockery;
use Yoast\WP\Free\Helpers\Pagination_Helper;
use Yoast\WP\Free\Presentations\Indexable_Post_Type_Archive_Presentation;
use Yoast\WP\Free\Tests\Mocks\Indexable;
use Yoast\WP\Free\Tests\Presentations\Presentation_Instance_Dependencies;

/**
 * Trait Presentation_Instance_Builder
 */
trait Presentation_Instance_Builder {
	use Presentation_Instance_Dependencies;

	/**
	 * Holds the Indexable instance.
	 *
	 * @var Indexable
	 */
	protected $indexable;

	/**
	 * Holds the Indexable_Post_Type_Archive_Presentation instance.
	 *
	 * @var Indexable_Post_Type_Archive_Presentation
	 */
	protected $instance;

	/**
	 * Holds the Pagination_Helper instance.
	 *
	 * @var Pagination_Helper
	 */
	protected $pagination;

	/**
	 * Builds an instance of Indexable_Post_Type_Archive_Presentation.
	 */
	protected function set_instance() {
		$this->indexable = new Indexable();

		$this->pagination = Mockery::mock( Pagination_Helper::class );

		$instance = new Indexable_Post_Type_Archive_Presentation();

		$this->instance = $instance->of( [ 'model' => $this->indexable ] );

		$this->set_instance_dependencies( $this->instance );
		$this->instance->set_archive_adjacent_helpers( $this->pagination );
	}
}
