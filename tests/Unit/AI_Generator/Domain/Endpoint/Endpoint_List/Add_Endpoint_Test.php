<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Generator\Domain\Endpoint\Endpoint_List;

use Yoast\WP\SEO\AI_Generator\Infrastructure\Endpoints\Get_Suggestions_Endpoint;

/**
 * Tests the Endpoint_List's add_endpoint method.
 *
 * @group ai-generator
 *
 * @covers \Yoast\WP\SEO\AI_Generator\Domain\Endpoint\Endpoint_List::add_suggestion
 */
final class Add_Endpoint_Test extends Abstract_Endpoint_List_Test {

	/**
	 * Tests the add_endpoint method.
	 *
	 * @return void
	 */
	public function test_add_endpoint() {
		$this->instance->add_endpoint( new Get_Suggestions_Endpoint() );

		$endpoints = $this->getPropertyValue( $this->instance, 'endpoints' );

		$this->assertArrayHasKey( 0, $endpoints );
		$this->assertInstanceOf( Get_Suggestions_Endpoint::class, $endpoints[0] );
		$this->assertSame( 'getSuggestions', $endpoints[0]->get_name() );
	}
}
