<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\AI\Authentication\Application;

use WP_User;
use Yoast\WP\SEO\AI\Authentication\Domain\Exceptions\Auth_Strategy_Unavailable_Exception;
use Yoast\WP\SEO\AI\Content_Planner\Domain\Content_Outline_Parameters;
use Yoast\WP\SEO\AI\Content_Planner\Domain\Content_Suggestion_Parameters;
use Yoast\WP\SEO\AI\Generator\Domain\Suggestions_Parameters;
use Yoast\WP\SEO\AI\Generator\Domain\Usage_Parameters;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Remote_Request_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Unauthorized_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\WP_Request_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Request;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Response;
use YoastSEO_Vendor\Psr\Log\LoggerAwareInterface;
use YoastSEO_Vendor\Psr\Log\LoggerAwareTrait;
use YoastSEO_Vendor\Psr\Log\NullLogger;

/**
 * Sends an authenticated AI request using a primary strategy, with an optional fallback.
 */
class AI_Request_Sender implements LoggerAwareInterface {

	use LoggerAwareTrait;

	/**
	 * The primary strategy.
	 *
	 * @var Auth_Strategy_Interface
	 */
	private $primary;

	/**
	 * The fallback strategy, or null when no fallback should be tried on persistent failure.
	 *
	 * @var Auth_Strategy_Interface|null
	 */
	private $fallback;

	/**
	 * Constructor.
	 *
	 * @param Auth_Strategy_Interface      $primary  The primary strategy.
	 * @param Auth_Strategy_Interface|null $fallback The fallback strategy, or null for no fallback.
	 */
	public function __construct( Auth_Strategy_Interface $primary, ?Auth_Strategy_Interface $fallback = null ) {
		$this->primary  = $primary;
		$this->fallback = $fallback;
		$this->logger   = new NullLogger();
	}

	// phpcs:disable Squiz.Commenting.FunctionCommentThrowTag.Missing -- Strategies throw typed exceptions that propagate out.

	/**
	 * Requests a content outline from the AI service.
	 *
	 * @param Content_Outline_Parameters $parameters The outline parameters.
	 *
	 * @return Response The parsed response.
	 */
	public function get_content_outline_suggestions( Content_Outline_Parameters $parameters ): Response {
		$request = new Request(
			'/content-planner/next-post-outline',
			[
				'subject' => [
					'language' => $parameters->get_language(),
					'content'  => $parameters->get_content(),
				],
			],
			[ 'X-Yst-Cohort' => $parameters->get_editor() ],
		);

		return $this->send( $request, $parameters->get_user() );
	}

	/**
	 * Requests next-post content suggestions from the AI service.
	 *
	 * @param Content_Suggestion_Parameters $parameters The suggestion parameters.
	 *
	 * @return Response The parsed response.
	 */
	public function get_content_suggestions( Content_Suggestion_Parameters $parameters ): Response {
		$request = new Request(
			'/content-planner/next-post-suggestions',
			[
				'subject' => [
					'language' => $parameters->get_language(),
					'content'  => $parameters->get_content(),
				],
			],
			[ 'X-Yst-Cohort' => $parameters->get_editor() ],
		);

		return $this->send( $request, $parameters->get_user() );
	}

	/**
	 * Requests suggestions for the given suggestion type.
	 *
	 * @param Suggestions_Parameters $parameters The suggestions parameters.
	 *
	 * @return Response The parsed response.
	 */
	public function get_suggestions( Suggestions_Parameters $parameters ): Response {
		$user    = $parameters->get_user();
		$request = new Request(
			'/openai/suggestions/' . $parameters->get_suggestion_type(),
			[
				'service' => 'openai',
				'user_id' => (string) $user->ID,
				'subject' => [
					'content'         => $parameters->get_prompt_content(),
					'focus_keyphrase' => $parameters->get_focus_keyphrase(),
					'language'        => $parameters->get_language(),
					'platform'        => $parameters->get_platform(),
				],
			],
			[ 'X-Yst-Cohort' => $parameters->get_editor() ],
		);

		return $this->send( $request, $user );
	}

	/**
	 * Requests the user's current usage.
	 *
	 * @param Usage_Parameters $parameters The usage parameters.
	 *
	 * @return Response The parsed response.
	 */
	public function get_usage( Usage_Parameters $parameters ): Response {
		$action_path = $parameters->is_free() ? '/usage/free-usages' : '/usage/' . $parameters->get_period();
		$request     = new Request( $action_path, [], [], Request::METHOD_GET );

		return $this->send( $request, $parameters->get_user() );
	}

	/**
	 * Records the user's consent on the AI service.
	 *
	 * The strategy identifies the WP user to the service (the OAuth path injects `user_id` into the
	 * POST body), so no body is built here.
	 *
	 * @param WP_User $user The WP user granting consent.
	 *
	 * @return Response The parsed response.
	 */
	public function grant_consent( WP_User $user ): Response {
		return $this->send( new Request( '/user/consent', [], [], Request::METHOD_POST ), $user );
	}

	/**
	 * Revokes the user's consent on the AI service.
	 *
	 * The strategy identifies the WP user to the service (the OAuth path injects `user_id` into the
	 * query string for DELETE requests).
	 *
	 * @param WP_User $user The WP user revoking consent.
	 *
	 * @return Response The parsed response.
	 */
	public function revoke_consent( WP_User $user ): Response {
		return $this->send( new Request( '/user/consent', [], [], Request::METHOD_DELETE ), $user );
	}

	/**
	 * Sends an authenticated AI request, falling back to the secondary strategy on persistent failure.
	 *
	 * The fallback is only tried for failures that mean the primary strategy could not authenticate
	 * or reach the service; every authoritative answer the service gave (a content-filter rejection,
	 * a missing license, a consent or scope 403, a rate limit, a server error) propagates to the
	 * caller instead — see {@see self::is_fallback_eligible()}.
	 *
	 * Kept public for backward compatibility — callers that have a pre-built Request may dispatch it
	 * directly. New call sites should prefer the named methods above.
	 *
	 * @param Request $request The base request, without auth headers.
	 * @param WP_User $user    The WP user the request is on behalf of.
	 *
	 * @return Response The parsed response.
	 */
	public function send( Request $request, WP_User $user ): Response {
		try {
			return $this->primary->send( $request, $user );
		}
		catch ( Remote_Request_Exception $exception ) {
			if ( ! $this->is_fallback_eligible( $exception ) ) {
				$this->logger->warning(
					'Primary AI auth strategy failed ({error_id}, HTTP {status}: {message}); the failure is not recoverable by the fallback, propagating to the caller.',
					$this->error_context( $exception ),
				);
				throw $exception;
			}
			if ( $this->fallback === null ) {
				$this->logger->warning(
					'Primary AI auth strategy failed ({error_id}, HTTP {status}: {message}); no fallback configured, giving up.',
					$this->error_context( $exception ),
				);
				throw $exception;
			}
			$this->logger->warning(
				'Primary AI auth strategy failed ({error_id}, HTTP {status}: {message}); falling back to the secondary strategy.',
				$this->error_context( $exception ),
			);

			try {
				$response = $this->fallback->send( $request, $user );
			}
			catch ( Remote_Request_Exception $fallback_exception ) {
				$this->logger->warning(
					'Secondary AI auth strategy also failed ({error_id}, HTTP {status}: {message}); giving up.',
					$this->error_context( $fallback_exception ),
				);
				throw $fallback_exception;
			}

			$this->logger->debug( 'Secondary AI auth strategy succeeded after primary failure.' );
			return $response;
		}
	}

	/**
	 * Decides whether a primary-strategy failure may be retried via the fallback strategy.
	 *
	 * The fallback exists to recover from a primary strategy that could not *authenticate* or *reach*
	 * the service. It must not fire on an authoritative answer the service gave about the request, the
	 * user, or the account, because the fallback talks to the same service for the same user and would
	 * either get the same answer or, worse, fail for an unrelated reason and mask the real one — for
	 * example a 400 content-filter rejection (profanity) would be silently turned into a repeat request.
	 *
	 * Only three failures clear this gate, all of them about the primary strategy itself rather than
	 * the service's verdict: {@see Auth_Strategy_Unavailable_Exception} (no OAuth site token could be
	 * acquired), {@see Unauthorized_Exception} (a 401 — the token is missing, invalid, or expired), and
	 * {@see WP_Request_Exception} (a transport failure reaching the service, the very case OAuth exists
	 * to survive — note it carries status 400 by convention but is a transport failure, not a service
	 * answer). Every other {@see Remote_Request_Exception} — a service-issued 400
	 * ({@see \Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Bad_Request_Exception}, e.g. a content
	 * filter), 402, 403 (consent, scope, or any other forbidden), 404, 408, 429, 500, 503 — is an
	 * authoritative answer that propagates untouched.
	 *
	 * @param Remote_Request_Exception $exception The failure thrown by the primary strategy.
	 *
	 * @return bool True when the fallback may be tried, false when the failure must propagate.
	 */
	private function is_fallback_eligible( Remote_Request_Exception $exception ): bool {
		return $exception instanceof Auth_Strategy_Unavailable_Exception
			|| $exception instanceof Unauthorized_Exception
			|| $exception instanceof WP_Request_Exception;
	}

	/**
	 * Builds the PSR-3 log context for a failed remote request, defaulting a missing error identifier
	 * to `unknown` so the rendered message never has an empty slot.
	 *
	 * @param Remote_Request_Exception $exception The failed request exception.
	 *
	 * @return array<string, int|string> The log context: error_id, status, message.
	 */
	private function error_context( Remote_Request_Exception $exception ): array {
		$error_id = $exception->get_error_identifier();
		if ( $error_id === '' ) {
			$error_id = 'unknown';
		}

		return [
			'error_id' => $error_id,
			'status'   => $exception->getCode(),
			'message'  => $exception->getMessage(),
		];
	}

	// phpcs:enable Squiz.Commenting.FunctionCommentThrowTag.Missing
}
