<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Admin
 */

/**
 * Unit Test Class.
 */
class WPSEO_Database_Proxy_Test extends WPSEO_UnitTestCase {

	/**
	 * Table name for use by the DB Proxy.
	 *
	 * @var string
	 */
	private static $proxy_table_name;

	/**
	 * Holds the instance of the class being tested.
	 *
	 * @var WPSEO_Database_Proxy
	 */
	private static $proxy;

	/**
	 * Instantiates a reusable table proxy and creates the table.
	 */
	public static function set_up_before_class() {
		parent::set_up_before_class();

		global $wpdb;

		self::$proxy_table_name = 'yoast_seo_test_table';
		self::$proxy            = new WPSEO_Database_Proxy( $wpdb, self::$proxy_table_name, true );
		self::$proxy->create_table(
			[
				'id bigint(20) unsigned NOT NULL AUTO_INCREMENT',
				'testkey varchar(255) NOT NULL',
				'testval longtext NOT NULL',
			],
			[
				'PRIMARY KEY (id)',
			]
		);
	}

	/**
	 * Truncates the table before each test.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		global $wpdb;

		$tablename = self::$proxy->get_table_name();
		$wpdb->query( "TRUNCATE TABLE $tablename" );
	}

	/**
	 * Drops the table from the proxy.
	 */
	public static function tear_down_after_class() {
		global $wpdb;

		$full_table_name = self::$proxy->get_table_name();

		$wpdb->query( "DROP TABLE {$full_table_name}" );

		parent::tear_down_after_class();
	}

	/**
	 * Tests inserting a valid dataset into the database.
	 *
	 * @covers WPSEO_Database_Proxy::insert
	 */
	public function test_insert() {
		$result = self::$proxy->insert(
			[
				'testkey' => 'key2',
				'testval' => 'value2',
			],
			[ '%s', '%s' ]
		);

		$this->assertSame( 1, $result );
	}

	/**
	 * Tests inserting a dataset with an existing ID into the database.
	 *
	 * @covers WPSEO_Database_Proxy::insert
	 */
	public function test_insert_exists() {
		self::$proxy->insert(
			[
				'testkey' => 'key2',
				'testval' => 'value2',
			],
			[ '%s', '%s' ]
		);

		$result = self::$proxy->insert(
			[
				'id'      => 1,
				'testkey' => 'key2',
				'testval' => 'value2',
			],
			[ '%d', '%s', '%s' ]
		);

		$this->assertFalse( $result );
	}

	/**
	 * Tests inserting an invalid dataset into the database.
	 *
	 * @covers WPSEO_Database_Proxy::insert
	 */
	public function test_insert_invalid() {
		$result = self::$proxy->insert(
			[
				'testvalue' => 'value2',
			],
			[ '%s' ]
		);

		$this->assertFalse( $result );
	}

	/**
	 * Tests updating a valid dataset in the database.
	 *
	 * @covers WPSEO_Database_Proxy::update
	 */
	public function test_update() {
		self::$proxy->insert(
			[
				'testkey' => 'key2',
				'testval' => 'value2',
			],
			[ '%s', '%s' ]
		);

		$result = self::$proxy->update(
			[
				'testval' => 'value3',
			],
			[
				'testkey' => 'key2',
			],
			[ '%s' ],
			[ '%s' ]
		);

		$this->assertSame( 1, $result );
	}

	/**
	 * Tests updating a not existing dataset in the database.
	 *
	 * @covers WPSEO_Database_Proxy::update
	 */
	public function test_update_not_exists() {
		$result = self::$proxy->update(
			[
				'testval' => 'value2',
			],
			[
				'testkey' => 'key2',
			],
			[ '%s' ],
			[ '%s' ]
		);

		$this->assertSame( 0, $result );
	}

	/**
	 * Tests updating an invalid dataset in the database.
	 *
	 * @covers WPSEO_Database_Proxy::update
	 */
	public function test_update_invalid() {
		$result = self::$proxy->update(
			[
				'testvalue' => 'value2',
			],
			[
				'testkey' => 'key1',
			],
			[ '%s' ],
			[ '%s' ]
		);

		$this->assertFalse( $result );
	}

	/**
	 * Tests inserting or otherwise updating a valid dataset in the database.
	 *
	 * @covers WPSEO_Database_Proxy::upsert
	 */
	public function test_upsert_new() {
		$result = self::$proxy->upsert(
			[
				'id'      => 2,
				'testkey' => 'key2',
				'testval' => 'value2',
			],
			[
				'id' => 2,
			],
			[ '%d', '%s', '%s' ]
		);

		$this->assertSame( 1, $result );
	}

	/**
	 * Tests inserting or otherwise updating an existing dataset in the database.
	 *
	 * @covers WPSEO_Database_Proxy::upsert
	 */
	public function test_upsert_existing() {
		self::$proxy->insert(
			[
				'id'      => 10,
				'testkey' => 'key10',
				'testval' => 'value10-1',
			],
			[ '%d', '%s', '%s' ]
		);

		$result = self::$proxy->upsert(
			[
				'id'      => 10,
				'testkey' => 'key10',
				'testval' => 'value10-2',
			],
			[
				'id' => 10,
			],
			[ '%d', '%s', '%s' ]
		);

		/*
		 * The result of Upsert is the number of affected rows.
		 * As it internally does an Insert and then an Update, it will count as 2 rows.
		 *
		 * {@link https://dev.mysql.com/doc/refman/8.0/en/insert-on-duplicate.html}
		 * "With ON DUPLICATE KEY UPDATE, the affected-rows value per row is 1 if the row
		 *  is inserted as a new row and 2 if an existing row is updated."
		 */
		$this->assertSame( 2, $result );

		// Verify the data has been set as expected.
		$table_name = self::$proxy->get_table_name();
		$results    = self::$proxy->get_results( "SELECT * FROM $table_name WHERE testkey = 'key10'" );

		$this->assertEquals(
			(object) [
				'id'      => 10,
				'testkey' => 'key10',
				'testval' => 'value10-2',
			],
			$results[0]
		);
	}

	/**
	 * Tests deleting a valid dataset from the database.
	 *
	 * @covers WPSEO_Database_Proxy::delete
	 */
	public function test_delete() {
		self::$proxy->insert(
			[
				'testkey' => 'key1',
				'testval' => 'value',
			],
			[ '%s', '%s' ]
		);

		$result = self::$proxy->delete(
			[
				'testkey' => 'key1',
			],
			[ '%s' ]
		);

		$this->assertSame( 1, $result );
	}

	/**
	 * Tests deleting a not existing dataset from the database.
	 *
	 * @covers WPSEO_Database_Proxy::delete
	 */
	public function test_delete_not_exists() {
		$result = self::$proxy->delete(
			[
				'testkey' => 'key2',
			],
			[ '%s' ]
		);

		$this->assertSame( 0, $result );
	}

	/**
	 * Tests deleting an invalid dataset from the database.
	 *
	 * @covers WPSEO_Database_Proxy::delete
	 */
	public function test_delete_invalid() {
		$result = self::$proxy->delete(
			[
				'testvalue' => 'key1',
			],
			[ '%s' ]
		);

		$this->assertFalse( $result );
	}

	/**
	 * Tests querying results from the database.
	 *
	 * @covers WPSEO_Database_Proxy::get_results
	 */
	public function test_get_results() {
		$table_name = self::$proxy->get_table_name();

		self::$proxy->insert(
			[
				'testkey' => 'key1',
				'testval' => 'value',
			],
			[ '%s', '%s' ]
		);

		$result = self::$proxy->get_results( "SELECT * FROM $table_name WHERE testkey = 'key1'" );

		$expected = [
			(object) [
				'id'      => 1,
				'testkey' => 'key1',
				'testval' => 'value',
			],
		];

		$this->assertEquals( $expected, $result );
	}

	/**
	 * Tests creating a table in the database from columns definition.
	 *
	 * @covers WPSEO_Database_Proxy::create_table
	 */
	public function test_create_table() {
		global $wpdb;

		$proxy_table_name = self::$proxy_table_name . '_duplicate';
		$proxy            = new WPSEO_Database_Proxy( $wpdb, $proxy_table_name, true );

		$result = $proxy->create_table(
			[
				'id bigint(20) unsigned NOT NULL AUTO_INCREMENT',
				'testkey varchar(255) NOT NULL',
				'testval longtext NOT NULL',
			],
			[
				'PRIMARY KEY (id)',
			]
		);

		$this->assertTrue( $result );
	}

	/**
	 * Tests checking whether the last database request resulted in an error.
	 *
	 * @covers WPSEO_Database_Proxy::has_error
	 */
	public function test_has_error() {
		$this->assertFalse( self::$proxy->has_error() );
	}

	/**
	 * Tests correctness of the full prefixed table name for a regular table.
	 *
	 * @covers WPSEO_Database_Proxy::get_table_name
	 */
	public function test_get_table_name() {
		global $wpdb;

		$expected = $wpdb->get_blog_prefix() . self::$proxy_table_name;
		$result   = self::$proxy->get_table_name();

		$this->assertSame( $expected, $result );
	}

	/**
	 * Tests correctness of the full prefixed table name for a global table.
	 *
	 * @covers WPSEO_Database_Proxy::get_table_name
	 */
	public function test_get_table_name_global() {
		global $wpdb;

		$proxy_table_name = self::$proxy_table_name . '_duplicate';
		$proxy            = new WPSEO_Database_Proxy( $wpdb, $proxy_table_name, true, true );

		$expected = $wpdb->base_prefix . $proxy_table_name;
		$result   = $proxy->get_table_name();

		$this->assertSame( $expected, $result );
	}

	/**
	 * Tests correct registration of a regular table with WordPress.
	 *
	 * @covers WPSEO_Database_Proxy::register_table
	 */
	public function test_register_table() {
		global $wpdb;

		$proxy_table_name = self::$proxy_table_name . '_duplicate';
		$proxy            = new WPSEO_Database_Proxy( $wpdb, $proxy_table_name, true );

		$this->assertTrue( in_array( $proxy_table_name, $wpdb->tables, true ) );
	}

	/**
	 * Tests correct registration of a global table with WordPress.
	 *
	 * @covers WPSEO_Database_Proxy::register_table
	 */
	public function test_register_table_global() {
		global $wpdb;

		$proxy_table_name = self::$proxy_table_name . '_duplicate';
		$proxy            = new WPSEO_Database_Proxy( $wpdb, $proxy_table_name, true, true );

		$this->assertTrue( in_array( $proxy_table_name, $wpdb->ms_global_tables, true ) );
	}
}
