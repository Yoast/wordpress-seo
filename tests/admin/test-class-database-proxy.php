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
		self::$proxy = new WPSEO_Database_Proxy( $wpdb, self::$proxy_table_name, true );
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
		self::$proxy->insert(
			array(
				'testkey' => 'key1',
				'testval' => 'value1',
			),
			array( '%s', '%s' )
		);

		$installer = new WPSEO_Link_Installer();
		$installer->install();
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

	public function test_insert_exists() {
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

	public function test_insert_invalid() {
		$result = self::$proxy->insert(
			array(
				'testvalue' => 'value2',
			),
			array( '%s' )
		);

		$this->assertFalse( $result );
	}

	public function test_update() {
		$result = self::$proxy->update(
			array(
				'testval' => 'value2',
			),
			array(
				'testkey' => 'key1',
			),
			array( '%s' ),
			array( '%s' )
		);

		$this->assertSame( 1, $result );
	}

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
			array( '%d', '%s', '%s' ),
			array( '%d' )
		);

		$this->assertSame( 1, $result );
	}

	public function test_upsert_existing() {
		$result = self::$proxy->upsert(
			array(
				'id'      => 1,
				'testkey' => 'key2',
				'testval' => 'value2',
			),
			array(
				'id' => 1,
			),
			array( '%d', '%s', '%s' ),
			array( '%d' )
		);

		$this->assertSame( 1, $result );
	}

	public function test_delete() {
		$result = self::$proxy->delete(
			array(
				'testkey' => 'key1',
			),
			array( '%s' )
		);

		$this->assertSame( 1, $result );
	}

	public function test_delete_not_exists() {
		$result = self::$proxy->delete(
			array(
				'testkey' => 'key2',
			),
			array( '%s' )
		);

		$this->assertSame( 0, $result );
	}

	public function test_delete_invalid() {
		$result = self::$proxy->delete(
			array(
				'testvalue' => 'key1',
			),
			array( '%s' )
		);

		$this->assertFalse( $result );
	}

	public function test_get_results() {
		$table_name = self::$proxy->get_table_name();

		$result = self::$proxy->get_results( "SELECT * FROM $table_name WHERE testkey = 'key1'" );

		$expected = array(
			(object) array(
				'id'      => 1,
				'testkey' => 'key1',
				'testval' => 'value1',
			),
		);

		$this->assertEquals( $expected, $result );
	}

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

	public function test_has_error() {
		$this->assertFalse( self::$proxy->has_error() );
	}

	public function test_get_table_name() {
		global $wpdb;

		$expected = $wpdb->get_blog_prefix() . self::$proxy_table_name;
		$result   = self::$proxy->get_table_name();

		$this->assertSame( $expected, $result );
	}

	public function test_get_table_name_global() {
		global $wpdb;

		$proxy_table_name = self::$proxy_table_name . '_duplicate';
		$proxy            = new WPSEO_Database_Proxy( $wpdb, $proxy_table_name, true, true );

		$expected = $wpdb->base_prefix . $proxy_table_name;
		$result   = $proxy->get_table_name();

		$this->assertSame( $expected, $result );
	}

	public function test_register_table() {
		global $wpdb;

		$proxy_table_name = self::$proxy_table_name . '_duplicate';
		$proxy            = new WPSEO_Database_Proxy( $wpdb, $proxy_table_name, true );

		$this->assertTrue( in_array( $proxy_table_name, $wpdb->tables, true ) );
	}

	public function test_register_table_global() {
		global $wpdb;

		$proxy_table_name = self::$proxy_table_name . '_duplicate';
		$proxy            = new WPSEO_Database_Proxy( $wpdb, $proxy_table_name, true, true );

		$this->assertTrue( in_array( $proxy_table_name, $wpdb->ms_global_tables, true ) );
	}
}
