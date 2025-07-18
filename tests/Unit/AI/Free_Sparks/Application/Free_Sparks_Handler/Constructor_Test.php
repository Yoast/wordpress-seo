<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Free_Sparks\Application\Free_Sparks_Handler;

use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * Tests the Free_Sparks_Handler constructor.
 *
 * @group ai-free-sparks
 *
 * @covers \Yoast\WP\SEO\AI\Free_Sparks\Application\Free_Sparks_Handler::__construct
 */
final class Constructor_Test extends Abstract_Free_Sparks_Handler_Test {

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
	}
}
