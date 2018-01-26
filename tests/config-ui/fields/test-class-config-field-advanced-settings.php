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
	 * @dataProvider get_data_values
	 *
	 * @param string $expected     The expected result.
	 * @param bool   $option_value The saved option value.
	 */
	public function test_get_data( $expected, $option_value ) {
		$class_instance = $this
			->getMockBuilder( 'WPSEO_Config_Field_Advanced_Settings' )
			->setMethods( array( 'get_option_value' ) )
			->getMock();

		$class_instance
			->expects( $this->once() )
			->method( 'get_option_value' )
			->will( $this->returnValue( $option_value ) );

		$this->assertEquals( $expected, $class_instance->get_data() );
	}

	/**
	 * @dataProvider set_data_values
	 *
	 * @param bool   $expected      The expected result.
	 * @param string $value_to_save The value to save.
	 * @param bool   $option_value  The saved option value.
	 */
	public function test_set_data( $expected, $value_to_save, $option_value ) {
		$class_instance = $this
			->getMockBuilder( 'WPSEO_Config_Field_Advanced_Settings' )
			->setMethods( array( 'get_option_value', 'set_option_value' ) )
			->getMock();

		$class_instance
			->expects( $this->once() )
			->method( 'get_option_value' )
			->will( $this->returnValue( $option_value ) );

		$this->assertEquals( $expected, $class_instance->set_data( $value_to_save ) );
	}

	/**
	 * Returns an array with data values for the get_data test.
	 *
	 * Format:
	 * [0] string is the expected value.
	 * [1] bool   is the value that get_option_value will return.
	 *
	 * @return array The data values.
	 */
	public function get_data_values() {
		return array(
			array( 'true', true ),
			array( 'false', false ),
		);
	}

	/**
	 * Returns an array with data values for the set_data test.
	 *
	 * Format:
	 * [0] bool   is the expected value.
	 * [1] string is the value to save.
	 * [2] bool   is the value that get_option_value will return.
	 *
	 * @return array The data values.
	 */
	public function set_data_values() {
		return array(
			array( true, 'true', true ),
			array( false, 'true', false ),
			array( true, 'false', false ),
			array( false, 'false', true ),
		);
	}
}
