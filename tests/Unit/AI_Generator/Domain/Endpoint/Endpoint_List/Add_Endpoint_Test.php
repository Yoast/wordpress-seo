<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Generator\Domain\Endpoint\Endpoint_List;

use ReflectionProperty;
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
		$this->instance->add_endpoint( new Get_Suggestions_Endpoint );

		$endpoints = new ReflectionProperty( $this->instance, 'endpoints' );
		$endpoints->setAccessible( true );

		$this->assertArrayHasKey( 0, $endpoints->getValue( $this->instance ) );

		$endpoint = $endpoints->getValue( $this->instance )[0];

		$this->assertInstanceOf( Get_Suggestions_Endpoint::class, $endpoint );
		$this->assertSame( 'getSuggestions', $endpoint->get_name() );
	}
}
