<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\AI\Content_Planner\Application;

use WPSEO_Utils;
use Yoast\WP\SEO\AI\Authorization\Application\Token_Manager;
use Yoast\WP\SEO\AI\Consent\Application\Consent_Handler;
use Yoast\WP\SEO\AI\Content_Planner\Domain\Category;
use Yoast\WP\SEO\AI\Content_Planner\Domain\Content_Suggestion;
use Yoast\WP\SEO\AI\Content_Planner\Domain\Content_Suggestion_List;
use Yoast\WP\SEO\AI\Content_Planner\Infrastructure\Recent_Content\Recent_Content_Collector;
use Yoast\WP\SEO\AI\HTTP_Request\Application\Request_Handler;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Bad_Request_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Forbidden_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Internal_Server_Error_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Not_Found_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Payment_Required_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Request_Timeout_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Service_Unavailable_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Too_Many_Requests_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Unauthorized_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\WP_Request_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Request;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Response;
use Yoast\WP\SEO\Helpers\User_Helper;

/**
 * Handles the content suggestion command.
 */
class Content_Suggestion_Command_Handler {

	/**
	 * @var Recent_Content_Collector The recent content collector.
	 */
	private Recent_Content_Collector $recent_content_collector;

	/**
	 * @var Token_Manager The token manager.
	 */
	private Token_Manager $token_manager;

	/**
	 * @var Request_Handler The request handler.
	 */
	private Request_Handler $request_handler;

	/**
	 * @var User_Helper The user helper.
	 */
	private User_Helper $user_helper;

	/**
	 * @var Consent_Handler The consent handler.
	 */
	private Consent_Handler $consent_handler;

	/**
	 * The constructor.
	 *
	 * @param Recent_Content_Collector $recent_content_collector The recent content collector.
	 * @param Token_Manager            $token_manager            The token manager.
	 * @param Request_Handler          $request_handler          The request handler.
	 * @param User_Helper              $user_helper              The user helper.
	 * @param Consent_Handler          $consent_handler          The consent handler.
	 */
	public function __construct(
		Recent_Content_Collector $recent_content_collector,
		Token_Manager $token_manager,
		Request_Handler $request_handler,
		User_Helper $user_helper,
		Consent_Handler $consent_handler
	) {
		$this->recent_content_collector = $recent_content_collector;
		$this->token_manager            = $token_manager;
		$this->request_handler          = $request_handler;
		$this->user_helper              = $user_helper;
		$this->consent_handler          = $consent_handler;
	}

	/**
	 *
	 * @throws Bad_Request_Exception
	 * @throws Forbidden_Exception
	 * @throws Internal_Server_Error_Exception
	 * @throws Not_Found_Exception
	 * @throws Payment_Required_Exception
	 * @throws Request_Timeout_Exception
	 * @throws Service_Unavailable_Exception
	 * @throws Too_Many_Requests_Exception
	 * @throws Unauthorized_Exception
	 * @throws WP_Request_Exception
	 * @return Content_Suggestion_List A list of content suggestions
	 */
	public function handle(
		Content_Suggestion_Command $command,
		bool $retry_on_unauthorized = true
	): Content_Suggestion_List {
		$recent_content = $this->recent_content_collector->collect( $command->get_post_type() );
		$token          = $this->token_manager->get_or_request_access_token( $command->get_user() );
		// phpcs:ignore Yoast.Yoast.JsonEncodeAlternative.Found -- Reason: We don't want the debug/pretty possibility.
		$recent_content  = WPSEO_Utils::format_json_encode( $recent_content->to_array() );
		$request_body    = [
			'language' => $command->get_language(),
			'content'  => $recent_content,
		];
		$request_headers = [
			'Authorization' => "Bearer $token",
			'X-Yst-Cohort'  => $command->get_editor(),
		];

		try {

			$response = $this->request_handler->handle( new Request( '/content-planner/next-post-suggestions', $request_body, $request_headers ) );
		} catch ( Unauthorized_Exception $exception ) {
			// Delete the stored JWT tokens, as they appear to be no longer valid.
			$this->user_helper->delete_meta( $command->get_user()->ID, '_yoast_wpseo_ai_generator_access_jwt' );
			$this->user_helper->delete_meta( $command->get_user()->ID, '_yoast_wpseo_ai_generator_refresh_jwt' );

			if ( ! $retry_on_unauthorized ) {
				throw $exception;
			}

			// Try again once more by fetching a new set of tokens and trying the suggestions endpoint again.
			return $this->handle( $command, false );
		} catch ( Forbidden_Exception $exception ) {
			// Follow the API in the consent being revoked (Use case: user sent an e-mail to revoke?).
			// phpcs:disable WordPress.Security.EscapeOutput.ExceptionNotEscaped -- false positive.
			$this->consent_handler->revoke_consent( $command->get_user()->ID );
			throw new Forbidden_Exception( 'CONSENT_REVOKED', $exception->getCode() );
			// phpcs:enable WordPress.Security.EscapeOutput.ExceptionNotEscaped
		}

		return $this->build_suggestions_array( $response );
	}

	public function build_suggestions_array( Response $response ): Content_Suggestion_List {
		$content_suggestion_list = new Content_Suggestion_List();
		$json                    = \json_decode( $response->get_body() );
		if ( $json === null || ! isset( $json->choices ) ) {
			return $content_suggestion_list;
		}
		foreach ( $json->choices as $suggestion ) {
			$content_suggestion_list->add_suggestion(
				new Content_Suggestion(
					$suggestion->title,
					$suggestion->intent,
					$suggestion->explanation,
					$suggestion->keyphrase,
					$suggestion->meta_description,
					new Category( $suggestion->category->title, $suggestion->category->id ),
				),
			);
		}

		return $content_suggestion_list;
	}
}
