<?php

namespace Yoast\WP\SEO\Tests\Unit\Admin;

use Brain\Monkey;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast_Input_Validation;

/**
 * User input validation tests.
 *
 * @group input-validation
 */
final class Input_Validation_Test extends TestCase {

	/**
	 * Set up the class which will be tested.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->stubEscapeFunctions();
		$this->stubTranslationFunctions();

		Monkey\Functions\stubs( [ 'add_settings_error' => null ] );
	}

	/**
	 * Tests the document title is updated when there's an error.
	 *
	 * @covers Yoast_Input_Validation::add_yoast_admin_document_title_errors
	 * @covers Yoast_Input_Validation::is_yoast_option_group_name
	 *
	 * @return void
	 */
	public function test_document_title_updated_with_error() {
		$admin_title = 'Original title';

		Monkey\Functions\expect( 'get_settings_errors' )
			->once()
			->andReturn(
				[
					[
						'setting' => 'yoast-setting-group-name',
						'code'    => 'code',
						'message' => 'This is the error message',
						'type'    => 'error',
					],
				]
			);

		$title_with_error_message = Yoast_Input_Validation::add_yoast_admin_document_title_errors( $admin_title );

		$this->assertEquals( 'The form contains 1 error. Original title', $title_with_error_message );
	}

	/**
	 * Tests the document title is updated when there's more than one error.
	 *
	 * @covers Yoast_Input_Validation::add_yoast_admin_document_title_errors
	 * @covers Yoast_Input_Validation::is_yoast_option_group_name
	 *
	 * @return void
	 */
	public function test_document_title_updated_with_errors() {
		$admin_title = 'Original title';

		Monkey\Functions\expect( 'get_settings_errors' )
			->once()
			->andReturn(
				[
					[
						'setting' => 'yoast-setting-first-group-name',
						'code'    => 'first-code',
						'message' => 'This is the first error message',
						'type'    => 'error',
					],
					[
						'setting' => 'yoast-setting-second-group-name',
						'code'    => 'second-code',
						'message' => 'This is the second error message',
						'type'    => 'error',
					],
				]
			);

		$title_with_error_message = Yoast_Input_Validation::add_yoast_admin_document_title_errors( $admin_title );

		$this->assertEquals( 'The form contains 2 errors. Original title', $title_with_error_message );
	}

	/**
	 * Tests the document title is not updated when the error is not a Yoast SEO error.
	 *
	 * @covers Yoast_Input_Validation::add_yoast_admin_document_title_errors
	 * @covers Yoast_Input_Validation::is_yoast_option_group_name
	 *
	 * @return void
	 */
	public function test_document_title_not_updated_with_non_yoast_errors() {
		$admin_title = 'Original title';

		Monkey\Functions\expect( 'get_settings_errors' )
			->once()
			->andReturn(
				[
					[
						'setting' => 'new_admin_email',
						'code'    => 'invalid_new_admin_email',
						'message' => 'This is the error message',
						'type'    => 'error',
					],
				]
			);

		$title_with_error_message = Yoast_Input_Validation::add_yoast_admin_document_title_errors( $admin_title );

		$this->assertEquals( 'Original title', $title_with_error_message );
	}

	/**
	 * Tests the document title is not updated when the error has the code settings_updated.
	 *
	 * @covers Yoast_Input_Validation::add_yoast_admin_document_title_errors
	 * @covers Yoast_Input_Validation::is_yoast_option_group_name
	 *
	 * @return void
	 */
	public function test_document_title_not_updated_with_settings_updated_error() {
		$admin_title = 'Original title';

		Monkey\Functions\expect( 'get_settings_errors' )
			->once()
			->andReturn(
				[
					[
						'setting' => 'new_admin_email',
						'code'    => 'settings_updated',
						'message' => 'This is the error message',
						'type'    => 'error',
					],
				]
			);

		$title_with_error_message = Yoast_Input_Validation::add_yoast_admin_document_title_errors( $admin_title );

		$this->assertEquals( 'Original title', $title_with_error_message );
	}
}
