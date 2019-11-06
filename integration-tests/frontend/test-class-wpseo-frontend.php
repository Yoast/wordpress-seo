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
}
