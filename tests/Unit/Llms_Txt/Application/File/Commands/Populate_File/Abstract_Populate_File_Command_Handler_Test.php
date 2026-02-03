<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\Application\File\Commands\Populate_File;

use Mockery;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Llms_Txt\Application\File\Commands\Populate_File_Command_Handler;
use Yoast\WP\SEO\Llms_Txt\Application\Markdown_Builders\Markdown_Builder;
use Yoast\WP\SEO\Llms_Txt\Infrastructure\File\WordPress_File_System_Adapter;
use Yoast\WP\SEO\Llms_Txt\Infrastructure\File\WordPress_Llms_Txt_Permission_Gate;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for the Populate_File_Command_Handler tests.
 *
 * @group llms.txt
 */
abstract class Abstract_Populate_File_Command_Handler_Test extends TestCase {

	/**
	 * The options helper mock.
	 *
	 * @var Options_Helper|Mockery\MockInterface
	 */
	protected $options_helper;

	/**
	 * The file system adapter mock.
	 *
	 * @var WordPress_File_System_Adapter|Mockery\MockInterface
	 */
	protected $file_system_adapter;

	/**
	 * The markdown builder mock.
	 *
	 * @var Markdown_Builder|Mockery\MockInterface
	 */
	protected $markdown_builder;

	/**
	 * The permission gate mock.
	 *
	 * @var WordPress_Llms_Txt_Permission_Gate|Mockery\MockInterface
	 */
	protected $permission_gate;

	/**
	 * The instance under test.
	 *
	 * @var Populate_File_Command_Handler
	 */
	protected $instance;

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
}
