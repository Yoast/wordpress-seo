<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Admin\Import\Plugins
 */

/**
 * Test importing meta data from SEOPressor.
 */
class WPSEO_Import_SEOPressor_Test extends WPSEO_UnitTestCase {
	/**
	 * @var WPSEO_Import_SEOPressor
	 */
	private $class_instance;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$this->class_instance = new WPSEO_Import_SEOPressor();
	}

	/**
	 * @covers WPSEO_Import_SEOPressor::plugin_name
	 */
	public function test_plugin_name() {
		$this->assertEquals( 'SEOpressor', $this->class_instance->plugin_name() );
	}

	/**
	 * @covers WPSEO_Import_SEOPressor::__construct
	 * @covers WPSEO_Import_SEOPressor::detect
	 * @covers WPSEO_Import_SEOPressor::detect_helper
	 */
	public function test_detect_no_data() {
		$this->assertEquals( $this->status( 'detect', false ), $this->class_instance->detect() );
	}

	/**
	 * @covers WPSEO_Import_SEOPressor::detect
	 * @covers WPSEO_Import_SEOPressor::detect_helper
	 */
	public function test_detect() {
		$this->setup_post();
		$this->assertEquals( $this->status( 'detect', true ), $this->class_instance->detect() );
	}

	/**
	 * @covers WPSEO_Import_SEOPressor::import
	 */
	public function test_import_no_data() {
		$this->assertEquals( $this->status( 'import', false ), $this->class_instance->import() );
	}

	/**
	 * @covers WPSEO_Import_SEOPressor::import
	 * @covers WPSEO_Import_SEOPressor::import_post_focus_keywords
	 * @covers WPSEO_Import_SEOPressor::import_post_robots
	 * @covers WPSEO_Import_SEOPressor::get_robot_value
	 * @covers WPSEO_Import_SEOPressor::import_meta_helper
	 * @covers WPSEO_Import_SEOPressor::import_seopressor_post_settings
	 */
	public function test_import() {
		$post_id = $this->setup_post();
		$result  = $this->class_instance->import();

		$seo_title       = get_post_meta( $post_id, WPSEO_Meta::$meta_prefix . 'title', true );
		$seo_desc        = get_post_meta( $post_id, WPSEO_Meta::$meta_prefix . 'metadesc', true );
		$robots_noindex  = get_post_meta( $post_id, WPSEO_Meta::$meta_prefix . 'meta-robots-noindex', true );
		$robots_nofollow = get_post_meta( $post_id, WPSEO_Meta::$meta_prefix . 'meta-robots-nofollow', true );
		$focus_kw        = get_post_meta( $post_id, WPSEO_Meta::$meta_prefix . 'focuskw', true );
		$extra_focus_kw  = json_decode( get_post_meta( $post_id, WPSEO_Meta::$meta_prefix . 'focuskeywords', true ) );

		$this->assertEquals( 'Test title', $seo_title );
		$this->assertEquals( 'Test description', $seo_desc );
		$this->assertEquals( 1, $robots_noindex );
		$this->assertEquals( 1, $robots_nofollow );
		$this->assertEquals( 'Test focus kw', $focus_kw );
		$this->assertEquals( array( 'Test focus kw 2', 'Test focus kw 3' ), $extra_focus_kw );
		$this->assertEquals( $this->status( 'import', true ), $result );
	}

	/**
	 * @covers WPSEO_Import_SEOPressor::cleanup
	 */
	public function test_cleanup_no_data() {
		$this->assertEquals( $this->status( 'cleanup', false ), $this->class_instance->cleanup() );
	}

	/**
	 * @covers WPSEO_Import_SEOPressor::cleanup
	 */
	public function test_cleanup() {
		$post_id = $this->setup_post();
		$result  = $this->class_instance->cleanup();

		$seo_options = get_post_meta( $post_id, '_seop_settings', true );

		$this->assertEquals( $seo_options, false );
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
		$post_id  = $this->factory()->post->create();
		$settings = array(
			'meta_title'       => 'Test title',
			'meta_description' => 'Test description',
			'meta_rules'       => 'noindex#|#|#nofollow',
		);
		update_post_meta( $post_id, '_seop_settings', $settings );
		update_post_meta( $post_id, '_seop_kw_1', 'Test focus kw' );
		update_post_meta( $post_id, '_seop_kw_2', 'Test focus kw 2' );
		update_post_meta( $post_id, '_seop_kw_3', 'Test focus kw 3' );

		return $post_id;
	}
}
