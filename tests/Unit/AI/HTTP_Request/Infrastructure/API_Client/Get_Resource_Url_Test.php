<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\HTTP_Request\Infrastructure\API_Client;

use Brain\Monkey\Functions;

/**
 * Class Get_Resource_Url_Test
 *
 * @group ai-http-request
 *
 * @covers Yoast\WP\SEO\AI\HTTP_Request\Infrastructure\API_Client::get_resource_url
 */
final class Get_Resource_Url_Test extends Abstract_API_Client_Test {

	/**
	 * Tests that the resource URL is the origin of the base URL, without the path.
	 *
	 * @return void
	 */
	public function test_get_resource_url_strips_path() {
		Functions\expect( 'apply_filters' )
			->once()
			->with( 'Yoast\WP\SEO\ai_api_url', 'https://ai.yoa.st/api/v1' )
			->andReturn( 'https://ai.yoa.st/api/v1' );
		Functions\expect( 'wp_parse_url' )->once()->andReturnUsing( 'parse_url' );

		$this->assertSame( 'https://ai.yoa.st', $this->instance->get_resource_url() );
	}

	/**
	 * Tests that a filter override flows through, so the resource indicator tracks the request target.
	 *
	 * @return void
	 */
	public function test_get_resource_url_follows_filter_override() {
		Functions\expect( 'apply_filters' )
			->once()
			->with( 'Yoast\WP\SEO\ai_api_url', 'https://ai.yoa.st/api/v1' )
			->andReturn( 'https://ai-dev.yoa.st:8080/api/v1' );
		Functions\expect( 'wp_parse_url' )->once()->andReturnUsing( 'parse_url' );

		$this->assertSame( 'https://ai-dev.yoa.st:8080', $this->instance->get_resource_url() );
	}
}
