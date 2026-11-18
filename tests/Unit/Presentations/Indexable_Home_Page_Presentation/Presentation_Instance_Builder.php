<?php

namespace Yoast\WP\SEO\Tests\Unit\Presentations\Indexable_Home_Page_Presentation;

use Mockery;
use Yoast\WP\SEO\Helpers\Pagination_Helper;
use Yoast\WP\SEO\Presentations\Indexable_Home_Page_Presentation;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\Presentations\Presentation_Instance_Dependencies;

/**
 * Trait Presentation_Instance_Builder
 */
trait Presentation_Instance_Builder {

	use Presentation_Instance_Dependencies;

	/**
	 * Represents the indexable mock.
	 *
	 * @var Indexable_Mock
	 */
	protected $indexable;

	/**
	 * Holds the Pagination_Helper instance.
	 *
	 * @var Pagination_Helper|Mockery\MockInterface
	 */
	protected $pagination;

	/**
	 * Represents the instance to test.
	 *
	 * @var Indexable_Home_Page_Presentation
	 */
	protected $instance;

	/**
	 * Builds an instance of Indexable_Home_Page_Presentation.
	 *
	 * @return void
	 */
	protected function set_instance() {
		$this->indexable = new Indexable_Mock();

		$this->pagination = Mockery::mock( Pagination_Helper::class );

		$instance = new Indexable_Home_Page_Presentation();

		$this->instance = $instance->of( [ 'model' => $this->indexable ] );

		$this->set_instance_dependencies( $this->instance );
		$this->instance->set_archive_adjacent_helpers( $this->pagination );
	}
}
