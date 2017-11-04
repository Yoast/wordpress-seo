<?php
/**
 * @package WPSEO\Tests\Premium
 */

/**
 * Unit Test Class.
 */
class WPSEO_Validation_Warning_Test extends WPSEO_UnitTestCase {

	/**
	 * Test retrieving of a warning message.
	 */
	public function test_get_message() {
		$validation_error = new WPSEO_Validation_Warning( 'This is a warning' );

		$this->assertEquals( 'This is a warning', $validation_error->get_message() );
	}

	/**
	 * Test error type.
	 */
	public function test_get_type() {
		$validation_error = new WPSEO_Validation_Warning( 'This is a warning' );

		$this->assertEquals( 'warning', $validation_error->get_type() );
	}

	/**
	 * Test retrieving of warning information as an array.
	 */
	public function test_to_array() {
		$validation_error = new WPSEO_Validation_Warning( 'This is a warning', array( 'field' => 'value' ) );

		$this->assertEquals(
			array(
				'type'    => 'warning',
				'message' => 'This is a warning',
				'fields'  => array( 'field' => 'value' ),
			),
			$validation_error->to_array()
		);
	}

	/**
	 * Test retrieving of warning information as an array.
	 */
	public function test_to_array_WITH_string_as_fields() {
		$validation_error = new WPSEO_Validation_Warning( 'This is a warning', 'field' );

		$this->assertEquals(
			array(
				'type'    => 'warning',
				'message' => 'This is a warning',
				'fields'  => array( 'field' ),
			),
			$validation_error->to_array()
		);
	}
}
