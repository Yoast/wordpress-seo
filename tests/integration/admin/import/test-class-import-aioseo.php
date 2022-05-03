<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Admin\Import\Plugins
 */

/**
 * Test importing meta data from AIOSEO.
 */
class WPSEO_Import_AIOSEO_Test extends WPSEO_UnitTestCase {

	/**
	 * Holds the class instance.
	 *
	 * @var WPSEO_Import_AIOSEO
	 */
	private $class_instance;

	/**
	 * Sets up the test class.
	 */
	public function set_up() {
		parent::set_up();

		$this->class_instance = new WPSEO_Import_AIOSEO();
	}

	/**
	 * Tests the plugin name function.
	 *
	 * @covers WPSEO_Import_AIOSEO::get_plugin_name
	 */
	public function test_plugin_name() {
		$this->assertEquals( 'All In One SEO Pack', $this->class_instance->get_plugin_name() );
	}

	/**
	 * Tests whether this importer has been registered.
	 *
	 * @covers WPSEO_Plugin_Importers::get
	 */
	public function test_importer_registered() {
		$this->assertContains( 'WPSEO_Import_AIOSEO', WPSEO_Plugin_Importers::get() );
	}

	/**
	 * Tests whether we can return false when there's no detectable data.
	 *
	 * @covers WPSEO_Import_AIOSEO::__construct
	 * @covers WPSEO_Import_AIOSEO::run_detect
	 * @covers WPSEO_Import_AIOSEO::detect
	 */
	public function test_detect_without_data() {
		$this->assertEquals( $this->status( 'detect', false ), $this->class_instance->run_detect() );
	}

	/**
	 * Tests whether we can detect data.
	 *
	 * @covers WPSEO_Import_AIOSEO::run_detect
	 * @covers WPSEO_Import_AIOSEO::detect
	 */
	public function test_detect_with_data() {
		$this->setup_post();
		$this->assertEquals( $this->status( 'detect', true ), $this->class_instance->run_detect() );
	}

	/**
	 * Tests whether we can return properly when there's nothing to import.
	 *
	 * @covers WPSEO_Import_AIOSEO::run_import
	 */
	public function test_import_without_data() {
		$result = $this->class_instance->run_import();
		$this->assertEquals( $this->status( 'import', false ), $result );
	}

	/**
	 * Tests whether we can properly import data.
	 *
	 * @covers WPSEO_Import_AIOSEO::run_import
	 * @covers WPSEO_Import_AIOSEO::import
	 * @covers WPSEO_Import_AIOSEO::import_opengraph
	 * @covers WPSEO_Import_AIOSEO::import_post_opengraph
	 * @covers WPSEO_Import_AIOSEO::meta_key_clone
	 * @covers WPSEO_Import_AIOSEO::meta_key_clone_replace
	 * @covers WPSEO_Import_AIOSEO::meta_keys_clone
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

		$this->assertEquals( 'Test title', $seo_title );
		$this->assertEquals( 'Test description', $seo_desc );
		$this->assertEquals( 1, $robots_noindex );
		$this->assertEquals( 1, $robots_nofollow );
		$this->assertEquals( 'http://local.wordpress.test/wp-content/uploads/2018/01/actionable-seo.png', $opengraph_image );
		$this->assertEquals( 'OpenGraph AIOSEO title', $opengraph_title );
		$this->assertEquals( $this->status( 'import', true ), $result );
	}

	/**
	 * Test whether we can properly return an error when we don't have rights to create a temporary table.
	 *
	 * @covers WPSEO_Import_AIOSEO::__construct
	 * @covers WPSEO_Import_AIOSEO::import
	 * @covers WPSEO_Import_AIOSEO::meta_key_clone
	 * @covers WPSEO_Import_AIOSEO::meta_key_clone_replace
	 * @covers WPSEO_Import_AIOSEO::run_import
	 * @covers WPSEO_Import_AIOSEO::set_missing_db_rights_status
	 */
	public function test_import_without_rights_to_temp_table() {
		$class_instance = new WPSEO_Import_AIOSEO();
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
	 * @covers WPSEO_Import_AIOSEO::run_import
	 * @covers WPSEO_Import_AIOSEO::import
	 * @covers WPSEO_Import_AIOSEO::meta_key_clone
	 * @covers WPSEO_Import_AIOSEO::meta_key_clone_replace
	 * @covers WPSEO_Import_AIOSEO::meta_keys_clone
	 * @covers WPSEO_Import_AIOSEO::maybe_save_post_meta
	 * @covers WPSEO_Import_AIOSEO::import_opengraph
	 * @covers WPSEO_Import_AIOSEO::import_post_opengraph
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
	 * @covers WPSEO_Import_AIOSEO::run_cleanup
	 */
	public function test_cleanup_without_data() {
		$result = $this->class_instance->run_cleanup();
		$this->assertEquals( $this->status( 'cleanup', false ), $result );
	}

	/**
	 * Tests whether we can properly clean up.
	 *
	 * @covers WPSEO_Import_AIOSEO::run_cleanup
	 * @covers WPSEO_Import_AIOSEO::cleanup
	 */
	public function test_cleanup() {
		$post_id = $this->setup_post();
		$result  = $this->class_instance->run_cleanup();

		$seo_title = get_post_meta( $post_id, '_aioseop_title', true );
		$seo_desc  = get_post_meta( $post_id, '_aioseop_description', true );

		$this->assertEquals( $seo_title, false );
		$this->assertEquals( $seo_desc, false );
		$this->assertEquals( $this->status( 'cleanup', true ), $result );
	}

	/**
	 * Tests whether can handle a cleanup gone wrong.
	 *
	 * @covers WPSEO_Import_AIOSEO::__construct
	 * @covers WPSEO_Import_AIOSEO::run_cleanup
	 * @covers WPSEO_Import_AIOSEO::cleanup
	 * @covers WPSEO_Import_AIOSEO::cleanup_error_msg
	 */
	public function test_cleanup_gone_bad() {
		$class_instance = new WPSEO_Import_AIOSEO();

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
		$expected_result->set_msg( 'Cleanup of All In One SEO Pack data failed.' );
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
		update_post_meta( $post_id, '_aioseop_title', 'Test title' );
		update_post_meta( $post_id, '_aioseop_description', 'Test description' );
		update_post_meta( $post_id, '_aioseop_noindex', 'on' );
		update_post_meta( $post_id, '_aioseop_nofollow', 'on' );
		update_post_meta( $post_id, '_aioseop_opengraph_settings', 'a:15:{s:32:"aioseop_opengraph_settings_title";s:22:"OpenGraph AIOSEO title";s:31:"aioseop_opengraph_settings_desc";s:28:"OpenGraph AIOSEO description";s:36:"aioseop_opengraph_settings_customimg";s:73:"http://local.wordpress.test/wp-content/uploads/2018/01/actionable-seo.png";s:37:"aioseop_opengraph_settings_imagewidth";s:0:"";s:38:"aioseop_opengraph_settings_imageheight";s:0:"";s:32:"aioseop_opengraph_settings_video";s:0:"";s:37:"aioseop_opengraph_settings_videowidth";s:0:"";s:38:"aioseop_opengraph_settings_videoheight";s:0:"";s:35:"aioseop_opengraph_settings_category";s:8:"activity";s:34:"aioseop_opengraph_settings_section";s:0:"";s:30:"aioseop_opengraph_settings_tag";s:0:"";s:34:"aioseop_opengraph_settings_setcard";s:7:"summary";s:44:"aioseop_opengraph_settings_customimg_twitter";s:73:"http://local.wordpress.test/wp-content/uploads/2018/01/actionable-seo.png";s:44:"aioseop_opengraph_settings_customimg_checker";s:1:"1";s:32:"aioseop_opengraph_settings_image";s:73:"http://local.wordpress.test/wp-content/uploads/2018/01/actionable-seo.png";}' );

		if ( $pre_existing_yoast_data ) {
			update_post_meta( $post_id, '_yoast_wpseo_metadesc', 'Existing Yoast SEO Test description' );
			update_post_meta( $post_id, '_yoast_wpseo_meta-robots-noindex', 0 );
			update_post_meta( $post_id, '_yoast_wpseo_opengraph-title', 'Pre-existing Yoast SEO test OpenGraph title' );
		}
		return $post_id;
	}
}
