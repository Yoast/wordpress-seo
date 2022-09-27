<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Admin\Import\Plugins
 */

/**
 * Test importing meta data from Jetpack SEO.
 */
class WPSEO_Import_Jetpack_SEO_Test extends WPSEO_UnitTestCase {

	/**
	 * Holds the class instance.
	 *
	 * @var WPSEO_Import_Jetpack_SEO
	 */
	private $class_instance;

	/**
	 * Sets up the test class.
	 */
	public function set_up() {
		parent::set_up();

		$this->class_instance = new WPSEO_Import_Jetpack_SEO();
	}

	/**
	 * Tests the plugin name function.
	 *
	 * @covers WPSEO_Import_Jetpack_SEO::get_plugin_name
	 */
	public function test_plugin_name() {
		$this->assertEquals( 'Jetpack', $this->class_instance->get_plugin_name() );
	}

	/**
	 * Tests whether this importer has been registered.
	 *
	 * @covers WPSEO_Plugin_Importers::get
	 */
	public function test_importer_registered() {
		$this->assertContains( 'WPSEO_Import_Jetpack_SEO', WPSEO_Plugin_Importers::get() );
	}

	/**
	 * Tests whether we can return false when there's no detectable data.
	 *
	 * @covers WPSEO_Import_Jetpack_SEO::__construct
	 * @covers WPSEO_Import_Jetpack_SEO::run_detect
	 * @covers WPSEO_Import_Jetpack_SEO::detect
	 */
	public function test_detect_without_data() {
		$this->assertEquals( $this->status( 'detect', false ), $this->class_instance->run_detect() );
	}

	/**
	 * Tests whether we can detect data.
	 *
	 * @covers WPSEO_Import_Jetpack_SEO::run_detect
	 * @covers WPSEO_Import_Jetpack_SEO::detect
	 */
	public function test_detect() {
		$this->setup_post();
		$this->assertEquals( $this->status( 'detect', true ), $this->class_instance->run_detect() );
	}

	/**
	 * Tests whether we can return properly when there's nothing to import.
	 *
	 * @covers WPSEO_Import_Jetpack_SEO::run_import
	 */
	public function test_import_without_data() {
		$result = $this->class_instance->run_import();
		$this->assertEquals( $this->status( 'import', false ), $result );
	}

	/**
	 * Tests whether we can properly import data.
	 *
	 * @covers WPSEO_Import_Jetpack_SEO::run_import
	 * @covers WPSEO_Import_Jetpack_SEO::import
	 * @covers WPSEO_Import_Jetpack_SEO::meta_key_clone
	 */
	public function test_import() {
		$post_id = $this->setup_post();
		$result  = $this->class_instance->run_import();

		$seo_desc = get_post_meta( $post_id, WPSEO_Meta::$meta_prefix . 'metadesc', true );

		$this->assertEquals( $seo_desc, 'Test description' );
		$this->assertEquals( $this->status( 'import', true ), $result );
	}

	/**
	 * Tests whether we can properly return an error when there is no data to clean.
	 *
	 * @covers WPSEO_Import_Jetpack_SEO::run_cleanup
	 */
	public function test_cleanup_without_data() {
		$result = $this->class_instance->run_cleanup();
		$this->assertEquals( $this->status( 'cleanup', false ), $result );
	}

	/**
	 * Tests whether we can properly clean up.
	 *
	 * @covers WPSEO_Import_Jetpack_SEO::run_cleanup
	 * @covers WPSEO_Import_Jetpack_SEO::cleanup
	 */
	public function test_cleanup() {
		$post_id = $this->setup_post();
		$result  = $this->class_instance->run_cleanup();

		$seo_desc = get_post_meta( $post_id, 'advanced_seo_description', true );

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
	private function setup_post() {
		$post_id = $this->factory()->post->create();
		update_post_meta( $post_id, 'advanced_seo_description', 'Test description' );

		return $post_id;
	}
}
