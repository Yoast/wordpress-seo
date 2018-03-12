<?php
/**
 * @package WPSEO\Tests\Admin\Import\Plugins
 */

/**
 * Test importing meta data from AIOSEO.
 */
class WPSEO_Import_AIOSEO_Test extends WPSEO_UnitTestCase {
	/**
	 * @var WPSEO_Import_AIOSEO
	 */
	private $class_instance;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$this->class_instance = new WPSEO_Import_AIOSEO();
	}

	/**
	 * @covers WPSEO_Import_AIOSEO::get_plugin_name
	 */
	public function test_plugin_name() {
		$this->assertEquals( 'All In One SEO Pack', $this->class_instance->get_plugin_name() );
	}

	/**
	 * @covers WPSEO_Import_AIOSEO::__construct
	 * @covers WPSEO_Import_AIOSEO::run_detect
	 * @covers WPSEO_Import_AIOSEO::detect
	 */
	public function test_detect_without_data() {
		$this->assertEquals( $this->status( 'detect', false ), $this->class_instance->run_detect() );
	}

	/**
	 * @covers WPSEO_Import_AIOSEO::run_detect
	 * @covers WPSEO_Import_AIOSEO::detect
	 */
	public function test_detect_with_data() {
		$this->setup_post();
		$this->assertEquals( $this->status( 'detect', true ), $this->class_instance->run_detect() );
	}

	/**
	 * @covers WPSEO_Import_AIOSEO::run_import
	 * @covers WPSEO_Import_AIOSEO::meta_key_clone
	 */
	public function test_import_without_data() {
		$result = $this->class_instance->run_import();
		$this->assertEquals( $this->status( 'import', false ), $result );
	}

	/**
	 * @covers WPSEO_Import_AIOSEO::run_import
	 * @covers WPSEO_Import_AIOSEO::import
	 */
	public function test_import_with_data() {
		$post_id = $this->setup_post();
		$result  = $this->class_instance->run_import();

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
	 * @covers WPSEO_Import_AIOSEO::run_cleanup
	 */
	public function test_cleanup_without_data() {
		$result  = $this->class_instance->run_cleanup();
		$this->assertEquals( $this->status( 'cleanup', false ), $result );
	}

	/**
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
		update_post_meta( $post_id, '_aioseop_title', 'Test title' );
		update_post_meta( $post_id, '_aioseop_description', 'Test description' );
		update_post_meta( $post_id, '_aioseop_noindex', 'on' );
		update_post_meta( $post_id, '_aioseop_nofollow', 'on' );

		return $post_id;
	}
}
