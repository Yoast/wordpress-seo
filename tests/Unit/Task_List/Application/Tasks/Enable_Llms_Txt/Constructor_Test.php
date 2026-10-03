<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Tasks\Enable_Llms_Txt;

use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * Test class for the constructor.
 *
 * @group Enable_Llms_Txt
 *
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Enable_Llms_Txt::__construct
 */
final class Constructor_Test extends Abstract_Test {

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Options_Helper::class,
			$this->getPropertyValue( $this->instance, 'options_helper' ),
		);
	}
}
