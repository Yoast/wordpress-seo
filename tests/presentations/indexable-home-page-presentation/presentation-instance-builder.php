<?php

namespace Yoast\WP\SEO\Tests\Presentations\Indexable_Home_Page_Presentation;

use Mockery;
use Yoast\WP\SEO\Helpers\Pagination_Helper;
use Yoast\WP\SEO\Presentations\Indexable_Home_Page_Presentation;
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
	 * @var Indexable_Home_Page_Presentation|Mockery\MockInterface
	 */
	protected $instance;

	/**
	 * Holds the Pagination_Helper instance.
	 *
	 * @var Pagination_Helper|Mockery\MockInterface
	 */
	protected $pagination;

	/**
	 * Builds an instance of Indexable_Home_Page_Presentation.
	 */
	protected function set_instance() {
		$this->indexable = new Indexable();

		$this->pagination = Mockery::mock( Pagination_Helper::class );

		$instance = new Indexable_Home_Page_Presentation();

		$this->instance = $instance->of( [ 'model' => $this->indexable ] );

		$this->set_instance_dependencies( $this->instance );
		$this->instance->set_archive_adjacent_helpers( $this->pagination );
	}
}
