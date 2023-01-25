<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Admin\Import\Plugins
 */

/**
 * Test importing meta data from wpSEO.de.
 */
class WPSEO_Import_WPSEO_Test extends WPSEO_UnitTestCase {

	/**
	 * Holds the class instance.
	 *
	 * @var WPSEO_Import_WPSEO
	 */
	private $class_instance;

	/**
	 * Sets up the test class.
	 */
	public function set_up() {
		parent::set_up();

		$this->class_instance = new WPSEO_Import_WPSEO();
	}

	/**
	 * Tests the plugin name function.
	 *
	 * @covers WPSEO_Import_WPSEO::get_plugin_name
	 */
	public function test_plugin_name() {
		$this->assertEquals( 'wpSEO.de', $this->class_instance->get_plugin_name() );
	}

	/**
	 * Tests whether this importer has been registered.
	 *
	 * @covers WPSEO_Plugin_Importers::get
	 */
	public function test_importer_registered() {
		$this->assertContains( 'WPSEO_Import_WPSEO', WPSEO_Plugin_Importers::get() );
	}

	/**
	 * Tests whether we can return false when there's no detectable data.
	 *
	 * @covers WPSEO_Import_WPSEO::run_detect
	 * @covers WPSEO_Import_WPSEO::detect
	 */
	public function test_detect_no_data() {
		$this->assertEquals( $this->status( 'detect', false ), $this->class_instance->run_detect() );
	}

	/**
	 * Tests whether we can detect data.
	 *
	 * @covers WPSEO_Import_WPSEO::__construct
	 * @covers WPSEO_Import_WPSEO::run_detect
	 * @covers WPSEO_Import_WPSEO::detect
	 */
	public function test_detect() {
		$this->setup_data();
		$this->assertEquals( $this->status( 'detect', true ), $this->class_instance->run_detect() );
	}

	/**
	 * Tests whether we can return properly when there's nothing to import.
	 *
	 * @covers WPSEO_Import_WPSEO::run_import
	 */
	public function test_import_no_data() {
		$this->assertEquals( $this->status( 'import', false ), $this->class_instance->run_import() );
	}

	/**
	 * Tests whether we can properly import data.
	 *
	 * @covers WPSEO_Import_WPSEO::detect
	 * @covers WPSEO_Import_WPSEO::run_import
	 * @covers WPSEO_Import_WPSEO::import
	 * @covers WPSEO_Import_WPSEO::import_post_robot
	 * @covers WPSEO_Import_WPSEO::import_post_robots
	 * @covers WPSEO_Import_WPSEO::get_robot_value
	 */
	public function test_import() {
		$post_id = $this->setup_data();
		$result  = $this->class_instance->run_import();

		$seo_title       = get_post_meta( $post_id, WPSEO_Meta::$meta_prefix . 'title', true );
		$seo_desc        = get_post_meta( $post_id, WPSEO_Meta::$meta_prefix . 'metadesc', true );
		$og_title        = get_post_meta( $post_id, WPSEO_Meta::$meta_prefix . 'opengraph-title', true );
		$tw_title        = get_post_meta( $post_id, WPSEO_Meta::$meta_prefix . 'twitter-title', true );
		$robots_noindex  = get_post_meta( $post_id, WPSEO_Meta::$meta_prefix . 'meta-robots-noindex', true );
		$robots_nofollow = get_post_meta( $post_id, WPSEO_Meta::$meta_prefix . 'meta-robots-nofollow', true );

		$this->assertEquals( 'Test title', $seo_title );
		$this->assertEquals( 'Test description', $seo_desc );
		$this->assertEquals( 'Test OG title', $og_title );
		$this->assertEquals( 'Test Twitter title', $tw_title );
		$this->assertEquals( 1, $robots_noindex );
		$this->assertEquals( 1, $robots_nofollow );
		$this->assertEquals( $this->status( 'import', true ), $result );
	}

	/**
	 * Tests whether we can properly import taxonomy metadata.
	 *
	 * @covers WPSEO_Import_WPSEO::detect
	 * @covers WPSEO_Import_WPSEO::run_import
	 * @covers WPSEO_Import_WPSEO::import
	 * @covers WPSEO_Import_WPSEO::import_taxonomy_metas
	 * @covers WPSEO_Import_WPSEO::import_taxonomy_robots
	 * @covers WPSEO_Import_WPSEO::import_taxonomy_description
	 * @covers WPSEO_Import_WPSEO::meta_key_clone
	 * @covers WPSEO_Import_WPSEO::meta_keys_clone
	 */
	public function test_import_category() {
		$this->create_category_metadata( 'test-category', 'Test-category description', 5 );
		$this->create_category_metadata( 'test-category-2', 'Test-category 2 description', 6 );
		$result = $this->class_instance->run_import();

		$cat_metadesc = WPSEO_Taxonomy_Meta::get_term_meta( 'test-category', 'category', 'desc' );
		$cat_robots   = WPSEO_Taxonomy_Meta::get_term_meta( 'test-category', 'category', 'noindex' );
		$cat_robots_2 = WPSEO_Taxonomy_Meta::get_term_meta( 'test-category-2', 'category', 'noindex' );

		$this->assertEquals( $this->status( 'import', true ), $result );
		$this->assertEquals( 'Test-category description', $cat_metadesc );
		$this->assertEquals( 'noindex', $cat_robots );
		$this->assertEquals( 'index', $cat_robots_2 );
	}

	/**
	 * Tests whether we correctly handle importing faulty meta robots data.
	 *
	 * @covers WPSEO_Import_WPSEO::run_import
	 * @covers WPSEO_Import_WPSEO::import_post_robot
	 * @covers WPSEO_Import_WPSEO::import_post_robots
	 * @covers WPSEO_Import_WPSEO::get_robot_value
	 */
	public function test_import_faulty_robots() {
		$post_id = $this->setup_data();
		update_post_meta( $post_id, '_wpseo_edit_robots', 9 );

		$this->class_instance->run_import();
		$robots_noindex = get_post_meta( $post_id, WPSEO_Meta::$meta_prefix . 'meta-robots-noindex', true );
		$this->assertEquals( 2, $robots_noindex );
	}

	/**
	 * Tests whether we can properly return an error when there is no data to clean.
	 *
	 * @covers WPSEO_Import_WPSEO::run_cleanup
	 */
	public function test_cleanup_no_data() {
		$this->assertEquals( $this->status( 'cleanup', false ), $this->class_instance->run_cleanup() );
	}

	/**
	 * Tests whether we can properly clean up.
	 *
	 * @covers WPSEO_Import_WPSEO::run_cleanup
	 * @covers WPSEO_Import_WPSEO::cleanup
	 * @covers WPSEO_Import_WPSEO::cleanup_post_meta
	 * @covers WPSEO_Import_WPSEO::cleanup_term_meta
	 * @covers WPSEO_Import_WPSEO::delete_taxonomy_metas
	 */
	public function test_cleanup() {
		$post_id = $this->setup_data();
		$result  = $this->class_instance->run_cleanup();

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
	private function setup_data() {
		$post_id = $this->factory()->post->create();
		update_post_meta( $post_id, '_wpseo_edit_title', 'Test title' );
		update_post_meta( $post_id, '_wpseo_edit_description', 'Test description' );
		update_post_meta( $post_id, '_wpseo_edit_robots', 5 );
		update_post_meta( $post_id, '_wpseo_edit_og_title', 'Test OG title' );
		update_post_meta( $post_id, '_wpseo_edit_twittercard_title', 'Test Twitter title' );

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
			[
				'name'     => $name,
				'taxonomy' => 'category',
			]
		);
		update_option( 'wpseo_category_' . $term_id, $desc );
		update_option( 'wpseo_category_' . $term_id . '_robots', $robots );
	}
}
