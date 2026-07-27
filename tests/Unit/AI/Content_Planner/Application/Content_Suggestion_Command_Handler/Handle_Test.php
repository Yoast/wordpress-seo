<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Content_Planner\Application\Content_Suggestion_Command_Handler;

use Mockery;
use WP_User;
use Yoast\WP\SEO\AI\Content_Planner\Application\Content_Suggestion_Command;
use Yoast\WP\SEO\AI\Content_Planner\Domain\Category;
use Yoast\WP\SEO\AI\Content_Planner\Domain\Content_Suggestion_Parameters;
use Yoast\WP\SEO\AI\Content_Planner\Domain\Content_Suggestion_Response;
use Yoast\WP\SEO\AI\Content_Planner\Domain\Post;
use Yoast\WP\SEO\AI\Content_Planner\Domain\Post_List;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Response;

/**
 * Tests the Content_Suggestion_Command_Handler::handle method.
 *
 * @group ai-content-planner
 *
 * @covers \Yoast\WP\SEO\AI\Content_Planner\Application\Content_Suggestion_Command_Handler::handle
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Handle_Test extends Abstract_Content_Suggestion_Command_Handler_Test {

	/**
	 * Builds a Content_Suggestion_Command with a WP_User mock whose ID is 1.
	 *
	 * @return Content_Suggestion_Command The command.
	 */
	private function build_command(): Content_Suggestion_Command {
		$user     = Mockery::mock( WP_User::class );
		$user->ID = 1;

		return new Content_Suggestion_Command( $user, 'post', 'en_US', 'gutenberg' );
	}

	/**
	 * Builds a Post_List with a single Post for use as collector output.
	 *
	 * @return Post_List The post list.
	 */
	private function build_post_list(): Post_List {
		$post_list = new Post_List();
		$post_list->add(
			new Post(
				'Existing post',
				'Existing description',
				new Category( 'Tech', 5 ),
				'AI usage',
				1,
				'2026-05-19 12:00:00',
				'Article',
			),
		);

		return $post_list;
	}

	/**
	 * Tests that on the happy path handle() returns a Content_Suggestion_Response whose
	 * recent content is the exact Post_List that was returned by the collector and forwarded
	 * to the suggestions API, so the frontend receives the same recent-content payload that
	 * the AI request was built from (no double collection).
	 *
	 * @return void
	 */
	public function test_handle_returns_same_post_list_that_was_collected_and_sent() {
		$command   = $this->build_command();
		$post_list = $this->build_post_list();

		$this->recent_content_collector
			->expects( 'collect' )
			->once()
			->with( 'post' )
			->andReturn( $post_list );

		$this->recent_content_collector
			->expects( 'collect_about_page' )
			->once()
			->with( 'post' )
			->andReturn( false );

		$this->ai_request_sender_factory->expects( 'create' )->once()->with( $command->get_user() )->andReturn( $this->ai_request_sender );

		$this->ai_request_sender
			->expects( 'get_content_suggestions' )
			->once()
			->with(
				Mockery::on(
					static function ( $parameters ) use ( $post_list ) {
						if ( ! $parameters instanceof Content_Suggestion_Parameters ) {
							return false;
						}

						$content = $parameters->get_content();

						return ( $content['posts'] ?? null ) === $post_list->to_array();
					},
				),
			)
			->andReturn( new Response( (string) \wp_json_encode( [ 'choices' => [] ] ), 200, 'OK' ) );

		$result = $this->instance->handle( $command );

		$this->assertInstanceOf( Content_Suggestion_Response::class, $result );
		$this->assertSame(
			$post_list,
			$result->get_recent_content(),
			'handle() must return the same Post_List instance that was collected and sent to the suggestions API.',
		);
	}
}
