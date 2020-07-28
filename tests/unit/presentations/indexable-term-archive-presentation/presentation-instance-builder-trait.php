<?php

namespace Yoast\WP\SEO\Tests\Presentations\Indexable_Term_Archive_Presentation;

use Mockery;
use Yoast\WP\SEO\Helpers\Pagination_Helper;
use Yoast\WP\SEO\Helpers\Taxonomy_Helper;
use Yoast\WP\SEO\Presentations\Indexable_Term_Archive_Presentation;
use Yoast\WP\SEO\Tests\Doubles\Context\Meta_Tags_Context_Mock;
use Yoast\WP\SEO\Tests\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Presentations\Presentation_Instance_Dependencies;
use Yoast\WP\SEO\Wrappers\WP_Query_Wrapper;

/**
 * Trait Presentation_Instance_Builder
 */
trait Presentation_Instance_Builder {
	use Presentation_Instance_Dependencies;

	/**
	 * Holds the Indexable instance.
	 *
	 * @var Indexable_Mock
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
	protected $taxonomy;

	/**
	 * Holds the Pagination_Helper instance.
	 *
	 * @var Pagination_Helper|Mockery\MockInterface
	 */
	protected $pagination;

	/**
	 * The context class.
	 *
	 * @var Meta_Tags_Context_Mock
	 */
	protected $context;

	/**
	 * Builds an instance of Indexable_Term_Archive_Presentation.
	 */
	protected function set_instance() {
		$this->indexable = new Indexable_Mock();

		$this->wp_query_wrapper = Mockery::mock( WP_Query_Wrapper::class );
		$this->taxonomy         = Mockery::mock( Taxonomy_Helper::class );
		$this->pagination       = Mockery::mock( Pagination_Helper::class );
		$this->context          = Mockery::mock( Meta_Tags_Context_Mock::class );

		$instance = Mockery::mock(
			Indexable_Term_Archive_Presentation::class,
			[
				$this->wp_query_wrapper,
				$this->taxonomy,
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
