<?php
/**
 * @package WPSEO\Tests\Admin\Import\Plugins
 */

/**
 * Test importing meta data from WooThemes SEO.
 */
class WPSEO_Import_WooThemes_SEO_Test extends WPSEO_UnitTestCase {
	/**
	 * @var WPSEO_Import_WooThemes_SEO
	 */
	private $class_instance;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		// These options need setting as otherwise Woo didn't handle the titles and meta desc and thus we cannot import.
		update_option( 'seo_woo_wp_title', true );
		update_option( 'seo_woo_meta_single_desc', 'b' );

		$this->class_instance = new WPSEO_Import_WooThemes_SEO();
	}

	/**
	 * @covers WPSEO_Import_WooThemes_SEO::plugin_name
	 */
	public function test_plugin_name() {
		$this->assertEquals( 'WooThemes SEO', $this->class_instance->plugin_name() );
	}

	/**
	 * @covers WPSEO_Import_WooThemes_SEO::__construct
	 * @covers WPSEO_Import_WooThemes_SEO::detect
	 * @covers WPSEO_Import_WooThemes_SEO::detect_helper
	 */
	public function test_detect_no_data() {
		$this->assertEquals( $this->status( 'detect', false ), $this->class_instance->detect() );
	}

	/**
	 * @covers WPSEO_Import_WooThemes_SEO::__construct
	 * @covers WPSEO_Import_WooThemes_SEO::detect
	 * @covers WPSEO_Import_WooThemes_SEO::detect_helper
	 */
	public function test_detect() {
		$this->setup_post();
		$this->assertEquals( $this->status( 'detect', true ), $this->class_instance->detect() );
	}

	/**
	 * @covers WPSEO_Import_WooThemes_SEO::import
	 */
	public function test_import_no_data() {
		$this->assertEquals( $this->status( 'import', false ), $this->class_instance->import() );
	}

	/**
	 * @covers WPSEO_Import_WooThemes_SEO::import
	 * @covers WPSEO_Import_WooThemes_SEO::import_helper
	 */
	public function test_import() {
		$post_id = $this->setup_post();
		$result  = $this->class_instance->import();

		$seo_title = get_post_meta( $post_id, WPSEO_Meta::$meta_prefix . 'title', true );
		$seo_desc  = get_post_meta( $post_id, WPSEO_Meta::$meta_prefix . 'metadesc', true );

		$this->assertEquals( $seo_title, 'Test title' );
		$this->assertEquals( $seo_desc, 'Test description' );
		$this->assertEquals( $this->status( 'import', true ), $result );
		$this->assertEquals( '', WPSEO_Options::get( 'metadesc-home-wpseo' ) );
	}

	/**
	 * @covers WPSEO_Import_WooThemes_SEO::cleanup
	 */
	public function test_cleanup_no_data() {
		$this->assertEquals( $this->status( 'cleanup', false ), $this->class_instance->cleanup() );
	}

	/**
	 * @covers WPSEO_Import_WooThemes_SEO::cleanup
	 * @covers WPSEO_Import_WooThemes_SEO::cleanup_helper
	 * @covers WPSEO_Import_WooThemes_SEO::cleanup_options
	 * @covers WPSEO_Import_WooThemes_SEO::cleanup_meta
	 * @covers WPSEO_Import_WooThemes_SEO::cleanup_meta_key
	 */
	public function test_cleanup() {
		$post_id = $this->setup_post();
		$result  = $this->class_instance->cleanup();

		$seo_title = get_post_meta( $post_id, 'seo_title', true );
		$seo_desc  = get_post_meta( $post_id, 'seo_description', true );

		$this->assertEquals( $seo_title, false );
		$this->assertEquals( $seo_desc, false );
		$this->assertEquals( $this->status( 'cleanup', true ), $result );
	}

	/**
	 * Returns a WPSEO_Import_Status object to check against.
	 *
	 * @param string $action The action to return.
	 * @param bool   $bool   The status.
	 *
	 * @return WPSEO_Import_Status Import status object.
	 */
	private function status( $action, $bool ) {
		return new WPSEO_Import_Status( $action, $bool );
	}

	/**
	 * Sets up a test post.
	 *
	 * @return int $post_id ID for the post created.
	 */
	private function setup_post() {
		$post_id = $this->factory()->post->create();
		update_post_meta( $post_id, 'seo_title', 'Test title' );
		update_post_meta( $post_id, 'seo_description', 'Test description' );

		return $post_id;
	}

}
