<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Content_Planner\Domain\Content_Suggestion_Response;

use Yoast\WP\SEO\AI\Content_Planner\Domain\Content_Suggestion_List;
use Yoast\WP\SEO\AI\Content_Planner\Domain\Content_Suggestion_Response;
use Yoast\WP\SEO\AI\Content_Planner\Domain\Post_List;

/**
 * Tests the Content_Suggestion_Response constructor and getters.
 *
 * @group ai-content-planner
 *
 * @covers \Yoast\WP\SEO\AI\Content_Planner\Domain\Content_Suggestion_Response::__construct
 * @covers \Yoast\WP\SEO\AI\Content_Planner\Domain\Content_Suggestion_Response::get_suggestions
 * @covers \Yoast\WP\SEO\AI\Content_Planner\Domain\Content_Suggestion_Response::get_recent_content
 */
final class Constructor_Test extends Abstract_Content_Suggestion_Response {

	/**
	 * Tests that the constructor stores the suggestions and recent content and the getters return them.
	 *
	 * @return void
	 */
	public function test_constructor_stores_suggestions_and_recent_content() {
		$suggestions    = new Content_Suggestion_List();
		$recent_content = new Post_List();

		$instance = new Content_Suggestion_Response(
			$suggestions,
			$recent_content,
		);

		$this->assertSame( $suggestions, $instance->get_suggestions() );
		$this->assertSame( $recent_content, $instance->get_recent_content() );
	}
}
