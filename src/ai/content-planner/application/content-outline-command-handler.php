<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\AI\Content_Planner\Application;

use Yoast\WP\SEO\AI\Authentication\Application\AI_Request_Sender_Factory;
use Yoast\WP\SEO\AI\Consent\Application\Consent_Handler;
use Yoast\WP\SEO\AI\Content_Planner\Domain\Section;
use Yoast\WP\SEO\AI\Content_Planner\Domain\Section_List;
use Yoast\WP\SEO\AI\Content_Planner\Infrastructure\Recent_Content\Recent_Content_Collector;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Forbidden_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Insufficient_Scope_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\OAuth_Forbidden_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Unauthorized_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Request;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Response;

/**
 * Handles the content outline command.
 */
class Content_Outline_Command_Handler {

	/**
	 * The recent content collector.
	 *
	 * @var Recent_Content_Collector
	 */
	private $recent_content_collector;

	/**
	 * The auth strategy factory.
	 *
	 * @var AI_Request_Sender_Factory
	 */
	private $ai_request_sender_factory;

	/**
	 * The consent handler.
	 *
	 * @var Consent_Handler
	 */
	private $consent_handler;

	/**
	 * The constructor.
	 *
	 * @param Recent_Content_Collector  $recent_content_collector  The recent content collector.
	 * @param AI_Request_Sender_Factory $ai_request_sender_factory The auth strategy factory.
	 * @param Consent_Handler           $consent_handler           The consent handler.
	 */
	public function __construct(
		Recent_Content_Collector $recent_content_collector,
		AI_Request_Sender_Factory $ai_request_sender_factory,
		Consent_Handler $consent_handler
	) {
		$this->recent_content_collector  = $recent_content_collector;
		$this->ai_request_sender_factory = $ai_request_sender_factory;
		$this->consent_handler           = $consent_handler;
	}

	// phpcs:disable Squiz.Commenting.FunctionCommentThrowTag.WrongNumber -- PHPCS doesn't track exceptions thrown by called services.

	/**
	 * Handles the content outline command by collecting recent content and requesting an outline from the AI API.
	 *
	 * @param Content_Outline_Command $command The content outline command.
	 *
	 * @throws Unauthorized_Exception        When the API returns an unauthorized response and retry is exhausted.
	 * @throws Forbidden_Exception           When consent has been revoked.
	 * @throws Insufficient_Scope_Exception  When the OAuth path's token is missing the required scope.
	 * @throws OAuth_Forbidden_Exception     When yoast-ai returns a non-scope 403 on the OAuth wire.
	 *
	 * @return Section_List A list of outline sections.
	 */
	public function handle( Content_Outline_Command $command ): Section_List {
		$recent_content = $this->recent_content_collector->collect( $command->get_post_type() );
		$about_page     = $this->recent_content_collector->collect_about_page( $command->get_post_type() );
		$recent_content = $recent_content->to_array();

		$existing_posts = \array_map(
			static function ( $post ) {
				return [
					'title'       => $post['title'],
					'description' => $post['description'],
				];
			},
			$recent_content,
		);

		$content = [
			'new_post_metadata' => [
				'title'            => $command->get_title(),
				'intent'           => $command->get_intent(),
				'explanation'      => $command->get_explanation(),
				'keyphrase'        => $command->get_keyphrase(),
				'meta_description' => $command->get_meta_description(),
				'category'         => $command->get_category()->to_array(),
			],
			'existing_posts'    => $existing_posts,
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
			$sender   = $this->ai_request_sender_factory->create( $command->get_user() );
			$response = $sender->send(
				new Request(
					'/content-planner/next-post-outline',
					$request_body,
					[ 'X-Yst-Cohort' => $command->get_editor() ],
				),
				$command->get_user(),
			);
		} catch ( Insufficient_Scope_Exception | OAuth_Forbidden_Exception $exception ) {
			// OAuth-side 4xxs are deployment/policy problems, not consent revocation.
			throw $exception;
		} catch ( Forbidden_Exception $exception ) {
			// Follow the API in the consent being revoked (Use case: user sent an e-mail to revoke?).
			// phpcs:disable WordPress.Security.EscapeOutput.ExceptionNotEscaped -- false positive.
			$this->consent_handler->revoke_consent( $command->get_user()->ID );
			throw new Forbidden_Exception( 'CONSENT_REVOKED', $exception->getCode() );
			// phpcs:enable WordPress.Security.EscapeOutput.ExceptionNotEscaped
		}

		return $this->build_outline( $response );
	}

	/**
	 * Builds a list of outline sections from the API response.
	 *
	 * @param Response $response The API response.
	 *
	 * @return Section_List The list of outline sections.
	 */
	private function build_outline( Response $response ): Section_List {
		$section_list = new Section_List();
		$json         = \json_decode( $response->get_body() );

		if ( $json === null || ! isset( $json->choices ) ) {
			return $section_list;
		}
		foreach ( $json->choices as $choice ) {
			$section_list->add(
				new Section(
					( $choice->content_notes ?? [] ),
					( $choice->subheading_text ?? null ),
				),
			);
		}

		return $section_list;
	}
}
