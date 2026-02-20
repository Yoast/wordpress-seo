<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\WP\Schema_Aggregator\Infrastructure\Schema_Pieces\Woo_Schema_Piece_Repository;

use WC_Install;
use WC_Product_Factory;
use WC_Product_Simple;
use Yoast\WP\SEO\Conditionals\WooCommerce_Conditional;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Pieces\Woo_Schema_Piece_Repository;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Integration Test Class for Woo_Schema_Piece_Repository::collect.
 *
 * @group schema-aggregator
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Pieces\Woo_Schema_Piece_Repository::collect
 */
final class Collect_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Woo_Schema_Piece_Repository
	 */
	private $instance;

	/**
	 * Created WordPress post IDs for cleanup.
	 *
	 * @var array<int>
	 */
	private $created_posts = [];

	/**
	 * Plugin basename of the plugin dependency this group of tests has.
	 *
	 * @var string
	 */
	public $prereq_plugin_basename = 'woocommerce/woocommerce.php';

	/**
	 * Sets up the test class.
	 *
	 * @return void
	 */
	public function set_up(): void {
		parent::set_up();

		/**
		 * Bootstrap WooCommerce: create DB tables, set up product factory, and fire required actions.
		 * We can't use WC()->init() here because it requires the DI container which is not available in the test environment.
		 * We then need to call the required actions that are normally triggered during WC()->init() manually.
		 */
		WC_Install::create_tables();
		\WC()->product_factory = new WC_Product_Factory();
		\do_action( 'woocommerce_after_register_taxonomy' );
		\do_action( 'woocommerce_after_register_post_type' );
		\do_action( 'woocommerce_init' );

		/**
		 * The wpseo_schema_product filter that is triggered by woocommerce_structured_data_product is defined in Yoast WooCommerce SEO.
		 * To avoid requiring the entire plugin, we can directly hook into woocommerce_structured_data_product here to capture the schema output.
		 */
		\add_filter(
			'woocommerce_structured_data_product',
			static function ( $markup ) {
				return \apply_filters( 'wpseo_schema_product', $markup );
			},
		);

		$this->instance = new Woo_Schema_Piece_Repository( new WooCommerce_Conditional() );
	}

	/**
	 * Tears down the test class.
	 *
	 * @return void
	 */
	public function tear_down(): void {
		global $wpdb;

		foreach ( $this->created_posts as $post_id ) {
			\wp_delete_post( $post_id, true );
		}

		$wpdb->query( "DELETE FROM {$wpdb->prefix}wc_product_meta_lookup" );

		parent::tear_down();
	}

	/**
	 * Tests the collect method returns product schema for a valid WooCommerce product.
	 *
	 * @return void
	 */
	public function test_collect_returns_product_schema(): void {
		$product = new WC_Product_Simple();
		$product->set_name( 'Test Product' );
		$product->set_regular_price( '19.99' );
		$product->set_status( 'publish' );
		$product->save();

		$this->created_posts[] = $product->get_id();

		$result = $this->instance->collect( $product->get_id() );

		$this->assertIsArray( $result );
		$this->assertNotEmpty( $result, 'Expected at least one schema piece for a valid product.' );
		$this->assertCount( 1, $result, 'Expected exactly one schema piece for a simple product.' );

		$schema = $result[0];
		$this->assertIsArray( $schema );
		$this->assertArrayHasKey( '@type', $schema, 'Schema piece should have a @type key.' );
	}

	/**
	 * Tests the collect method returns an empty array for a non-product post.
	 *
	 * @return void
	 */
	public function test_collect_returns_empty_for_non_product_post(): void {
		$post_id               = self::factory()->post->create(
			[
				'post_title'  => 'Regular Post',
				'post_status' => 'publish',
				'post_type'   => 'post',
			],
		);
		$this->created_posts[] = $post_id;

		$result = $this->instance->collect( $post_id );

		$this->assertIsArray( $result );
		$this->assertEmpty( $result, 'Expected empty array for a non-product post.' );
	}

	/**
	 * Tests the collect method returns an empty array for a non-existent post ID.
	 *
	 * @return void
	 */
	public function test_collect_returns_empty_for_non_existent_post(): void {
		$result = $this->instance->collect( 999_999 );

		$this->assertIsArray( $result );
		$this->assertEmpty( $result, 'Expected empty array for a non-existent post ID.' );
	}
}
