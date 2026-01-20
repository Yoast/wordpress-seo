<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\Application\File\Commands\Populate_File;

use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Llms_Txt\Application\Markdown_Builders\Markdown_Builder;
use Yoast\WP\SEO\Llms_Txt\Infrastructure\File\WordPress_File_System_Adapter;
use Yoast\WP\SEO\Llms_Txt\Infrastructure\File\WordPress_Llms_Txt_Permission_Gate;

/**
 * Tests the contstructor.
 *
 * @group llms.txt
 *
 * @covers Yoast\WP\SEO\Llms_Txt\Application\File\Commands\Populate_File_Command_Handler::__construct
 *
 * @phpcs :disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Constructor_Test extends Abstract_Populate_File_Command_Handler_Test {

	/**
	 * Tests the constructor.
	 *
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
}
