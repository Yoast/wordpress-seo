<?php

namespace Yoast\WP\SEO\Tests\Unit\Expiring_Store\Infrastructure;

use Mockery;
use Yoast\WP\SEO\Expiring_Store\Infrastructure\WPDB_Expiring_Store_Repository;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the WPDB_Expiring_Store_Repository.
 *
 * @group expiring-store
 *
 * @coversDefaultClass \Yoast\WP\SEO\Expiring_Store\Infrastructure\WPDB_Expiring_Store_Repository
 */
final class WPDB_Expiring_Store_Repository_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var WPDB_Expiring_Store_Repository
	 */
	private $instance;

	/**
	 * Holds the wpdb mock.
	 *
	 * @var Mockery\MockInterface
	 */
	private $wpdb;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->wpdb              = Mockery::mock( 'wpdb' );
		$this->wpdb->base_prefix = 'wp_';
		$GLOBALS['wpdb']         = $this->wpdb;

		$this->instance = new WPDB_Expiring_Store_Repository();
	}

	/**
	 * Tests upsert calls wpdb->replace with correct arguments.
	 *
	 * @covers ::upsert
	 * @covers ::get_table_name
	 *
	 * @return void
	 */
	public function test_upsert() {
		$this->wpdb
			->expects( 'replace' )
			->once()
			->with(
				'wp_yoast_expiring_store',
				[
					'key_name' => 'blog_1_my_key',
					'value'    => '"my_value"',
					'exp'      => '2026-01-01 00:00:00',
				],
				[ '%s', '%s', '%s' ],
			);

		$this->instance->upsert( 'blog_1_my_key', '"my_value"', '2026-01-01 00:00:00' );
	}

	/**
	 * Tests find returns the value when found.
	 *
	 * @covers ::find
	 * @covers ::get_table_name
	 *
	 * @return void
	 */
	public function test_find_returns_value() {
		$this->wpdb
			->expects( 'prepare' )
			->once()
			->with(
				'SELECT `value` FROM %i WHERE `key_name` = %s AND `exp` > %s',
				'wp_yoast_expiring_store',
				'blog_1_my_key',
				'2026-01-01 00:00:00',
			)
			->andReturn( 'prepared_sql' );

		$this->wpdb
			->expects( 'get_var' )
			->once()
			->with( 'prepared_sql' )
			->andReturn( '"my_value"' );

		$result = $this->instance->find( 'blog_1_my_key', '2026-01-01 00:00:00' );

		$this->assertSame( '"my_value"', $result );
	}

	/**
	 * Tests find returns null when not found.
	 *
	 * @covers ::find
	 * @covers ::get_table_name
	 *
	 * @return void
	 */
	public function test_find_returns_null_when_not_found() {
		$this->wpdb
			->expects( 'prepare' )
			->once()
			->andReturn( 'prepared_sql' );

		$this->wpdb
			->expects( 'get_var' )
			->once()
			->with( 'prepared_sql' )
			->andReturn( null );

		$result = $this->instance->find( 'blog_1_missing', '2026-01-01 00:00:00' );

		$this->assertNull( $result );
	}

	/**
	 * Tests delete calls wpdb->delete with correct arguments.
	 *
	 * @covers ::delete
	 * @covers ::get_table_name
	 *
	 * @return void
	 */
	public function test_delete() {
		$this->wpdb
			->expects( 'delete' )
			->once()
			->with(
				'wp_yoast_expiring_store',
				[ 'key_name' => 'blog_1_my_key' ],
				[ '%s' ],
			);

		$this->instance->delete( 'blog_1_my_key' );
	}

	/**
	 * Tests delete_expired returns the number of deleted rows.
	 *
	 * @covers ::delete_expired
	 * @covers ::get_table_name
	 *
	 * @return void
	 */
	public function test_delete_expired() {
		$this->wpdb
			->expects( 'prepare' )
			->once()
			->with(
				'DELETE FROM %i WHERE `exp` <= %s',
				'wp_yoast_expiring_store',
				'2026-01-01 00:00:00',
			)
			->andReturn( 'prepared_sql' );

		$this->wpdb
			->expects( 'query' )
			->once()
			->with( 'prepared_sql' );

		$this->wpdb->rows_affected = 3;

		$result = $this->instance->delete_expired( '2026-01-01 00:00:00' );

		$this->assertSame( 3, $result );
	}
}
