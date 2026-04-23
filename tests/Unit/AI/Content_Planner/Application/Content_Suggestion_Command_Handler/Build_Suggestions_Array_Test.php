<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Content_Planner\Application\Content_Suggestion_Command_Handler;

use Yoast\WP\SEO\AI\Content_Planner\Domain\Category;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Response;

/**
 * Tests Content_Suggestion_Command_Handler::build_suggestions_array for the category handling cases.
 *
 * @group ai-content-planner
 *
 * @covers \Yoast\WP\SEO\AI\Content_Planner\Application\Content_Suggestion_Command_Handler::build_suggestions_array
 */
final class Build_Suggestions_Array_Test extends Abstract_Content_Suggestion_Command_Handler_Test {

	/**
	 * Builds a response whose single choice has the given category payload.
	 *
	 * @param array<string, mixed> $category_payload The category payload for the choice.
	 *
	 * @return Response The constructed response.
	 */
	private function build_single_choice_response( array $category_payload ): Response {
		$body = [
			'choices' => [
				[
					'title'            => 'How to use AI',
					'intent'           => 'informational',
					'explanation'      => 'This article explains AI usage.',
					'keyphrase'        => 'AI usage',
					'meta_description' => 'Learn how to use AI effectively.',
					'category'         => $category_payload,
				],
			],
		];

		return new Response( (string) \wp_json_encode( $body ), 200, 'OK' );
	}

	/**
	 * Tests case 1: the suggested category exists in the blog.
	 *
	 * @return void
	 */
	public function test_builds_suggestion_when_category_exists() {
		$resolved_category = new Category( 'Travel', 7 );

		$this->category_repository
			->expects( 'find_by_name' )
			->once()
			->with( 'Travel' )
			->andReturn( $resolved_category );

		$response = $this->build_single_choice_response(
			[
				'name' => 'Travel',
				'id'   => 7,
			],
		);

		$result = $this->instance->build_suggestions_array( $response );

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
							'name' => 'Travel',
							'id'   => 7,
						],
					],
				],
			],
			$result->to_array(),
		);
	}

	/**
	 * Tests case 2: the suggested category does not exist in the blog (repository returns the default).
	 *
	 * @return void
	 */
	public function test_builds_suggestion_when_category_does_not_exist() {
		$default_category = new Category( 'Uncategorized', 1 );

		$this->category_repository
			->expects( 'find_by_name' )
			->once()
			->with( 'Made Up Category' )
			->andReturn( $default_category );

		$response = $this->build_single_choice_response(
			[
				'name' => 'Made Up Category',
				'id'   => 9999,
			],
		);

		$result = $this->instance->build_suggestions_array( $response );

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
							'name' => 'Uncategorized',
							'id'   => 1,
						],
					],
				],
			],
			$result->to_array(),
		);
	}

	/**
	 * Tests case 3: the AI returns the empty-category sentinel (repository returns the default).
	 *
	 * @return void
	 */
	public function test_builds_suggestion_for_empty_category_sentinel() {
		$default_category = new Category( 'Uncategorized', 1 );

		$this->category_repository
			->expects( 'find_by_name' )
			->once()
			->with( '' )
			->andReturn( $default_category );

		$response = $this->build_single_choice_response(
			[
				'name' => '',
				'id'   => -1,
			],
		);

		$result = $this->instance->build_suggestions_array( $response );

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
							'name' => 'Uncategorized',
							'id'   => 1,
						],
					],
				],
			],
			$result->to_array(),
		);
	}
}
