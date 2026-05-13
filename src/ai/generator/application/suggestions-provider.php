<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\AI\Generator\Application;

use RuntimeException;
use WP_User;
use Yoast\WP\SEO\AI\Authentication\Application\Auth_Strategy_Factory;
use Yoast\WP\SEO\AI\Consent\Application\Consent_Handler;
use Yoast\WP\SEO\AI\Generator\Domain\Suggestion;
use Yoast\WP\SEO\AI\Generator\Domain\Suggestions_Bucket;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Bad_Request_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Forbidden_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Insufficient_Scope_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Internal_Server_Error_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Not_Found_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Payment_Required_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Request_Timeout_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Service_Unavailable_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Too_Many_Requests_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Unauthorized_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Request;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Response;

/**
 * The class that handles the suggestions from the AI API.
 */
class Suggestions_Provider {

	/**
	 * The consent handler instance.
	 *
	 * @var Consent_Handler
	 */
	private $consent_handler;

	/**
	 * The auth strategy factory.
	 *
	 * @var Auth_Strategy_Factory
	 */
	private $auth_strategy_factory;

	/**
	 * Class constructor.
	 *
	 * @param Consent_Handler       $consent_handler       The consent handler instance.
	 * @param Auth_Strategy_Factory $auth_strategy_factory The auth strategy factory.
	 */
	public function __construct(
		Consent_Handler $consent_handler,
		Auth_Strategy_Factory $auth_strategy_factory
	) {
		$this->consent_handler       = $consent_handler;
		$this->auth_strategy_factory = $auth_strategy_factory;
	}

	// phpcs:disable Squiz.Commenting.FunctionCommentThrowTag.WrongNumber -- PHPCS doesn't take into account exceptions thrown in called methods.

	/**
	 * Method used to generate suggestions through AI.
	 *
	 * @param WP_User $user            The WP user.
	 * @param string  $suggestion_type The type of the requested suggestion.
	 * @param string  $prompt_content  The excerpt taken from the post.
	 * @param string  $focus_keyphrase The focus keyphrase associated to the post.
	 * @param string  $language        The language of the post.
	 * @param string  $platform        The platform the post is intended for.
	 * @param string  $editor          The current editor.
	 *
	 * @throws Bad_Request_Exception Bad_Request_Exception.
	 * @throws Forbidden_Exception Forbidden_Exception.
	 * @throws Internal_Server_Error_Exception Internal_Server_Error_Exception.
	 * @throws Not_Found_Exception Not_Found_Exception.
	 * @throws Payment_Required_Exception Payment_Required_Exception.
	 * @throws Request_Timeout_Exception Request_Timeout_Exception.
	 * @throws Service_Unavailable_Exception Service_Unavailable_Exception.
	 * @throws Too_Many_Requests_Exception Too_Many_Requests_Exception.
	 * @throws Unauthorized_Exception Unauthorized_Exception.
	 * @throws RuntimeException Unable to retrieve the access token.
	 * @return string[] The suggestions.
	 */
	public function get_suggestions(
		WP_User $user,
		string $suggestion_type,
		string $prompt_content,
		string $focus_keyphrase,
		string $language,
		string $platform,
		string $editor
	): array {
		$request_body = [
			'service' => 'openai',
			'user_id' => (string) $user->ID,
			'subject' => [
				'content'         => $prompt_content,
				'focus_keyphrase' => $focus_keyphrase,
				'language'        => $language,
				'platform'        => $platform,
			],
		];

		try {
			$strategy = $this->auth_strategy_factory->create( $user );
			$response = $strategy->send(
				new Request(
					"/openai/suggestions/$suggestion_type",
					$request_body,
					[ 'X-Yst-Cohort' => $editor ],
				),
				$user,
			);
		} catch ( Insufficient_Scope_Exception $exception ) {
			// Scope errors are a deployment/token-issuance problem, not a consent revocation.
			// Surface them unchanged so the caller can distinguish the two.
			throw $exception;
		} catch ( Forbidden_Exception $exception ) {
			// Follow the API in the consent being revoked (Use case: user sent an e-mail to revoke?).
			// phpcs:disable WordPress.Security.EscapeOutput.ExceptionNotEscaped -- false positive.
			$this->consent_handler->revoke_consent( $user->ID );
			throw new Forbidden_Exception( 'CONSENT_REVOKED', $exception->getCode() );
			// phpcs:enable WordPress.Security.EscapeOutput.ExceptionNotEscaped
		}

		return $this->build_suggestions_array( $response )->to_array();
	}

	// phpcs:enable Squiz.Commenting.FunctionCommentThrowTag.WrongNumber

	/**
	 * Generates the list of 5 suggestions to return.
	 *
	 * @param Response $response The response from the API.
	 *
	 * @return Suggestions_Bucket The array of suggestions.
	 */
	public function build_suggestions_array( Response $response ): Suggestions_Bucket {
		$suggestions_bucket = new Suggestions_Bucket();
		$json               = \json_decode( $response->get_body() );
		if ( $json === null || ! isset( $json->choices ) ) {
			return $suggestions_bucket;
		}
		foreach ( $json->choices as $suggestion ) {
			$suggestions_bucket->add_suggestion( new Suggestion( $suggestion->text ) );
		}

		return $suggestions_bucket;
	}
}
