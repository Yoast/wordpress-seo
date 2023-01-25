<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Admin\Import\Plugins
 */

/**
 * Test importing meta data from Smartcrawl_SEO.
 */
class WPSEO_Import_Smartcrawl_SEO_Test extends WPSEO_UnitTestCase {

	/**
	 * Holds the class instance.
	 *
	 * @var WPSEO_Import_Smartcrawl_SEO
	 */
	private $class_instance;

	/**
	 * Sets up the test class.
	 */
	public function set_up() {
		parent::set_up();

		$this->class_instance = new WPSEO_Import_Smartcrawl_SEO();
	}

	/**
	 * Tests the plugin name function.
	 *
	 * @covers WPSEO_Import_Smartcrawl_SEO::get_plugin_name
	 */
	public function test_plugin_name() {
		$this->assertEquals( 'Smartcrawl SEO', $this->class_instance->get_plugin_name() );
	}

	/**
	 * Tests whether this importer has been registered.
	 *
	 * @covers WPSEO_Plugin_Importers::get
	 */
	public function test_importer_registered() {
		$this->assertContains( 'WPSEO_Import_Smartcrawl_SEO', WPSEO_Plugin_Importers::get() );
	}

	/**
	 * Tests whether we can return false when there's no detectable data.
	 *
	 * @covers WPSEO_Import_Smartcrawl_SEO::__construct
	 * @covers WPSEO_Import_Smartcrawl_SEO::run_detect
	 * @covers WPSEO_Import_Smartcrawl_SEO::detect
	 */
	public function test_detect_without_data() {
		$this->assertEquals( $this->status( 'detect', false ), $this->class_instance->run_detect() );
	}

	/**
	 * Tests whether we can detect data.
	 *
	 * @covers WPSEO_Import_Smartcrawl_SEO::run_detect
	 * @covers WPSEO_Import_Smartcrawl_SEO::detect
	 */
	public function test_detect_with_data() {
		$this->setup_post();
		$this->assertEquals( $this->status( 'detect', true ), $this->class_instance->run_detect() );
	}

	/**
	 * Tests whether we can return properly when there's nothing to import.
	 *
	 * @covers WPSEO_Import_Smartcrawl_SEO::run_import
	 */
	public function test_import_without_data() {
		$result = $this->class_instance->run_import();
		$this->assertEquals( $this->status( 'import', false ), $result );
	}

	/**
	 * Tests whether we can properly import data.
	 *
	 * @covers WPSEO_Import_Smartcrawl_SEO::run_import
	 * @covers WPSEO_Import_Smartcrawl_SEO::import
	 * @covers WPSEO_Import_Smartcrawl_SEO::import_opengraph
	 * @covers WPSEO_Import_Smartcrawl_SEO::import_twitter
	 * @covers WPSEO_Import_Smartcrawl_SEO::import_serialized_post_meta
	 * @covers WPSEO_Import_Smartcrawl_SEO::meta_key_clone
	 * @covers WPSEO_Import_Smartcrawl_SEO::meta_key_clone_replace
	 * @covers WPSEO_Import_Smartcrawl_SEO::meta_keys_clone
	 * @covers WPSEO_Import_Smartcrawl_SEO::post_find_import
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
		$twitter_title   = get_post_meta( $post_id, WPSEO_Meta::$meta_prefix . 'twitter-title', true );
		$focuskw         = get_post_meta( $post_id, WPSEO_Meta::$meta_prefix . 'focuskw', true );

		$this->assertEquals( 'Test title', $seo_title );
		$this->assertEquals( 'Test description', $seo_desc );
		$this->assertEquals( 1, $robots_noindex );
		$this->assertEquals( 1, $robots_nofollow );
		$this->assertEquals( 'http://local.wordpress.test/wp-content/uploads/2018/01/actionable-seo.png', $opengraph_image );
		$this->assertEquals( 'smartcrawl test opengraph title', $opengraph_title );
		$this->assertEquals( 'smartcrawl test twitter title', $twitter_title );
		$this->assertEquals( 'smartcrawl focuskw', $focuskw );
		$this->assertEquals( $this->status( 'import', true ), $result );
	}

	/**
	 * Tests whether we can properly import data.
	 *
	 * @covers WPSEO_Import_Smartcrawl_SEO::run_import
	 * @covers WPSEO_Import_Smartcrawl_SEO::import
	 * @covers WPSEO_Import_Smartcrawl_SEO::import_opengraph
	 * @covers WPSEO_Import_Smartcrawl_SEO::import_twitter
	 * @covers WPSEO_Import_Smartcrawl_SEO::import_serialized_post_meta
	 * @covers WPSEO_Import_Smartcrawl_SEO::meta_key_clone
	 * @covers WPSEO_Import_Smartcrawl_SEO::meta_key_clone_replace
	 * @covers WPSEO_Import_Smartcrawl_SEO::meta_keys_clone
	 * @covers WPSEO_Import_Smartcrawl_SEO::post_find_import
	 */
	public function test_import_without_opengraph_data() {
		$post_id = $this->setup_post();
		delete_post_meta( $post_id, '_wds_twitter' );
		delete_post_meta( $post_id, '_wds_opengraph' );
		$result = $this->class_instance->run_import();

		$seo_title       = get_post_meta( $post_id, WPSEO_Meta::$meta_prefix . 'title', true );
		$seo_desc        = get_post_meta( $post_id, WPSEO_Meta::$meta_prefix . 'metadesc', true );
		$robots_noindex  = get_post_meta( $post_id, WPSEO_Meta::$meta_prefix . 'meta-robots-noindex', true );
		$robots_nofollow = get_post_meta( $post_id, WPSEO_Meta::$meta_prefix . 'meta-robots-nofollow', true );

		$this->assertEquals( 'Test title', $seo_title );
		$this->assertEquals( 'Test description', $seo_desc );
		$this->assertEquals( 1, $robots_noindex );
		$this->assertEquals( 1, $robots_nofollow );
		$this->assertEquals( $this->status( 'import', true ), $result );
	}

	/**
	 * Test whether we can properly return an error when we don't have rights to create a temporary table.
	 *
	 * @covers WPSEO_Import_Smartcrawl_SEO::__construct
	 * @covers WPSEO_Import_Smartcrawl_SEO::import
	 * @covers WPSEO_Import_Smartcrawl_SEO::import_opengraph
	 * @covers WPSEO_Import_Smartcrawl_SEO::import_twitter
	 * @covers WPSEO_Import_Smartcrawl_SEO::import_serialized_post_meta
	 * @covers WPSEO_Import_Smartcrawl_SEO::meta_key_clone
	 * @covers WPSEO_Import_Smartcrawl_SEO::meta_key_clone_replace
	 * @covers WPSEO_Import_Smartcrawl_SEO::run_import
	 * @covers WPSEO_Import_Smartcrawl_SEO::set_missing_db_rights_status
	 */
	public function test_import_without_rights_to_temp_table() {
		$class_instance = new WPSEO_Import_Smartcrawl_SEO();
		global $wpdb;
		// Save for later return.
		$original_wpdb = $wpdb;

		$wpdb = $this->getMockBuilder( 'wpdb' )
			->setConstructorArgs( [ DB_USER, DB_PASSWORD, DB_NAME, DB_HOST ] )
			->setMethods( [ 'query' ] )
			->getMock();
		$wpdb->expects( $this->any() )
			->method( 'query' )
			->will( $this->returnValue( false ) );
		$result          = $class_instance->run_import();
		$expected_result = $this->status( 'import', false );
		$expected_result->set_msg( 'The Yoast SEO importer functionality uses temporary database tables. It seems your WordPress install does not have the capability to do this, please consult your hosting provider.' );
		$this->assertEquals( $expected_result, $result );

		// Return to proper $wpdb.
		$wpdb = $original_wpdb;
	}

	/**
	 * Tests whether we will not overwrite already existing Yoast SEO data with imported data.
	 *
	 * @covers WPSEO_Import_Smartcrawl_SEO::run_import
	 * @covers WPSEO_Import_Smartcrawl_SEO::import
	 * @covers WPSEO_Import_Smartcrawl_SEO::meta_key_clone
	 * @covers WPSEO_Import_Smartcrawl_SEO::meta_key_clone_replace
	 * @covers WPSEO_Import_Smartcrawl_SEO::meta_keys_clone
	 * @covers WPSEO_Import_Smartcrawl_SEO::maybe_save_post_meta
	 * @covers WPSEO_Import_Smartcrawl_SEO::import_opengraph
	 * @covers WPSEO_Import_Smartcrawl_SEO::import_twitter
	 * @covers WPSEO_Import_Smartcrawl_SEO::import_serialized_post_meta
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
	 * Tests whether we can properly return an error when there is no data to clean.
	 *
	 * @covers WPSEO_Import_Smartcrawl_SEO::run_cleanup
	 */
	public function test_cleanup_without_data() {
		$result = $this->class_instance->run_cleanup();
		$this->assertEquals( $this->status( 'cleanup', false ), $result );
	}

	/**
	 * Tests whether we can properly clean up.
	 *
	 * @covers WPSEO_Import_Smartcrawl_SEO::run_cleanup
	 * @covers WPSEO_Import_Smartcrawl_SEO::cleanup
	 */
	public function test_cleanup() {
		$post_id = $this->setup_post();
		$result  = $this->class_instance->run_cleanup();

		$seo_title = get_post_meta( $post_id, '_wds_metadesc', true );
		$seo_desc  = get_post_meta( $post_id, '_wds_title', true );
		$twitter   = get_post_meta( $post_id, '_wds_twitter', true );

		$this->assertEquals( $seo_title, false );
		$this->assertEquals( $seo_desc, false );
		$this->assertEquals( $twitter, false );
		$this->assertEquals( $this->status( 'cleanup', true ), $result );
	}

	/**
	 * Tests whether can handle a cleanup gone wrong.
	 *
	 * @covers WPSEO_Import_Smartcrawl_SEO::__construct
	 * @covers WPSEO_Import_Smartcrawl_SEO::run_cleanup
	 * @covers WPSEO_Import_Smartcrawl_SEO::cleanup
	 * @covers WPSEO_Import_Smartcrawl_SEO::cleanup_error_msg
	 */
	public function test_cleanup_gone_bad() {
		$class_instance = new WPSEO_Import_Smartcrawl_SEO();

		global $wpdb;
		$original_wpdb = $wpdb;

		$wpdb = $this->getMockBuilder( 'wpdb' )
			->setConstructorArgs( [ DB_USER, DB_PASSWORD, DB_NAME, DB_HOST ] )
			->setMethods( [ 'query' ] )
			->getMock();
		$wpdb->expects( $this->any() )
			->method( 'query' )
			->will( $this->returnValue( false ) );

		$result          = $class_instance->run_cleanup();
		$expected_result = $this->status( 'cleanup', false );
		$expected_result->set_msg( 'Cleanup of Smartcrawl SEO data failed.' );
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
		$post_id = $this->factory()->post->create();
		update_post_meta( $post_id, '_wds_title', 'Test title' );
		update_post_meta( $post_id, '_wds_metadesc', 'Test description' );
		update_post_meta( $post_id, '_wds_focus-keywords', 'smartcrawl focuskw' );
		update_post_meta( $post_id, '_wds_meta-robots-noindex', 1 );
		update_post_meta( $post_id, '_wds_meta-robots-nofollow', 1 );
		update_post_meta( $post_id, '_wds_opengraph', 'a:4:{s:8:"disabled";b:0;s:5:"title";s:31:"smartcrawl test opengraph title";s:11:"description";s:30:"smartcrawl test opengraph desc";s:6:"images";a:1:{i:0;s:73:"http://local.wordpress.test/wp-content/uploads/2018/01/actionable-seo.png";}}' );
		update_post_meta( $post_id, '_wds_twitter', 'a:3:{s:8:"disabled";b:0;s:6:"use_og";b:0;s:5:"title";s:29:"smartcrawl test twitter title";}' );

		if ( $pre_existing_yoast_data ) {
			update_post_meta( $post_id, '_yoast_wpseo_metadesc', 'Existing Yoast SEO Test description' );
			update_post_meta( $post_id, '_yoast_wpseo_meta-robots-noindex', 0 );
			update_post_meta( $post_id, '_yoast_wpseo_opengraph-title', 'Pre-existing Yoast SEO test OpenGraph title' );
		}
		return $post_id;
	}
}
