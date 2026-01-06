<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Tasks\Complete_FTC;

use Yoast\WP\SEO\Helpers\First_Time_Configuration_Notice_Helper;

/**
 * Test class for the constructor.
 *
 * @group Complete_FTC
 *
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Complete_FTC::__construct
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Complete_FTC_Constructor_Test extends Abstract_Complete_FTC_Test {

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			First_Time_Configuration_Notice_Helper::class,
			$this->getPropertyValue( $this->instance, 'ftc_notice_helper' )
		);
	}
}
