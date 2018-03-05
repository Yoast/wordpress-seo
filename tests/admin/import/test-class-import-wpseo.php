<?php
/**
 * @package WPSEO\Tests\Admin\Import\Plugins
 */

/**
 * Test importing meta data from wpSEO.de.
 */
class WPSEO_Import_WPSEO_Test extends WPSEO_UnitTestCase {
	/**
	 * @var WPSEO_Import_WPSEO
	 */
	private $class_instance;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$this->class_instance = new WPSEO_Import_WPSEO();
	}

	/**
	 * @covers WPSEO_Import_WPSEO::plugin_name
	 */
	public function test_plugin_name() {
		$this->assertEquals( 'wpSEO.de', $this->class_instance->plugin_name() );
	}

	/**
	 * @covers WPSEO_Import_WPSEO::detect
	 * @covers WPSEO_Import_WPSEO::detect_helper
	 */
	public function test_detect_no_data() {
		$this->assertEquals( $this->status( 'detect', false ), $this->class_instance->detect() );
	}

	/**
	 * @covers WPSEO_Import_WPSEO::__construct
	 * @covers WPSEO_Import_WPSEO::detect
	 * @covers WPSEO_Import_WPSEO::detect_helper
	 */
	public function test_detect() {
		$this->setup_data();
		$this->assertEquals( $this->status( 'detect', true ), $this->class_instance->detect() );
	}

	/**
	 * @covers WPSEO_Import_WPSEO::import
	 */
	public function test_import_no_data() {
		$this->assertEquals( $this->status( 'import', false ), $this->class_instance->import() );
	}

	/**
	 * @covers WPSEO_Import_WPSEO::detect_helper
	 * @covers WPSEO_Import_WPSEO::import
	 * @covers WPSEO_Import_WPSEO::import_post_metas
	 * @covers WPSEO_Import_WPSEO::import_post_robot
	 * @covers WPSEO_Import_WPSEO::import_post_robots
	 * @covers WPSEO_Import_WPSEO::get_robot_value
	 *
	 * @group  test
	 */
	public function test_import() {
		$post_id = $this->setup_data();
		$result  = $this->class_instance->import();

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
	 * @covers WPSEO_Import_WPSEO::detect_helper
	 * @covers WPSEO_Import_WPSEO::import
	 * @covers WPSEO_Import_WPSEO::import_taxonomy_metas
	 * @covers WPSEO_Import_WPSEO::import_taxonomy_robots
	 * @covers WPSEO_Import_WPSEO::import_taxonomy_description
	 *
	 * @group test
	 */
	public function test_import_category() {
		$this->create_category_metadata( 'test-category', 'Test-category description', 5 );
		$this->create_category_metadata( 'test-category-2', 'Test-category 2 description', 6 );
		$result = $this->class_instance->import();

		$cat_metadesc = WPSEO_Taxonomy_Meta::get_term_meta( 'test-category', 'category', 'desc' );
		$cat_robots   = WPSEO_Taxonomy_Meta::get_term_meta( 'test-category', 'category', 'noindex' );
		$cat_robots_2 = WPSEO_Taxonomy_Meta::get_term_meta( 'test-category-2', 'category', 'noindex' );

		$this->assertEquals( $this->status( 'import', true ), $result );
		$this->assertEquals( 'Test-category description', $cat_metadesc );
		$this->assertEquals( 'noindex', $cat_robots );
		$this->assertEquals( 'index', $cat_robots_2 );
	}

	/**
	 * @covers WPSEO_Import_WPSEO::import
	 * @covers WPSEO_Import_WPSEO::import_post_robot
	 * @covers WPSEO_Import_WPSEO::import_post_robots
	 * @covers WPSEO_Import_WPSEO::get_robot_value
	 */
	public function test_import_faulty_robots() {
		$post_id = $this->setup_data();
		update_post_meta( $post_id, '_wpseo_edit_robots', 9 );

		$this->class_instance->import();
		$robots_noindex = get_post_meta( $post_id, WPSEO_Meta::$meta_prefix . 'meta-robots-noindex', true );
		$this->assertEquals( 2, $robots_noindex );
	}

	/**
	 * @covers WPSEO_Import_WPSEO::cleanup
	 */
	public function test_cleanup_no_data() {
		$this->assertEquals( $this->status( 'cleanup', false ), $this->class_instance->cleanup() );
	}

	/**
	 * @covers WPSEO_Import_WPSEO::cleanup
	 * @covers WPSEO_Import_WPSEO::cleanup_post_meta
	 * @covers WPSEO_Import_WPSEO::cleanup_term_meta
	 * @covers WPSEO_Import_WPSEO::delete_taxonomy_metas
	 */
	public function test_cleanup() {
		$post_id = $this->setup_data();
		$result  = $this->class_instance->cleanup();

		$seo_title = get_post_meta( $post_id, '_wpseo_edit_title', true );
		$seo_desc  = get_post_meta( $post_id, '_wpseo_edit_description', true );

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
	private function setup_data() {
		$post_id = $this->factory()->post->create();
		update_post_meta( $post_id, '_wpseo_edit_title', 'Test title' );
		update_post_meta( $post_id, '_wpseo_edit_description', 'Test description' );
		update_post_meta( $post_id, '_wpseo_edit_robots', 5 );

		return $post_id;
	}

	/**
	 * Helper function to create category metadata.
	 *
	 * @param string $name   Category name and slug.
	 * @param string $desc   Category meta description.
	 * @param int    $robots Category wpSEO.de robots setting.
	 *
	 * @return void
	 */
	private function create_category_metadata( $name, $desc, $robots ) {
		$term_id = $this->factory->term->create(
			array(
				'name'     => $name,
				'taxonomy' => 'category',
			)
		);
		update_option( 'wpseo_category_' . $term_id, $desc );
		update_option( 'wpseo_category_' . $term_id . '_robots', $robots );
	}
}
