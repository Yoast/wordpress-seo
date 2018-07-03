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

	/** @var string */
	private static $proxy_table_name;

	/** @var WPSEO_Database_Proxy */
	private static $proxy;

	/**
	 * Instantiates a reusable table proxy and creates the table.
	 */
	public static function setUpBeforeClass() {
		parent::setUpBeforeClass();

		global $wpdb;

		self::$proxy_table_name = 'yoast_seo_test_table';
		self::$proxy            = new WPSEO_Database_Proxy( $wpdb, self::$proxy_table_name, true );
		self::$proxy->create_table(
			array(
				'id bigint(20) unsigned NOT NULL AUTO_INCREMENT',
				'testkey varchar(255) NOT NULL',
				'testval longtext NOT NULL',
			),
			array(
				'PRIMARY KEY (id)',
			)
		);

		$installer = new WPSEO_Link_Installer();
		$installer->install();
	}

	/**
	 * Truncates the table before each test.
	 *
	 * @return void
	 */
	public function setUp() {
		parent::setUp();

		global $wpdb;

		$tablename = self::$proxy->get_table_name();
		$wpdb->query( "TRUNCATE TABLE $tablename" );
	}

	/**
	 * Drops the table from the proxy.
	 */
	public static function tearDownAfterClass() {
		parent::tearDownAfterClass();

		global $wpdb;

		$full_table_name = self::$proxy->get_table_name();

		$wpdb->query( "DROP TABLE {$full_table_name}" );
	}

	/**
	 * Tests inserting a valid dataset into the database.
	 *
	 * @covers WPSEO_Database_Proxy::insert()
	 */
	public function test_insert() {
		$result = self::$proxy->insert(
			array(
				'testkey' => 'key2',
				'testval' => 'value2',
			),
			array( '%s', '%s' )
		);

		$this->assertSame( 1, $result );
	}

	/**
	 * Tests inserting a dataset with an existing ID into the database.
	 *
	 * @covers WPSEO_Database_Proxy::insert()
	 */
	public function test_insert_exists() {
		self::$proxy->insert(
			array(
				'testkey' => 'key2',
				'testval' => 'value2',
			),
			array( '%s', '%s' )
		);

		$result = self::$proxy->insert(
			array(
				'id'      => 1,
				'testkey' => 'key2',
				'testval' => 'value2',
			),
			array( '%d', '%s', '%s' )
		);

		$this->assertFalse( $result );
	}

	/**
	 * Tests inserting an invalid dataset into the database.
	 *
	 * @covers WPSEO_Database_Proxy::insert()
	 */
	public function test_insert_invalid() {
		$result = self::$proxy->insert(
			array(
				'testvalue' => 'value2',
			),
			array( '%s' )
		);

		$this->assertFalse( $result );
	}

	/**
	 * Tests updating a valid dataset in the database.
	 *
	 * @covers WPSEO_Database_Proxy::update()
	 */
	public function test_update() {
		self::$proxy->insert(
			array(
				'testkey' => 'key2',
				'testval' => 'value2',
			),
			array( '%s', '%s' )
		);

		$result = self::$proxy->update(
			array(
				'testval' => 'value3',
			),
			array(
				'testkey' => 'key2',
			),
			array( '%s' ),
			array( '%s' )
		);

		$this->assertSame( 1, $result );
	}

	/**
	 * Tests updating a not existing dataset in the database.
	 *
	 * @covers WPSEO_Database_Proxy::update()
	 */
	public function test_update_not_exists() {
		$result = self::$proxy->update(
			array(
				'testval' => 'value2',
			),
			array(
				'testkey' => 'key2',
			),
			array( '%s' ),
			array( '%s' )
		);

		$this->assertSame( 0, $result );
	}

	/**
	 * Tests updating an invalid dataset in the database.
	 *
	 * @covers WPSEO_Database_Proxy::update()
	 */
	public function test_update_invalid() {
		$result = self::$proxy->update(
			array(
				'testvalue' => 'value2',
			),
			array(
				'testkey' => 'key1',
			),
			array( '%s' ),
			array( '%s' )
		);

		$this->assertFalse( $result );
	}

	/**
	 * Tests inserting or otherwise updating a valid dataset in the database.
	 *
	 * @covers WPSEO_Database_Proxy::upsert()
	 */
	public function test_upsert_new() {
		$result = self::$proxy->upsert(
			array(
				'id'      => 2,
				'testkey' => 'key2',
				'testval' => 'value2',
			),
			array(
				'id' => 2,
			),
			array( '%d', '%s', '%s' )
		);

		$this->assertSame( 1, $result );
	}

	/**
	 * Tests inserting or otherwise updating an existing dataset in the database.
	 *
	 * @covers WPSEO_Database_Proxy::upsert()
	 */
	public function test_upsert_existing() {
		self::$proxy->insert(
			array(
				'id'      => 10,
				'testkey' => 'key10',
				'testval' => 'value10-1',
			),
			array( '%d', '%s', '%s' )
		);

		$result = self::$proxy->upsert(
			array(
				'id'      => 10,
				'testkey' => 'key10',
				'testval' => 'value10-2',
			),
			array(
				'id' => 10,
			),
			array( '%d', '%s', '%s' )
		);

		/**
		 * The result of Upsert is the number of affected rows.
		 * As it internally does an Insert and then an Update, it will count as 2 rows.
		 *
		 * @see https://dev.mysql.com/doc/refman/8.0/en/insert-on-duplicate.html
		 * "With ON DUPLICATE KEY UPDATE, the affected-rows value per row is 1 if the row is inserted as a new row and 2 if an existing row is updated."
		 */
		$this->assertSame( 2, $result );

		// Verify the data has been set as expected.
		$table_name = self::$proxy->get_table_name();
		$results    = self::$proxy->get_results( "SELECT * FROM $table_name WHERE testkey = 'key10'" );

		$this->assertEquals(
			(object) array(
				'id'      => 10,
				'testkey' => 'key10',
				'testval' => 'value10-2'
			),
			$results[0]
		);
	}

	/**
	 * Tests deleting a valid dataset from the database.
	 *
	 * @covers WPSEO_Database_Proxy::delete()
	 */
	public function test_delete() {
		self::$proxy->insert(
			array(
				'testkey' => 'key1',
				'testval' => 'value',
			),
			array( '%s', '%s' )
		);

		$result = self::$proxy->delete(
			array(
				'testkey' => 'key1',
			),
			array( '%s' )
		);

		$this->assertSame( 1, $result );
	}

	/**
	 * Tests deleting a not existing dataset from the database.
	 *
	 * @covers WPSEO_Database_Proxy::delete()
	 */
	public function test_delete_not_exists() {
		$result = self::$proxy->delete(
			array(
				'testkey' => 'key2',
			),
			array( '%s' )
		);

		$this->assertSame( 0, $result );
	}

	/**
	 * Tests deleting an invalid dataset from the database.
	 *
	 * @covers WPSEO_Database_Proxy::delete()
	 */
	public function test_delete_invalid() {
		$result = self::$proxy->delete(
			array(
				'testvalue' => 'key1',
			),
			array( '%s' )
		);

		$this->assertFalse( $result );
	}

	/**
	 * Tests querying results from the database.
	 *
	 * @covers WPSEO_Database_Proxy::get_results()
	 */
	public function test_get_results() {
		$table_name = self::$proxy->get_table_name();

		self::$proxy->insert(
			array(
				'testkey' => 'key1',
				'testval' => 'value',
			),
			array( '%s', '%s' )
		);

		$result = self::$proxy->get_results( "SELECT * FROM $table_name WHERE testkey = 'key1'" );

		$expected = array(
			(object) array(
				'id'      => 1,
				'testkey' => 'key1',
				'testval' => 'value',
			),
		);

		$this->assertEquals( $expected, $result );
	}

	/**
	 * Tests creating a table in the database from columns definition.
	 *
	 * @covers WPSEO_Database_Proxy::create_table()
	 */
	public function test_create_table() {
		global $wpdb;

		$proxy_table_name = self::$proxy_table_name . '_duplicate';
		$proxy            = new WPSEO_Database_Proxy( $wpdb, $proxy_table_name, true );

		$result = $proxy->create_table(
			array(
				'id bigint(20) unsigned NOT NULL AUTO_INCREMENT',
				'testkey varchar(255) NOT NULL',
				'testval longtext NOT NULL',
			),
			array(
				'PRIMARY KEY (id)',
			)
		);

		$this->assertTrue( $result );
	}

	/**
	 * Tests checking whether the last database request resulted in an error.
	 *
	 * @covers WPSEO_Database_Proxy::has_error()
	 */
	public function test_has_error() {
		$this->assertFalse( self::$proxy->has_error() );
	}

	/**
	 * Tests correctness of the full prefixed table name for a regular table.
	 *
	 * @covers WPSEO_Database_Proxy::get_table_name()
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
	 * @covers WPSEO_Database_Proxy::get_table_name()
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
	 * @covers WPSEO_Database_Proxy::register_table()
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
	 * @covers WPSEO_Database_Proxy::register_table()
	 */
	public function test_register_table_global() {
		global $wpdb;

		$proxy_table_name = self::$proxy_table_name . '_duplicate';
		$proxy            = new WPSEO_Database_Proxy( $wpdb, $proxy_table_name, true, true );

		$this->assertTrue( in_array( $proxy_table_name, $wpdb->ms_global_tables, true ) );
	}
}
