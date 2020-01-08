<?php

namespace Yoast\WP\Free\Tests\Presentations\Indexable_Term_Archive_Presentation;

use Mockery;
use Yoast\WP\Free\Helpers\Pagination_Helper;
use Yoast\WP\Free\Helpers\Taxonomy_Helper;
use Yoast\WP\Free\Presentations\Indexable_Term_Archive_Presentation;
use Yoast\WP\Free\Tests\Mocks\Indexable;
use Yoast\WP\Free\Tests\Mocks\Meta_Tags_Context;
use Yoast\WP\Free\Tests\Presentations\Presentation_Instance_Dependencies;
use Yoast\WP\Free\Wrappers\WP_Query_Wrapper;

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
	 * Holds the Indexable_Term_Archive_Presentation instance.
	 *
	 * @var Indexable_Term_Archive_Presentation|Mockery\MockInterface
	 */
	protected $instance;

	/**
	 * Holds the WP_Query_Wrapper instance.
	 *
	 * @var WP_Query_Wrapper|Mockery\MockInterface
	 */
	protected $wp_query_wrapper;

	/**
	 * Holds the Taxonomy_Helper instance.
	 *
	 * @var Taxonomy_Helper|Mockery\MockInterface
	 */
	protected $taxonomy_helper;

	/**
	 * Holds the Pagination_Helper instance.
	 *
	 * @var Pagination_Helper|Mockery\MockInterface
	 */
	protected $pagination;

	/**
	 * The context class.
	 *
	 * @var \Yoast\WP\Free\Context\Meta_Tags_Context
	 */
	protected $context;

	/**
	 * Builds an instance of Indexable_Term_Archive_Presentation.
	 */
	protected function set_instance() {
		$this->indexable = new Indexable();

		$this->wp_query_wrapper = Mockery::mock( WP_Query_Wrapper::class );
		$this->taxonomy_helper  = Mockery::mock( Taxonomy_Helper::class );
		$this->pagination       = Mockery::mock( Pagination_Helper::class );
		$this->context          = Mockery::mock( Meta_Tags_Context::class );

		$instance = Mockery::mock(
			Indexable_Term_Archive_Presentation::class,
			[
				$this->wp_query_wrapper,
				$this->taxonomy_helper,
			]
		)
			->makePartial()
			->shouldAllowMockingProtectedMethods();

		$instance->context = $this->context;

		$this->instance = $instance->of( [ 'model' => $this->indexable ] );

		$this->set_instance_dependencies( $this->instance );
		$this->instance->set_archive_adjacent_helpers( $this->pagination );
	}
}
