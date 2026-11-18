<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\HTTP_Request\Application\Response_Validator;

use Yoast\WP\SEO\AI\HTTP_Request\Application\Response_Validator;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Bad_Request_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Forbidden_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Internal_Server_Error_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Not_Found_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Payment_Required_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Request_Timeout_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Service_Unavailable_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Too_Many_Requests_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Unauthorized_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Response;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests for Response_Validator::assert_success.
 *
 * @group ai-http-request
 *
 * @coversDefaultClass \Yoast\WP\SEO\AI\HTTP_Request\Application\Response_Validator
 */
final class Assert_Success_Test extends TestCase {

	/**
	 * The instance under test.
	 *
	 * @var Response_Validator
	 */
	private $instance;

	/**
	 * Sets up the test.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();
		$this->instance = new Response_Validator();
	}

	/**
	 * 200 returns the response unchanged.
	 *
	 * @covers ::assert_success
	 *
	 * @return void
	 */
	public function test_returns_response_on_200(): void {
		$response = new Response( '{}', 200, 'OK' );

		$this->assertSame( $response, $this->instance->assert_success( $response ) );
	}

	/**
	 * Non-200 statuses are mapped to the matching typed exception.
	 *
	 * @param int    $status    The HTTP status code.
	 * @param string $exception The expected exception class.
	 *
	 * @covers ::assert_success
	 *
	 * @dataProvider provider_status_to_exception
	 *
	 * @return void
	 */
	public function test_throws_for_non_200( int $status, string $exception ): void {
		$response = new Response( '{}', $status, 'error', 'some_error' );

		$this->expectException( $exception );
		$this->expectExceptionCode( $status );
		$this->instance->assert_success( $response );
	}

	/**
	 * Data provider mapping each handled status code to the expected exception class.
	 *
	 * @return array<string, array{0: int, 1: string}>
	 */
	public function provider_status_to_exception(): array {
		return [
			'unauthorized'          => [ 401, Unauthorized_Exception::class ],
			'payment_required'      => [ 402, Payment_Required_Exception::class ],
			'forbidden'             => [ 403, Forbidden_Exception::class ],
			'not_found'             => [ 404, Not_Found_Exception::class ],
			'request_timeout'       => [ 408, Request_Timeout_Exception::class ],
			'too_many_requests'     => [ 429, Too_Many_Requests_Exception::class ],
			'internal_server_error' => [ 500, Internal_Server_Error_Exception::class ],
			'service_unavailable'   => [ 503, Service_Unavailable_Exception::class ],
			'bad_request'           => [ 400, Bad_Request_Exception::class ],
			'unknown'               => [ 418, Bad_Request_Exception::class ],
			'transport_failure'     => [ 0, Bad_Request_Exception::class ],
		];
	}

	/**
	 * Missing licenses are forwarded onto the Payment_Required exception.
	 *
	 * @covers ::assert_success
	 *
	 * @return void
	 */
	public function test_forwards_missing_licenses_on_402(): void {
		$response = new Response( '{}', 402, 'payment required', 'payment_needed', [ 'wpseo-premium' ] );

		try {
			$this->instance->assert_success( $response );
			$this->fail( 'Expected Payment_Required_Exception.' );
		}
		catch ( Payment_Required_Exception $exception ) {
			$this->assertSame( [ 'wpseo-premium' ], $exception->get_missing_licenses() );
		}
	}

	/**
	 * Response headers are forwarded onto the thrown exception.
	 *
	 * @covers ::assert_success
	 *
	 * @return void
	 */
	public function test_forwards_response_headers(): void {
		$headers  = [ 'www-authenticate' => 'Bearer error="insufficient_scope"' ];
		$response = new Response( '{}', 403, 'forbidden', 'insufficient_scope', [], $headers );

		try {
			$this->instance->assert_success( $response );
			$this->fail( 'Expected Forbidden_Exception.' );
		}
		catch ( Forbidden_Exception $exception ) {
			$this->assertSame( $headers, $exception->get_response_headers() );
		}
	}
}
