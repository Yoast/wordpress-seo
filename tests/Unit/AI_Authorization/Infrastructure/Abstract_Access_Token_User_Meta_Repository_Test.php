<?php


namespace Yoast\WP\SEO\Premium\Tests\Unit\Helpers;

use Brain\Monkey;
use Exception;
use Generator;
use Mockery;
use RuntimeException;
use WP_Error;
use WP_User;
use Yoast\WP\SEO\AI_Authorization\Infrastructure\Access_Token_User_Meta_Repository;
use Yoast\WP\SEO\Helpers\Date_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Url_Helper;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\Premium\Exceptions\Remote_Request\Bad_Request_Exception;
use Yoast\WP\SEO\Premium\Exceptions\Remote_Request\Forbidden_Exception;
use Yoast\WP\SEO\Premium\Exceptions\Remote_Request\Internal_Server_Error_Exception;
use Yoast\WP\SEO\Premium\Exceptions\Remote_Request\Not_Found_Exception;
use Yoast\WP\SEO\Premium\Exceptions\Remote_Request\Payment_Required_Exception;
use Yoast\WP\SEO\Premium\Exceptions\Remote_Request\Request_Timeout_Exception;
use Yoast\WP\SEO\Premium\Exceptions\Remote_Request\Service_Unavailable_Exception;
use Yoast\WP\SEO\Premium\Exceptions\Remote_Request\Too_Many_Requests_Exception;
use Yoast\WP\SEO\Premium\Exceptions\Remote_Request\Unauthorized_Exception;
use Yoast\WP\SEO\Premium\Exceptions\Remote_Request\WP_Request_Exception;
use Yoast\WP\SEO\Premium\Helpers\AI_Generator_Helper;
use Yoast\WP\SEO\Premium\Tests\Unit\TestCase;

/**
 * Class Access_Token_User_Meta_Repository_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\AI_Authorization\Infrastructure\Access_Token_User_Meta_Repository
 */
final class Access_Token_User_Meta_Repository_Test extends TestCase {

	/**
	 * Represents the class to test.
	 *
	 * @var Access_Token_User_Meta_Repository
	 */
	protected $instance;

	/**
	 * The user helper.
	 *
	 * @var Mockery\MockInterface|User_Helper
	 */
	protected $user_helper;

	public function set_up() {
		parent::set_up();
		$this->user_helper    = Mockery::mock( User_Helper::class );
		$this->instance       = new Access_Token_User_Meta_Repository( $this->user_helper );
	}

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Options_Helper::class,
			$this->getPropertyValue( $this->instance, 'options_helper' )
		);
		$this->assertInstanceOf(
			User_Helper::class,
			$this->getPropertyValue( $this->instance, 'user_helper' )
		);
		$this->assertInstanceOf(
			Date_Helper::class,
			$this->getPropertyValue( $this->instance, 'date_helper' )
		);
	}

	/**
	 * Tests the `generate_code_verifier` method.
	 *
	 * @covers ::generate_code_verifier
	 * @return void
	 */
	public function test_generate_code_verifier() {
		$user             = Mockery::mock( WP_User::class );
		$user->user_email = 'example@yoast.com';
		$random_string    = 'veryrandom';

		Monkey\Functions\expect( 'str_shuffle' )
			->with( '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ' )
			->andReturn( $random_string );

		Monkey\Functions\expect( 'substr' )
			->with( $random_string )
			->andReturn( $random_string );

		self::assertEquals( \hash( 'sha256', $user->user_email . $random_string ), $this->instance->generate_code_verifier( $user ) );
	}

	/**
	 * Tests the `set_code_verifier` method.
	 *
	 * @covers ::set_code_verifier
	 * @return void
	 */
	public function test_set_code_verifier() {
		Monkey\Functions\when( 'get_current_blog_id' )->justReturn( 1 );

		$this->date_helper
			->allows( 'current_time' )
			->andReturn( 1707232258 );

		$this->user_helper
			->expects( 'update_meta' )
			->with(
				123,
				'yoast_wpseo_ai_generator_code_verifier_for_blog_1',
				[
					'code'       => 'code_verifier',
					'created_at' => 1707232258,
				]
			);

		$this->instance->set_code_verifier( 123, 'code_verifier' );
	}

	/**
	 * Tests the `delete_code_verifier` method.
	 *
	 * @covers ::delete_code_verifier
	 * @return void
	 */
	public function test_delete_code_verifier() {
		Monkey\Functions\when( 'get_current_blog_id' )->justReturn( 1 );

		$this->user_helper
			->expects( 'delete_meta' )
			->with(
				123,
				'yoast_wpseo_ai_generator_code_verifier_for_blog_1'
			);

		$this->instance->delete_code_verifier( 123 );
	}

	/**
	 * Tests the `get_code_verifier` method.
	 *
	 * @covers ::get_code_verifier
	 * @return void
	 */
	public function test_get_code_verifier() {
		Monkey\Functions\when( 'get_current_blog_id' )->justReturn( 1 );

		$this->date_helper
			->allows( 'current_time' )
			->andReturn( 1707232258 );

		$this->user_helper
			->expects( 'get_meta' )
			->once()
			->with( 123, 'yoast_wpseo_ai_generator_code_verifier_for_blog_1', true )
			->andReturn(
				[
					'code'       => 'code_verifier',
					'created_at' => 1707232258,
				]
			);

		self::assertEquals( 'code_verifier', $this->instance->get_code_verifier( 123 ) );
	}

	/**
	 * Tests the `get_code_verifier` method.
	 *
	 * @covers ::get_code_verifier
	 * @dataProvider provide_get_code_verifier_exception
	 *
	 * @param mixed $return_value The return value for the transient.
	 *
	 * @return void
	 */
	public function test_get_code_verifier_exception( $return_value ) {
		Monkey\Functions\when( 'get_current_blog_id' )->justReturn( 1 );

		$this->date_helper
			->allows( 'current_time' )
			->andReturn( 1707232258 );

		$this->user_helper
			->expects( 'get_meta' )
			->with(
				123,
				'yoast_wpseo_ai_generator_code_verifier_for_blog_1',
				true
			)
			->andReturn( $return_value );

		$this->expectException( RuntimeException::class );
		$this->instance->get_code_verifier( 123 );
	}

	/**
	 * Tests the `get_code_verifier` method.
	 *
	 * @covers ::get_code_verifier
	 * @dataProvider provide_get_code_verifier_expired
	 *
	 * @param mixed $return_value The return value for the transient.
	 *
	 * @return void
	 */
	public function test_get_code_verifier_expired( $return_value ) {
		Monkey\Functions\when( 'get_current_blog_id' )->justReturn( 1 );

		$this->date_helper
			->allows( 'current_time' )
			->andReturn( 1707232258 );

		$this->user_helper
			->expects( 'get_meta' )
			->with(
				123,
				'yoast_wpseo_ai_generator_code_verifier_for_blog_1',
				true
			)
			->andReturn( $return_value );

		$this->user_helper
			->expects( 'delete_meta' )
			->with( 123, 'yoast_wpseo_ai_generator_code_verifier_for_blog_1' );

		$this->expectException( RuntimeException::class );
		$this->instance->get_code_verifier( 123 );
	}

	/**
	 * Tests the `get_refresh_token` method.
	 *
	 * @covers ::get_refresh_token
	 * @dataProvider provide_get_code_verifier_exception
	 *
	 * @param mixed $return_value The return value for the transient.
	 *
	 * @return void
	 */
	public function test_get_refresh_token_exception( $return_value ) {
		$this->user_helper
			->expects( 'get_meta' )
			->with( 1, '_yoast_wpseo_ai_generator_refresh_jwt', true )
			->andReturn( $return_value );

		$this->expectException( RuntimeException::class );
		$this->instance->get_refresh_token( 1 );
	}

	/**
	 * Tests the `get_refresh_token` method.
	 *
	 * @covers ::get_refresh_token
	 *
	 * @return void
	 */
	public function test_get_refresh_token() {
		$this->user_helper
			->expects( 'get_meta' )
			->with( 1, '_yoast_wpseo_ai_generator_refresh_jwt', true )
			->andReturn( 'string' );

		self::assertEquals( 'string', $this->instance->get_refresh_token( 1 ) );
	}

	/**
	 * Tests the `is_ai_generator_enabled` method.
	 *
	 * @covers ::is_ai_generator_enabled
	 *
	 * @return void
	 */
	public function test_is_ai_generator_enabled() {
		$this->options_helper
			->expects( 'get' )
			->with( 'enable_ai_generator', false );

		$this->instance->is_ai_generator_enabled();
	}

	/**
	 * Tests the `get_access_token` method.
	 *
	 * @covers ::get_access_token
	 * @dataProvider provide_get_code_verifier_exception
	 *
	 * @param mixed $return_value The return value for the transient.
	 *
	 * @return void
	 */
	public function test_get_access_token_exception( $return_value ) {
		$this->user_helper
			->expects( 'get_meta' )
			->with( 1, '_yoast_wpseo_ai_generator_access_jwt', true )
			->andReturn( $return_value );

		$this->expectException( RuntimeException::class );
		$this->instance->get_access_token( 1 );
	}

	/**
	 * Tests the `get_access_token` method.
	 *
	 * @covers ::get_access_token
	 *
	 * @return void
	 */
	public function test_get_access_token() {
		$this->user_helper
			->expects( 'get_meta' )
			->with( 1, '_yoast_wpseo_ai_generator_access_jwt', true )
			->andReturn( 'string' );

		self::assertEquals( 'string', $this->instance->get_access_token( 1 ) );
	}

	/**
	 * The data provider for the `test_get_code_verifier_exception`.
	 *
	 * @return Generator
	 */
	public static function provide_get_code_verifier_exception() {

		yield 'number' => [
			'return_value' => 1234,
		];

		yield 'boolean true' => [
			'return_value' => true,
		];

		yield 'boolean false' => [
			'return_value' => false,
		];

		yield 'empty string' => [
			'return_value' => '',
		];

		yield 'Object' => [
			'return_value' => (object) [ 'someting' => 'else' ],
		];

		yield 'empty token' => [
			'return_value' => [
				'code'       => '',
				'created_at' => 1999999999,
			],
		];
	}

	/**
	 * The data provider for the `test_get_code_verifier_expired`.
	 *
	 * @return Generator
	 */
	public static function provide_get_code_verifier_expired() {
		yield 'expired token' => [
			'missing expiration' => [
				'code' => 'code_verifier',
			],
			'expired'            => [
				'code'       => 'code_verifier',
				'created_at' => 16099999999,
			],
		];
	}

	/**
	 * Tests the `get_license_url` method.
	 *
	 * @covers ::get_license_url
	 *
	 * @return void
	 */
	public function test_get_license_url() {
		$url = Mockery::mock( Url_Helper::class );
		$url->expects( 'network_safe_home_url' )->andReturn( 'url' );
		$helpers   = (object) [ 'url' => $url ];
		$yoast_seo = (object) [ 'helpers' => $helpers ];

		Monkey\Functions\expect( 'YoastSEO' )
			->andReturn( $yoast_seo );
		self::assertEquals( 'url', $this->instance->get_license_url() );
	}

	/**
	 * Tests the `get_callback_url` method.
	 *
	 * @covers ::get_callback_url
	 *
	 * @return void
	 */
	public function test_get_callback_url() {
		Monkey\Functions\expect( 'get_rest_url' )
			->andReturn( 'url' );
		self::assertEquals( 'url', $this->instance->get_callback_url() );
	}

	/**
	 * Tests the `get_refresh_callback_url` method.
	 *
	 * @covers ::get_refresh_callback_url
	 * @return void
	 */
	public function test_get_refresh_callback_url() {
		Monkey\Functions\expect( 'get_rest_url' )
			->andReturn( 'url' );
		self::assertEquals( 'url', $this->instance->get_refresh_callback_url() );
	}

	/**
	 * Tests the `build_suggestions_array` method.
	 *
	 * @covers ::build_suggestions_array
	 *
	 * @return void
	 */
	public function test_build_suggestions_array() {
		$suggestions = [
			'choices' => [
				[ 'text' => 'something' ],
				[ 'text' => 'something1' ],
				[ 'text' => 'something2' ],
			],
		];

		$response = (object) [ 'body' => \json_encode( $suggestions ) ];

		self::assertEquals(
			[
				'something',
				'something1',
				'something2',
			],
			$this->instance->build_suggestions_array( $response )
		);
	}

	/**
	 * Tests the `build_suggestions_array` method.
	 *
	 * @covers ::build_suggestions_array
	 *
	 * @return void
	 */
	public function test_build_suggestions_array_invalid_json() {
		$suggestions = [
			'nothing' => [
				[ 'text' => 'something' ],
				[ 'text' => 'something1' ],
				[ 'text' => 'something2' ],
			],
		];

		$response = (object) [ 'body' => \json_encode( $suggestions ) ];

		self::assertEquals(
			[],
			$this->instance->build_suggestions_array( $response )
		);
	}

	/**
	 * Tests the request method.
	 *
	 * @dataProvider provide_request
	 * @covers ::request
	 * @covers ::get_request_timeout
	 * @covers ::parse_response
	 *
	 * @param bool           $should_wp_error                  If the wp_error should be triggered.
	 * @param int|null       $wp_remote_retrieve_response_code The response code from the `api`.
	 * @param object|null    $response_body                    The response body.
	 * @param bool           $is_post                          If the request is a POST one.
	 * @param Exception|null $expected_exception               The expected exception.
	 *
	 * @return void
	 */
	public function test_request(
		$should_wp_error,
		$wp_remote_retrieve_response_code,
		$response_body,
		$is_post,
		$expected_exception
	) {
		Monkey\Filters\expectApplied( 'Yoast\WP\SEO\ai_suggestions_timeout' )
			->once()
			->with( 60 )
			->andReturn( 60 );

		Monkey\Functions\expect( 'site_url' )
			->andReturn( '' );
		if ( $should_wp_error ) {
			$response_body = Mockery::mock( 'overload:' . WP_Error::class );
			$response_body->expects( 'get_error_message' )->andReturn( 'message' );
			$response_body->expects( 'get_error_code' )->andReturn( 100 );
		}
		$request_arguments = [
			'timeout' => 60,
			'headers' => [ 'Content-Type' => 'application/json' ],
		];

		if ( $is_post ) {
			$request_arguments['body'] = \json_encode( (object) 'bla' );
		}

		Monkey\Functions\expect( 'wp_remote_post' )
			->times( ( $is_post ) ? 1 : 0 )
			->with( 'https://ai.yoa.st/api/v1/something', $request_arguments )
			->andReturn( $response_body );

		Monkey\Functions\expect( 'wp_remote_get' )
			->times( ( ! $is_post ) ? 1 : 0 )
			->with( 'https://ai.yoa.st/api/v1/something', $request_arguments )
			->andReturn( $response_body );

		Monkey\Functions\expect( 'is_wp_error' )
			->andReturn( $should_wp_error );

		Monkey\Functions\expect( 'esc_html' )
			->andReturn( 'html' );

		if ( $wp_remote_retrieve_response_code !== 200 ) {
			Monkey\Functions\expect( 'wp_remote_retrieve_body' )
				->andReturn( $response_body->body );

			$this->expectException( $expected_exception );
		}

		if ( $should_wp_error ) {
			$this->expectException( WP_Request_Exception::class );
		}
		else {

			Monkey\Functions\expect( 'wp_remote_retrieve_response_code' )
				->andReturn( $wp_remote_retrieve_response_code );
			Monkey\Functions\expect( 'wp_remote_retrieve_response_message' )
				->andReturn( $response_body->message );
		}

		$this->assertEquals( $response_body, $this->instance->request( '/something', (object) 'bla', [], $is_post ) );
	}

	/**
	 * Tests the request method.
	 *
	 * @dataProvider provide_request_custom_error
	 * @covers ::request
	 * @covers ::get_request_timeout
	 * @covers ::parse_response
	 * @covers ::map_message_to_code
	 *
	 * @param object $response_body             The response body.
	 * @param string $expected_error_identifier The expected error identifier.
	 * @param string $expected_message          The expected message.
	 *
	 * @return void
	 */
	public function test_request_custom_error( $response_body, $expected_error_identifier, $expected_message ) {
		Monkey\Filters\expectApplied( 'Yoast\WP\SEO\ai_suggestions_timeout' )
			->once()
			->with( 60 )
			->andReturn( 60 );

		Monkey\Functions\expect( 'wp_remote_post' )
			->andReturn( $response_body );

		Monkey\Functions\expect( 'is_wp_error' )
			->andReturn( false );

		Monkey\Functions\expect( 'esc_html' )
			->andReturn( 'html' );

		Monkey\Functions\expect( 'wp_remote_retrieve_response_code' )
			->andReturn( 5001 );
		Monkey\Functions\expect( 'wp_remote_retrieve_response_message' )
			->andReturn( 'not_interesting' );

		Monkey\Functions\expect( 'wp_remote_retrieve_body' )
			->andReturn( $response_body->body );

		try {
			$this->instance->request( '/something', (object) 'bla' );
		} catch ( Bad_Request_Exception $exception ) {
			$message          = $exception->getMessage();
			$error_identifier = $exception->get_error_identifier();
		}

		$this->assertEquals( $expected_error_identifier, $error_identifier );
		$this->assertEquals( $expected_message, $message );
	}

	/**
	 * The data provider for the `test_request_custom_error`.
	 *
	 * @return Generator
	 */
	public static function provide_request_custom_error() {

		yield 'NOT_ENOUGH_CONTENT error message' => [
			'response_body'             => (object) [
				'code'    => 201,
				'body'    => \json_encode( [ 'message' => 'must NOT have fewer than 1 characters' ] ),
				'message' => '',
			],
			'expected_error_identifier' => 'NOT_ENOUGH_CONTENT',
			'expected_message'          => 'must NOT have fewer than 1 characters',
		];

		yield 'CLIENT_TIMEOUT error message' => [
			'response_body'             => (object) [
				'code'    => 200,
				'body'    => \json_encode( [ 'message' => 'something about Client timeout' ] ),
				'message' => '',
			],
			'expected_error_identifier' => 'CLIENT_TIMEOUT',
			'expected_message'          => 'something about Client timeout',
		];

		yield 'SERVER_TIMEOUT error message' => [
			'response_body'             => (object) [
				'code'    => 401,
				'body'    => \json_encode( [ 'message' => 'something something Server timeout' ] ),
				'message' => '',
			],
			'expected_error_identifier' => 'SERVER_TIMEOUT',
			'expected_message'          => 'something something Server timeout',
		];

		yield 'generic error message' => [
			'response_body'             => (object) [
				'code'    => 401,
				'body'    => \json_encode( [ 'message' => 'A generic message' ] ),
				'message' => '',
			],
			'expected_error_identifier' => 'UNKNOWN',
			'expected_message'          => 'A generic message',
		];
	}

	/**
	 * The data provider for the `test_request`.
	 *
	 * @return Generator
	 */
	public static function provide_request() {

		yield 'wp_error in request' => [
			'should_wp_error'                  => true,
			'wp_remote_retrieve_response_code' => 200,
			'response_body'                    => null,
			'is_post'                          => true,
			'expected_exception'               => null,
		];

		yield '200 request code' => [
			'should_wp_error'                  => false,
			'wp_remote_retrieve_response_code' => 200,
			'response_body'                    => (object) [
				'code'    => 200,
				'message' => 'message',
			],
			'is_post'                          => true,
			'expected_exception'               => null,
		];

		yield '401 request code' => [
			'should_wp_error'                  => false,
			'wp_remote_retrieve_response_code' => 401,
			'response_body'                    => (object) [
				'code'    => 401,
				'body'    => \json_encode( [ 'error_code' => 401 ] ),
				'message' => 'message',
			],
			'is_post'                          => true,
			'expected_exception'               => Unauthorized_Exception::class,
		];

		yield '402 request code' => [
			'should_wp_error'                  => false,
			'wp_remote_retrieve_response_code' => 402,
			'response_body'                    => (object) [
				'code'             => 402,
				'body'             => \json_encode( [ 'error_code' => 402 ] ),
				'message'          => 'message',
				'missing_licenses' => [ 'Yoast SEO Premium' ],
			],
			'is_post'                          => true,
			'expected_exception'               => Payment_Required_Exception::class,
		];

		yield '403 request code' => [
			'should_wp_error'                  => false,
			'wp_remote_retrieve_response_code' => 403,
			'response_body'                    => (object) [
				'code'    => 403,
				'body'    => \json_encode( [ 'error_code' => 403 ] ),
				'message' => 'message',
			],
			'is_post'                          => true,
			'expected_exception'               => Forbidden_Exception::class,
		];

		yield '404 request code' => [
			'should_wp_error'                  => false,
			'wp_remote_retrieve_response_code' => 404,
			'response_body'                    => (object) [
				'code'    => 404,
				'body'    => \json_encode( [ 'error_code' => 404 ] ),
				'message' => 'message',
			],
			'is_post'                          => true,
			'expected_exception'               => Not_Found_Exception::class,
		];

		yield '408 request code' => [
			'should_wp_error'                  => false,
			'wp_remote_retrieve_response_code' => 408,
			'response_body'                    => (object) [
				'code'    => 408,
				'body'    => \json_encode( [ 'error_code' => 408 ] ),
				'message' => 'message',
			],
			'is_post'                          => true,
			'expected_exception'               => Request_Timeout_Exception::class,
		];

		yield '429 request code' => [
			'should_wp_error'                  => false,
			'wp_remote_retrieve_response_code' => 429,
			'response_body'                    => (object) [
				'code'    => 429,
				'body'    => \json_encode( [ 'error_code' => 429 ] ),
				'message' => 'message',
			],
			'is_post'                          => true,
			'expected_exception'               => Too_Many_Requests_Exception::class,
		];

		yield '500 request code' => [
			'should_wp_error'                  => false,
			'wp_remote_retrieve_response_code' => 500,
			'response_body'                    => (object) [
				'code'    => 500,
				'body'    => \json_encode( [ 'error_code' => 500 ] ),
				'message' => 'message',
			],
			'is_post'                          => true,
			'expected_exception'               => Internal_Server_Error_Exception::class,
		];

		yield '503 request code' => [
			'should_wp_error'                  => false,
			'wp_remote_retrieve_response_code' => 503,
			'response_body'                    => (object) [
				'code'    => 503,
				'body'    => \json_encode( [ 'error_code' => 503 ] ),
				'message' => 'message',
			],
			'is_post'                          => true,
			'expected_exception'               => Service_Unavailable_Exception::class,
		];

		yield 'unexpected request code' => [
			'should_wp_error'                  => false,
			'wp_remote_retrieve_response_code' => 5003,
			'response_body'                    => (object) [
				'code'    => 5003,
				'body'    => \json_encode( [ 'error_code' => 5003 ] ),
				'message' => 'message',
			],
			'is_post'                          => true,
			'expected_exception'               => Bad_Request_Exception::class,
		];

		yield 'GET request' => [
			'should_wp_error'                  => false,
			'wp_remote_retrieve_response_code' => 200,
			'response_body'                    => (object) [
				'code'    => 200,
				'message' => 'message',
			],
			'is_post'                          => false,
			'expected_exception'               => null,
		];
	}

	/**
	 * Tests the has_token_expired method.
	 *
	 * @dataProvider provide_has_token_expired
	 * @covers ::has_token_expired
	 *
	 * @param bool   $expected_result The expected boolean result.
	 * @param string $jwt             The given jwt.
	 *
	 * @return void
	 */
	public function test_has_token_expired( $expected_result, $jwt ) {
		$result = $this->instance->has_token_expired( $jwt );

		self::assertEquals( $expected_result, $result );
	}

	/**
	 * The data provider for the `test_request`.
	 *
	 * The jwt consists of a base64 encoded json object that consist of {"exp":2859974215} (the timestamp is in 2060) so this should never expire.
	 *
	 * @return Generator
	 */
	public static function provide_has_token_expired() {

		yield 'valid unexpired jwt' => [
			'expected_result' => false,
			'jwt'             => 'something.eyJleHAiOjI4NTk5NzQyMTV9.signature',
		];

		yield 'invalid jwt' => [
			'expected_result' => true,
			'jwt'             => 'something....',
		];

		yield 'valid jwt corrupted base64' => [
			'expected_result' => true,
			'jwt'             => 'something.eyJleHAiOjI4NCORRUPTEDTk5NzQyMTV9.signature',
		];

		yield 'valid jwt expired token' => [
			'expected_result' => true,
			'jwt'             => 'something.eyJleHAiOjEwOTUzNzkxOTh9.signature',
		];
	}
}
