<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Third_Party;

use Brain\Monkey;
use Mockery;
use WC_Product_Variable;
use WC_Product_Variation;
use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Conditionals\Admin\Post_Conditional;
use Yoast\WP\SEO\Conditionals\WooCommerce_Conditional;
use Yoast\WP\SEO\Integrations\Third_Party\WooCommerce_Product_Image_Alt_Integration;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class WooCommerce_Product_Image_Alt_Integration_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Third_Party\WooCommerce_Product_Image_Alt_Integration
 * @covers \Yoast\WP\SEO\Integrations\Third_Party\WooCommerce_Product_Image_Alt_Integration
 *
 * @group integrations
 * @group woocommerce
 */
final class WooCommerce_Product_Image_Alt_Integration_Test extends TestCase {

	/**
	 * The instance under test.
	 *
	 * @var WooCommerce_Product_Image_Alt_Integration
	 */
	protected $instance;

	/**
	 * The asset manager mock.
	 *
	 * @var Mockery\MockInterface|WPSEO_Admin_Asset_Manager
	 */
	protected $asset_manager;

	/**
	 * Sets up the test instance.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->asset_manager = Mockery::mock( WPSEO_Admin_Asset_Manager::class );
		$this->instance      = new WooCommerce_Product_Image_Alt_Integration( $this->asset_manager );
	}

	// -------------------------------------------------------------------------
	// get_conditionals
	// -------------------------------------------------------------------------

	/**
	 * Tests that the correct conditionals are returned.
	 *
	 * @covers ::get_conditionals
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[
				WooCommerce_Conditional::class,
				Post_Conditional::class,
			],
			WooCommerce_Product_Image_Alt_Integration::get_conditionals(),
		);
	}

	// -------------------------------------------------------------------------
	// register_hooks – is_product_edit_page() branches
	// -------------------------------------------------------------------------

	/**
	 * Tests that register_hooks adds the admin_enqueue_scripts action on
	 * the product new-post page.
	 *
	 * @covers ::register_hooks
	 *
	 * @return void
	 */
	public function test_register_hooks_on_new_product_page() {
		global $pagenow;
		$pagenow           = 'post-new.php';
		$_GET['post_type'] = 'product';

		$this->instance->register_hooks();

		$this->assertNotFalse(
			Monkey\Actions\has( 'admin_enqueue_scripts', [ $this->instance, 'enqueue_assets' ] ),
		);

		unset( $_GET['post_type'] );
	}

	/**
	 * Tests that register_hooks adds the action on an existing product edit page.
	 *
	 * @covers ::register_hooks
	 *
	 * @return void
	 */
	public function test_register_hooks_on_product_edit_page() {
		global $pagenow;
		$pagenow      = 'post.php';
		$_GET['post'] = '42';

		Monkey\Functions\expect( 'get_post_type' )
			->once()
			->with( 42 )
			->andReturn( 'product' );

		$this->instance->register_hooks();

		$this->assertNotFalse(
			Monkey\Actions\has( 'admin_enqueue_scripts', [ $this->instance, 'enqueue_assets' ] ),
		);

		unset( $_GET['post'] );
	}

	/**
	 * Tests that register_hooks does nothing on post-new.php with a non-product type.
	 *
	 * @covers ::register_hooks
	 *
	 * @return void
	 */
	public function test_register_hooks_skips_non_product_new_page() {
		global $pagenow;
		$pagenow           = 'post-new.php';
		$_GET['post_type'] = 'post';

		$this->instance->register_hooks();

		$this->assertFalse(
			Monkey\Actions\has( 'admin_enqueue_scripts', [ $this->instance, 'enqueue_assets' ] ),
		);

		unset( $_GET['post_type'] );
	}

	/**
	 * Tests that register_hooks does nothing on post.php with a non-product post type.
	 *
	 * @covers ::register_hooks
	 *
	 * @return void
	 */
	public function test_register_hooks_skips_non_product_edit_page() {
		global $pagenow;
		$pagenow      = 'post.php';
		$_GET['post'] = '10';

		Monkey\Functions\expect( 'get_post_type' )
			->once()
			->with( 10 )
			->andReturn( 'post' );

		$this->instance->register_hooks();

		$this->assertFalse(
			Monkey\Actions\has( 'admin_enqueue_scripts', [ $this->instance, 'enqueue_assets' ] ),
		);

		unset( $_GET['post'] );
	}

	/**
	 * Tests that register_hooks does nothing on an unrelated admin page.
	 *
	 * @covers ::register_hooks
	 *
	 * @return void
	 */
	public function test_register_hooks_skips_unrelated_page() {
		global $pagenow;
		$pagenow = 'edit.php';

		$this->instance->register_hooks();

		$this->assertFalse(
			Monkey\Actions\has( 'admin_enqueue_scripts', [ $this->instance, 'enqueue_assets' ] ),
		);
	}

	// -------------------------------------------------------------------------
	// enqueue_assets / get_variation_images
	// -------------------------------------------------------------------------

	/**
	 * Tests that enqueue_assets enqueues the script and localizes with an empty
	 * array when post_id is 0.
	 *
	 * @covers ::enqueue_assets
	 *
	 * @return void
	 */
	public function test_enqueue_assets_without_post_id() {
		unset( $_GET['post'] );

		$this->asset_manager->expects( 'enqueue_script' )->once()->with( 'product-image-alt' );
		$this->asset_manager->expects( 'localize_script' )
			->once()
			->with(
				'product-image-alt',
				'wpseoProductImageAlt',
				[ 'variationImages' => [] ],
			);

		$this->instance->enqueue_assets();
	}

	/**
	 * Tests that enqueue_assets returns empty variation images when the product
	 * is not a variable product.
	 *
	 * @covers ::enqueue_assets
	 *
	 * @return void
	 */
	public function test_enqueue_assets_non_variable_product() {
		$_GET['post'] = '10';

		$product = Mockery::mock( 'WC_Product' );

		Monkey\Functions\expect( 'wc_get_product' )
			->once()
			->with( 10 )
			->andReturn( $product );

		$this->asset_manager->expects( 'enqueue_script' )->once()->with( 'product-image-alt' );
		$this->asset_manager->expects( 'localize_script' )
			->once()
			->with(
				'product-image-alt',
				'wpseoProductImageAlt',
				[ 'variationImages' => [] ],
			);

		$this->instance->enqueue_assets();

		unset( $_GET['post'] );
	}

	/**
	 * Tests that enqueue_assets returns the correct variation images for a
	 * variable product whose variations have images.
	 *
	 * @covers ::enqueue_assets
	 *
	 * @return void
	 */
	public function test_enqueue_assets_variable_product_with_images() {
		$_GET['post'] = '42';

		$variation = Mockery::mock( WC_Product_Variation::class );
		$variation->expects( 'get_image_id' )->once()->andReturn( 99 );

		$product = Mockery::mock( WC_Product_Variable::class );
		$product->expects( 'get_children' )->once()->andReturn( [ 7 ] );

		Monkey\Functions\expect( 'wc_get_product' )
			->twice()
			->andReturnValues( [ $product, $variation ] );

		Monkey\Functions\expect( 'wp_get_attachment_image_url' )
			->once()
			->with( 99, 'thumbnail' )
			->andReturn( 'https://example.com/img-150x150.jpg' );

		Monkey\Functions\expect( 'get_post_meta' )
			->once()
			->with( 99, '_wp_attachment_image_alt', true )
			->andReturn( 'My alt text' );

		$this->asset_manager->expects( 'enqueue_script' )->once()->with( 'product-image-alt' );
		$this->asset_manager->expects( 'localize_script' )
			->once()
			->with(
				'product-image-alt',
				'wpseoProductImageAlt',
				[
					'variationImages' => [
						[
							'variationId' => 7,
							'image'       => [
								'id'  => 99,
								'src' => 'https://example.com/img-150x150.jpg',
								'alt' => 'My alt text',
							],
						],
					],
				],
			);

		$this->instance->enqueue_assets();

		unset( $_GET['post'] );
	}

	/**
	 * Tests that a variation without an image contributes a null image entry.
	 *
	 * @covers ::enqueue_assets
	 *
	 * @return void
	 */
	public function test_enqueue_assets_variation_without_image() {
		$_GET['post'] = '42';

		$variation = Mockery::mock( WC_Product_Variation::class );
		$variation->expects( 'get_image_id' )->once()->andReturn( 0 );

		$product = Mockery::mock( WC_Product_Variable::class );
		$product->expects( 'get_children' )->once()->andReturn( [ 7 ] );

		Monkey\Functions\expect( 'wc_get_product' )
			->twice()
			->andReturnValues( [ $product, $variation ] );

		$this->asset_manager->expects( 'enqueue_script' )->once()->with( 'product-image-alt' );
		$this->asset_manager->expects( 'localize_script' )
			->once()
			->with(
				'product-image-alt',
				'wpseoProductImageAlt',
				[
					'variationImages' => [
						[
							'variationId' => 7,
							'image'       => null,
						],
					],
				],
			);

		$this->instance->enqueue_assets();

		unset( $_GET['post'] );
	}

	/**
	 * Tests that child IDs that resolve to a non-WC_Product_Variation are skipped.
	 *
	 * @covers ::enqueue_assets
	 *
	 * @return void
	 */
	public function test_enqueue_assets_skips_non_variation_children() {
		$_GET['post'] = '42';

		$product = Mockery::mock( WC_Product_Variable::class );
		$product->expects( 'get_children' )->once()->andReturn( [ 7 ] );

		// wc_get_product returns a plain product (not WC_Product_Variation) for child 7.
		$non_variation = Mockery::mock( 'WC_Product' );

		Monkey\Functions\expect( 'wc_get_product' )
			->twice()
			->andReturnValues( [ $product, $non_variation ] );

		$this->asset_manager->expects( 'enqueue_script' )->once()->with( 'product-image-alt' );
		$this->asset_manager->expects( 'localize_script' )
			->once()
			->with(
				'product-image-alt',
				'wpseoProductImageAlt',
				[ 'variationImages' => [] ],
			);

		$this->instance->enqueue_assets();

		unset( $_GET['post'] );
	}

	/**
	 * Tests that wp_get_attachment_image_url returning false is cast to an empty string.
	 *
	 * @covers ::enqueue_assets
	 *
	 * @return void
	 */
	public function test_enqueue_assets_missing_thumbnail_url_cast_to_string() {
		$_GET['post'] = '42';

		$variation = Mockery::mock( WC_Product_Variation::class );
		$variation->expects( 'get_image_id' )->once()->andReturn( 99 );

		$product = Mockery::mock( WC_Product_Variable::class );
		$product->expects( 'get_children' )->once()->andReturn( [ 7 ] );

		Monkey\Functions\expect( 'wc_get_product' )
			->twice()
			->andReturnValues( [ $product, $variation ] );

		Monkey\Functions\expect( 'wp_get_attachment_image_url' )
			->once()
			->andReturn( false );

		Monkey\Functions\expect( 'get_post_meta' )
			->once()
			->andReturn( '' );

		$this->asset_manager->expects( 'enqueue_script' )->once();
		$this->asset_manager->expects( 'localize_script' )
			->once()
			->with(
				'product-image-alt',
				'wpseoProductImageAlt',
				Mockery::on(
					static function ( $data ) {
						return $data['variationImages'][0]['image']['src'] === '';
					},
				),
			);

		$this->instance->enqueue_assets();

		unset( $_GET['post'] );
	}
}
