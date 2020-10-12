<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Admin;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Complete_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexation\Indexable_General_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Post_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Post_Type_Archive_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Term_Indexation_Action;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Conditionals\Yoast_Admin_And_Dashboard_Conditional;
use Yoast\WP\SEO\Integrations\Admin\Indexing_Indexables_Integration;
use Yoast\WP\SEO\Integrations\Admin\Indexing_Integration;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Indexing_Integration_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Admin\Indexing_Indexables_Integration
 *
 * @group integrations
 * @group indexing
 */
class Indexing_Indexables_Integration_Test extends TestCase {

	/**
	 * The indexation integration under test.
	 *
	 * @var Indexing_Integration
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
	 * @var Mockery\MockInterface|Indexable_Complete_Indexation_Action
	 */
	protected $complete_indexation_action;

	/**
	 * Sets up the tests.
	 */
	protected function setUp()  {
		parent::setUp();

		$this->post_indexation              = Mockery::mock( Indexable_Post_Indexation_Action::class );
		$this->term_indexation              = Mockery::mock( Indexable_Term_Indexation_Action::class );
		$this->post_type_archive_indexation = Mockery::mock( Indexable_Post_Type_Archive_Indexation_Action::class );
		$this->general_indexation           = Mockery::mock( Indexable_General_Indexation_Action::class );
		$this->complete_indexation_action   = Mockery::mock( Indexable_Complete_Indexation_Action::class );

		$this->instance = new Indexing_Indexables_Integration(
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
			Indexing_Indexables_Integration::get_conditionals()
		);
	}

	/**
	 * Sets the expectations for the get_total_unindexed methods for the given actions.
	 *
	 * @param array $expectations The expectations.
	 */
	protected function set_total_unindexed_expectations( array $expectations ) {
		foreach ( $expectations as $action => $total_unindexed ) {
			$this->{$action}
				->expects( 'get_total_unindexed' )
				->andReturn( $total_unindexed );
		}
	}

	/**
	 * Tests the constructor.
	 *
	 * @covers ::__construct
	 */
	public function test_constructor() {
		$this->assertAttributeInstanceOf( Indexable_Post_Indexation_Action::class, 'post_indexation', $this->instance );
		$this->assertAttributeInstanceOf( Indexable_Term_Indexation_Action::class, 'term_indexation', $this->instance );
		$this->assertAttributeInstanceOf( Indexable_Post_Type_Archive_Indexation_Action::class, 'post_type_archive_indexation', $this->instance );
		$this->assertAttributeInstanceOf( Indexable_General_Indexation_Action::class, 'general_indexation', $this->instance );
		$this->assertAttributeInstanceOf( Indexable_Complete_Indexation_Action::class, 'complete_indexation_action', $this->instance );
	}

	/**
	 * Tests the register hooks method.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		Monkey\Actions\expectAdded( 'admin_enqueue_scripts' );

		$this->instance->register_hooks();
	}

	/**
	 * Tests the shutdown indexing method.
	 *
	 * @covers ::shutdown_indexation
	 */
	public function test_shutdown_indexing() {
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

		$this->instance->shutdown_indexation();
	}

	/**
	 * Tests the get_total_unindexed method.
	 *
	 * @covers ::get_total_unindexed
	 */
	public function test_get_total_unindexed() {
		$this->post_indexation->expects( 'get_total_unindexed' )->andReturn( 40 );
		$this->term_indexation->expects( 'get_total_unindexed' )->andReturn( 20 );
		$this->post_type_archive_indexation->expects( 'get_total_unindexed' )->andReturn( 12 );
		$this->general_indexation->expects( 'get_total_unindexed' )->andReturn( 0 );

		$this->assertEquals( 72, $this->instance->get_total_unindexed() );
	}

	/**
	 * Tests the retrieval of the endpoints.
	 *
	 * @covers ::get_endpoints
	 */
	public function test_get_endpoints() {
		$this->assertEquals(
			[
				'prepare'  => 'yoast/v1/indexation/prepare',
				'posts'    => 'yoast/v1/indexation/posts',
				'terms'    => 'yoast/v1/indexation/terms',
				'archives' => 'yoast/v1/indexation/post-type-archives',
				'general'  => 'yoast/v1/indexation/general',
				'complete' => 'yoast/v1/indexation/complete',
			],
			$this->instance->get_endpoints()
		);
	}

	/**
	 * Tests the enqueue_scripts method.
	 *
	 * @covers ::enqueue_scripts
	 */
	public function test_enqueue_scripts() {
		$this->post_indexation->expects( 'get_total_unindexed' )->andReturn( 40 );
		$this->term_indexation->expects( 'get_total_unindexed' )->andReturn( 20 );
		$this->post_type_archive_indexation->expects( 'get_total_unindexed' )->andReturn( 12 );
		$this->general_indexation->expects( 'get_total_unindexed' )->andReturn( 0 );

		$this->instance->enqueue_scripts();
	}

	/**
	 * Tests the enqueue_scripts method.
	 *
	 * @covers ::enqueue_scripts
	 */
	public function test_enqueue_scripts_indexing_completed() {
		$this->post_indexation->expects( 'get_total_unindexed' )->andReturn( 0 );
		$this->term_indexation->expects( 'get_total_unindexed' )->andReturn( 0 );
		$this->post_type_archive_indexation->expects( 'get_total_unindexed' )->andReturn( 0 );
		$this->general_indexation->expects( 'get_total_unindexed' )->andReturn( 0 );

		$this->complete_indexation_action
			->expects( 'complete' )
			->once();

		/**
		 * We have to register the shutdown function here to prevent a fatal PHP error,
		 * which would occur because the registered shutdown function is executed
		 * after the unit test has already completed.
		 */
		\register_shutdown_function( [ $this, 'shutdown_indexation_expectations' ] );

		Monkey\Functions\expect( 'wp_create_nonce' )
			->with( 'wp_rest' )
			->andReturn( 'nonce_value' );

		$this->instance->enqueue_scripts();
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
