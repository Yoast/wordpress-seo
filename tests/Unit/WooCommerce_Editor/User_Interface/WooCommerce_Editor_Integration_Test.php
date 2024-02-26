<?php

namespace Yoast\WP\SEO\Tests\Unit\WooCommerce_Editor\User_Interface;

use Brain\Monkey;
use Generator;
use Mockery;
use WP_Post;
use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Wincher_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\WooCommerce_Editor\Framework\WooCommerce_Editor_Admin_L10n;
use Yoast\WP\SEO\WooCommerce_Editor\Framework\WooCommerce_Editor_Script_Data;
use Yoast\WP\SEO\WooCommerce_Editor\User_Interface\WooCommerce_Editor_Integration;

/**
 * Tests WooCommerce_Editor_Integration.
 *
 * @group woocommerce-editor
 * @coversDefaultClass \Yoast\WP\SEO\Woocommerce_Editor\User_Interface\WooCommerce_Editor_Integration
 */
final class WooCommerce_Editor_Integration_Test extends TestCase {

	/**
	 * The WooCommerce_Editor_Integration.
	 *
	 * @var WooCommerce_Editor_Integration
	 */
	private $instance;

	/**
	 * Represents the WPSEO_Admin_Asset_Manager.
	 *
	 * @var Mockery\MockInterface|WPSEO_Admin_Asset_Manager
	 */
	private $asset_manager;

	/**
	 * Represents the Current_Page_Helper.
	 *
	 * @var Mockery\MockInterface|Current_Page_Helper
	 */
	private $current_page_helper;

	/**
	 * Represents the Wincher_Helper.
	 *
	 * @var Mockery\MockInterface|Wincher_Helper
	 */
	private $wincher_helper;

	/**
	 * Represents the WooCommerce_Editor_Admin_L10n.
	 *
	 * @var Mockery\MockInterface|WooCommerce_Editor_Admin_L10n
	 */
	private $woocommerce_editor_admin_l10n;

	/**
	 * Represents the WooCommerce_Editor_Script_Data.
	 *
	 * @var Mockery\MockInterface|WooCommerce_Editor_Script_Data
	 */
	private $woocommerce_editor_script_data;

	/**
	 * Set up the test.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->asset_manager                  = Mockery::mock( WPSEO_Admin_Asset_Manager::class );
		$this->current_page_helper            = Mockery::mock( Current_Page_Helper::class );
		$this->wincher_helper                 = Mockery::mock( Wincher_Helper::class );
		$this->woocommerce_editor_admin_l10n  = Mockery::mock( WooCommerce_Editor_Admin_L10n::class );
		$this->woocommerce_editor_script_data = Mockery::mock( WooCommerce_Editor_Script_Data::class );

		$this->instance = new WooCommerce_Editor_Integration(
			$this->asset_manager,
			$this->current_page_helper,
			$this->wincher_helper,
			$this->woocommerce_editor_admin_l10n,
			$this->woocommerce_editor_script_data
		);
	}

	/**
	 * Tests whether the defaults of the constructor are there.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			WPSEO_Admin_Asset_Manager::class,
			$this->getPropertyValue( $this->instance, 'asset_manager' )
		);
		$this->assertInstanceOf(
			Current_Page_Helper::class,
			$this->getPropertyValue( $this->instance, 'current_page_helper' )
		);
		$this->assertInstanceOf(
			Wincher_Helper::class,
			$this->getPropertyValue( $this->instance, 'wincher_helper' )
		);
		$this->assertInstanceOf(
			WooCommerce_Editor_Admin_L10n::class,
			$this->getPropertyValue( $this->instance, 'woocommerce_editor_admin_l10n' )
		);
		$this->assertInstanceOf(
			WooCommerce_Editor_Script_Data::class,
			$this->getPropertyValue( $this->instance, 'woocommerce_editor_script_data' )
		);

		$this->assertSame( 'wc-admin', $this->instance::PAGE );
		$this->assertSame( 'woocommerce-editor', $this->instance::ASSET_HANDLE );
	}

	/**
	 * Tests the get_conditionals method.
	 *
	 * @covers ::get_conditionals
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$this->assertSame(
			[
				'Yoast\WP\SEO\Conditionals\WooCommerce_Conditional',
				'Yoast\WP\SEO\WooCommerce_Editor\Framework\WooCommerce_Product_Block_Editor_Conditional',
			],
			WooCommerce_Editor_Integration::get_conditionals()
		);
	}

	/**
	 * Tests that register_hooks enqueues assets when on the "wc-admin" page.
	 *
	 * @covers ::register_hooks
	 * @covers ::is_on_page
	 *
	 * @return void
	 */
	public function test_register_hooks() {
		$this->current_page_helper->expects( 'get_current_yoast_seo_page' )->once()->andReturn( 'wc-admin' );

		Monkey\Functions\expect( 'add_action' )
			->with( 'admin_enqueue_assets', [ $this->instance, 'enqueue_assets' ] )
			->once();

		$this->instance->register_hooks();
	}

	/**
	 * Tests that register_hooks does not enqueue assets when not on the "wc-admin" page..
	 *
	 * @covers ::register_hooks
	 * @covers ::is_on_page
	 *
	 * @return void
	 */
	public function test_register_hooks_not_on_page() {
		$this->current_page_helper->expects( 'get_current_yoast_seo_page' )->once()->andReturn( 'other-page' );

		Monkey\Functions\expect( 'add_action' )
			->with( 'admin_enqueue_assets', [ $this->instance, 'enqueue_assets' ] )
			->never();

		$this->instance->register_hooks();
	}

	/**
	 * Tests the enqueue_assets method' happy path.
	 *
	 * @covers ::enqueue_assets
	 * @covers ::get_post
	 *
	 * @return void
	 */
	public function test_enqueue_assets_happy_path() {
		Monkey\Functions\expect( 'get_queried_object_id' )->once()->andReturn( 42 );

		$post            = Mockery::mock( WP_Post::class );
		$post->post_type = 'post';
		Monkey\Functions\expect( 'get_post' )->with( 42 )->once()->andReturn( $post );

		$this->asset_manager->expects( 'enqueue_script' )->with( 'woocommerce-editor' )->once();
		$this->asset_manager->expects( 'enqueue_style' )->with( 'tailwind' )->once();
		$this->asset_manager->expects( 'enqueue_style' )->with( 'monorepo' )->once();
		$this->asset_manager->expects( 'enqueue_style' )->with( 'metabox-css' )->once();

		Monkey\Functions\expect( 'get_current_user_id' )->once()->andReturn( 1 );

		$this->woocommerce_editor_script_data->expects( 'get_data_for' )
			->with( $post, 1 )
			->once()
			->andReturn( [ 'some' => 'data' ] );
		$this->asset_manager->expects( 'localize_script' )
			->with( 'woocommerce-editor', 'wpseoScriptData', [ 'some' => 'data' ] )
			->once();
		$this->wincher_helper->expects( 'get_admin_global_links' )->once()->andReturn( [ 'some' => 'links' ] );
		$this->asset_manager->expects( 'localize_script' )
			->with( 'woocommerce-editor', 'wpseoAdminGlobalL10n', [ 'some' => 'links' ] )
			->once();
		$this->woocommerce_editor_admin_l10n->expects( 'get_data_for' )
			->with( 'post' )
			->once()
			->andReturn( [ 'some' => 'l10n' ] );
		$this->asset_manager->expects( 'localize_script' )
			->with( 'woocommerce-editor', 'wpseoAdminL10n', [ 'some' => 'l10n' ] )
			->once();

		$this->instance->enqueue_assets();
	}

	/**
	 * Tests that the assets are never enqueued when there is no post.
	 *
	 * @covers ::enqueue_assets
	 * @covers ::get_post
	 *
	 * @return void
	 */
	public function test_enqueue_assets_no_post() {
		Monkey\Functions\expect( 'get_queried_object_id' )->once()->andReturn( 0 );

		Monkey\Functions\expect( 'get_post' )->with( 0 )->once()->andReturn( null );

		$this->asset_manager->expects( 'enqueue_script' )->never();
		$this->asset_manager->expects( 'enqueue_style' )->never();
		$this->asset_manager->expects( 'localize_script' )->never();

		$this->instance->enqueue_assets();
	}

	/**
	 * Tests the asset enqueue with retrieving the post ID via the path.
	 *
	 * @covers ::get_current_path
	 * @covers ::get_product_id_from_path
	 *
	 * @dataProvider provider_for_get_product_id_from_path
	 *
	 * @param string|int $path                The path to test.
	 * @param ?int       $expected_product_id The expected product ID.
	 *
	 * @return void
	 */
	public function test_get_product_id_from_path( $path, $expected_product_id ) {
		$_GET['path'] = $path;

		Monkey\Functions\expect( 'get_queried_object_id' )->once()->andReturn( 0 );

		$post            = Mockery::mock( WP_Post::class );
		$post->post_type = 'post';
		Monkey\Functions\expect( 'get_post' )->with( $expected_product_id )->once()->andReturn( null );

		// Ignore any asset enqueueing, the focus is on the path retrieval.
		Monkey\Functions\when( 'get_current_user_id' )->justReturn( 42 );
		$this->asset_manager->allows( 'enqueue_script' );
		$this->asset_manager->allows( 'enqueue_style' );
		$this->asset_manager->allows( 'localize_script' );
		$this->woocommerce_editor_script_data->allows( 'get_data_for' )->andReturn( [ 'some' => 'data' ] );
		$this->wincher_helper->allows( 'get_admin_global_links' )->andReturn( [ 'some' => 'links' ] );
		$this->woocommerce_editor_admin_l10n->allows( 'get_data_for' )->andReturn( [ 'some' => 'l10n' ] );

		$this->instance->enqueue_assets();
	}

	/**
	 * Provides data for the test_get_product_id_from_path test.
	 *
	 * @return Generator
	 */
	public static function provider_for_get_product_id_from_path(): Generator {
		yield 'With ID' => [
			'path'                => '/product/123',
			'expected_product_id' => 123,
		];
		yield 'No ID' => [
			'path'                => '/foo',
			'expected_product_id' => null,
		];
		yield 'Negative ID' => [
			'path'                => '/product/-1',
			'expected_product_id' => null,
		];
		yield 'Non-integer ID' => [
			'path'                => '/product/foo',
			'expected_product_id' => null,
		];
		yield 'Non-string path' => [
			'path'                => 123,
			'expected_product_id' => null,
		];
	}
}
