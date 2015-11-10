<?php
/**
 * @package WPSEO\Tests/Premium
 */

/**
 * Test class for the redirect option class
 *
 * @covers WPSEO_Redirect
 */
class WPSEO_Redirect_Test extends WPSEO_UnitTestCase {

	/**
	 * This variable is instantiated in setUp().
	 *
	 * @var WPSEO_Redirect_Option
	 */
	protected $class_instance;

	/**
	 * Setting the instance
	 */
	public function setUp() {
		parent::setUp();

		$this->class_instance = new WPSEO_Redirect_Option( 'wpseo_redirects' );
		$this->class_instance->set(
			array(
				'old-url' => array(
					'url'  => 'new-url',
					'type' => 301,
				),
			)
		);
	}

	/**
	 * Test the result of the get_all method. Should return an empty array
	 *
	 * @covers WPSEO_Redirect::get_all
	 */
	public function test_get_all() {
		$this->assertEquals(
			array(
				'old-url' => array(
					'url'  => 'new-url',
					'type' => 301,
				),
			),
			$this->class_instance->get_all()
		);
	}

	/**
	 * Test if storing redirects by passing an array works.
	 *
	 * @covers WPSEO_Redirect::set
	 */
	public function test_set() {
		$this->class_instance->set(
			array( 'first-redirect', 'second-redirect' )
		);

		$this->assertEquals( array( 'first-redirect', 'second-redirect' ), $this->class_instance->get_all() );
	}

	/**
	 * Test adding a new redirect and add the same one also, to check if this one will be skipped
	 *
	 * @covers WPSEO_Redirect::add
	 */
	public function test_add() {
		$this->assertTrue( $this->class_instance->add( 'new-redirect', 'new-target', 301 ) );
		$this->assertFalse( $this->class_instance->add( 'old-url', 'new-url', 301 ) );
	}

	/**
	 * Test updating a redirect and update another redirect that doesn't exists
	 *
	 * @covers WPSEO_Redirect::update
	 */
	public function test_update() {
		$this->assertTrue( $this->class_instance->update( 'old-url', 'older-url', 'older-target', 301 ) );
		$this->assertFalse( $this->class_instance->update( 'does-not-exists', 'old-target', 'new-target', 301 ) );
	}

	/**
	 * Test deleting a redirect and delete another redirect that doesn't exists
	 *
	 * @covers WPSEO_Redirect::delete
	 */
	public function test_delete() {
		$this->assertTrue( $this->class_instance->delete( 'old-url' ) );
		$this->assertFalse( $this->class_instance->delete( 'does-not-exists' ) );
	}

	/**
	 * Test if searching for a redirect is working
	 *
	 * @covers WPSEO_Redirect::search
	 */
	public function test_search() {
		$this->assertEquals( array( 'url' => 'new-url', 'type' => 301 ), $this->class_instance->search( 'old-url' ) );
		$this->assertFalse( $this->class_instance->search( 'does-not-exist' ) );
	}

	/**
	 * Test the result of the formatting.
	 *
	 * @covers WPSEO_Redirect::format
	 */
	public function test_format() {
		$this->assertEquals(
			array( 'url' => 'the-target', 'type' => 301 ),
			$this->class_instance->format( 'the-target', 301 )
		);
	}
}
