<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Content_Planner\Application\Content_Suggestion_Command_Handler;

use Yoast\WP\SEO\AI\Content_Planner\Domain\Category;
use Yoast\WP\SEO\AI\Content_Planner\Domain\Content_Suggestion_Response;
use Yoast\WP\SEO\AI\Content_Planner\Domain\Post_List;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Response;

/**
 * Tests Content_Suggestion_Command_Handler::build_response.
 *
 * @group ai-content-planner
 *
 * @covers \Yoast\WP\SEO\AI\Content_Planner\Application\Content_Suggestion_Command_Handler::build_response
 */
final class Build_Response_Test extends Abstract_Content_Suggestion_Command_Handler_Test {

	/**
	 * Tests that build_response returns a Content_Suggestion_Response bundling suggestions and recent content.
	 *
	 * @return void
	 */
	public function test_build_response_returns_response_with_suggestions_and_recent_content() {
		$body = [
			'choices' => [
				[
					'title'            => 'How to use AI',
					'intent'           => 'informational',
					'explanation'      => 'This article explains AI usage.',
					'keyphrase'        => 'AI usage',
					'meta_description' => 'Learn how to use AI effectively.',
					'category'         => [
						'name' => 'Tech',
						'id'   => 5,
					],
				],
			],
		];

		$resolved_category = new Category( 'Tech', 5 );
		$this->category_repository
			->expects( 'find_by_name' )
			->once()
			->with( 'Tech' )
			->andReturn( $resolved_category );

		$response       = new Response( (string) \wp_json_encode( $body ), 200, 'OK' );
		$recent_content = new Post_List();

		$result = $this->instance->build_response( $response, $recent_content );

		$this->assertInstanceOf( Content_Suggestion_Response::class, $result );
		$this->assertSame( $recent_content, $result->get_recent_content() );
		$this->assertSame(
			[
				'suggestions' => [
					[
						'title'            => 'How to use AI',
						'intent'           => 'informational',
						'explanation'      => 'This article explains AI usage.',
						'keyphrase'        => 'AI usage',
						'meta_description' => 'Learn how to use AI effectively.',
						'category'         => [
							'name' => 'Tech',
							'id'   => 5,
						],
					],
				],
			],
			$result->get_suggestions()->to_array(),
		);
	}

	/**
	 * Tests that build_response with an empty API body returns a response with empty suggestions.
	 *
	 * @return void
	 */
	public function test_build_response_with_empty_body_returns_empty_suggestions() {
		$response       = new Response( (string) \wp_json_encode( [] ), 200, 'OK' );
		$recent_content = new Post_List();

		$result = $this->instance->build_response( $response, $recent_content );

		$this->assertInstanceOf( Content_Suggestion_Response::class, $result );
		$this->assertSame( $recent_content, $result->get_recent_content() );
		$this->assertSame( [ 'suggestions' => [] ], $result->get_suggestions()->to_array() );
	}
}
