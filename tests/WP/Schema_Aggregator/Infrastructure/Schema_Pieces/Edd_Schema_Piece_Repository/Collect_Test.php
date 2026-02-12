<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\WP\Schema_Aggregator\Infrastructure\Schema_Pieces\Edd_Schema_Piece_Repository;

use Yoast\WP\SEO\Conditionals\Third_Party\EDD_Conditional;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Pieces\Edd_Schema_Piece_Repository;
use Yoast\WP\SEO\Surfaces\Meta_Surface;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Integration Test Class for Edd_Schema_Piece_Repository::collect.
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Pieces\Edd_Schema_Piece_Repository::collect
 */
final class Collect_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Edd_Schema_Piece_Repository
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
	public $prereq_plugin_basename = 'easy-digital-downloads/easy-digital-downloads.php';

	/**
	 * Sets up the test class.
	 *
	 * @return void
	 */
	public function set_up(): void {
		parent::set_up();

		// This initializes the singleton which loads all required EDD files.
		\EDD();

		/**
		 * Because EDD hooks on 'init' to register its custom post types, and 'init' has already fired by the time we get here,
		 * we need to manually register the 'download' post type for our tests by calling edd_setup_edd_post_types.
		 */
		// Register the download post type (EDD hooks this on 'init' which has already fired).
		if ( ! \post_type_exists( 'download' ) ) {
			\edd_setup_edd_post_types();
		}

		$meta_surface   = \YoastSEO()->classes->get( Meta_Surface::class );
		$this->instance = new Edd_Schema_Piece_Repository( new EDD_Conditional(), $meta_surface );
	}

	/**
	 * Tears down the test class.
	 *
	 * @return void
	 */
	public function tear_down(): void {
		/**
		 * EDD hooks into the 'delete_post' action to perform cleanup of its custom database tables when a 'download' post is deleted.
		 * The test environment does not have the EDD custom tables, so these hooks will cause errors when attempting to delete the test posts.
		 */
		\remove_all_actions( 'delete_post' );

		foreach ( $this->created_posts as $post_id ) {
			\wp_delete_post( $post_id, true );
		}

		parent::tear_down();
	}

	/**
	 * Tests the collect method returns product schema for a valid EDD download.
	 *
	 * @return void
	 */
	public function test_collect_returns_product_schema(): void {
		$post_id               = self::factory()->post->create(
			[
				'post_title'   => 'Test Download',
				'post_status'  => 'publish',
				'post_type'    => 'download',
				'post_excerpt' => 'A test digital download.',
			]
		);
		$this->created_posts[] = $post_id;

		\update_post_meta( $post_id, 'edd_price', '9.99' );

		$result = $this->instance->collect( $post_id );

		$this->assertIsArray( $result );
		$this->assertNotEmpty( $result, 'Expected at least one schema piece for a valid download.' );
		$this->assertCount( 1, $result, 'Expected exactly one schema piece for a simple download.' );

		$schema = $result[0];
		$this->assertIsArray( $schema );
		$this->assertArrayHasKey( '@type', $schema, 'Schema piece should have a @type key.' );
		$this->assertSame( 'Product', $schema['@type'], 'Schema @type should be Product.' );
		$this->assertArrayHasKey( '@id', $schema, 'Schema piece should have an @id key.' );
	}

	/**
	 * Tests the collect method returns an empty array for a non-download post.
	 *
	 * @return void
	 */
	public function test_collect_returns_empty_for_non_download_post(): void {
		$post_id               = self::factory()->post->create(
			[
				'post_title'  => 'Regular Post',
				'post_status' => 'publish',
				'post_type'   => 'post',
			]
		);
		$this->created_posts[] = $post_id;

		$result = $this->instance->collect( $post_id );

		$this->assertIsArray( $result );
		$this->assertEmpty( $result, 'Expected empty array for a non-download post.' );
	}

	/**
	 * Tests the collect method returns an empty array for a non-existent post ID.
	 *
	 * @return void
	 */
	public function test_collect_returns_empty_for_non_existent_post(): void {
		$result = $this->instance->collect( 999999 );

		$this->assertIsArray( $result );
		$this->assertEmpty( $result, 'Expected empty array for a non-existent post ID.' );
	}
}
