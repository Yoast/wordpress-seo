<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers;

use Mockery;
use Yoast\WP\SEO\Helpers\Wpdb_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Wpdb_Helper_Test.
 *
 * @group helpers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Wpdb_Helper
 */
class Wpdb_Helper_Test extends TestCase {

	/**
	 * The instance under test.
	 *
	 * @var Wpdb_Helper
	 */
	protected $instance;

	/**
	 * Sets up the class under test and mock objects.
	 */
	public function set_up() {
		parent::set_up();

		$this->wpdb     = Mockery::mock( 'wpdb' );
		$this->instance = new Wpdb_Helper( $this->wpdb );
	}

	/**
	 * Tests the checking of the table existance.
	 *
	 * @covers ::table_exists
	 */
	public function test_table_exists() {
		$this->wpdb->expects( 'get_var' )
			->once()
			->with( "SHOW TABLES LIKE 'wp_aioseo_posts'" );

		$this->instance->table_exists( 'wp_aioseo_posts' );
	}
}
