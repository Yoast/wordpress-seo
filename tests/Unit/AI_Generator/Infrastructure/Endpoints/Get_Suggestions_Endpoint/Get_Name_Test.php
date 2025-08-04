<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Generator\Infrastructure\Endpoints\Get_Suggestions_Endpoint;

/**
 * Tests the Get_Suggestions_Endpoint constructor.
 *
 * @group ai-generator
 *
 * @covers \Yoast\WP\SEO\AI_Generator\Infrastructure\Endpoints\Get_Suggestions_Endpoint::get_name
 */
final class Get_Name_Test extends Abstract_Get_Suggestions_Endpoint_Test {

	/**
	 * Tests the get_name method.
	 *
	 * @return void
	 */
	public function test_get_name() {
		$this->assertSame( 'getSuggestions', $this->instance->get_name() );
	}
}
