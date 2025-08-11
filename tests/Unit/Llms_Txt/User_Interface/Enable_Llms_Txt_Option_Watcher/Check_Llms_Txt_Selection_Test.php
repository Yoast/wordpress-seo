<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\User_Interface\Enable_Llms_Txt_Option_Watcher;

use Generator;

/**
 * Tests the check_llms_txt_selection.
 *
 * @group llms.txt
 *
 * @covers Yoast\WP\SEO\Llms_Txt\User_Interface\Enable_Llms_Txt_Option_Watcher::check_llms_txt_selection
 */
final class Check_Llms_Txt_Selection_Test extends Abstract_Enable_Llms_Txt_Option_Watcher_Test {

	/**
	 * Tests that nothing happens when LLMS.txt is disabled.
	 *
	 * @return void
	 */
	public function test_check_llms_txt_selection_when_disabled() {
		$this->options_helper->expects( 'get' )
			->with( 'enable_llms_txt', false )
			->andReturn( false );

		$this->populate_file_command_handler->expects( 'handle' )->never();

		$old_value = [ 'about_us_page' => '1' ];
		$new_value = [ 'about_us_page' => '2' ];

		$this->instance->check_llms_txt_selection( $old_value, $new_value );
	}

	/**
	 * Tests that populate_file_command_handler is called when an option changes.
	 *
	 * @dataProvider option_changes_data_provider
	 *
	 * @param array<string,int> $old_value The old value.
	 * @param array<string,int> $new_value The new value.
	 *
	 * @return void
	 */
	public function test_check_llms_txt_selection_with_option_changes( $old_value, $new_value ) {
		$this->options_helper->expects( 'get' )
			->with( 'enable_llms_txt', false )
			->andReturn( true );

		$this->populate_file_command_handler->expects( 'handle' )->once();

		$this->instance->check_llms_txt_selection( $old_value, $new_value );
	}

	/**
	 * Tests that nothing happens when no relevant options change.
	 *
	 * @return void
	 */
	public function test_check_llms_txt_selection_with_no_changes() {
		$this->options_helper->expects( 'get' )
			->with( 'enable_llms_txt', false )
			->andReturn( true );

		$this->populate_file_command_handler->expects( 'handle' )->never();

		$old_value = [
			'about_us_page'        => '1',
			'contact_page'         => '2',
			'other_included_pages' => [ 1, 2, 3 ],
		];

		$new_value = [
			'about_us_page'           => '1',
			'contact_page'            => '2',
			'other_included_pages'    => [ 1, 2, 3 ],
		];

		$this->instance->check_llms_txt_selection( $old_value, $new_value );
	}

	/**
	 * Tests that nothing happens when options are missing.
	 *
	 * @return void
	 */
	public function test_check_llms_txt_selection_with_missing_options() {
		$this->options_helper->expects( 'get' )
			->with( 'enable_llms_txt', false )
			->andReturn( true );

		$this->populate_file_command_handler->expects( 'handle' )->never();

		$old_value = [];
		$new_value = [ 'unrelated_option' => 'value' ];

		$this->instance->check_llms_txt_selection( $old_value, $new_value );
	}

	/**
	 * Data provider for option changes tests.
	 *
	 * @return Generator
	 */
	public function option_changes_data_provider() {
		yield 'about us page change' => [
			'old_value' => [ 'about_us_page' => '1' ],
			'new_value' => [ 'about_us_page' => '2' ],
		];

		yield 'contact page change' => [
			'old_value' => [ 'contact_page' => '1' ],
			'new_value' => [ 'contact_page' => '2' ],
		];

		yield 'terms page change' => [
			'old_value' => [ 'terms_page' => '1' ],
			'new_value' => [ 'terms_page' => '2' ],
		];

		yield 'privacy policy page change' => [
			'old_value' => [ 'privacy_policy_page' => '1' ],
			'new_value' => [ 'privacy_policy_page' => '2' ],
		];

		yield 'shop page change' => [
			'old_value' => [ 'shop_page' => '1' ],
			'new_value' => [ 'shop_page' => '2' ],
		];

		yield 'other included pages count change' => [
			'old_value' => [ 'other_included_pages' => [ 1, 2 ] ],
			'new_value' => [ 'other_included_pages' => [ 1, 2, 3 ] ],
		];

		yield 'other included pages value change' => [
			'old_value' => [ 'other_included_pages' => [ 1, 2, 3 ] ],
			'new_value' => [ 'other_included_pages' => [ 1, 2, 4 ] ],
		];
	}
}
