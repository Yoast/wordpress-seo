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
class WPSEO_Indexable_Test extends WPSEO_UnitTestCase {

	/**
	 * Tests the conversion of the noindex value.
	 *
	 * @param string	$value		 The value to test with.
	 * @param bool|null $expected	 The expected conversion.
	 * @param string	$description Description of the test.
	 *
	 * @dataProvider noindex_conversion_provider
	 * @covers WPSEO_Indexable::get_robots_noindex_value()
	 */
	public function test_get_robots_noindex_value( $value, $expected, $description ) {
		$data = WPSEO_Indexable_Double::get_robots_noindex_value( $value );

		$this->assertEquals( $expected, $data, $description );
	}

	/**
	 * Tests the retrieval of data as an array.
	 *
	 * @covers WPSEO_Indexable::to_array()
	 */
	public function test_to_array() {
		$instance = $this
			->getMockBuilder( 'WPSEO_Indexable_Double' )
			->setConstructorArgs(
				array(
					array( 'field' => 'value' )
				)
			)
			->setMethods( array( 'validate_data' ) )
			->getMock();

		$instance->set_data( array( 'field' => 'value' ) );

		$this->assertEquals( array( 'field' => 'value' ), $instance->to_array() );
	}

	/**
	 * Returns an array with test data.
	 *
	 * @return array The test data.
	 */
	public function noindex_conversion_provider() {
		return array(
			array( '1', true, 'With noindex set to string value of 1' ),
			array( '2', false, 'With noindex set to string value of 2' ),
			array( true, null, 'With noindex set to boolean value of true' ),
			array( false, null, 'With noindex set to boolean value of false' ),
			array( null, null, 'With noindex set to value of null' ),
		);
	}
}
