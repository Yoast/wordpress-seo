<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Admin;

use Brain\Monkey;
use Mockery;
use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Conditionals\Yoast_Tools_Page_Conditional;
use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Short_Link_Helper;
use Yoast\WP\SEO\Integrations\Admin\Indexing_Indexables_Integration;
use Yoast\WP\SEO\Integrations\Admin\Indexing_Integration;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Indexing_Integration_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Admin\Indexing_Integration
 *
 * @group integrations
 * @group indexing
 */
class Indexing_Integration_Test extends TestCase {

	/**
	 * The indexation integration under test.
	 *
	 * @var Indexing_Integration
	 */
	protected $instance;

	/**
	 * The indexing indexables indexation action.
	 *
	 * @var Mockery\MockInterface|Indexing_Indexables_Integration
	 */
	protected $indexing_indexables_integration;

	/**
	 * The admin asset manager.
	 *
	 * @var Mockery\MockInterface|WPSEO_Admin_Asset_Manager
	 */
	protected $asset_manager;

	/**
	 * The indexable helper.
	 *
	 * @var Mockery\MockInterface|Indexable_Helper
	 */
	protected $indexable_helper;

	/**
	 * The short link helper.
	 *
	 * @var Mockery\MockInterface|Short_Link_Helper
	 */
	protected $short_link_helper;

	/**
	 * Represents the options helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $options_helper;

	/**
	 * Sets up the tests.
	 */
	protected function setUp() {
		parent::setUp();

		$this->indexing_indexables_integration = Mockery::mock( Indexing_Indexables_Integration::class );
		$this->asset_manager                   = Mockery::mock( WPSEO_Admin_Asset_Manager::class );
		$this->indexable_helper                = Mockery::mock( Indexable_Helper::class );
		$this->short_link_helper               = Mockery::mock( Short_Link_Helper::class );
		$this->options_helper                  = Mockery::mock( Options_Helper::class );

		$this->instance = new Indexing_Integration(
			$this->indexing_indexables_integration,
			$this->asset_manager,
			$this->indexable_helper,
			$this->short_link_helper,
			$this->options_helper
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
		$this->assertAttributeInstanceOf( WPSEO_Admin_Asset_Manager::class, 'asset_manager', $this->instance );
		$this->assertAttributeInstanceOf( Indexable_Helper::class, 'indexable_helper', $this->instance );
		$this->assertAttributeInstanceOf( Short_Link_Helper::class, 'short_link_helper', $this->instance );
		$this->assertAttributeInstanceOf( Options_Helper::class, 'options_helper', $this->instance );

		$this->assertAttributeEquals( [ $this->indexing_indexables_integration ], 'indexing_integrations', $this->instance );
	}

	/**
	 * Tests the get_conditionals method.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$actual   = Indexing_Integration::get_conditionals();
		$expected = [
			Yoast_Tools_Page_Conditional::class,
			Migrations_Conditional::class,
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
		Monkey\Actions\expectAdded( 'admin_enqueue_scripts' )->twice();

		$this->instance->register_hooks();
	}

	/**
	 * Tests the setting of the indexing integrations.
	 *
	 * @covers ::set_indexing_integrations
	 */
	public function test_set_indexing_integrations() {
		Monkey\Filters\expectApplied( 'wpseo_indexing_instances' )
			->with( [ $this->indexing_indexables_integration ] );

		$this->instance->set_indexing_integrations();
	}

	/**
	 * Tests the get_total_unindexed method.
	 *
	 * @covers ::get_total_unindexed
	 */
	public function test_get_total_unindexed() {
		$this->indexing_indexables_integration
			->expects( 'get_total_unindexed' )
			->once()
			->andReturn( 84 );

		$this->assertEquals( 84, $this->instance->get_total_unindexed() );
	}

	/**
	 * Tests the enqueue_scripts method.
	 *
	 * @covers ::enqueue_scripts
	 * @covers ::get_endpoints
	 */
	public function test_enqueue_scripts() {
		$this->indexing_indexables_integration
			->expects( 'get_total_unindexed' )
			->once()
			->andReturn( 72 );

		$this->indexing_indexables_integration
			->expects( 'get_endpoints' )
			->once()
			->andReturn(
				[
					'prepare'  => 'yoast/v1/indexation/prepare',
					'posts'    => 'yoast/v1/indexation/posts',
					'terms'    => 'yoast/v1/indexation/terms',
					'archives' => 'yoast/v1/indexation/post-type-archives',
					'general'  => 'yoast/v1/indexation/general',
					'complete' => 'yoast/v1/indexation/complete',
				]
			);

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
			->andReturnTrue();

		Monkey\Functions\expect( 'wp_create_nonce' )
			->with( 'wp_rest' )
			->andReturn( 'nonce_value' );

		$this->options_helper
			->expects( 'get' )
			->with( 'indexing_first_time', true )
			->andReturnTrue();

		$injected_data = [
			'amount'    => 72,
			'disabled'  => false,
			'firstTime' => true,
			'restApi'   =>
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
	 * Tests the rendering of the list item, when the user does not have the right rights.
	 *
	 * @covers ::render_indexing_list_item
	 */
	public function test_render_indexing_list_item_not_allowed() {
		// Arrange.
		Monkey\Functions\expect( 'current_user_can' )->with( 'manage_options' )->andReturn( false );

		// Act.
		$this->instance->render_indexing_list_item();

		// Assert.
		$this->expectOutput( '' );
	}

	/**
	 * Tests the rendering of the list item, when the user has the right rights.
	 *
	 * @covers ::render_indexing_list_item
	 */
	public function test_render_indexing_list_item_is_allowed() {
		// Arrange.
		Monkey\Functions\expect( 'current_user_can' )->with( 'manage_options' )->andReturn( true );
		$this->short_link_helper->shouldReceive( 'get' )->with( 'https://yoa.st/3-z' )->andReturn( 'https://yoast.com' );

		// Act.
		$this->instance->render_indexing_list_item();

		// Assert.
		$this->expectOutput( '<li><strong>Optimize SEO Data</strong><br/>You can speed up your site and get insight into your internal linking structure by letting us perform a few optimizations to the way SEO data is stored. If you have a lot of content it might take a while, but trust us, it\'s worth it. <a href="https://yoast.com" target="_blank">Learn more about the benefits of optimized SEO data.</a><div id="yoast-seo-indexing-action" style="margin: 16px 0;"></div></li>' );
	}
}
