<?php
/**
 * WPSEO Premium plugin test file.
 *
 * @package WPSEO\Tests\Premium
 */

/**
 * Unit Test Class.
 */
class WPSEO_Validation_Error_Test extends WPSEO_UnitTestCase {

	/**
	 * Test retrieving of an error message.
	 */
	public function test_get_message() {
		$validation_error = new WPSEO_Validation_Error( 'This is an error message' );

		$this->assertEquals( 'This is an error message', $validation_error->get_message() );
	}

	/**
	 * Test error type.
	 */
	public function test_get_type() {
		$validation_error = new WPSEO_Validation_Error( 'This is an error message' );

		$this->assertEquals( 'error', $validation_error->get_type() );
	}

	/**
	 * Test retrieving of error information as an array.
	 */
	public function test_to_array() {
		$validation_error = new WPSEO_Validation_Error( 'This is an error message', array( 'field' => 'value' ) );

		$this->assertEquals(
			array(
				'type'    => 'error',
				'message' => 'This is an error message',
				'fields'  => array( 'field' => 'value' ),
			),
			$validation_error->to_array()
		);
	}

	/**
	 * Test retrieving of error information as an array.
	 */
	public function test_to_array_WITH_string_as_fields() {
		$validation_error = new WPSEO_Validation_Error( 'This is an error message', 'field' );

		$this->assertEquals(
			array(
				'type'    => 'error',
				'message' => 'This is an error message',
				'fields'  => array( 'field' ),
			),
			$validation_error->to_array()
		);
	}

}
