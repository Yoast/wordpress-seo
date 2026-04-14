<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Generator\Domain\Endpoint\Endpoint_List;

use Yoast\WP\SEO\AI\Generator\Infrastructure\Endpoints\Get_Suggestions_Endpoint;

/**
 * Tests the Endpoint_List's to_paths_array method.
 *
 * @group ai-generator
 *
 * @covers \Yoast\WP\SEO\Routes\Endpoint\Endpoint_List::to_paths_array
 */
final class To_Paths_Array_Test extends Abstract_Endpoint_List_Test {

	/**
	 * Tests the to_paths_array method.
	 *
	 * @return void
	 */
	public function test_to_paths_array() {
		$this->instance->add_endpoint( new Get_Suggestions_Endpoint() );

		$result = $this->instance->to_paths_array();

		$this->assertArrayHasKey( 'getSuggestions', $result );
		$this->assertSame( 'yoast/v1/ai_generator/get_suggestions', $result['getSuggestions'] );
	}
}
