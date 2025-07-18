<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Consent\User_Interface\Consent_Route;

use Yoast\WP\SEO\AI_Consent\Application\Consent_Handler_Interface;

/**
 * Tests the Consent_Route's construct method.
 *
 * @group ai-consent
 *
 * @covers \Yoast\WP\SEO\AI_Consent\User_Interface\Consent_Route::__construct
 */
final class Constructor_Test extends Abstract_Consent_Route_Test {

	/**
	 * Tests the constructor.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Consent_Handler_Interface::class,
			$this->getPropertyValue( $this->instance, 'consent_handler' )
		);
	}
}
