<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Content_Planner\Application\Content_Outline_Command_Handler;

use Yoast\WP\SEO\AI\Content_Planner\Domain\Section_List;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Response;

/**
 * Tests the Content_Outline_Command_Handler build_outline method.
 *
 * @group ai-content-planner
 *
 * @covers \Yoast\WP\SEO\AI\Content_Planner\Application\Content_Outline_Command_Handler::build_outline
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Build_Outline_Test extends Abstract_Content_Outline_Command_Handler_Test {

	/**
	 * Tests build_outline returns a populated Section_List when the response contains choices.
	 *
	 * @return void
	 */
	public function test_build_outline_with_populated_choices() {
		$body     = '{"choices":[{"subheading_text":"Section A","content_notes":["note 1","note 2"]},{"subheading_text":"Section B","content_notes":["note 3"]}]}';
		$response = new Response( $body, 200, '' );

		$result = $this->instance->build_outline( $response );

		$this->assertInstanceOf( Section_List::class, $result );
		$this->assertSame(
			[
				'outline' => [
					[
						'subheading_text' => 'Section A',
						'content_notes'   => [ 'note 1', 'note 2' ],
					],
					[
						'subheading_text' => 'Section B',
						'content_notes'   => [ 'note 3' ],
					],
				],
			],
			$result->to_array(),
		);
	}

	/**
	 * Tests build_outline returns an empty Section_List when the response body is invalid JSON.
	 *
	 * @return void
	 */
	public function test_build_outline_with_invalid_json() {
		$response = new Response( 'not json', 200, '' );

		$result = $this->instance->build_outline( $response );

		$this->assertInstanceOf( Section_List::class, $result );
		$this->assertSame( [ 'outline' => [] ], $result->to_array() );
	}

	/**
	 * Tests build_outline returns an empty Section_List when the response JSON has no choices key.
	 *
	 * @return void
	 */
	public function test_build_outline_with_missing_choices_key() {
		$response = new Response( '{"something_else":[]}', 200, '' );

		$result = $this->instance->build_outline( $response );

		$this->assertInstanceOf( Section_List::class, $result );
		$this->assertSame( [ 'outline' => [] ], $result->to_array() );
	}

	/**
	 * Tests build_outline falls back to null/empty array when a choice is missing fields.
	 *
	 * @return void
	 */
	public function test_build_outline_with_partial_choice_fields() {
		$body     = '{"choices":[{"subheading_text":"Only heading"},{"content_notes":["only notes"]}]}';
		$response = new Response( $body, 200, '' );

		$result = $this->instance->build_outline( $response );

		$this->assertSame(
			[
				'outline' => [
					[
						'subheading_text' => 'Only heading',
						'content_notes'   => [],
					],
					[
						'subheading_text' => null,
						'content_notes'   => [ 'only notes' ],
					],
				],
			],
			$result->to_array(),
		);
	}
}
