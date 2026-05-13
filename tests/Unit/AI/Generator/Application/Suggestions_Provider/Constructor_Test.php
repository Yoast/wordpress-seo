<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Generator\Application\Suggestions_Provider;

use Yoast\WP\SEO\AI\Authentication\Application\Auth_Strategy_Factory;
use Yoast\WP\SEO\AI\Consent\Application\Consent_Handler;

/**
 * Tests the Suggestions_Provider constructor.
 *
 * @group ai-generator
 *
 * @covers \Yoast\WP\SEO\AI\Generator\Application\Suggestions_Provider::__construct
 */
final class Constructor_Test extends Abstract_Suggestions_Provider_Test {

	/**
	 * Tests the constructor.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Consent_Handler::class,
			$this->getPropertyValue( $this->instance, 'consent_handler' ),
		);

		$this->assertInstanceOf(
			Auth_Strategy_Factory::class,
			$this->getPropertyValue( $this->instance, 'auth_strategy_factory' ),
		);
	}
}
