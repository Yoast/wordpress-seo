<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Admin\Import\Plugins
 */

/**
 * Test importing meta data from SEO Framework.
 */
class WPSEO_Import_SEO_Framework_Test extends WPSEO_UnitTestCase {

	/**
	 * Holds the class instance.
	 *
	 * @var WPSEO_Import_SEO_Framework
	 */
	private $class_instance;

	/**
	 * Sets up the test class.
	 */
	public function set_up() {
		parent::set_up();

		$this->class_instance = new WPSEO_Import_SEO_Framework();
	}

	/**
	 * Tests the plugin name function.
	 *
	 * @covers WPSEO_Import_SEO_Framework::get_plugin_name
	 */
	public function test_plugin_name() {
		$this->assertEquals( 'SEO Framework', $this->class_instance->get_plugin_name() );
	}

	/**
	 * Tests whether this importer has been registered.
	 *
	 * @covers WPSEO_Plugin_Importers::get
	 */
	public function test_importer_registered() {
		$this->assertContains( 'WPSEO_Import_SEO_Framework', WPSEO_Plugin_Importers::get() );
	}

	/**
	 * Tests whether we can return false when there's no detectable data.
	 *
	 * @covers WPSEO_Import_SEO_Framework::run_detect
	 * @covers WPSEO_Import_SEO_Framework::detect
	 */
	public function test_detect_no_data() {
		$this->assertEquals( $this->status( 'detect', false ), $this->class_instance->run_detect() );
	}

	/**
	 * Tests whether we can detect data.
	 *
	 * @covers WPSEO_Import_SEO_Framework::__construct
	 * @covers WPSEO_Import_SEO_Framework::run_detect
	 * @covers WPSEO_Import_SEO_Framework::detect
	 */
	public function test_detect() {
		$this->setup_post();
		$this->assertEquals( $this->status( 'detect', true ), $this->class_instance->run_detect() );
	}

	/**
	 * Tests whether we can return properly when there's nothing to import.
	 *
	 * @covers WPSEO_Import_SEO_Framework::run_import
	 */
	public function test_import_no_data() {
		$this->assertEquals( $this->status( 'import', false ), $this->class_instance->run_import() );
	}

	/**
	 * Tests whether we can properly import data.
	 *
	 * @covers WPSEO_Import_SEO_Framework::run_import
	 * @covers WPSEO_Import_SEO_Framework::import
	 * @covers WPSEO_Import_SEO_Framework::meta_key_clone
	 * @covers WPSEO_Import_SEO_Framework::meta_keys_clone
	 */
	public function test_import() {
		$post_id = $this->setup_post();
		$result  = $this->class_instance->run_import();

		$seo_title       = get_post_meta( $post_id, WPSEO_Meta::$meta_prefix . 'title', true );
		$seo_desc        = get_post_meta( $post_id, WPSEO_Meta::$meta_prefix . 'metadesc', true );
		$robots_noindex  = get_post_meta( $post_id, WPSEO_Meta::$meta_prefix . 'meta-robots-noindex', true );
		$robots_nofollow = get_post_meta( $post_id, WPSEO_Meta::$meta_prefix . 'meta-robots-nofollow', true );
		$twitter_title   = get_post_meta( $post_id, WPSEO_Meta::$meta_prefix . 'twitter-title', true );
		$twitter_desc    = get_post_meta( $post_id, WPSEO_Meta::$meta_prefix . 'twitter-description', true );

		$this->assertEquals( 1, $robots_noindex );
		$this->assertEquals( 1, $robots_nofollow );
		$this->assertEquals( 'Test title', $seo_title );
		$this->assertEquals( 'Test description', $seo_desc );
		$this->assertEquals( 'Test Twitter title', $twitter_title );
		$this->assertEquals( 'Test Twitter description', $twitter_desc );
		$this->assertEquals( $this->status( 'import', true ), $result );
	}

	/**
	 * Tests whether we can properly return an error when there is no data to clean.
	 *
	 * @covers WPSEO_Import_SEO_Framework::run_cleanup
	 */
	public function test_cleanup_no_data() {
		$this->assertEquals( $this->status( 'cleanup', false ), $this->class_instance->run_cleanup() );
	}

	/**
	 * Tests whether we can properly clean up.
	 *
	 * @covers WPSEO_Import_SEO_Framework::run_cleanup
	 * @covers WPSEO_Import_SEO_Framework::cleanup
	 */
	public function test_cleanup() {
		$post_id = $this->setup_post();
		$result  = $this->class_instance->run_cleanup();

		$seo_title = get_post_meta( $post_id, '_su_title', true );
		$seo_desc  = get_post_meta( $post_id, '_su_description', true );

		$this->assertEquals( $seo_title, false );
		$this->assertEquals( $seo_desc, false );
		$this->assertEquals( $this->status( 'cleanup', true ), $result );
		$this->assertEquals( $this->status( 'detect', false ), $this->class_instance->run_detect() );
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
	 * @return int ID for the post created.
	 */
	private function setup_post() {
		$post_id = $this->factory()->post->create();
		update_post_meta( $post_id, '_genesis_title', 'Test title' );
		update_post_meta( $post_id, '_genesis_description', 'Test description' );
		update_post_meta( $post_id, '_genesis_noindex', 1 );
		update_post_meta( $post_id, '_genesis_nofollow', 1 );
		update_post_meta( $post_id, '_twitter_title', 'Test Twitter title' );
		update_post_meta( $post_id, '_twitter_description', 'Test Twitter description' );

		return $post_id;
	}
}
