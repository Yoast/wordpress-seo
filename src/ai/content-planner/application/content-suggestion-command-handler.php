<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\AI\Content_Planner\Application;

use Yoast\WP\SEO\AI\Authorization\Application\Token_Manager;
use Yoast\WP\SEO\AI\Consent\Application\Consent_Handler;
use Yoast\WP\SEO\AI\Content_Planner\Domain\Content_Suggestion;
use Yoast\WP\SEO\AI\Content_Planner\Domain\Content_Suggestion_List;
use Yoast\WP\SEO\AI\Content_Planner\Infrastructure\Recent_Content\Recent_Content_Collector;
use Yoast\WP\SEO\AI\HTTP_Request\Application\Request_Handler;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Forbidden_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Unauthorized_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Request;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Response;

/**
 * Handles the content suggestion command.
 */
class Content_Suggestion_Command_Handler {

	/**
	 * The recent content collector.
	 *
	 * @var Recent_Content_Collector
	 */
	private $recent_content_collector;

	/**
	 * The token manager.
	 *
	 * @var Token_Manager
	 */
	private $token_manager;

	/**
	 * The request handler.
	 *
	 * @var Request_Handler
	 */
	private $request_handler;

	/**
	 * The consent handler.
	 *
	 * @var Consent_Handler
	 */
	private $consent_handler;

	/**
	 * The category repository.
	 *
	 * @var Category_Repository_Interface
	 */
	private $category_repository;

	/**
	 * The constructor.
	 *
	 * @param Recent_Content_Collector      $recent_content_collector The recent content collector.
	 * @param Token_Manager                 $token_manager            The token manager.
	 * @param Request_Handler               $request_handler          The request handler.
	 * @param Consent_Handler               $consent_handler          The consent handler.
	 * @param Category_Repository_Interface $category_repository      The category repository.
	 */
	public function __construct(
		Recent_Content_Collector $recent_content_collector,
		Token_Manager $token_manager,
		Request_Handler $request_handler,
		Consent_Handler $consent_handler,
		Category_Repository_Interface $category_repository
	) {
		$this->recent_content_collector = $recent_content_collector;
		$this->token_manager            = $token_manager;
		$this->request_handler          = $request_handler;
		$this->consent_handler          = $consent_handler;
		$this->category_repository      = $category_repository;
	}

	/**
	 * Handles the content suggestion command by collecting recent content and requesting suggestions from the AI API.
	 *
	 * @param Content_Suggestion_Command $command               The content suggestion command.
	 * @param bool                       $retry_on_unauthorized Whether to retry on unauthorized response.
	 *
	 * @throws Unauthorized_Exception When the API returns an unauthorized response and retry is exhausted.
	 * @throws Forbidden_Exception    When consent has been revoked.
	 *
	 * @return Content_Suggestion_List A list of content suggestions.
	 */
	public function handle(
		Content_Suggestion_Command $command,
		bool $retry_on_unauthorized = true
	): Content_Suggestion_List {
		$recent_content = $this->recent_content_collector->collect( $command->get_post_type() );
		$about_page     = $this->recent_content_collector->collect_about_page( $command->get_post_type() );
		$token          = $this->token_manager->get_or_request_access_token( $command->get_user() );
		$recent_content = $recent_content->to_array();

		$content = [
			'posts' => $recent_content,
		];
		if ( $about_page ) {
			$content['about_page'] = $about_page;
		}
		$request_body = [
			'subject' => [
				'language' => $command->get_language(),
				'content'  => $content,
			],
		];

		$request_headers = [
			'Authorization' => "Bearer $token",
			'X-Yst-Cohort'  => $command->get_editor(),
		];

		try {

			$response = $this->request_handler->handle( new Request( '/content-planner/next-post-suggestions', $request_body, $request_headers ) );
		} catch ( Unauthorized_Exception $exception ) {
			// Delete the stored JWT tokens, as they appear to be no longer valid.
			$this->token_manager->clear_tokens( (string) $command->get_user()->ID );

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

	/**
	 * Builds a list of content suggestions from the API response.
	 *
	 * @param Response $response The API response.
	 *
	 * @return Content_Suggestion_List The list of content suggestions.
	 */
	public function build_suggestions_array( Response $response ): Content_Suggestion_List {
		$content_suggestion_list = new Content_Suggestion_List();
		$json                    = \json_decode( $response->get_body() );

		if ( $json === null || ! isset( $json->choices ) ) {
			return $content_suggestion_list;
		}
		foreach ( $json->choices as $suggestion ) {
			$category = $this->category_repository->find_by_name( $suggestion->category->name );

			$content_suggestion_list->add(
				new Content_Suggestion(
					$suggestion->title,
					$suggestion->intent,
					$suggestion->explanation,
					$suggestion->keyphrase,
					$suggestion->meta_description,
					$category,
				),
			);
		}

		return $content_suggestion_list;
	}
}
