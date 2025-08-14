<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Consent\Infrastructure\Endpoints\Consent_Endpoint;

/**
 * Tests the Consent_Endpoint get_route method.
 *
 * @group ai-consent
 *
 * @covers \Yoast\WP\SEO\AI\Consent\Infrastructure\Endpoints\Consent_Endpoint::get_route
 */
final class Get_Route_Test extends Abstract_Consent_Endpoint_Test {

	/**
	 * Tests the get_route method.
	 *
	 * @return void
	 */
	public function test_get_route() {
		$this->assertSame( '/ai_generator/consent', $this->instance->get_route() );
	}
}
