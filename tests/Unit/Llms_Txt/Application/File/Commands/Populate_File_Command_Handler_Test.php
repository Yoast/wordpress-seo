<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\Application\File\Commands;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Llms_Txt\Application\File\Commands\Populate_File_Command_Handler;
use Yoast\WP\SEO\Llms_Txt\Application\Markdown_Builders\Markdown_Builder;
use Yoast\WP\SEO\Llms_Txt\Infrastructure\File\WordPress_File_System_Adapter;
use Yoast\WP\SEO\Llms_Txt\Infrastructure\File\WordPress_Llms_Txt_Permission_Gate;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the populate file command handler.
 *
 * @group llms.txt
 *
 * @coversDefaultClass \Yoast\WP\SEO\Llms_Txt\Application\File\Commands\Populate_File_Command_Handler
 *
 * @phpcs :disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Populate_File_Command_Handler_Test extends TestCase {

	/**
	 * The options helper mock.
	 *
	 * @var Options_Helper|Mockery\MockInterface
	 */
	private $options_helper;

	/**
	 * The file system adapter mock.
	 *
	 * @var WordPress_File_System_Adapter|Mockery\MockInterface
	 */
	private $file_system_adapter;

	/**
	 * The markdown builder mock.
	 *
	 * @var Markdown_Builder|Mockery\MockInterface
	 */
	private $markdown_builder;

	/**
	 * The permission gate mock.
	 *
	 * @var WordPress_Llms_Txt_Permission_Gate|Mockery\MockInterface
	 */
	private $permission_gate;

	/**
	 * The instance under test.
	 *
	 * @var Populate_File_Command_Handler
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->options_helper      = Mockery::mock( Options_Helper::class );
		$this->file_system_adapter = Mockery::mock( WordPress_File_System_Adapter::class );
		$this->markdown_builder    = Mockery::mock( Markdown_Builder::class );
		$this->permission_gate     = Mockery::mock( WordPress_Llms_Txt_Permission_Gate::class );

		$this->instance = new Populate_File_Command_Handler(
			$this->options_helper,
			$this->file_system_adapter,
			$this->markdown_builder,
			$this->permission_gate
		);
	}

	/**
	 * Tests the constructor.
	 *
	 * @covers ::__construct
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Options_Helper::class,
			$this->getPropertyValue( $this->instance, 'options_helper' )
		);
		$this->assertInstanceOf(
			WordPress_File_System_Adapter::class,
			$this->getPropertyValue( $this->instance, 'file_system_adapter' )
		);
		$this->assertInstanceOf(
			Markdown_Builder::class,
			$this->getPropertyValue( $this->instance, 'markdown_builder' )
		);
		$this->assertInstanceOf(
			WordPress_Llms_Txt_Permission_Gate::class,
			$this->getPropertyValue( $this->instance, 'permission_gate' )
		);
	}

	/**
	 * Tests the handle execution by mocking expected behaviors and verifying interactions.
	 *
	 * @param bool   $managed_by_yoast                   If Yoast SEO manages the file.
	 * @param bool   $file_written_successfully          If the file content was set successfully.
	 * @param int    $file_written_successfully_times    The number of times the file written function is called.
	 * @param string $new_content                        The new content to be written to the file.
	 * @param int    $update_hash_times                  The number of times the has is expected to be updated.
	 * @param int    $delete_failure_times               The number of times the failure reason is supposed to be deleted.
	 * @param int    $permission_failure_times           The number of times the permission failure reason is supposed to be set.
	 * @param int    $not_managed_by_yoast_failure_times The number of times the not managed by Yoast failure reason is supposed to be set.
	 *
	 * @return void
	 * @covers ::handle
	 * @dataProvider handle_data
	 */
	public function test_handle(
		bool $managed_by_yoast,
		bool $file_written_successfully,
		int $file_written_successfully_times,
		string $new_content,
		int $update_hash_times,
		int $delete_failure_times,
		int $permission_failure_times,
		int $not_managed_by_yoast_failure_times
	) {
		$this->permission_gate->expects( 'is_managed_by_yoast_seo' )->andReturn( $managed_by_yoast );
		$this->markdown_builder->expects( 'render' )->times( $file_written_successfully_times )->andReturn( $new_content );
		$this->file_system_adapter->expects( 'set_file_content' )->times( $file_written_successfully_times )->andReturn( $file_written_successfully );

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
			1,
			1,
			0,
			0,
		];
	}
}
