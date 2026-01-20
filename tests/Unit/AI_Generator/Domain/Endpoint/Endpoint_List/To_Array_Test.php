<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Generator\Domain\Endpoint\Endpoint_List;

use Brain\Monkey\Functions;
use Yoast\WP\SEO\AI_Generator\Infrastructure\Endpoints\Get_Suggestions_Endpoint;

/**
 * Tests the Endpoint_List's to_array method.
 *
 * @group ai-generator
 *
 * @covers \Yoast\WP\SEO\AI_Generator\Domain\Endpoint\Endpoint_List::to_array
 */
final class To_Array_Test extends Abstract_Endpoint_List_Test {

	/**
	 * Tests the to_array method.
	 *
	 * @return void
	 */
	public function test_to_array() {
		$url = 'yoast/v1/ai_generator/get_suggestions';

		Functions\expect( 'rest_url' )
			->once()
			->with( $url )
			->andReturn( $url );

		$this->instance->add_endpoint( new Get_Suggestions_Endpoint() );

		$result = $this->instance->to_array();

		$this->assertArrayHasKey( 'getSuggestions', $result );
		$this->assertContains( $url, $result );
	}
}
