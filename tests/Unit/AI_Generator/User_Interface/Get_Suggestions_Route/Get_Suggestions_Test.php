<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Generator\User_Interface\Get_Suggestions_Route;

use Brain\Monkey\Functions;
use Mockery;
use RuntimeException;
use WP_REST_Request;
use WP_REST_Response;
use WP_User;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Payment_Required_Exception;

/**
 * Tests the Get_Suggestions_Route's get_suggestions method.
 *
 * @group ai-generator
 *
 * @covers \Yoast\WP\SEO\AI_Generator\User_Interface\Get_Suggestions_Route::get_suggestions
 */
final class Get_Suggestions_Test extends Abstract_Get_Suggestions_Route_Test {

	/**
	 * Tests the get_suggestions method.
	 *
	 * @return void
	 */
	public function test_get_suggestions() {
		$user = Mockery::mock( WP_User::class );

		Functions\expect( 'wp_get_current_user' )
			->once()
			->withNoArgs()
			->andReturn( $user );

		$wp_rest_request = Mockery::mock( WP_REST_Request::class );
		$wp_rest_request
			->expects( 'get_param' )
			->times( 6 )
			->andReturn( 'test' );

		$wp_rest_response = Mockery::mock( 'overload:' . WP_REST_Response::class );

		$request = [
			'type'            => 'test',
			'prompt_content'  => 'test',
			'focus_keyphrase' => 'test',
			'language'        => 'test',
			'platform'        => 'test',
			'editor'          => 'test',
		];

		$this->suggestions_provider
			->expects( 'get_suggestions' )
			->once()
			->with(
				$user,
				$request['type'],
				$request['prompt_content'],
				$request['focus_keyphrase'],
				$request['language'],
				$request['platform'],
				$request['editor']
			);

		$wp_rest_response
			->expects( '__construct' )
			->once()
			->with( [] );

		$result = $this->instance->get_suggestions( $wp_rest_request );

		$this->assertInstanceOf( WP_REST_Response::class, $result );
	}

	/**
	 * Tests a missing license request.
	 *
	 * @return void
	 */
	public function test_get_suggestions_with_missing_license() {
		$user = Mockery::mock( WP_User::class );

		Functions\expect( 'wp_get_current_user' )
			->once()
			->withNoArgs()
			->andReturn( $user );

		$wp_rest_request = Mockery::mock( WP_REST_Request::class );
		$wp_rest_request
			->expects( 'get_param' )
			->times( 6 )
			->andReturn( 'test' );

		$wp_rest_response           = Mockery::mock( 'overload:' . WP_REST_Response::class );
		$payment_required_exception = Mockery::mock( Payment_Required_Exception::class );

		$request = [
			'type'            => 'test',
			'prompt_content'  => 'test',
			'focus_keyphrase' => 'test',
			'language'        => 'test',
			'platform'        => 'test',
			'editor'          => 'test',
		];

		$this->suggestions_provider
			->expects( 'get_suggestions' )
			->once()
			->with(
				$user,
				$request['type'],
				$request['prompt_content'],
				$request['focus_keyphrase'],
				$request['language'],
				$request['platform'],
				$request['editor']
			)
			->andThrow( $payment_required_exception );

		$payment_required_exception
			->expects( 'get_error_identifier' )
			->once()
			->withNoArgs()
			->andReturn( 'test' );

		$payment_required_exception
			->expects( 'get_missing_licenses' )
			->once()
			->withNoArgs()
			->andReturn( 'test' );

		$wp_rest_response
			->expects( '__construct' )
			->once()
			->with(
				[
					'message'         => '',
					'errorIdentifier' => 'test',
					'missingLicenses' => 'test',
				],
				0
			);

		$result = $this->instance->get_suggestions( $wp_rest_request );

		$this->assertInstanceOf( WP_REST_Response::class, $result );
	}

	/**
	 * Tests an unknown runtime exception.
	 *
	 * @return void
	 */
	public function test_get_suggestions_with_runtime_exception() {
		$user = Mockery::mock( WP_User::class );

		Functions\expect( 'wp_get_current_user' )
			->once()
			->withNoArgs()
			->andReturn( $user );

		$wp_rest_request = Mockery::mock( WP_REST_Request::class );
		$wp_rest_request
			->expects( 'get_param' )
			->times( 6 )
			->andReturn( 'test' );

		$wp_rest_response  = Mockery::mock( 'overload:' . WP_REST_Response::class );
		$runtime_exception = Mockery::mock( RuntimeException::class );

		$request = [
			'type'            => 'test',
			'prompt_content'  => 'test',
			'focus_keyphrase' => 'test',
			'language'        => 'test',
			'platform'        => 'test',
			'editor'          => 'test',
		];

		$this->suggestions_provider
			->expects( 'get_suggestions' )
			->once()
			->with(
				$user,
				$request['type'],
				$request['prompt_content'],
				$request['focus_keyphrase'],
				$request['language'],
				$request['platform'],
				$request['editor']
			)
			->andThrow( $runtime_exception );

		$wp_rest_response
			->expects( '__construct' )
			->once()
			->with( 'Failed to get suggestions.', 500 );

		$result = $this->instance->get_suggestions( $wp_rest_request );

		$this->assertInstanceOf( WP_REST_Response::class, $result );
	}
}
