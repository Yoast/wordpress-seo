<?php
/**
 * @package WPSEO\Tests\ConfigUI\Fields
 */

/**
 * WPSEO_Config_Field_Advanced_Settings_Test
 *
 * @group configuration-wizard
 */
class WPSEO_Config_Field_Advanced_Settings_Test extends PHPUnit_Framework_TestCase {

	/**
	 * Tests the get data method.
	 *
	 * @dataProvider get_data_values
	 *
	 * @param string $expected     The expected result.
	 * @param bool   $option_value The saved option value.
	 * @param string $description  The description of the test purpose.
	 */
	public function test_get_data( $expected, $option_value, $description ) {
		$class_instance = $this
			->getMockBuilder( 'WPSEO_Config_Field_Advanced_Settings' )
			->setMethods( array( 'get_option_value' ) )
			->getMock();

		$class_instance
			->expects( $this->once() )
			->method( 'get_option_value' )
			->will( $this->returnValue( $option_value ) );

		$this->assertEquals( $expected, $class_instance->get_data(), $description );
	}

	/**
	 * Tests the set data method.
	 *
	 * @dataProvider set_data_values
	 *
	 * @param bool   $expected      The expected result.
	 * @param string $value_to_save The value to save.
	 * @param bool   $option_value  The saved option value.
	 * @param string $description   The description of the test purpose.
	 */
	public function test_set_data( $expected, $value_to_save, $option_value, $description ) {
		$class_instance = $this
			->getMockBuilder( 'WPSEO_Config_Field_Advanced_Settings' )
			->setMethods( array( 'get_option_value', 'set_option_value' ) )
			->getMock();

		$class_instance
			->expects( $this->once() )
			->method( 'get_option_value' )
			->will( $this->returnValue( $option_value ) );

		$this->assertEquals( $expected, $class_instance->set_data( $value_to_save ), $description );
	}

	/**
	 * Returns an array with data values for the get_data test.
	 *
	 * Format:
	 * [0] string is the expected value.
	 * [1] bool   is the value that get_option_value will return.
	 * [2] string is the description of the test.
	 *
	 * @return array The data values.
	 */
	public function get_data_values() {
		return array(
			array( 'true', true, 'Boolean true converted to string true.' ),
			array( 'false', false, 'Boolean false converted to string false' ),
			array( 'false', 'foo', 'Unexpected string foo converted to string false' ),
		);
	}

	/**
	 * Returns an array with data values for the set_data test.
	 *
	 * Format:
	 * [0] bool   is the expected value.
	 * [1] string is the value to save.
	 * [2] bool   is the value that get_option_value will return.
	 * [3] string is the description of the test.
	 *
	 * @return array The data values.
	 */
	public function set_data_values() {
		return array(
			array( true, 'true', true, 'Saving the value true when old value is false.' ),
			array( false, 'true', false, 'Saving the value true when old value already is true.' ),
			array( true, 'false', false, 'Saving the value false when old value is true' ),
			array( false, 'false', true, 'Saving the value false when old value already is false.' ),
			array( true, 'foo', false, 'Saving unexpected value converted to false when old value is true.' ),
			array( false, 'foo', true, 'Saving unexpected value converted to false when old value already is false.' ),
		);
	}
}
