<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Admin;

use Brain\Monkey;
use Mockery;
use WPSEO_Addon_Manager;
use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Conditionals\No_Tool_Selected_Conditional;
use Yoast\WP\SEO\Conditionals\Yoast_Tools_Page_Conditional;
use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Helpers\Indexing_Helper;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Helpers\Short_Link_Helper;
use Yoast\WP\SEO\Integrations\Admin\Indexing_Tool_Integration;
use Yoast\WP\SEO\Services\Importing\Importable_Detector;
use Yoast\WP\SEO\Routes\Importing_Route;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Indexing_Tool_Integration_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Admin\Indexing_Tool_Integration
 *
 * @group integrations
 * @group indexing
 */
class Indexing_Tool_Integration_Test extends TestCase {

	/**
	 * The indexation integration under test.
	 *
	 * @var Indexing_Tool_Integration
	 */
	protected $instance;

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
	 * The indexing helper.
	 *
	 * @var Mockery\MockInterface|Indexing_Helper
	 */
	protected $indexing_helper;

	/**
	 * The addon manager.
	 *
	 * @var Mockery\MockInterface|WPSEO_Addon_Manager
	 */
	protected $addon_manager;

	/**
	 * The product helper.
	 *
	 * @var Mockery\MockInterface|Product_Helper
	 */
	protected $product_helper;

	/**
	 * The Importable Detector service.
	 *
	 * @var Importable_Detector
	 */
	protected $importable_detector;

	/**
	 * The Importing Route class.
	 *
	 * @var Importing_Route
	 */
	protected $importing_route;

	/**
	 * Sets up the tests.
	 */
	protected function set_up() {
		parent::set_up();

		$this->stubTranslationFunctions();
		$this->stubEscapeFunctions();

		$this->asset_manager       = Mockery::mock( WPSEO_Admin_Asset_Manager::class );
		$this->indexable_helper    = Mockery::mock( Indexable_Helper::class );
		$this->short_link_helper   = Mockery::mock( Short_Link_Helper::class );
		$this->indexing_helper     = Mockery::mock( Indexing_Helper::class );
		$this->addon_manager       = Mockery::mock( WPSEO_Addon_Manager::class );
		$this->product_helper      = Mockery::mock( Product_Helper::class );
		$this->importable_detector = Mockery::mock( Importable_Detector::class );
		$this->importing_route     = Mockery::mock( Importing_Route::class );

		$this->instance = new Indexing_Tool_Integration(
			$this->asset_manager,
			$this->indexable_helper,
			$this->short_link_helper,
			$this->indexing_helper,
			$this->addon_manager,
			$this->product_helper,
			$this->importable_detector,
			$this->importing_route
		);
	}

	/**
	 * Tests the constructor.
	 *
	 * @covers ::__construct
	 */
	public function test_constructor() {
		static::assertInstanceOf(
			WPSEO_Admin_Asset_Manager::class,
			self::getPropertyValue( $this->instance, 'asset_manager' )
		);
		static::assertInstanceOf(
			Indexable_Helper::class,
			self::getPropertyValue( $this->instance, 'indexable_helper' )
		);
		static::assertInstanceOf(
			Short_Link_Helper::class,
			self::getPropertyValue( $this->instance, 'short_link_helper' )
		);
		static::assertInstanceOf(
			Indexing_Helper::class,
			self::getPropertyValue( $this->instance, 'indexing_helper' )
		);
		static::assertInstanceOf(
			WPSEO_Addon_Manager::class,
			self::getPropertyValue( $this->instance, 'addon_manager' )
		);
		static::assertInstanceOf(
			Product_Helper::class,
			self::getPropertyValue( $this->instance, 'product_helper' )
		);
		static::assertInstanceOf(
			Importable_Detector::class,
			self::getPropertyValue( $this->instance, 'importable_detector' )
		);
		static::assertInstanceOf(
			Importing_Route::class,
			self::getPropertyValue( $this->instance, 'importing_route' )
		);
	}

	/**
	 * Tests the get_conditionals method.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$actual   = Indexing_Tool_Integration::get_conditionals();
		$expected = [
			Migrations_Conditional::class,
			No_Tool_Selected_Conditional::class,
			Yoast_Tools_Page_Conditional::class,
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
	 * Tests the enqueue_scripts method.
	 *
	 * @covers ::enqueue_scripts
	 * @covers ::get_indexing_endpoints
	 * @covers ::get_importing_endpoints
	 */
	public function test_enqueue_scripts() {
		$this->indexing_helper
			->expects( 'get_filtered_unindexed_count' )
			->once()
			->andReturn( 112 );

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

		$this->indexing_helper
			->expects( 'is_initial_indexing' )
			->withNoArgs()
			->andReturnTrue();

		$this->addon_manager
			->expects( 'has_valid_subscription' )
			->with( 'yoast-seo-wordpress-premium' )
			->andReturnTrue();

		$this->short_link_helper
			->allows( 'get' )
			->andReturnArg( 0 );

		$this->product_helper
			->expects( 'is_premium' )
			->andReturnTrue();

		$injected_data = [
			'disabled'  => false,
			'amount'    => 112,
			'firstTime' => true,
			'restApi'   => [
				'root'                => 'https://example.org/wp-ajax/',
				'indexing_endpoints'  => [
					'prepare'            => 'yoast/v1/indexing/prepare',
					'terms'              => 'yoast/v1/indexing/terms',
					'posts'              => 'yoast/v1/indexing/posts',
					'archives'           => 'yoast/v1/indexing/post-type-archives',
					'general'            => 'yoast/v1/indexing/general',
					'indexablesComplete' => 'yoast/v1/indexing/indexables-complete',
					'post_link'          => 'yoast/v1/link-indexing/posts',
					'term_link'          => 'yoast/v1/link-indexing/terms',
					'complete'           => 'yoast/v1/indexing/complete',
				],
				'importing_endpoints' => [
					'aioseo' => [
						'yoast/v1/import/aioseo/posts',
					],
				],
				'nonce'               => 'nonce_value',
			],
		];

		$injected_data['errorMessage'] = '<p>Oops, something has gone wrong and we couldn\'t complete the optimization of your SEO data. ' .
			'Please click the button again to re-start the process. If the problem persists, please contact support.</p>' .
			'<p>Below are the technical details for the error. See <a href="https://yoa.st/4f3">this page</a> for a more detailed explanation.</p>';

		Monkey\Functions\expect( 'rest_url' )
			->andReturn( 'https://example.org/wp-ajax/' );

		$this->asset_manager
			->expects( 'localize_script' )
			->with( 'indexation', 'yoastIndexingData', $injected_data );

		$expected_detections = [
			'aioseo' => [ 'posts' ],
		];

		$this->importable_detector
			->expects( 'detect' )
			->andReturn( $expected_detections );

		$this->importing_route
			->expects( 'get_endpoint' )
			->once()
			->with( 'aioseo', 'posts' )
			->andReturn( 'yoast/v1/import/aioseo/posts' );

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
		$this->expectOutputString( '' );
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
		$this->expectOutputString(
			'<li><strong>Optimize SEO Data</strong><br/>You can speed up your site and get insight into your internal linking structure by letting us perform a few optimizations to the way SEO data is stored. If you have a lot of content it might take a while, but trust us, it\'s worth it. <a href="https://yoast.com" target="_blank">Learn more about the benefits of optimized SEO data.</a><div id="yoast-seo-indexing-action" style="margin: 16px 0;"></div></li>'
		);
	}
}
