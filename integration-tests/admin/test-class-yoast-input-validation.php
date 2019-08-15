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
	 * @covers Yoast_Input_Validation::add_yoast_admin_document_title_errors
	 */
	public function test_document_title_updated_with_error() {
		$admin_title = 'Original title';

		add_settings_error(
			'yoast-setting-group-name',
			'code',
			'This is the error message',
			'error'
		);

		$title_with_error_message = Yoast_Input_Validation::add_yoast_admin_document_title_errors( $admin_title );

		$this->assertEquals( 'The form contains 1 error. Original title', $title_with_error_message );

		unset( $GLOBALS['wp_settings_errors'] );
	}

	/**
	 * Tests the document title is updated when there's more than one error.
	 *
	 * @covers Yoast_Input_Validation::add_yoast_admin_document_title_errors
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

		$title_with_error_message = Yoast_Input_Validation::add_yoast_admin_document_title_errors( $admin_title );

		$this->assertEquals( 'The form contains 2 errors. Original title', $title_with_error_message );

		unset( $GLOBALS['wp_settings_errors'] );
	}

	/**
	 * Tests the document title is not updated when the error is not a Yoast SEO error.
	 *
	 * @covers Yoast_Input_Validation::add_yoast_admin_document_title_errors
	 */
	public function test_document_title_not_updated_with_non_yoast_errors() {
		$admin_title = 'Original title';

		add_settings_error(
			'new_admin_email',
			'invalid_new_admin_email',
			'This is the error message',
			'error'
		);

		$title_with_error_message = Yoast_Input_Validation::add_yoast_admin_document_title_errors( $admin_title );

		$this->assertEquals( 'Original title', $title_with_error_message );

		unset( $GLOBALS['wp_settings_errors'] );
	}
}
