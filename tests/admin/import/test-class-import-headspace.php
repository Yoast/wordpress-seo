<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Admin\Import\Plugins
 */

/**
 * Test importing meta data from HeadSpace.
 */
class WPSEO_Import_HeadSpace_Test extends WPSEO_UnitTestCase {
	/**
	 * @var WPSEO_Import_HeadSpace
	 */
	private $class_instance;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$this->class_instance = new WPSEO_Import_HeadSpace();
	}

	/**
	 * @covers WPSEO_Import_HeadSpace::plugin_name
	 */
	public function test_plugin_name() {
		$this->assertEquals( 'HeadSpace SEO', $this->class_instance->plugin_name() );
	}

	/**
	 * @covers WPSEO_Import_HeadSpace::__construct
	 * @covers WPSEO_Import_HeadSpace::detect
	 * @covers WPSEO_Import_HeadSpace::detect_helper
	 */
	public function test_detect_without_data() {
		$this->assertEquals( $this->status( 'detect', false ), $this->class_instance->detect() );
	}

	/**
	 * @covers WPSEO_Import_HeadSpace::detect
	 * @covers WPSEO_Import_HeadSpace::detect_helper
	 */
	public function test_detect_with_data() {
		$this->setup_post();
		$this->assertEquals( $this->status( 'detect', true ), $this->class_instance->detect() );
	}

	/**
	 * @covers WPSEO_Import_HeadSpace::import
	 */
	public function test_import_without_data() {
		$result  = $this->class_instance->import();
		$this->assertEquals( $this->status( 'import', false ), $result );
	}

	/**
	 * @covers WPSEO_Import_HeadSpace::import
	 * @covers WPSEO_Import_HeadSpace::replace_metas
	 */
	public function test_import_with_data() {
		$post_id = $this->setup_post();
		$result  = $this->class_instance->import();

		$seo_title = get_post_meta( $post_id, WPSEO_Meta::$meta_prefix . 'title', true );
		$seo_desc  = get_post_meta( $post_id, WPSEO_Meta::$meta_prefix . 'metadesc', true );

		$this->assertEquals( $seo_title, 'Test title' );
		$this->assertEquals( $seo_desc, 'Test description' );
		$this->assertEquals( $this->status( 'import', true ), $result );
	}

	/**
	 * @covers WPSEO_Import_HeadSpace::cleanup
	 */
	public function test_cleanup_without_data() {
		$result  = $this->class_instance->cleanup();
		$this->assertEquals( $this->status( 'cleanup', false ), $result );
	}

	/**
	 * @covers WPSEO_Import_HeadSpace::cleanup
	 */
	public function test_cleanup() {
		$post_id = $this->setup_post();
		$result  = $this->class_instance->cleanup();

		$seo_title = get_post_meta( $post_id, '_headspace_page_title', true );
		$seo_desc  = get_post_meta( $post_id, '_headspace_description', true );

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
		update_post_meta( $post_id, '_headspace_page_title', 'Test title' );
		update_post_meta( $post_id, '_headspace_description', 'Test description' );

		return $post_id;
	}
}
