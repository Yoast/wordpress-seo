<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Admin
 */

/**
 * User input validation tests.
 *
 * @group input-validation
 */
class Yoast_Input_Validation_Test extends WPSEO_UnitTestCase {

	/**
	 * Tests the document title is updated when there's an error.
	 *
	 * @covers Yoast_Input_Validation::yoast_admin_document_title_errors
	 */
	public function test_document_title_updated_with_error() {
		$admin_title = 'Original title';

		add_settings_error(
			'yoast-setting-group-name',
			'code',
			'This is the error message',
			'error'
		);

		$title_with_error_message = Yoast_Input_Validation::yoast_admin_document_title_errors( $admin_title );

		$this->assertEquals( 'The form contains 1 error. Original title', $title_with_error_message );

		unset( $GLOBALS['wp_settings_errors'] );
	}

	/**
	 * Tests the document title is updated when there's more than one error.
	 *
	 * @covers Yoast_Input_Validation::yoast_admin_document_title_errors
	 */
	public function test_document_title_updated_with_errors() {
		$admin_title = 'Original title';

		add_settings_error(
			'yoast-setting-first-group-name',
			'first-code',
			'This is the first error message',
			'error'
		);

		add_settings_error(
			'yoast-setting-second-group-name',
			'second-code',
			'This is second error message',
			'error'
		);

		$title_with_error_message = Yoast_Input_Validation::yoast_admin_document_title_errors( $admin_title );

		$this->assertEquals( 'The form contains 2 errors. Original title', $title_with_error_message );

		unset( $GLOBALS['wp_settings_errors'] );
	}

	/**
	 * Tests the document title is not updated when the error is not a Yoast SEO error.
	 *
	 * @covers Yoast_Input_Validation::yoast_admin_document_title_errors
	 */
	public function test_document_title_not_updated_with_non_yoast_errors() {
		$admin_title = 'Original title';

		add_settings_error(
			'new_admin_email',
			'invalid_new_admin_email',
			'This is the error message',
			'error'
		);

		$title_with_error_message = Yoast_Input_Validation::yoast_admin_document_title_errors( $admin_title );

		$this->assertEquals( 'Original title', $title_with_error_message );

		unset( $GLOBALS['wp_settings_errors'] );
	}

	/**
	 * Tests a submitted invalid value is added to the WordPress `$wp_settings_errors` global.
	 *
	 * @covers Yoast_Input_Validation::add_dirty_value_to_settings_errors
	 */
	public function test_add_dirty_value_to_settings_errors() {
		global $wp_settings_errors;
		$added_dirty_value = '';

		add_settings_error(
			'name_of_input_field_with_error',
			'name_of_input_field_with_error',
			'This is the error message',
			'error'
		);

		Yoast_Input_Validation::add_dirty_value_to_settings_errors( 'name_of_input_field_with_error', 'Invalid submitted value' );

		foreach ( $wp_settings_errors as $error ) {
			if ( $error['code'] === 'name_of_input_field_with_error' && isset( $error['yoast_dirty_value'] ) ) {
				$added_dirty_value = $error['yoast_dirty_value'];
			}
		}

		$this->assertEquals( 'Invalid submitted value', $added_dirty_value );

		unset( $GLOBALS['wp_settings_errors'] );
	}

	/**
	 * Tests a submitted invalid value is retrieved from the WordPress `$wp_settings_errors` global.
	 *
	 * @covers Yoast_Input_Validation::test_get_dirty_value
	 */
	public function test_get_dirty_value() {
		global $wp_settings_errors;
		$added_dirty_value = '';

		add_settings_error(
			'name_of_input_field_with_error',
			'name_of_input_field_with_error',
			'This is the error message',
			'error'
		);

		Yoast_Input_Validation::add_dirty_value_to_settings_errors( 'name_of_input_field_with_error', 'Invalid submitted value' );

		$added_dirty_value = Yoast_Input_Validation::get_dirty_value( 'name_of_input_field_with_error' );

		$this->assertEquals( 'Invalid submitted value', $added_dirty_value );

		unset( $GLOBALS['wp_settings_errors'] );
	}
}
