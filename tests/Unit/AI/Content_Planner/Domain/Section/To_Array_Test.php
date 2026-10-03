<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Content_Planner\Domain\Section;

use Yoast\WP\SEO\AI\Content_Planner\Domain\Section;

/**
 * Tests the Section's to_array method.
 *
 * @group ai-content-planner
 *
 * @covers \Yoast\WP\SEO\AI\Content_Planner\Domain\Section::to_array
 */
final class To_Array_Test extends Abstract_Section {

	/**
	 * Tests the to_array method.
	 *
	 * @return void
	 */
	public function test_to_array() {
		$expected = [
			'subheading_text' => 'Understanding Your Child\'s Needs',
			'content_notes'   => [
				'Assess your child\'s developmental stage.',
				'Consider any specific requirements.',
			],
		];

		$this->assertSame( $expected, $this->instance->to_array() );
	}

	/**
	 * Tests the to_array method with a null subheading text.
	 *
	 * @return void
	 */
	public function test_to_array_with_null_subheading_text() {
		$instance = new Section( [], null );

		$expected = [
			'subheading_text' => null,
			'content_notes'   => [],
		];

		$this->assertSame( $expected, $instance->to_array() );
	}
}
