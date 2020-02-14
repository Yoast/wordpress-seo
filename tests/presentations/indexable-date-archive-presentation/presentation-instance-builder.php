<?php

namespace Yoast\WP\SEO\Tests\Presentations\Indexable_Date_Archive_Presentation;

use Mockery;
use Yoast\WP\SEO\Helpers\Pagination_Helper;
use Yoast\WP\SEO\Presentations\Indexable_Date_Archive_Presentation;
use Yoast\WP\SEO\Tests\Mocks\Indexable;
use Yoast\WP\SEO\Tests\Presentations\Presentation_Instance_Dependencies;

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
	 * @var Indexable_Date_Archive_Presentation
	 */
	protected $instance;

	/**
	 * Holds the Pagination_Helper instance.
	 *
	 * @var Pagination_Helper|Mockery\MockInterface
	 */
	protected $pagination;

	/**
	 * Builds an instance of Indexable_Post_Type_Presentation.
	 */
	protected function set_instance() {
		$this->indexable = new Indexable();

		$this->pagination = Mockery::mock( Pagination_Helper::class );

		$instance = new Indexable_Date_Archive_Presentation( $this->pagination );

		$this->instance = $instance->of( [ 'model' => $this->indexable ] );

		$this->set_instance_dependencies( $this->instance );
	}
}
