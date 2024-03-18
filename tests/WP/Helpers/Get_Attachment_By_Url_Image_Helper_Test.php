<?php

namespace Yoast\WP\SEO\Tests\WP\Helpers;

use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Repositories\SEO_Links_Repository;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Integration Test Class for the Image_Helper class.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded -- Needed to show specific method being tested in this file.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Image_Helper
 */
final class Get_Attachment_By_Url_Image_Helper_Test extends TestCase {

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
		$this->instance = new Image_Helper( \YoastSEO()->classes->get( Indexable_Repository::class ), \YoastSEO()->classes->get( SEO_Links_Repository::class ), \YoastSEO()->helpers->options, \YoastSEO()->helpers->url );
		\YoastSEO()->helpers->options->set( 'disable-attachment', true );

		global $wpdb;

		$wpdb->insert(
			$wpdb->prefix . 'yoast_seo_links',
			[
				'url'                 => 'a_dir/something',
				'type'                => 'internal',
				'indexable_id'        => '101',
				'post_id'             => '110',
				'target_post_id'      => '112',
				'target_indexable_id' => '344',
				'id'                  => '113',
			]
		);
	}

	/**
	 * Tests if the query cached is filled when `get_attachment_by_url` is called multiple times.
	 *
	 * @covers ::get_attachment_by_url
	 * @return void
	 */
	public function test_get_attachment_by_url_with_existing_link_and_cache() {
		$url       = 'a_dir/something';
		$cache_key = 'attachment_seo_link_object_' . \md5( $url );
		$link      = $this->instance->get_attachment_by_url( $url );

		$link_cache = \wp_cache_get( $cache_key, 'yoast-seo-attachment-link' );
		$this->assertSame( $link, $link_cache->target_post_id );

		$this->assertSame( 112, $this->instance->get_attachment_by_url( 'a_dir/something' ) );
	}
}
