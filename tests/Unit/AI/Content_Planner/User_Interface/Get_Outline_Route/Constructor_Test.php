<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Content_Planner\User_Interface\Get_Outline_Route;

use Yoast\WP\SEO\AI\Content_Planner\Application\Content_Outline_Command_Handler;

/**
 * Tests the Get_Outline_Route constructor.
 *
 * @group ai-content-planner
 *
 * @covers \Yoast\WP\SEO\AI\Content_Planner\User_Interface\Get_Outline_Route::__construct
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Constructor_Test extends Abstract_Get_Outline_Route_Test {

	/**
	 * Tests if the constructor sets properties correctly.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Content_Outline_Command_Handler::class,
			$this->getPropertyValue( $this->instance, 'command_handler' ),
		);
	}
}
