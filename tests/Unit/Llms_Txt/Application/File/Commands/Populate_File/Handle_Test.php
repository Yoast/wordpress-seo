<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\Application\File\Commands\Populate_File;

use Brain\Monkey;

/**
 * Tests the handler.
 *
 * @group llms.txt
 *
 * @covers Yoast\WP\SEO\Llms_Txt\Application\File\Commands\Populate_File_Command_Handler::handle
 * @covers Yoast\WP\SEO\Llms_Txt\Application\File\Commands\Populate_File_Command_Handler::encode_content
 *
 * @phpcs :disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Handle_Test extends Abstract_Populate_File_Command_Handler_Test {

	/**
	 * Tests the handle execution by mocking expected behaviors and verifying interactions.
	 *
	 * @param bool   $managed_by_yoast                   If Yoast SEO manages the file.
	 * @param bool   $file_written_successfully          If the file content was set successfully.
	 * @param int    $file_written_successfully_times    The number of times the file written function is called.
	 * @param string $new_content                        The new content to be written to the file.
	 * @param string $encoding_prefix                    The encoding prefix to be applied to the content.
	 * @param string $file_content                       The expected content of the file after encoding.
	 * @param int    $update_hash_times                  The number of times the has is expected to be updated.
	 * @param int    $delete_failure_times               The number of times the failure reason is supposed to be deleted.
	 * @param int    $permission_failure_times           The number of times the permission failure reason is supposed to be set.
	 * @param int    $not_managed_by_yoast_failure_times The number of times the not managed by Yoast failure reason is supposed to be set.
	 *
	 * @return void
	 * @dataProvider handle_data
	 */
	public function test_handle(
		bool $managed_by_yoast,
		bool $file_written_successfully,
		int $file_written_successfully_times,
		string $new_content,
		string $encoding_prefix,
		string $file_content,
		int $update_hash_times,
		int $delete_failure_times,
		int $permission_failure_times,
		int $not_managed_by_yoast_failure_times
	) {
		$this->permission_gate->expects( 'is_managed_by_yoast_seo' )->andReturn( $managed_by_yoast );
		$this->markdown_builder->expects( 'render' )->times( $file_written_successfully_times )->andReturn( $new_content );

		Monkey\Functions\expect( 'apply_filters' )
			->times( $file_written_successfully_times )
			->with( 'wpseo_llmstxt_encoding_prefix', "\xEF\xBB\xBF" )
			->andReturn( $encoding_prefix );

		$this->file_system_adapter->expects( 'set_file_content' )->times( $file_written_successfully_times )->with( $file_content )->andReturn( $file_written_successfully );

		Monkey\Functions\expect( 'update_option' )
			->with( 'wpseo_llms_txt_content_hash', \md5( $new_content ) )
			->times( $update_hash_times );

		Monkey\Functions\expect( 'delete_option' )
			->with( 'wpseo_llms_txt_file_failure' )
			->times( $delete_failure_times );

		Monkey\Functions\expect( 'update_option' )
			->with( 'wpseo_llms_txt_file_failure', 'filesystem_permissions' )
			->times( $permission_failure_times );

		Monkey\Functions\expect( 'update_option' )
			->with( 'wpseo_llms_txt_file_failure', 'not_managed_by_yoast_seo' )
			->times( $not_managed_by_yoast_failure_times );

		$this->instance->handle();
	}

	/**
	 * Dataprovider for the `test_handle` test.
	 *
	 * @return Generator
	 */
	public function handle_data() {
		yield 'file not managed by yoast' => [
			false,
			false,
			0,
			'irrelevant',
			'irrelevant',
			'irrelevant',
			0,
			0,
			0,
			1,
		];
		yield 'file managed by Yoast but not written' => [
			true,
			false,
			1,
			'irrelevant',
			"\xEF\xBB\xBF",
			"\xEF\xBB\xBF" . 'irrelevant',
			0,
			0,
			1,
			0,

		];
		yield 'file managed by Yoast and written' => [
			true,
			true,
			1,
			'new content',
			"\xEF\xBB\xBF",
			"\xEF\xBB\xBF" . 'new content',
			1,
			1,
			0,
			0,
		];
		yield 'file managed by Yoast and written and prefix filtered into empty string' => [
			true,
			true,
			1,
			'new content',
			'',
			'new content',
			1,
			1,
			0,
			0,
		];
	}
}
