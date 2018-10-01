<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests
 */

/**
 * Unit Test Class.
 *
 * @group indexable
 */
class WPSEO_Object_Type_Test extends WPSEO_UnitTestCase {

	/**
	 * @var WPSEO_Object_Type
	 */
	private $class_instance;

	/**
	 * Sets up the test.
	 */
	public function setUp() {
		parent::setUp();

		$this->class_instance = $this
			->getMockBuilder( 'WPSEO_Object_Type' )
			->setConstructorArgs( array( 1, 'post', 'post', 'the-permalink' ) )
			->getMockForAbstractClass();
	}

	/**
	 * Tests the retrieval of the ID.
	 *
	 * @covers WPSEO_Object_Type::get_id
	 */
	public function test_get_id() {
		$this->assertEquals( 1, $this->class_instance->get_id() );
	}

	/**
	 * Tests the retrieval of the type.
	 *
	 * @covers WPSEO_Object_Type::get_type
	 */
	public function test_get_type() {
		$this->assertEquals( 'post', $this->class_instance->get_type() );
	}

	/**
	 * Tests the retrieval of the subtype.
	 *
	 * @covers WPSEO_Object_Type::get_subtype
	 */
	public function test_get_subtype() {
		$this->assertEquals( 'post', $this->class_instance->get_subtype() );
	}

	/**
	 * Tests the retrieval of the permalink.
	 *
	 * @covers WPSEO_Object_Type::get_permalink
	 */
	public function test_get_permalink() {
		$this->assertEquals( $this->class_instance->get_permalink(), 'the-permalink' );
	}

	/**
	 * Tests the comparison of the type against the passed, valid type.
	 *
	 * @covers WPSEO_Object_Type::is_type
	 */
	public function test_is_type() {
		$this->assertTrue( $this->class_instance->is_type( 'post' ) );
	}

	/**
	 * Tests the comparison of the type against the passed, valid subtype.
	 *
	 * @covers WPSEO_Object_Type::is_subtype
	 */
	public function test_is_subtype() {
		$this->assertTrue( $this->class_instance->is_subtype( 'post' ) );
	}

	/**
	 * Tests the comparison of the type against the passed, invalid type.
	 *
	 * @covers WPSEO_Object_Type::is_type
	 */
	public function test_is_not_type() {
		$this->assertFalse( $this->class_instance->is_type( 'term' ) );
	}

	/**
	 * Tests the comparison of the type against the passed, invalid subtype.
	 *
	 * @covers WPSEO_Object_Type::is_subtype
	 */
	public function test_is_not_subtype() {
		$this->assertFalse( $this->class_instance->is_subtype( 'term')  );
	}
}
