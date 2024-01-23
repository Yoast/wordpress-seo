<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers;

use Mockery;
use wpdb;
use Yoast\WP\SEO\Helpers\Attachment_Cleanup_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Attachment_Cleanup_Helper_Test
 *
 * @group helpers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Attachment_Cleanup_Helper
 */
final class Attachment_Cleanup_Helper_Test extends TestCase {

	/**
	 * The instance under test.
	 *
	 * @var Attachment_Cleanup_Helper
	 */
	private $instance;

	/**
	 * The WPDB mock.
	 *
	 * @var Mockery\MockInterface|wpdb
	 */
	private $wpdb;

	/**
	 * Set up the tests.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Attachment_Cleanup_Helper();

		global $wpdb;

		$wpdb              = Mockery::mock( wpdb::class );
		$wpdb->prefix      = 'wp_';
		$wpdb->show_errors = false;

		$this->wpdb = $wpdb;
	}

	/**
	 * Tests the remove_attachment_indexables method.
	 *
	 * @covers ::remove_attachment_indexables
	 *
	 * @return void
	 */
	public function test_remove_attachment_indexables() {
		$this->wpdb->shouldReceive( 'query' )
			->once()
			->with( "DELETE FROM wp_yoast_indexable WHERE object_type = 'post' AND object_sub_type = 'attachment'" );

		$this->instance->remove_attachment_indexables( true );
	}

	/**
	 * Tests the clean_attachment_links_from_target_indexable_ids method.
	 *
	 * @covers ::clean_attachment_links_from_target_indexable_ids
	 *
	 * @return void
	 */
	public function test_clean_attachment_links_from_target_indexable_ids() {
		$this->wpdb->shouldReceive( 'query' )
			->once()
			->with( "UPDATE wp_yoast_seo_links SET target_indexable_id = NULL WHERE type = 'image-in'" );

		$this->instance->clean_attachment_links_from_target_indexable_ids( true );
	}
}
