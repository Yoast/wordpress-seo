<?php
/**
 * @package WPSEO\Tests\Premium
 */

/**
 * Unit Test Class.
 */
class WPSEO_Term_Watcher_Test extends WPSEO_UnitTestCase {

	/**
	 * Include helper class.
	 */
	public static function setUpBeforeClass() {
		parent::setUpBeforeClass();

		require_once WPSEO_TESTS_PATH . 'premium/doubles/term-watcher-double.php';
	}

	/**
	 * This variable is instantiated in setUp() and is a mock object. This is used for future use in the tests
	 *
	 * @var WPSEO_Term_Watcher_Double
	 */
	protected $class_instance;

	/**
	 * Mocking the term watcher
	 */
	public function setUp() {
		parent::setUp();

		$this->class_instance = $this
			->getMockBuilder( 'WPSEO_Term_Watcher_Double' )
			->setMethods( array( 'get_taxonomy_permalink' ) )
			->getMock();

	}

	/**
	 * Make sure old_url is set when the permalink is returned
	 *
	 * @covers WPSEO_Term_Watcher::set_old_url_quick_edit
	 */
	public function test_set_old_url_quick_edit_IS_NOT_wp_error() {
		$this->class_instance
			->expects( $this->once() )
			->method( 'get_taxonomy_permalink' )
			->will( $this->returnValue( home_url() . '/categories/test/' ) );

		$this->class_instance->set_old_url_quick_edit();

		$this->assertEquals( '/categories/test/', $this->class_instance->old_url );
	}

	/**
	 * Make sure old_url is not set when WP_Error is returned
	 *
	 * @covers WPSEO_Term_Watcher::set_old_url_quick_edit
	 */
	public function test_set_old_url_quick_edit_IS_wp_error() {
		$this->class_instance
			->expects( $this->once() )
			->method( 'get_taxonomy_permalink' )
			->will( $this->returnValue( new WP_Error( 'Test_error', 'Test' ) ) );

		$this->class_instance->set_old_url_quick_edit();

		$this->assertEquals( '', $this->class_instance->old_url );
	}

}

