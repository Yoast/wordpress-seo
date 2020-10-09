<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Admin;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Indexing_Complete_Action;
use Yoast\WP\SEO\Actions\Indexation\Indexable_General_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Post_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Post_Type_Archive_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Term_Indexation_Action;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Conditionals\Yoast_Admin_And_Dashboard_Conditional;
use Yoast\WP\SEO\Integrations\Admin\Background_Indexing_Integration;
use Yoast\WP\SEO\Integrations\Admin\Indexing_Tool_Integration;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Indexing_Integration_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Admin\Background_Indexing_Integration
 *
 * @group integrations
 * @group indexing
 */
class Indexing_Indexables_Integration_Test extends TestCase {

	/**
	 * The indexation integration under test.
	 *
	 * @var Indexing_Tool_Integration
	 */
	protected $instance;

	/**
	 * The post indexable indexation action.
	 *
	 * @var Mockery\MockInterface|Indexable_Post_Indexation_Action
	 */
	protected $post_indexation;

	/**
	 * The term indexable indexation action.
	 *
	 * @var Mockery\MockInterface|Indexable_Term_Indexation_Action
	 */
	protected $term_indexation;

	/**
	 * The post type archive indexable indexation action.
	 *
	 * @var Mockery\MockInterface|Indexable_Post_Type_Archive_Indexation_Action
	 */
	protected $post_type_archive_indexation;

	/**
	 * The general indexable indexation action.
	 *
	 * @var Mockery\MockInterface|Indexable_General_Indexation_Action
	 */
	protected $general_indexation;

	/**
	 * The complete indexation action.
	 *
	 * @var Mockery\MockInterface|Indexable_Indexing_Complete_Action
	 */
	protected $complete_indexation_action;

	/**
	 * Sets up the tests.
	 */
	protected function setUp() {
		parent::setUp();

		$this->post_indexation              = Mockery::mock( Indexable_Post_Indexation_Action::class );
		$this->term_indexation              = Mockery::mock( Indexable_Term_Indexation_Action::class );
		$this->post_type_archive_indexation = Mockery::mock( Indexable_Post_Type_Archive_Indexation_Action::class );
		$this->general_indexation           = Mockery::mock( Indexable_General_Indexation_Action::class );
		$this->complete_indexation_action   = Mockery::mock( Indexable_Indexing_Complete_Action::class );

		$this->instance = new Background_Indexing_Integration(
			$this->post_indexation,
			$this->term_indexation,
			$this->post_type_archive_indexation,
			$this->general_indexation,
			$this->complete_indexation_action
		);
	}

	/**
	 * Tests the get_conditionals method.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		static::assertEquals(
			[
				Yoast_Admin_And_Dashboard_Conditional::class,
				Migrations_Conditional::class,
			],
			Background_Indexing_Integration::get_conditionals()
		);
	}

	/**
	 * Tests the constructor.
	 *
	 * @covers ::__construct
	 */
	public function test_constructor() {
		static::assertAttributeInstanceOf( Indexable_Post_Indexation_Action::class, 'post_indexation', $this->instance );
		static::assertAttributeInstanceOf( Indexable_Term_Indexation_Action::class, 'term_indexation', $this->instance );
		static::assertAttributeInstanceOf( Indexable_Post_Type_Archive_Indexation_Action::class, 'post_type_archive_indexation', $this->instance );
		static::assertAttributeInstanceOf( Indexable_General_Indexation_Action::class, 'general_indexation', $this->instance );
		static::assertAttributeInstanceOf( Indexable_Indexing_Complete_Action::class, 'complete_indexation_action', $this->instance );
	}

	/**
	 * Tests the register hooks method.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		Monkey\Actions\expectAdded( 'admin_init' );

		$this->instance->register_hooks();
	}

	/**
	 * Tests the enqueue_scripts method.
	 *
	 * @covers ::register_shutdown_indexing
	 */
	public function test_register_shutdown_indexing() {
		$this->post_indexation->expects( 'get_total_unindexed' )->andReturn( 0 );
		$this->term_indexation->expects( 'get_total_unindexed' )->andReturn( 0 );
		$this->post_type_archive_indexation->expects( 'get_total_unindexed' )->andReturn( 0 );
		$this->general_indexation->expects( 'get_total_unindexed' )->andReturn( 0 );

		/**
		 * We have to register the shutdown function here to prevent a fatal PHP error,
		 * which would occur because the registered shutdown function is executed
		 * after the unit test has already completed.
		 */
		\register_shutdown_function( [ $this, 'shutdown_indexation_expectations' ] );

		$this->instance->register_shutdown_indexing();
	}

	/**
	 * Tests the shutdown indexing method.
	 *
	 * @covers ::index
	 */
	public function test_index() {
		$this->term_indexation
			->expects( 'index' )
			->once();

		$this->post_indexation
			->expects( 'index' )
			->once();

		$this->general_indexation
			->expects( 'index' )
			->once();

		$this->post_type_archive_indexation
			->expects( 'index' )
			->once();

		$this->complete_indexation_action
			->expects( 'complete' )
			->once();

		$this->instance->index();
	}

	/**
	 * Sets the expectations for the shutdown indexation.
	 */
	public function shutdown_indexation_expectations() {
		$this->post_indexation->expects( 'index' )->once();
		$this->term_indexation->expects( 'index' )->once();
		$this->general_indexation->expects( 'index' )->once();
		$this->post_type_archive_indexation->expects( 'index' )->once();
	}
}
