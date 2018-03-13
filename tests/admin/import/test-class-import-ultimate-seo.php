<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Admin\Import\Plugins
 */

/**
 * Test importing meta data from Ultimate SEO.
 */
class WPSEO_Import_Ultimate_SEO_Test extends WPSEO_UnitTestCase {
	/**
	 * @var WPSEO_Import_Ultimate_SEO
	 */
	private $class_instance;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$this->class_instance = new WPSEO_Import_Ultimate_SEO();
	}

	/**
	 * @covers WPSEO_Import_Ultimate_SEO::get_plugin_name
	 */
	public function test_plugin_name() {
		$this->assertEquals( 'Ultimate SEO', $this->class_instance->get_plugin_name() );
	}

	/**
	 * @covers WPSEO_Import_Ultimate_SEO::run_detect
	 * @covers WPSEO_Import_Ultimate_SEO::detect
	 */
	public function test_detect_no_data() {
		$this->assertEquals( $this->status( 'detect', false ), $this->class_instance->run_detect() );
	}

	/**
	 * @covers WPSEO_Import_Ultimate_SEO::__construct
	 * @covers WPSEO_Import_Ultimate_SEO::run_detect
	 * @covers WPSEO_Import_Ultimate_SEO::detect
	 */
	public function test_detect() {
		$this->setup_post();
		$this->assertEquals( $this->status( 'detect', true ), $this->class_instance->run_detect() );
	}

	/**
	 * @covers WPSEO_Import_Ultimate_SEO::run_import
	 */
	public function test_import_no_data() {
		$this->assertEquals( $this->status( 'import', false ), $this->class_instance->run_import() );
	}

	/**
	 * @covers WPSEO_Import_Ultimate_SEO::run_import
	 * @covers WPSEO_Import_Ultimate_SEO::import
	 * @covers WPSEO_Import_Ultimate_SEO::meta_key_clone
	 * @covers WPSEO_Import_Ultimate_SEO::meta_keys_clone
	 */
	public function test_import() {
		$post_id = $this->setup_post();
		$result  = $this->class_instance->run_import();

		$seo_title = get_post_meta( $post_id, WPSEO_Meta::$meta_prefix . 'title', true );
		$seo_desc  = get_post_meta( $post_id, WPSEO_Meta::$meta_prefix . 'metadesc', true );

		$this->assertEquals( $seo_title, 'Test title' );
		$this->assertEquals( $seo_desc, 'Test description' );
		$this->assertEquals( $this->status( 'import', true ), $result );
	}

	/**
	 * @covers WPSEO_Import_Ultimate_SEO::run_cleanup
	 */
	public function test_cleanup_no_data() {
		$this->assertEquals( $this->status( 'cleanup', false ), $this->class_instance->run_cleanup() );
	}

	/**
	 * @covers WPSEO_Import_Ultimate_SEO::run_cleanup
	 * @covers WPSEO_Import_Ultimate_SEO::cleanup
	 */
	public function test_cleanup() {
		$post_id = $this->setup_post();
		$result  = $this->class_instance->run_cleanup();

		$seo_title = get_post_meta( $post_id, '_su_title', true );
		$seo_desc  = get_post_meta( $post_id, '_su_description', true );

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
		update_post_meta( $post_id, '_su_title', 'Test title' );
		update_post_meta( $post_id, '_su_description', 'Test description' );

		return $post_id;
	}
}
