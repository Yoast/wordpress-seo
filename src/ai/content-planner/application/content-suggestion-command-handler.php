<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\AI\Content_Planner\Application;

use Yoast\WP\SEO\AI\Authentication\Application\Auth_Strategy_Factory;
use Yoast\WP\SEO\AI\Consent\Application\Consent_Handler;
use Yoast\WP\SEO\AI\Content_Planner\Domain\Content_Suggestion;
use Yoast\WP\SEO\AI\Content_Planner\Domain\Content_Suggestion_List;
use Yoast\WP\SEO\AI\Content_Planner\Infrastructure\Recent_Content\Recent_Content_Collector;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Forbidden_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Insufficient_Scope_Exception;
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
	 * The auth strategy factory.
	 *
	 * @var Auth_Strategy_Factory
	 */
	private $auth_strategy_factory;

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
	 * @param Auth_Strategy_Factory         $auth_strategy_factory    The auth strategy factory.
	 * @param Consent_Handler               $consent_handler          The consent handler.
	 * @param Category_Repository_Interface $category_repository      The category repository.
	 */
	public function __construct(
		Recent_Content_Collector $recent_content_collector,
		Auth_Strategy_Factory $auth_strategy_factory,
		Consent_Handler $consent_handler,
		Category_Repository_Interface $category_repository
	) {
		$this->recent_content_collector = $recent_content_collector;
		$this->auth_strategy_factory    = $auth_strategy_factory;
		$this->consent_handler          = $consent_handler;
		$this->category_repository      = $category_repository;
	}

	// phpcs:disable Squiz.Commenting.FunctionCommentThrowTag.WrongNumber -- PHPCS doesn't track exceptions thrown by called services.

	/**
	 * Handles the content suggestion command by collecting recent content and requesting suggestions from the AI API.
	 *
	 * @param Content_Suggestion_Command $command The content suggestion command.
	 *
	 * @throws Unauthorized_Exception        When the API returns an unauthorized response and retry is exhausted.
	 * @throws Forbidden_Exception           When consent has been revoked.
	 * @throws Insufficient_Scope_Exception  When the OAuth path's token is missing the required scope.
	 *
	 * @return Content_Suggestion_List A list of content suggestions.
	 */
	public function handle( Content_Suggestion_Command $command ): Content_Suggestion_List {
		$recent_content = $this->recent_content_collector->collect( $command->get_post_type() );
		$about_page     = $this->recent_content_collector->collect_about_page( $command->get_post_type() );
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

		try {
			$strategy = $this->auth_strategy_factory->create( $command->get_user() );
			$response = $strategy->send(
				new Request(
					'/content-planner/next-post-suggestions',
					$request_body,
					[ 'X-Yst-Cohort' => $command->get_editor() ],
				),
				$command->get_user(),
			);
		} catch ( Insufficient_Scope_Exception $exception ) {
			// Scope errors are a deployment/token-issuance problem, not a consent revocation.
			throw $exception;
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
