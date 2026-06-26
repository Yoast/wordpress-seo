<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\AI_Consent\User_Interface;

use RuntimeException;
use WP_REST_Request;
use WP_REST_Response;
use Yoast\WP\SEO\AI_Authorization\Application\Token_Manager;
use Yoast\WP\SEO\AI_Consent\Application\Consent_Handler;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Remote_Request_Exception;
use Yoast\WP\SEO\Conditionals\AI_Conditional;
use Yoast\WP\SEO\Conditionals\Old_Premium_AI_Conditional;
use Yoast\WP\SEO\Loggers\Logger;
use Yoast\WP\SEO\Main;
use Yoast\WP\SEO\Routes\Route_Interface;

/**
 * Registers a route toget suggestions from the AI API
 *
 * @makePublic
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Consent_Route implements Route_Interface {

	/**
	 *  The namespace for this route.
	 *
	 * @var string
	 */
	public const ROUTE_NAMESPACE = Main::API_V1_NAMESPACE;

	/**
	 *  The prefix for this route.
	 *
	 * @var string
	 */
	public const ROUTE_PREFIX = '/ai_generator/consent';

	/**
	 * The consent handler instance.
	 *
	 * @var Consent_Handler
	 */
	private $consent_handler;

	/**
	 * The token manager instance.
	 *
	 * @var Token_Manager
	 */
	private $token_manager;

	/**
	 * The logger instance.
	 *
	 * @var Logger
	 */
	private $logger;

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * @return array<string> The conditionals.
	 */
	public static function get_conditionals() {
		return [ AI_Conditional::class, Old_Premium_AI_Conditional::class ];
	}

	/**
	 * Class constructor.
	 *
	 * @param Consent_Handler $consent_handler The consent handler.
	 * @param Token_Manager   $token_manager   The token manager.
	 * @param Logger          $logger          The logger.
	 */
	public function __construct( Consent_Handler $consent_handler, Token_Manager $token_manager, Logger $logger ) {
		$this->consent_handler = $consent_handler;
		$this->token_manager   = $token_manager;
		$this->logger          = $logger;
	}

	/**
	 * Registers routes with WordPress.
	 *
	 * @return void
	 */
	public function register_routes() {
		\register_rest_route(
			self::ROUTE_NAMESPACE,
			self::ROUTE_PREFIX,
			[
				'methods'             => 'POST',
				'args'                => [
					'consent' => [
						'required'    => true,
						'type'        => 'boolean',
						'description' => 'Whether the consent to use AI-based services has been given by the user.',
					],
				],
				'callback'            => [ $this, 'consent' ],
				'permission_callback' => [ $this, 'check_permissions' ],
			],
		);
	}

	/**
	 * Runs the callback to store the consent given by the user to use AI-based services.
	 *
	 * @param WP_REST_Request $request The request object.
	 *
	 * @return WP_REST_Response The response of the callback action.
	 */
	public function consent( WP_REST_Request $request ): WP_REST_Response {
		$user_id = \get_current_user_id();
		$consent = (bool) $request->get_param( 'consent' );

		try {
			if ( $consent ) {
				// Store the consent at user level.
				$this->consent_handler->grant_consent( $user_id );
			}
			else {
				// Invalidate the token if the user revoked the consent.
				$this->token_manager->token_invalidate( $user_id );
				// Delete the consent at user level.
				$this->consent_handler->revoke_consent( $user_id );
			}
		} catch ( Remote_Request_Exception | RuntimeException $e ) {
			$status_code = ( $e instanceof Remote_Request_Exception ) ? $e->getCode() : 500;
			$this->logger->error( $e->getMessage(), [ 'exception' => $e ] );
			return new WP_REST_Response( ( $consent ) ? 'Failed to give consent.' : 'Failed to revoke consent.', $status_code );
		}

		return new WP_REST_Response( ( $consent ) ? 'Consent successfully given.' : 'Consent successfully revoked.' );
	}

	/**
	 * Checks:
	 * - if the user is logged
	 * - if the user can edit posts
	 *
	 * @return bool Whether the user is logged in, can edit posts and the feature is active.
	 */
	public function check_permissions(): bool {
		$user = \wp_get_current_user();
		if ( $user === null || $user->ID < 1 ) {
			return false;
		}

		return \user_can( $user, 'edit_posts' );
	}
}
