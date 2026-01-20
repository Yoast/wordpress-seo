<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Generator\Application\Suggestions_Provider;

use Mockery;
use Yoast\WP\SEO\AI_Generator\Domain\Suggestions_Bucket;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Response;

/**
 * Tests the Suggestions_Provider's build_suggestions_array method.
 *
 * @group ai-generator
 *
 * @covers \Yoast\WP\SEO\AI_Generator\Application\Suggestions_Provider::build_suggestions_array
 */
final class Build_Suggestions_Array_Test extends Abstract_Suggestions_Provider_Test {

	/**
	 * Tests the build_suggestions_array method.
	 *
	 * @return void
	 */
	public function test_build_suggestions_array() {
		$http_response = Mockery::mock( Response::class );
		$http_response
			->expects( 'get_body' )
			->once()
			->withNoArgs()
			->andReturn( '{"choices":[{"text":"test"}]}' );

		$suggestions = $this->instance->build_suggestions_array( $http_response );

		$this->assertInstanceOf( Suggestions_Bucket::class, $suggestions );

		$suggestions_array = $suggestions->to_array();

		$this->assertArrayHasKey( 0, $suggestions_array );
		$this->assertSame( 'test', $suggestions_array[0] );
	}

	/**
	 * Tests an empty API response.
	 *
	 * @return void
	 */
	public function test_build_suggestions_array_with_empty_api_response() {
		$http_response = Mockery::mock( Response::class );
		$http_response
			->expects( 'get_body' )
			->once()
			->withNoArgs()
			->andReturn( '' );

		$suggestions = $this->instance->build_suggestions_array( $http_response );

		$this->assertInstanceOf( Suggestions_Bucket::class, $suggestions );
	}
}
