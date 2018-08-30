<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Admin\Links
 */

/**
 * Unit Test Class.
 */
class WPSEO_Link_Columns_Test extends WPSEO_UnitTestCase {

	/**
	 * Creates the table to make sure the tests for this class can be executed.
	 */
	public static function setUpBeforeClass() {
		parent::setUpBeforeClass();

		$installer = new WPSEO_Link_Installer();
		$installer->install();
	}

	/**
	 * Drops the table when all tests for this class are executed.
	 */
	public static function tearDownAfterClass() {
		parent::tearDownAfterClass();

		global $wpdb;

		$storage      = new WPSEO_Link_Storage();
		$meta_storage = new WPSEO_Meta_Storage();

		$wpdb->query( 'DROP TABLE ' . $storage->get_table_name() );
		$wpdb->query( 'DROP TABLE ' . $meta_storage->get_table_name() );

		delete_transient( 'wpseo_link_table_inaccessible' );
		delete_transient( 'wpseo_meta_table_inaccessible' );
	}

	/**
	 * Set up.
	 */
	public function setUp() {
		parent::setUp();

		$GLOBALS['pagenow'] = 'edit.php';
	}

	/**
	 * Tests the registering of the hooks.
	 */
	public function test_register_hooks() {
		$link_columns = new WPSEO_Link_Columns( new WPSEO_Meta_Storage() );
		$link_columns->register_hooks();

		$this->assertFalse(
			has_action( 'admin_init', array( $link_columns, 'set_count_objects' ) )
		);
	}

	/**
	 * Tests the registering of the hooks of post columns.
	 */
	public function test_register_hooks_on_upload_page() {
		$GLOBALS['pagenow'] = 'upload.php';

		/** @var WPSEO_Link_Columns $link_columns */
		$link_columns = $this
			->getMockBuilder( 'WPSEO_Link_Columns' )
			->setConstructorArgs( array( new WPSEO_Meta_Storage() ) )
			->setMethods( array( 'set_post_type_hooks' ) )
			->getMock();

		$link_columns
			->expects( $this->never() )
			->method( 'set_post_type_hooks' );

		$link_columns->register_hooks();
	}

	/**
	 * Tests the addition of post columns.
	 */
	public function test_add_post_columns() {
		$link_columns = new WPSEO_Link_Columns( new WPSEO_Meta_Storage() );
		$expected     = array(
			'wpseo-links'  => '<span class="yoast-linked-to yoast-column-header-has-tooltip" data-label="Number of internal links in this post. See &quot;Yoast Columns&quot; text in the help tab for more info."><span class="screen-reader-text"># links in post</span></span>',
			'wpseo-linked' => '<span class="yoast-linked-from yoast-column-header-has-tooltip" data-label="Number of internal links linking to this post. See &quot;Yoast Columns&quot; text in the help tab for more info."><span class="screen-reader-text"># internal links to</span></span>',
		);

		$this->assertEquals(
			$expected,
			$link_columns->add_post_columns( array() )
		);
	}

	/**
	 * Tests the addition of post columns with a non-array value.
	 */
	public function test_add_faulty_post_columns() {
		$link_columns = new WPSEO_Link_Columns( new WPSEO_Meta_Storage() );

		$this->assertTrue( $link_columns->add_post_columns( true ) );
	}

	/**
	 * Test set_count_objects to set the object correctly.
	 */
	public function test_set_count_objects() {
		$link_columns = new WPSEO_Link_Columns( new WPSEO_Meta_Storage() );
		$link_columns->set_count_objects();

		$this->assertAttributeInstanceOf( 'WPSEO_Link_Column_Count', 'link_count', $link_columns );
	}

	/**
	 * Test the getting of the column content
	 */
	public function test_column_content() {
		$link_columns = new WPSEO_Link_Columns( new WPSEO_Meta_Storage() );
		$link_columns->set_count_objects();

		$link_columns->column_content( 'wpseo-links', 1 );
		$this->expectOutput( '' );

		$link_columns->column_content( 'wpseo-linked', 1 );
		$this->expectOutput( '' );
	}

	/**
	 * Tests column_sort.
	 */
	public function test_column_sort() {
		$link_columns = new WPSEO_Link_Columns( new WPSEO_Meta_Storage() );

		$this->assertEquals(
			array(
				'wpseo-links'  => 'wpseo-links',
				'wpseo-linked' => 'wpseo-linked',
			),
			$link_columns->column_sort( array() )
		);
	}
}
