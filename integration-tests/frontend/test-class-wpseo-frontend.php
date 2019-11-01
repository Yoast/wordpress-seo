<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests
 */

/**
 * Unit Test Class.
 *
 * @group frontend
 */
class WPSEO_Frontend_Test extends WPSEO_UnitTestCase_Frontend {

	/**
	 * Setting up.
	 */
	public static function setUpBeforeClass() {
		parent::setUpBeforeClass();

		self::$class_instance = WPSEO_Frontend_Double::get_instance();
	}

	/**
	 * Reset permalink structure.
	 *
	 * @return void
	 */
	public function setUp() {
		parent::setUp();
		$this->set_permalink_structure( '' );
		create_initial_taxonomies();
	}

	/**
	 * Reset after running a test.
	 */
	public function tearDown() {
		parent::tearDown();

		$this->reset_post_types();

		ob_clean();
		self::$class_instance->reset();
		update_option( 'posts_per_page', 10 );
	}



	/**
	 * Tests the situation for flush cache with output buffering not turned on.
	 *
	 * @covers WPSEO_Frontend::flush_cache
	 */
	public function test_flush_cache_with_output_buffering_not_turned_on() {
		// Should not run when output buffering is not turned on.
		$this->assertFalse( self::$class_instance->flush_cache() );
	}

	/**
	 * @covers WPSEO_Frontend::force_rewrite_output_buffer
	 */
	public function test_force_rewrite_output_buffer() {
		self::$class_instance->force_rewrite_output_buffer();
		$this->assertTrue( ( ob_get_level() > 0 ) );
		ob_get_clean();
	}

}
