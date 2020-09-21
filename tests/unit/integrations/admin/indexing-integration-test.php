<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Admin;

use Mockery;
use Brain\Monkey;
use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Complete_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexation\Indexable_General_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Post_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Post_Type_Archive_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Term_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexation\Post_Link_Indexing_Action;
use Yoast\WP\SEO\Actions\Indexation\Term_Link_Indexing_Action;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Conditionals\Yoast_Tools_Page_Conditional;
use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Integrations\Admin\Indexing_Integration;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Indexing_Integration_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Admin\Indexing_Integration
 */
class Indexing_Integration_Test extends TestCase {

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
	private $term_indexation;

	/**
	 * The post type archive indexable indexation action.
	 *
	 * @var Mockery\MockInterface|Indexable_Post_Type_Archive_Indexation_Action
	 */
	private $post_type_archive_indexation;

	/**
	 * The general indexable indexation action.
	 *
	 * @var Mockery\MockInterface|Indexable_General_Indexation_Action
	 */
	private $general_indexation;

	/**
	 * The complete indexation action.
	 *
	 * @var Mockery\MockInterface|Indexable_Complete_Indexation_Action
	 */
	private $complete_indexation_action;

	/**
	 * The post link indexation action.
	 *
	 * @var Mockery\MockInterface|Post_Link_Indexing_Action
	 */
	private $post_link_indexing_action;

	/**
	 * The term link indexation action.
	 *
	 * @var Mockery\MockInterface|Term_Link_Indexing_Action
	 */
	private $term_link_indexing_action;

	/**
	 * The admin asset manager.
	 *
	 * @var Mockery\MockInterface|WPSEO_Admin_Asset_Manager
	 */
	private $asset_manager;

	/**
	 * The indexable helper.
	 *
	 * @var Mockery\MockInterface|Indexable_Helper
	 */
	private $indexable_helper;

	/**
	 * Sets up the tests.
	 */
	protected function setUp() {
		parent::setUp();

		$this->post_indexation              = Mockery::mock( Indexable_Post_Indexation_Action::class );
		$this->term_indexation              = Mockery::mock( Indexable_Term_Indexation_Action::class );
		$this->post_type_archive_indexation = Mockery::mock( Indexable_Post_Type_Archive_Indexation_Action::class );
		$this->general_indexation           = Mockery::mock( Indexable_General_Indexation_Action::class );
		$this->complete_indexation_action   = Mockery::mock( Indexable_Complete_Indexation_Action::class );
		$this->post_link_indexing_action    = Mockery::mock( Post_Link_Indexing_Action::class );
		$this->term_link_indexing_action    = Mockery::mock( Term_Link_Indexing_Action::class );
		$this->asset_manager                = Mockery::mock( WPSEO_Admin_Asset_Manager::class );
		$this->indexable_helper             = Mockery::mock( Indexable_Helper::class );

		$this->instance = new Indexing_Integration(
			$this->post_indexation,
			$this->term_indexation,
			$this->post_type_archive_indexation,
			$this->general_indexation,
			$this->complete_indexation_action,
			$this->asset_manager,
			$this->indexable_helper
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
		$this->assertAttributeInstanceOf( WPSEO_Admin_Asset_Manager::class, 'asset_manager', $this->instance );
	}

	/**
	 * Tests the get_conditionals method.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$actual = Indexing_Integration::get_conditionals();
		$expected = [
			Yoast_Tools_Page_Conditional::class,
			Migrations_Conditional::class
		];
		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests the register hooks method.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		Monkey\Actions\expectAdded( 'wpseo_tools_overview_list_items' );
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
		$total_unindexed_expectations = [
			'post_indexation'              => 40,
			'term_indexation'              => 20,
			'post_type_archive_indexation' => 12,
			'general_indexation'           => 0,
		];

		$this->set_total_unindexed_expectations( $total_unindexed_expectations );

		Monkey\Filters\expectApplied( 'wpseo_indexing_total_unindexed' )
			->with( 72 )
			->andReturn( 84 );

		$this->assertEquals( 84, $this->instance->get_total_unindexed() );
	}

	/**
	 * Tests the enqueue_scripts method.
	 *
	 * @covers ::enqueue_scripts
	 */
	public function test_enqueue_scripts() {
		$total_unindexed_expectations = [
			'post_indexation'              => 40,
			'term_indexation'              => 20,
			'post_type_archive_indexation' => 12,
			'general_indexation'           => 0,
		];

		$this->set_total_unindexed_expectations( $total_unindexed_expectations );

		$this->asset_manager
			->expects( 'enqueue_script' )
			->with( 'indexation' );
		$this->asset_manager
			->expects( 'enqueue_style' )
			->with( 'admin-css' );
		$this->asset_manager
			->expects( 'enqueue_style' )
			->with( 'monorepo' );

		$this->indexable_helper
			->expects( 'should_index_indexables' )
			->andReturn( true );

		Monkey\Functions\expect( 'wp_create_nonce' )
			->with( 'wp_rest' )
			->andReturn( 'nonce_value' );

		$injected_data = [
			'amount'   => 72,
			'disabled' => false,
			'restApi'  =>
				[
					'root'      => 'https://example.org/wp-ajax/',
					'endpoints' =>
						[
							'prepare'  => 'yoast/v1/indexation/prepare',
							'posts'    => 'yoast/v1/indexation/posts',
							'terms'    => 'yoast/v1/indexation/terms',
							'archives' => 'yoast/v1/indexation/post-type-archives',
							'general'  => 'yoast/v1/indexation/general',
							'complete' => 'yoast/v1/indexation/complete',
						],
					'nonce'     => 'nonce_value',
				],
		];

		Monkey\Functions\expect( 'rest_url' )
			->andReturn( 'https://example.org/wp-ajax/' );

		Monkey\Functions\expect( 'wp_localize_script' )
			->with( 'yoast-seo-indexation', 'yoastIndexingData', $injected_data );

		Monkey\Filters\expectApplied( 'wpseo_indexing_data' )
			->with( $injected_data );

		$this->instance->enqueue_scripts();
	}

	/**
	 * Tests the enqueue_scripts method.
	 *
	 * @covers ::enqueue_scripts
	 */
	public function test_enqueue_scripts_indexing_completed() {
		$total_unindexed_expectations = [
			'post_indexation'              => 0,
			'term_indexation'              => 0,
			'post_type_archive_indexation' => 0,
			'general_indexation'           => 0,
		];

		$this->set_total_unindexed_expectations( $total_unindexed_expectations );

		$this->complete_indexation_action
			->expects( 'complete' )
			->once();

		$this->asset_manager
			->expects( 'enqueue_script' )
			->with( 'indexation' );
		$this->asset_manager
			->expects( 'enqueue_style' )
			->with( 'admin-css' );
		$this->asset_manager
			->expects( 'enqueue_style' )
			->with( 'monorepo' );

		$this->indexable_helper
			->expects( 'should_index_indexables' )
			->andReturn( true );

		/**
		 * We have to register the shutdown function here to prevent a fatal PHP error,
		 * which would occur because the registered shutdown function is executed
		 * after the unit test has already completed.
		 */
		\register_shutdown_function( [ $this, 'shutdown_indexation_expectations' ] );

		Monkey\Functions\expect( 'wp_create_nonce' )
			->with( 'wp_rest' )
			->andReturn( 'nonce_value' );

		$injected_data = [
			'amount'   => 0,
			'disabled' => false,
			'restApi'  =>
				[
					'root'      => 'https://example.org/wp-ajax/',
					'endpoints' =>
						[
							'prepare'  => 'yoast/v1/indexation/prepare',
							'posts'    => 'yoast/v1/indexation/posts',
							'terms'    => 'yoast/v1/indexation/terms',
							'archives' => 'yoast/v1/indexation/post-type-archives',
							'general'  => 'yoast/v1/indexation/general',
							'complete' => 'yoast/v1/indexation/complete',
						],
					'nonce'     => 'nonce_value',
				],
		];

		Monkey\Functions\expect( 'rest_url' )
			->andReturn( 'https://example.org/wp-ajax/' );

		Monkey\Functions\expect( 'wp_localize_script' )
			->with( 'yoast-seo-indexation', 'yoastIndexingData', $injected_data );

		Monkey\Filters\expectApplied( 'wpseo_indexing_data' )
			->with( $injected_data );

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
