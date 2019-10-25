<?php

namespace Yoast\WP\Free\Tests\Presentations\Indexable_Term_Archive_Presentation;

use Mockery;
use Yoast\WP\Free\Helpers\Rel_Adjacent_Helper;
use Yoast\WP\Free\Helpers\Taxonomy_Helper;
use Yoast\WP\Free\Presentations\Indexable_Term_Archive_Presentation;
use Yoast\WP\Free\Tests\Mocks\Indexable;
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
	 * Holds the Rel_Adjacent_Helper instance.
	 *
	 * @var Rel_Adjacent_Helper|Mockery\MockInterface
	 */
	protected $rel_adjacent;

	/**
	 * Builds an instance of Indexable_Term_Archive_Presentation.
	 */
	protected function setInstance() {
		$this->indexable = new Indexable();

		$this->wp_query_wrapper = Mockery::mock( WP_Query_Wrapper::class );
		$this->taxonomy_helper  = Mockery::mock( Taxonomy_Helper::class );
		$this->rel_adjacent     = Mockery::mock( Rel_Adjacent_Helper::class );

		$instance = Mockery::mock(
			Indexable_Term_Archive_Presentation::class,
			[
				$this->wp_query_wrapper,
				$this->taxonomy_helper,
				$this->rel_adjacent,
			]
		)
			->makePartial()
			->shouldAllowMockingProtectedMethods();

		$this->instance = $instance->of( [ 'model' => $this->indexable ] );

		$this->set_instance_dependencies( $this->instance );
	}
}
