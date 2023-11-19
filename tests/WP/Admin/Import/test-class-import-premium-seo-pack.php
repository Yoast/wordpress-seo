<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Admin\Import\Plugins
 */

/**
 * Test importing meta data from AIOSEO.
 */
class WPSEO_Import_Premium_SEO_Pack_Test extends WPSEO_UnitTestCase {

	/**
	 * Holds the class instance.
	 *
	 * @var WPSEO_Import_Premium_SEO_Pack
	 */
	private $class_instance;

	/**
	 * Sets up the test class.
	 */
	public function set_up() {
		parent::set_up();
		$this->class_instance = new WPSEO_Import_Premium_SEO_Pack();
	}

	/**
	 * Drops our table and returns to normal WPDB testing state.
	 */
	public function tear_down() {
		$this->class_instance->run_cleanup();

		add_filter( 'query', [ $this, '_create_temporary_tables' ] );
		add_filter( 'query', [ $this, '_drop_temporary_tables' ] );

		parent::tear_down();
	}

	/**
	 * Tests the plugin name function.
	 *
	 * @covers WPSEO_Import_Premium_SEO_Pack::get_plugin_name
	 */
	public function test_plugin_name() {
		$this->assertEquals( 'Premium SEO Pack', $this->class_instance->get_plugin_name() );
	}

	/**
	 * Tests whether this importer has been registered.
	 *
	 * @covers WPSEO_Plugin_Importers::get
	 */
	public function test_importer_registered() {
		$this->assertContains( 'WPSEO_Import_Premium_SEO_Pack', WPSEO_Plugin_Importers::get() );
	}

	/**
	 * Tests whether we can return false when there's no detectable data.
	 *
	 * @covers WPSEO_Import_Premium_SEO_Pack::__construct
	 * @covers WPSEO_Import_Premium_SEO_Pack::run_detect
	 * @covers WPSEO_Import_Premium_SEO_Pack::detect
	 */
	public function test_detect_without_data() {
		$expected = $this->status( 'detect', false );
		$return   = $this->class_instance->run_detect();

		$this->assertEquals( $expected, $return );
	}

	/**
	 * Tests whether we can detect data.
	 *
	 * @covers WPSEO_Import_Premium_SEO_Pack::run_detect
	 * @covers WPSEO_Import_Premium_SEO_Pack::detect
	 */
	public function test_detect_with_data() {
		$this->setup_post();
		$this->assertEquals( $this->status( 'detect', true ), $this->class_instance->run_detect() );
	}

	/**
	 * Tests whether we can return properly when there's nothing to import.
	 *
	 * @covers WPSEO_Import_Premium_SEO_Pack::run_import
	 */
	public function test_import_without_data() {
		$result = $this->class_instance->run_import();
		$this->assertEquals( $this->status( 'import', false ), $result );
	}

	/**
	 * Tests whether we can properly import data.
	 *
	 * @covers WPSEO_Import_Premium_SEO_Pack::run_import
	 * @covers WPSEO_Import_Premium_SEO_Pack::import
	 * @covers WPSEO_Import_Squirrly::import_post_values
	 * @covers WPSEO_Import_Squirrly::retrieve_post_data
	 * @covers WPSEO_Import_Squirrly::maybe_add_focus_kw
	 * @covers WPSEO_Import_Premium_SEO_Pack::retrieve_posts_query
	 * @covers WPSEO_Import_Premium_SEO_Pack::retrieve_posts
	 */
	public function test_import_with_data() {
		$post_id = $this->setup_post();
		$result  = $this->class_instance->run_import();

		$seo_title       = get_post_meta( $post_id, WPSEO_Meta::$meta_prefix . 'title', true );
		$seo_desc        = get_post_meta( $post_id, WPSEO_Meta::$meta_prefix . 'metadesc', true );
		$robots_noindex  = get_post_meta( $post_id, WPSEO_Meta::$meta_prefix . 'meta-robots-noindex', true );
		$robots_nofollow = get_post_meta( $post_id, WPSEO_Meta::$meta_prefix . 'meta-robots-nofollow', true );
		$opengraph_image = get_post_meta( $post_id, WPSEO_Meta::$meta_prefix . 'opengraph-image', true );
		$opengraph_title = get_post_meta( $post_id, WPSEO_Meta::$meta_prefix . 'opengraph-title', true );
		$cornerstone     = get_post_meta( $post_id, '_yst_is_cornerstone', true );

		$this->assertEquals( 'Test title', $seo_title );
		$this->assertEquals( 'Test description', $seo_desc );
		$this->assertEquals( '', $robots_noindex );
		$this->assertEquals( 1, $robots_nofollow );
		$this->assertEquals( 'http://local.wordpress.test/wp-content/uploads/2018/01/actionable-seo.png', $opengraph_image );
		$this->assertEquals( 'OpenGraph AIOSEO title', $opengraph_title );
		$this->assertEquals( 1, $cornerstone );
		$this->assertEquals( $this->status( 'import', true ), $result );
	}

	/**
	 * Tests whether we will not overwrite already existing Yoast SEO data with imported data.
	 *
	 * @covers WPSEO_Import_Premium_SEO_Pack::run_import
	 * @covers WPSEO_Import_Premium_SEO_Pack::import
	 * @covers WPSEO_Import_Premium_SEO_Pack::import_meta_helper
	 * @covers WPSEO_Import_Squirrly::import_post_values
	 * @covers WPSEO_Import_Premium_SEO_Pack::maybe_save_post_meta
	 * @covers WPSEO_Import_Squirrly::retrieve_post_data
	 */
	public function test_import_without_overwriting_data() {
		$post_id = $this->setup_post( true );
		$result  = $this->class_instance->run_import();

		$seo_title       = get_post_meta( $post_id, WPSEO_Meta::$meta_prefix . 'title', true );
		$seo_desc        = get_post_meta( $post_id, WPSEO_Meta::$meta_prefix . 'metadesc', true );
		$robots_noindex  = get_post_meta( $post_id, WPSEO_Meta::$meta_prefix . 'meta-robots-noindex', true );
		$robots_nofollow = get_post_meta( $post_id, WPSEO_Meta::$meta_prefix . 'meta-robots-nofollow', true );
		$opengraph_image = get_post_meta( $post_id, WPSEO_Meta::$meta_prefix . 'opengraph-image', true );
		$opengraph_title = get_post_meta( $post_id, WPSEO_Meta::$meta_prefix . 'opengraph-title', true );

		$this->assertEquals( 'Test title', $seo_title );
		$this->assertEquals( 'Existing Yoast SEO Test description', $seo_desc );
		$this->assertEquals( 0, $robots_noindex );
		$this->assertEquals( 1, $robots_nofollow );
		$this->assertEquals( 'http://local.wordpress.test/wp-content/uploads/2018/01/actionable-seo.png', $opengraph_image );
		$this->assertEquals( 'Pre-existing Yoast SEO test OpenGraph title', $opengraph_title );
		$this->assertEquals( $this->status( 'import', true ), $result );
	}

	/**
	 * Tests whether we will not overwrite already existing Yoast SEO data with imported data.
	 *
	 * @covers WPSEO_Import_Premium_SEO_Pack::run_import
	 * @covers WPSEO_Import_Premium_SEO_Pack::import
	 * @covers WPSEO_Import_Premium_SEO_Pack::import_meta_helper
	 * @covers WPSEO_Import_Squirrly::import_post_values
	 * @covers WPSEO_Import_Squirrly::retrieve_post_data
	 */
	public function test_import_without_seo_column_in_db() {
		$this->setup_post();
		global $wpdb;
		$wpdb->query( "ALTER TABLE {$wpdb->prefix}psp DROP COLUMN seo" );

		$wpdb->suppress_errors( true );
		$result = $this->class_instance->run_import();
		$wpdb->suppress_errors( false );

		$this->assertEquals( $this->status( 'import', false ), $result );
	}

	/**
	 * Tests whether we can properly return an error when there is no data to clean.
	 *
	 * @covers WPSEO_Import_Premium_SEO_Pack::run_cleanup
	 */
	public function test_cleanup_without_data() {
		$result = $this->class_instance->run_cleanup();
		$this->assertEquals( $this->status( 'cleanup', false ), $result );
	}

	/**
	 * Tests whether we can properly clean up.
	 *
	 * @covers WPSEO_Import_Premium_SEO_Pack::run_cleanup
	 * @covers WPSEO_Import_Premium_SEO_Pack::cleanup
	 */
	public function test_cleanup() {
		$this->setup_post();
		$result = $this->class_instance->run_cleanup();

		global $wpdb;
		$db_result = $wpdb->get_var( "SHOW TABLES LIKE '{$wpdb->prefix}psp'" );

		$this->assertNull( $db_result );
		$this->assertEquals( $this->status( 'cleanup', true ), $result );
	}

	/**
	 * Tests whether can handle a cleanup gone wrong.
	 *
	 * @covers WPSEO_Import_Premium_SEO_Pack::__construct
	 * @covers WPSEO_Import_Premium_SEO_Pack::run_cleanup
	 * @covers WPSEO_Import_Premium_SEO_Pack::cleanup
	 * @covers WPSEO_Plugin_Importer::cleanup
	 * @covers WPSEO_Import_Premium_SEO_Pack::cleanup_error_msg
	 */
	public function test_cleanup_gone_bad() {
		$class_instance = new WPSEO_Import_Premium_SEO_Pack();

		$this->setup_post();

		global $wpdb;
		$original_wpdb = $wpdb;

		$wpdb = $this->getMockBuilder( 'wpdb' )
			->setConstructorArgs( [ DB_USER, DB_PASSWORD, DB_NAME, DB_HOST ] )
			->setMethods( [ 'query', 'get_var' ] )
			->getMock();
		$wpdb->expects( $this->any() )
			->method( 'query' )
			->will( $this->returnValue( false ) );

		// For this to work the detect() function needs to run first and return the right table.
		$wpdb->expects( $this->any() )
			->method( 'get_var' )
			->will( $this->returnValue( $wpdb->prefix . 'psp' ) );

		$result          = $class_instance->run_cleanup();
		$expected_result = $this->status( 'cleanup', false );
		$expected_result->set_msg( 'Cleanup of Premium SEO Pack data failed.' );
		$this->assertEquals( $expected_result, $result );

		$wpdb = $original_wpdb;
	}

	/**
	 * Returns a WPSEO_Import_Status object to check against.
	 *
	 * @param string $action The action to return.
	 * @param bool   $status The status.
	 *
	 * @return WPSEO_Import_Status Import status object.
	 */
	private function status( $action, $status ) {
		return new WPSEO_Import_Status( $action, $status );
	}

	/**
	 * Sets up a test post.
	 *
	 * @param bool $pre_existing_yoast_data Whether or not to insert pre-existing Yoast SEO data.
	 *
	 * @return int ID for the post created.
	 */
	private function setup_post( $pre_existing_yoast_data = false ) {
		$this->create_table();

		$post_id = $this->factory()->post->create();
		$blob    = $this->build_data_blob(
			[
				'noindex'     => 0,
				'nofollow'    => 1,
				'title'       => 'Test title',
				'description' => 'Test description',
				'og_media'    => 'http://local.wordpress.test/wp-content/uploads/2018/01/actionable-seo.png',
				'og_title'    => 'OpenGraph AIOSEO title',
				'cornerstone' => 1,
			]
		);
		$this->insert_post( $post_id, $blob );

		if ( $pre_existing_yoast_data ) {
			update_post_meta( $post_id, '_yoast_wpseo_metadesc', 'Existing Yoast SEO Test description' );
			update_post_meta( $post_id, '_yoast_wpseo_meta-robots-noindex', 0 );
			update_post_meta( $post_id, '_yoast_wpseo_opengraph-title', 'Pre-existing Yoast SEO test OpenGraph title' );
		}

		return $post_id;
	}

	/**
	 * Builds a blob of data similar to what Premium SEO Pack uses internally.
	 *
	 * @param array $data Test data to add, merged with default data.
	 *
	 * @return array Complete array
	 */
	private function build_data_blob( $data = [] ) {
		return array_merge(
			[
				'doseo'          => 1,
				'noindex'        => 0,
				'nofollow'       => 0,
				'nositemap'      => 0,
				'title'          => '',
				'description'    => '',
				'keywords'       => '',
				'canonical'      => '',
				'robots'         => '',
				'cornerstone'    => '',
				'tw_media'       => '',
				'tw_title'       => '',
				'tw_description' => '',
				'tw_type'        => '',
				'og_title'       => '',
				'og_description' => '',
				'og_author'      => '',
				'og_type'        => '',
				'og_media'       => '',
				'patterns'       => '',
				'sep'            => '',
			],
			$data
		);
	}

	/**
	 * Inserts a post into the Premium SEO Pack table.
	 *
	 * @param int   $post_id Post ID.
	 * @param array $blob    Data to throw into the `seo` column.
	 */
	private function insert_post( $post_id, $blob ) {
		global $wpdb;
		$wpdb->query(
			$wpdb->prepare(
				'INSERT INTO `' . $wpdb->prefix . 'psp` 
				(`blog_id`, `post_id`, `URL`, `url_hash`, `seo`)
				VALUES
				(
					%s, 
					%s, 
					%s, 
					%s, 
					%s
				);',
				get_current_blog_id(),
				$post_id,
				get_permalink( $post_id ),
				md5( get_permalink( $post_id ) ),
				serialize( $blob )
			)
		);
	}

	/**
	 * Creates a copy of the PSP SEO DB table.
	 */
	private function create_table() {
		// We need to test creating and dropping tables, so we can't have this.
		remove_all_filters( 'query' );

		global $wpdb;
		$wpdb->query(
			"CREATE TABLE IF NOT EXISTS {$wpdb->prefix}psp (
				`id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
				`blog_id` int(10) NOT NULL,
				`post_id` bigint(20) NOT NULL DEFAULT '0',
				`URL` varchar(255) NOT NULL,
				`url_hash` varchar(32) NOT NULL,
				`seo` text NOT NULL,
				`date_time` datetime NOT NULL,
				PRIMARY KEY (`id`),
				UNIQUE KEY `url_hash` (`url_hash`) USING BTREE,
				KEY `post_id` (`post_id`) USING BTREE,
				KEY `blog_id_url_hash` (`blog_id`,`url_hash`) USING BTREE
			) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8"
		);
	}
}
