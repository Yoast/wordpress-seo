<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Content_Planner\User_Interface\Get_Outline_Route;

use Brain\Monkey\Functions;
use Mockery;
use RuntimeException;
use WP_REST_Request;
use WP_REST_Response;
use WP_User;
use Yoast\WP\SEO\AI\Content_Planner\Application\Content_Outline_Command;
use Yoast\WP\SEO\AI\Content_Planner\Domain\Section;
use Yoast\WP\SEO\AI\Content_Planner\Domain\Section_List;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Internal_Server_Error_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Payment_Required_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Too_Many_Requests_Exception;

/**
 * Tests the Get_Outline_Route get_outline method.
 *
 * @group ai-content-planner
 *
 * @covers \Yoast\WP\SEO\AI\Content_Planner\User_Interface\Get_Outline_Route::get_outline
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Get_Outline_Test extends Abstract_Get_Outline_Route_Test {

	/**
	 * Builds a request mock that returns a complete set of params.
	 *
	 * @return Mockery\MockInterface|WP_REST_Request The request mock.
	 */
	private function build_request_mock() {
		$request = Mockery::mock( WP_REST_Request::class );
		$request->expects( 'get_param' )->with( 'category' )->andReturn(
			[
				'name' => 'Tech',
				'id'   => 5,
			],
		);
		$request->expects( 'get_param' )->with( 'post_type' )->andReturn( 'post' );
		$request->expects( 'get_param' )->with( 'language' )->andReturn( 'en_US' );
		$request->expects( 'get_param' )->with( 'editor' )->andReturn( 'gutenberg' );
		$request->expects( 'get_param' )->with( 'title' )->andReturn( 'How to use AI' );
		$request->expects( 'get_param' )->with( 'intent' )->andReturn( 'informational' );
		$request->expects( 'get_param' )->with( 'explanation' )->andReturn( 'Explanation' );
		$request->expects( 'get_param' )->with( 'keyphrase' )->andReturn( 'AI usage' );
		$request->expects( 'get_param' )->with( 'meta_description' )->andReturn( 'Meta description' );

		return $request;
	}

	/**
	 * Stubs wp_get_current_user to return a WP_User mock.
	 *
	 * @return WP_User The user mock.
	 */
	private function stub_current_user(): WP_User {
		$user     = Mockery::mock( WP_User::class );
		$user->ID = 1;
		Functions\when( 'wp_get_current_user' )->justReturn( $user );

		return $user;
	}

	/**
	 * Tests get_outline returns the section list array on the happy path.
	 *
	 * @return void
	 */
	public function test_get_outline_happy_path() {
		$this->stub_current_user();
		$request = $this->build_request_mock();

		$section_list = new Section_List();
		$section_list->add( new Section( [ 'note 1' ], 'Section A' ) );

		$this->command_handler
			->expects( 'handle' )
			->once()
			->with( Mockery::type( Content_Outline_Command::class ) )
			->andReturn( $section_list );

		$wp_rest_response = Mockery::mock( 'overload:' . WP_REST_Response::class );
		$wp_rest_response
			->expects( '__construct' )
			->once()
			->with( $section_list->to_array() );

		$result = $this->instance->get_outline( $request );

		$this->assertInstanceOf( WP_REST_Response::class, $result );
	}

	/**
	 * Tests get_outline returns an error response when the handler throws a Remote_Request_Exception.
	 *
	 * @return void
	 */
	public function test_get_outline_handles_remote_request_exception() {
		$this->stub_current_user();
		$request = $this->build_request_mock();

		$exception = Mockery::mock( Internal_Server_Error_Exception::class );
		$exception->expects( 'get_error_identifier' )->once()->andReturn( 'SOMETHING_BAD' );

		$this->command_handler->expects( 'handle' )->once()->andThrow( $exception );

		$wp_rest_response = Mockery::mock( 'overload:' . WP_REST_Response::class );
		$wp_rest_response
			->expects( '__construct' )
			->once()
			->with(
				[
					'message'         => '',
					'errorIdentifier' => 'SOMETHING_BAD',
				],
				0,
			);

		$result = $this->instance->get_outline( $request );

		$this->assertInstanceOf( WP_REST_Response::class, $result );
	}

	/**
	 * Tests get_outline includes missingLicenses when the handler throws a Payment_Required_Exception.
	 *
	 * @return void
	 */
	public function test_get_outline_handles_payment_required_exception() {
		$this->stub_current_user();
		$request = $this->build_request_mock();

		$exception = Mockery::mock( Payment_Required_Exception::class );
		$exception->expects( 'get_error_identifier' )->once()->andReturn( 'PAYMENT_REQUIRED' );
		$exception->expects( 'get_missing_licenses' )->once()->andReturn( [ 'free' ] );

		$this->command_handler->expects( 'handle' )->once()->andThrow( $exception );

		$wp_rest_response = Mockery::mock( 'overload:' . WP_REST_Response::class );
		$wp_rest_response
			->expects( '__construct' )
			->once()
			->with(
				[
					'message'         => '',
					'errorIdentifier' => 'PAYMENT_REQUIRED',
					'missingLicenses' => [ 'free' ],
				],
				0,
			);

		$result = $this->instance->get_outline( $request );

		$this->assertInstanceOf( WP_REST_Response::class, $result );
	}

	/**
	 * Tests get_outline includes missingLicenses when the handler throws a Too_Many_Requests_Exception.
	 *
	 * @return void
	 */
	public function test_get_outline_handles_too_many_requests_exception() {
		$this->stub_current_user();
		$request = $this->build_request_mock();

		$exception = Mockery::mock( Too_Many_Requests_Exception::class );
		$exception->expects( 'get_error_identifier' )->once()->andReturn( 'TOO_MANY_REQUESTS' );
		$exception->expects( 'get_missing_licenses' )->once()->andReturn( [ 'premium' ] );

		$this->command_handler->expects( 'handle' )->once()->andThrow( $exception );

		$wp_rest_response = Mockery::mock( 'overload:' . WP_REST_Response::class );
		$wp_rest_response
			->expects( '__construct' )
			->once()
			->with(
				[
					'message'         => '',
					'errorIdentifier' => 'TOO_MANY_REQUESTS',
					'missingLicenses' => [ 'premium' ],
				],
				0,
			);

		$result = $this->instance->get_outline( $request );

		$this->assertInstanceOf( WP_REST_Response::class, $result );
	}

	/**
	 * Tests get_outline returns a generic 500 response when the handler throws a plain RuntimeException.
	 *
	 * @return void
	 */
	public function test_get_outline_handles_runtime_exception() {
		$this->stub_current_user();
		$request = $this->build_request_mock();

		$exception = Mockery::mock( RuntimeException::class );
		$this->command_handler->expects( 'handle' )->once()->andThrow( $exception );

		$wp_rest_response = Mockery::mock( 'overload:' . WP_REST_Response::class );
		$wp_rest_response
			->expects( '__construct' )
			->once()
			->with( 'Failed to get content outline.', 500 );

		$result = $this->instance->get_outline( $request );

		$this->assertInstanceOf( WP_REST_Response::class, $result );
	}
}
