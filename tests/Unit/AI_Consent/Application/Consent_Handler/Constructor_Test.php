<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Consent\Application\Consent_Handler;

use Yoast\WP\SEO\Helpers\User_Helper;

/**
 * Tests the Consent_Handler constructor.
 *
 * @group ai-consent
 *
 * @covers \Yoast\WP\SEO\AI_Consent\Application\Consent_Handler::__construct
 */
final class Constructor_Test extends Abstract_Consent_Handler_Test {

	/**
	 * Tests the constructor.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			User_Helper::class,
			$this->getPropertyValue( $this->instance, 'user_helper' )
		);
	}
}
