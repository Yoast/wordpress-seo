<?php

namespace Yoast\WP\SEO\Tests\WP\Helpers;

use WPSEO_Image_Utils;
use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Repositories\SEO_Links_Repository;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Integration tests asserting that Image_Helper does not re-issue
 * `wp_postmeta` lookups for the same attachment ID within a single request.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded -- Needed to show the specific behaviour under test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Image_Helper
 */
final class Image_Helper_Metadata_Cache_Test extends TestCase {

	/**
	 * The instance.
	 *
	 * @var Image_Helper
	 */
	private $instance;

	/**
	 * Sets up the test class.
	 *
	 * @return void
	 */
	public function set_up(): void {
		parent::set_up();

		$this->instance = new Image_Helper(
			\YoastSEO()->classes->get( Indexable_Repository::class ),
			\YoastSEO()->classes->get( SEO_Links_Repository::class ),
			\YoastSEO()->helpers->options,
			\YoastSEO()->helpers->url
		);

		// Static memo on `WPSEO_Image_Utils` is process-wide; reset it so the
		// first call in each test issues a real lookup.
		WPSEO_Image_Utils::reset_full_size_image_data_cache();
	}

	/**
	 * Tear down.
	 *
	 * @return void
	 */
	public function tear_down(): void {
		WPSEO_Image_Utils::reset_full_size_image_data_cache();

		parent::tear_down();
	}

	/**
	 * The second call to `get_metadata` for the same attachment must not
	 * issue any new `wp_postmeta` queries — the per-request memo on
	 * Image_Helper has to absorb it even when the WordPress object cache
	 * has been invalidated in between.
	 *
	 * @covers ::get_metadata
	 *
	 * @return void
	 */
	public function test_get_metadata_does_not_query_twice_for_the_same_id() {
		$attachment_id = self::factory()->attachment->create();
		\update_post_meta(
			$attachment_id,
			'_wp_attachment_metadata',
			[
				'width'  => 1000,
				'height' => 1000,
				'file'   => 'image.jpg',
			]
		);

		// Make sure the first call has to hit the database, not a primed cache.
		\wp_cache_delete( $attachment_id, 'post_meta' );

		global $wpdb;
		$queries_at_start = $wpdb->num_queries;

		$first = $this->instance->get_metadata( $attachment_id );

		$queries_after_first = $wpdb->num_queries;

		// Bust the WordPress object cache so that — without our memo — a second
		// call would have to query `wp_postmeta` again.
		\wp_cache_delete( $attachment_id, 'post_meta' );

		$second = $this->instance->get_metadata( $attachment_id );

		$queries_after_second = $wpdb->num_queries;

		$this->assertSame( $first, $second, 'Both calls should return the same metadata payload.' );
		$this->assertGreaterThan(
			$queries_at_start,
			$queries_after_first,
			'The first call should issue at least one query against `wp_postmeta`.'
		);
		$this->assertSame(
			$queries_after_first,
			$queries_after_second,
			'The second call must be served from the per-request memo without issuing new queries.'
		);
	}

	/**
	 * The second call to `get_best_attachment_variation` for the same
	 * attachment must short-circuit at the helper level, even when the
	 * WordPress object cache has been invalidated between calls.
	 *
	 * @covers ::get_best_attachment_variation
	 *
	 * @return void
	 */
	public function test_get_best_attachment_variation_does_not_query_twice_for_the_same_id() {
		$attachment_id = self::factory()->attachment->create();
		\update_post_meta(
			$attachment_id,
			'_wp_attachment_metadata',
			[
				'width'  => 1000,
				'height' => 1000,
				'file'   => 'image.jpg',
			]
		);

		\wp_cache_delete( $attachment_id, 'post_meta' );

		global $wpdb;
		$queries_at_start = $wpdb->num_queries;

		$first = $this->instance->get_best_attachment_variation( $attachment_id );

		$queries_after_first = $wpdb->num_queries;

		\wp_cache_delete( $attachment_id, 'post_meta' );

		$second = $this->instance->get_best_attachment_variation( $attachment_id );

		$queries_after_second = $wpdb->num_queries;

		$this->assertSame( $first, $second, 'Both calls should return the same variation payload.' );
		$this->assertSame(
			$queries_after_first,
			$queries_after_second,
			'The second call must be served from the per-request memo without issuing new queries.'
		);
		$this->assertGreaterThanOrEqual(
			$queries_at_start,
			$queries_after_first,
			'Sanity: the first call should not decrease the query counter.'
		);
	}
}
