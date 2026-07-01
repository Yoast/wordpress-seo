<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Authentication\Application\AI_Request_Sender;

use Mockery;
use WP_User;
use Yoast\WP\SEO\AI\Authentication\Application\AI_Request_Sender;
use Yoast\WP\SEO\AI\Authentication\Application\Auth_Strategy_Interface;
use Yoast\WP\SEO\AI\Authentication\Domain\Exceptions\Auth_Strategy_Unavailable_Exception;
use Yoast\WP\SEO\AI\Content_Planner\Domain\Content_Outline_Parameters;
use Yoast\WP\SEO\AI\Content_Planner\Domain\Content_Suggestion_Parameters;
use Yoast\WP\SEO\AI\Generator\Domain\Suggestions_Parameters;
use Yoast\WP\SEO\AI\Generator\Domain\Usage_Parameters;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Bad_Request_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Consent_Required_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Forbidden_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Insufficient_Scope_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Service_Unavailable_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Too_Many_Requests_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Unauthorized_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\WP_Request_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Request;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Response;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use YoastSEO_Vendor\Psr\Log\LoggerInterface;

/**
 * Tests for AI_Request_Sender.
 *
 * @group ai-authentication
 *
 * @coversDefaultClass \Yoast\WP\SEO\AI\Authentication\Application\AI_Request_Sender
 */
final class AI_Request_Sender_Test extends TestCase {

	/**
	 * The primary strategy mock.
	 *
	 * @var Mockery\MockInterface|Auth_Strategy_Interface
	 */
	private $primary;

	/**
	 * The fallback strategy mock.
	 *
	 * @var Mockery\MockInterface|Auth_Strategy_Interface
	 */
	private $fallback;

	/**
	 * The WP user.
	 *
	 * @var WP_User
	 */
	private $user;

	/**
	 * Sets up the test.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->primary  = Mockery::mock( Auth_Strategy_Interface::class );
		$this->fallback = Mockery::mock( Auth_Strategy_Interface::class );

		$this->user     = new WP_User();
		$this->user->ID = 42;
	}

	/**
	 * Builds a suggestions parameter object that is used to exercise the shared dispatch path.
	 *
	 * @return Suggestions_Parameters The parameters.
	 */
	private function suggestions_parameters(): Suggestions_Parameters {
		return new Suggestions_Parameters(
			$this->user,
			'seo-title',
			'prompt content',
			'focus keyphrase',
			'en_US',
			'web',
			'gutenberg',
		);
	}

	/**
	 * Happy path: primary returns a response, fallback is never invoked.
	 *
	 * @covers ::__construct
	 * @covers ::get_suggestions
	 * @covers ::send
	 *
	 * @return void
	 */
	public function test_send_returns_response_from_primary(): void {
		$response = new Response( '{}', 200, 'OK' );

		$this->primary->expects( 'send' )->with( Mockery::type( Request::class ), $this->user )->andReturn( $response );
		$this->fallback->shouldNotReceive( 'send' );

		$sender = new AI_Request_Sender( $this->primary, $this->fallback );

		$this->assertSame( $response, $sender->get_suggestions( $this->suggestions_parameters() ) );
	}

	/**
	 * When the primary throws an Unauthorized_Exception (a 401, the token is missing/invalid/expired)
	 * and a fallback is configured, the fallback dispatches.
	 *
	 * @covers ::send
	 *
	 * @return void
	 */
	public function test_send_falls_back_on_unauthorized_exception(): void {
		$fallback_response = new Response( '{}', 200, 'OK' );

		$this->primary->expects( 'send' )->andThrow( new Unauthorized_Exception( 'oauth-failed', 401 ) );
		$this->fallback->expects( 'send' )->with( Mockery::type( Request::class ), $this->user )->andReturn( $fallback_response );

		$sender = new AI_Request_Sender( $this->primary, $this->fallback );

		$this->assertSame( $fallback_response, $sender->get_suggestions( $this->suggestions_parameters() ) );
	}

	/**
	 * Without a fallback, Remote_Request_Exception propagates.
	 *
	 * @covers ::send
	 *
	 * @return void
	 */
	public function test_send_rethrows_when_no_fallback(): void {
		$this->primary->expects( 'send' )->andThrow( new Unauthorized_Exception( 'no-recovery', 401, 'oauth-expired' ) );

		$logger = Mockery::mock( LoggerInterface::class );
		$logger->expects( 'warning' )->once()->with(
			'Primary AI auth strategy failed ({error_id}, HTTP {status}: {message}); no fallback configured, giving up.',
			[
				'error_id' => 'oauth-expired',
				'status'   => 401,
				'message'  => 'no-recovery',
			],
		);

		$sender = new AI_Request_Sender( $this->primary );
		$sender->setLogger( $logger );

		$this->expectException( Unauthorized_Exception::class );
		$sender->get_suggestions( $this->suggestions_parameters() );
	}

	/**
	 * When both strategies fail, the fallback's exception propagates (not the primary's).
	 *
	 * @covers ::send
	 *
	 * @return void
	 */
	public function test_send_rethrows_fallback_exception_when_both_fail(): void {
		$this->primary->expects( 'send' )->andThrow( new Unauthorized_Exception( 'oauth-failed', 401 ) );
		$this->fallback->expects( 'send' )->andThrow( new Forbidden_Exception( 'token-failed', 403, 'token-failed' ) );

		$sender = new AI_Request_Sender( $this->primary, $this->fallback );

		try {
			$sender->get_suggestions( $this->suggestions_parameters() );
			$this->fail( 'Expected the fallback exception to propagate.' );
		}
		catch ( Forbidden_Exception $exception ) {
			$this->assertSame( 'token-failed', $exception->get_error_identifier() );
		}
	}

	/**
	 * A 403 the OAuth strategy classified as insufficient_scope is an authoritative answer about this
	 * token, not an authentication failure the fallback can recover from. The fallback must be skipped
	 * and the exception must propagate untouched so the caller can treat it as a token/deployment problem.
	 *
	 * @covers ::send
	 * @covers ::is_fallback_eligible
	 *
	 * @return void
	 */
	public function test_send_does_not_fall_back_on_insufficient_scope(): void {
		$this->primary->expects( 'send' )->andThrow( new Insufficient_Scope_Exception( 'INSUFFICIENT_SCOPE', 403, 'INSUFFICIENT_SCOPE' ) );
		$this->fallback->shouldNotReceive( 'send' );

		$sender = new AI_Request_Sender( $this->primary, $this->fallback );

		$this->expectException( Insufficient_Scope_Exception::class );
		$sender->get_suggestions( $this->suggestions_parameters() );
	}

	/**
	 * A 403 the OAuth strategy classified as consent-required is an authoritative answer about this
	 * user, not an authentication failure. The fallback talks to the same service for the same user,
	 * so trying it is pointless and can mask the real signal with an unrelated failure. The
	 * Consent_Required_Exception must propagate so the caller can clear local consent and re-prompt.
	 *
	 * @covers ::send
	 * @covers ::is_fallback_eligible
	 *
	 * @return void
	 */
	public function test_send_does_not_fall_back_on_consent_required(): void {
		$this->primary->expects( 'send' )->andThrow( new Consent_Required_Exception( 'CONSENT_REQUIRED', 403, 'CONSENT_REQUIRED' ) );
		$this->fallback->shouldNotReceive( 'send' );

		$sender = new AI_Request_Sender( $this->primary, $this->fallback );

		$this->expectException( Consent_Required_Exception::class );
		$sender->get_suggestions( $this->suggestions_parameters() );
	}

	/**
	 * A plain Forbidden_Exception (e.g. a DOMAIN_MISMATCH 403) is an authoritative answer the service
	 * gave about this site, not an authentication failure of the primary strategy. The fallback talks
	 * to the same service and would get the same verdict, so it must be skipped and the exception must
	 * propagate.
	 *
	 * @covers ::send
	 * @covers ::is_fallback_eligible
	 *
	 * @return void
	 */
	public function test_send_does_not_fall_back_on_plain_forbidden(): void {
		$this->primary->expects( 'send' )->andThrow( new Forbidden_Exception( 'forbidden', 403, 'forbidden' ) );
		$this->fallback->shouldNotReceive( 'send' );

		$sender = new AI_Request_Sender( $this->primary, $this->fallback );

		$this->expectException( Forbidden_Exception::class );
		$sender->get_suggestions( $this->suggestions_parameters() );
	}

	/**
	 * The primary could not acquire an OAuth site token, so it never authenticated the request. The
	 * fallback may still serve it via the legacy path.
	 *
	 * @covers ::send
	 * @covers ::is_fallback_eligible
	 *
	 * @return void
	 */
	public function test_send_falls_back_on_auth_strategy_unavailable(): void {
		$fallback_response = new Response( '{}', 200, 'OK' );

		$this->primary->expects( 'send' )->andThrow( new Auth_Strategy_Unavailable_Exception( 'OAUTH_TOKEN_UNAVAILABLE', 0, 'OAUTH_TOKEN_UNAVAILABLE' ) );
		$this->fallback->expects( 'send' )->andReturn( $fallback_response );

		$sender = new AI_Request_Sender( $this->primary, $this->fallback );

		$this->assertSame( $fallback_response, $sender->get_suggestions( $this->suggestions_parameters() ) );
	}

	/**
	 * A transport failure reaching the service is the very case the OAuth path exists to survive, so it
	 * is fallback-eligible: the legacy strategy may still reach the service.
	 *
	 * @covers ::send
	 * @covers ::is_fallback_eligible
	 *
	 * @return void
	 */
	public function test_send_falls_back_on_wp_request_exception(): void {
		$fallback_response = new Response( '{}', 200, 'OK' );

		$this->primary->expects( 'send' )->andThrow( new WP_Request_Exception( 'connection refused' ) );
		$this->fallback->expects( 'send' )->andReturn( $fallback_response );

		$sender = new AI_Request_Sender( $this->primary, $this->fallback );

		$this->assertSame( $fallback_response, $sender->get_suggestions( $this->suggestions_parameters() ) );
	}

	/**
	 * A 400 the service returned about the request itself (e.g. AI_CONTENT_FILTER for profanity) is an
	 * authoritative rejection, not an authentication failure. Falling back would silently repeat the
	 * request, so the exception must propagate instead.
	 *
	 * @covers ::send
	 * @covers ::is_fallback_eligible
	 *
	 * @return void
	 */
	public function test_send_does_not_fall_back_on_bad_request(): void {
		$this->primary->expects( 'send' )->andThrow( new Bad_Request_Exception( 'blocked', 400, 'AI_CONTENT_FILTER' ) );
		$this->fallback->shouldNotReceive( 'send' );

		$sender = new AI_Request_Sender( $this->primary, $this->fallback );

		$this->expectException( Bad_Request_Exception::class );
		$sender->get_suggestions( $this->suggestions_parameters() );
	}

	/**
	 * A 429 rate-limit is an authoritative answer about the account's usage, not an authentication
	 * failure, so the fallback is skipped and the exception propagates.
	 *
	 * @covers ::send
	 * @covers ::is_fallback_eligible
	 *
	 * @return void
	 */
	public function test_send_does_not_fall_back_on_too_many_requests(): void {
		$this->primary->expects( 'send' )->andThrow( new Too_Many_Requests_Exception( 'slow down', 429, 'AI_RATE_LIMITED', null, [] ) );
		$this->fallback->shouldNotReceive( 'send' );

		$sender = new AI_Request_Sender( $this->primary, $this->fallback );

		$this->expectException( Too_Many_Requests_Exception::class );
		$sender->get_suggestions( $this->suggestions_parameters() );
	}

	/**
	 * A 503 is the service's own answer that it could not reach the MyYoast licence server — distinct
	 * from the primary strategy failing to reach the service (a WP_Request_Exception). It is therefore
	 * authoritative and must propagate rather than trigger the fallback.
	 *
	 * @covers ::send
	 * @covers ::is_fallback_eligible
	 *
	 * @return void
	 */
	public function test_send_does_not_fall_back_on_service_unavailable(): void {
		$this->primary->expects( 'send' )->andThrow( new Service_Unavailable_Exception( 'unavailable', 503, '' ) );
		$this->fallback->shouldNotReceive( 'send' );

		$sender = new AI_Request_Sender( $this->primary, $this->fallback );

		$this->expectException( Service_Unavailable_Exception::class );
		$sender->get_suggestions( $this->suggestions_parameters() );
	}

	/**
	 * A non-fallback-eligible failure is logged with the propagation message and never reaches the
	 * fallback, even when one is configured.
	 *
	 * @covers ::send
	 * @covers ::is_fallback_eligible
	 *
	 * @return void
	 */
	public function test_send_logs_when_failure_is_not_fallback_eligible(): void {
		$this->primary->expects( 'send' )->andThrow( new Consent_Required_Exception( 'CONSENT_REQUIRED', 403, 'CONSENT_REQUIRED' ) );
		$this->fallback->shouldNotReceive( 'send' );

		$logger = Mockery::mock( LoggerInterface::class );
		$logger->expects( 'warning' )->once()->with(
			'Primary AI auth strategy failed ({error_id}, HTTP {status}: {message}); the failure is not recoverable by the fallback, propagating to the caller.',
			[
				'error_id' => 'CONSENT_REQUIRED',
				'status'   => 403,
				'message'  => 'CONSENT_REQUIRED',
			],
		);

		$sender = new AI_Request_Sender( $this->primary, $this->fallback );
		$sender->setLogger( $logger );

		$this->expectException( Consent_Required_Exception::class );
		$sender->get_suggestions( $this->suggestions_parameters() );
	}

	/**
	 * Builds the expected Request for the content-outline endpoint and dispatches it.
	 *
	 * @covers ::get_content_outline_suggestions
	 *
	 * @return void
	 */
	public function test_get_content_outline_suggestions_builds_request(): void {
		$content    = [
			'new_post_metadata' => [ 'title' => 'How to use AI' ],
			'existing_posts'    => [],
		];
		$parameters = new Content_Outline_Parameters( $this->user, 'en_US', $content, 'gutenberg' );
		$response   = new Response( '{}', 200, 'OK' );

		$this->primary
			->expects( 'send' )
			->with(
				Mockery::on(
					static function ( $request ) use ( $content ) {
						return $request instanceof Request
							&& $request->get_action_path() === '/content-planner/next-post-outline'
							&& $request->get_http_method() === Request::METHOD_POST
							&& $request->get_headers() === [ 'X-Yst-Cohort' => 'gutenberg' ]
							&& $request->get_body() === [
								'subject' => [
									'language' => 'en_US',
									'content'  => $content,
								],
							];
					},
				),
				$this->user,
			)
			->andReturn( $response );

		$sender = new AI_Request_Sender( $this->primary );

		$this->assertSame( $response, $sender->get_content_outline_suggestions( $parameters ) );
	}

	/**
	 * Builds the expected Request for the content-suggestions endpoint and dispatches it.
	 *
	 * @covers ::get_content_suggestions
	 *
	 * @return void
	 */
	public function test_get_content_suggestions_builds_request(): void {
		$content    = [
			'posts' => [
				[
					'title'       => 'Existing post',
					'description' => 'Existing description',
				],
			],
		];
		$parameters = new Content_Suggestion_Parameters( $this->user, 'en_US', $content, 'gutenberg' );
		$response   = new Response( '{}', 200, 'OK' );

		$this->primary
			->expects( 'send' )
			->with(
				Mockery::on(
					static function ( $request ) use ( $content ) {
						return $request instanceof Request
							&& $request->get_action_path() === '/content-planner/next-post-suggestions'
							&& $request->get_http_method() === Request::METHOD_POST
							&& $request->get_headers() === [ 'X-Yst-Cohort' => 'gutenberg' ]
							&& $request->get_body() === [
								'subject' => [
									'language' => 'en_US',
									'content'  => $content,
								],
							];
					},
				),
				$this->user,
			)
			->andReturn( $response );

		$sender = new AI_Request_Sender( $this->primary );

		$this->assertSame( $response, $sender->get_content_suggestions( $parameters ) );
	}

	/**
	 * Builds the expected Request for the OpenAI suggestions endpoint, interpolating the suggestion type.
	 *
	 * @covers ::get_suggestions
	 *
	 * @return void
	 */
	public function test_get_suggestions_builds_request(): void {
		$parameters = new Suggestions_Parameters(
			$this->user,
			'seo-title',
			'prompt content',
			'focus keyphrase',
			'en_US',
			'web',
			'gutenberg',
		);
		$response   = new Response( '{}', 200, 'OK' );

		$this->primary
			->expects( 'send' )
			->with(
				Mockery::on( [ self::class, 'request_matches_suggestions_shape' ] ),
				$this->user,
			)
			->andReturn( $response );

		$sender = new AI_Request_Sender( $this->primary );

		$this->assertSame( $response, $sender->get_suggestions( $parameters ) );
	}

	/**
	 * Matcher used by the suggestions test to verify the dispatched request.
	 *
	 * @param mixed $request The candidate request.
	 *
	 * @return bool True when the request matches the expected shape.
	 */
	public static function request_matches_suggestions_shape( $request ): bool {
		if ( ! $request instanceof Request ) {
			return false;
		}
		if ( $request->get_action_path() !== '/openai/suggestions/seo-title' ) {
			return false;
		}
		if ( $request->get_http_method() !== Request::METHOD_POST ) {
			return false;
		}
		if ( $request->get_headers() !== [ 'X-Yst-Cohort' => 'gutenberg' ] ) {
			return false;
		}

		return $request->get_body() === [
			'service' => 'openai',
			'user_id' => '42',
			'subject' => [
				'content'         => 'prompt content',
				'focus_keyphrase' => 'focus keyphrase',
				'language'        => 'en_US',
				'platform'        => 'web',
			],
		];
	}

	/**
	 * Builds the expected GET Request for the usage endpoint of a given period (non-free request).
	 *
	 * @covers ::get_usage
	 *
	 * @return void
	 */
	public function test_get_usage_builds_period_request(): void {
		$period     = '2026-06';
		$parameters = new Usage_Parameters( $this->user, false, $period );
		$response   = new Response( '{}', 200, 'OK' );

		$this->primary
			->expects( 'send' )
			->with(
				Mockery::on(
					static function ( $request ) use ( $period ) {
						return $request instanceof Request
							&& $request->get_action_path() === '/usage/' . $period
							&& $request->get_http_method() === Request::METHOD_GET
							&& $request->get_body() === []
							&& $request->get_headers() === [];
					},
				),
				$this->user,
			)
			->andReturn( $response );

		$sender = new AI_Request_Sender( $this->primary );

		$this->assertSame( $response, $sender->get_usage( $parameters ) );
	}

	/**
	 * Builds the expected GET Request for the free-usages endpoint when the request targets the free bucket.
	 *
	 * @covers ::get_usage
	 *
	 * @return void
	 */
	public function test_get_usage_builds_free_usages_request(): void {
		$parameters = new Usage_Parameters( $this->user, true, '2026-06' );
		$response   = new Response( '{}', 200, 'OK' );

		$this->primary
			->expects( 'send' )
			->with(
				Mockery::on(
					static function ( $request ) {
						return $request instanceof Request
							&& $request->get_action_path() === '/usage/free-usages'
							&& $request->get_http_method() === Request::METHOD_GET
							&& $request->get_body() === []
							&& $request->get_headers() === [];
					},
				),
				$this->user,
			)
			->andReturn( $response );

		$sender = new AI_Request_Sender( $this->primary );

		$this->assertSame( $response, $sender->get_usage( $parameters ) );
	}
}
