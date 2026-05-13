<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\AI\Authentication\Application;

use WP_User;
use Yoast\WP\SEO\AI\Authentication\Domain\Exceptions\Auth_Strategy_Loop_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Application\Request_Handler;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Insufficient_Scope_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\OAuth_Forbidden_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Remote_Request_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Request;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Response;
use YoastSEO_Vendor\Psr\Log\LoggerAwareInterface;
use YoastSEO_Vendor\Psr\Log\LoggerAwareTrait;
use YoastSEO_Vendor\Psr\Log\NullLogger;

/**
 * Sends an authenticated AI request using a primary auth strategy, with optional fallback.
 *
 * Owns the dispatch + retry orchestration so strategies stay pure decorators. The flow per send()
 * is: decorate → dispatch → on failure ask the strategy whether to retry → if not, try fallback
 * (if any) → propagate. A hard cap on attempts (3) prevents infinite loops if a strategy keeps
 * returning true from on_failure.
 *
 * Insufficient_Scope_Exception always propagates without triggering fallback — different token
 * semantics mean the legacy path would mask the real config bug.
 */
class AI_Request_Sender implements LoggerAwareInterface {

	use LoggerAwareTrait;

	/**
	 * Hard cap on dispatch attempts per strategy. The OAuth strategy uses at most two recoveries
	 * (one DPoP nonce stash + one cached-token clear), so three attempts is sufficient.
	 */
	private const MAX_ATTEMPTS = 3;

	/**
	 * The AI request handler.
	 *
	 * @var Request_Handler
	 */
	private $request_handler;

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
	 * @param Request_Handler              $request_handler The AI request handler.
	 * @param Auth_Strategy_Interface      $primary         The primary strategy.
	 * @param Auth_Strategy_Interface|null $fallback        The fallback strategy, or null for no fallback.
	 */
	public function __construct( Request_Handler $request_handler, Auth_Strategy_Interface $primary, ?Auth_Strategy_Interface $fallback = null ) {
		$this->request_handler = $request_handler;
		$this->primary         = $primary;
		$this->fallback        = $fallback;
		$this->logger          = new NullLogger();
	}

	// phpcs:disable Squiz.Commenting.FunctionCommentThrowTag.Missing -- Request_Handler and strategies throw typed exceptions that propagate out.

	/**
	 * Sends an authenticated AI request.
	 *
	 * Insufficient_Scope_Exception bypasses the fallback path (different token semantics mean Token
	 * would mask the OAuth scope bug). Auth_Strategy_Loop_Exception (raised when a strategy's
	 * on_failure runs away past MAX_ATTEMPTS) propagates fail-closed — it signals a strategy
	 * implementation bug and is deliberately NOT recovered by trying the fallback.
	 *
	 * @param Request $request The base request, without auth headers.
	 * @param WP_User $user    The WP user the request is on behalf of.
	 *
	 * @return Response The parsed response.
	 */
	public function send( Request $request, WP_User $user ): Response {
		try {
			return $this->dispatch_with( $this->primary, $request, $user );
		} catch ( Insufficient_Scope_Exception | OAuth_Forbidden_Exception $exception ) {
			// OAuth-specific 4xxs never fall back — different token semantics would mask the config bug.
			throw $exception;
		} catch ( Remote_Request_Exception $exception ) {
			if ( $this->fallback === null ) {
				throw $exception;
			}
			$this->logger->warning(
				'Primary AI auth strategy exhausted recovery ({error_id}); falling back to the secondary strategy.',
				[ 'error_id' => $exception->get_error_identifier() ],
			);
			return $this->dispatch_with( $this->fallback, $request, $user );
		}
	}

	/**
	 * Runs the decorate → dispatch → on_failure loop for a single strategy.
	 *
	 * @param Auth_Strategy_Interface $strategy The strategy to use.
	 * @param Request                 $request  The base request.
	 * @param WP_User                 $user     The WP user.
	 *
	 * @return Response The parsed response.
	 */
	private function dispatch_with( Auth_Strategy_Interface $strategy, Request $request, WP_User $user ): Response {
		for ( $attempt = 1; $attempt <= self::MAX_ATTEMPTS; ++$attempt ) {
			try {
				return $this->request_handler->handle( $strategy->decorate( $request, $user ) );
			} catch ( Remote_Request_Exception $exception ) {
				if ( ! $strategy->on_failure( $request, $user, $exception, $attempt ) ) {
					throw $exception;
				}
			}
		}

		// A strategy kept returning true from on_failure past MAX_ATTEMPTS — buggy implementation.
		// Fail loudly with a LogicException so the bug surfaces rather than being masked by fallback.
		$this->logger->error( 'AI auth strategy {strategy} hit retry budget without resolution.', [ 'strategy' => \get_class( $strategy ) ] );
		throw new Auth_Strategy_Loop_Exception( 'AI_Request_Sender: retry budget exhausted without resolution.' );
	}

	// phpcs:enable Squiz.Commenting.FunctionCommentThrowTag.Missing
}
