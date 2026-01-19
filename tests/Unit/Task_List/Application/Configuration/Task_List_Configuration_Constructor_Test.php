<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Configuration;

use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Task_List\Application\Endpoints\Endpoints_Repository;

/**
 * Test class for the constructor.
 *
 * @group Task_List_Configuration
 *
 * @covers Yoast\WP\SEO\Task_List\Application\Configuration\Task_List_Configuration::__construct
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Task_List_Configuration_Constructor_Test extends Abstract_Task_List_Configuration_Test {

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Options_Helper::class,
			$this->getPropertyValue( $this->instance, 'options_helper' )
		);
		$this->assertInstanceOf(
			Endpoints_Repository::class,
			$this->getPropertyValue( $this->instance, 'endpoints_repository' )
		);
	}
}
