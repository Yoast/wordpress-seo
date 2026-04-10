<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Content_Planner\Domain\Section_List;

use Yoast\WP\SEO\AI\Content_Planner\Domain\Section;

/**
 * Tests the Section_List's to_array method.
 *
 * @group ai-content-planner
 *
 * @covers \Yoast\WP\SEO\AI\Content_Planner\Domain\Section_List::to_array
 */
final class To_Array_Test extends Abstract_Section_List {

	/**
	 * Tests the to_array method returns an empty outline when no sections are added.
	 *
	 * @return void
	 */
	public function test_to_array_empty() {
		$this->assertSame( [ 'outline' => [] ], $this->instance->to_array() );
	}

	/**
	 * Tests the to_array method returns the correct array when sections are added.
	 *
	 * @return void
	 */
	public function test_to_array_with_sections() {
		$this->instance->add(
			new Section(
				'Understanding Your Child\'s Needs',
				[
					'Assess your child\'s developmental stage.',
					'Consider any specific requirements.',
				],
			),
		);
		$this->instance->add(
			new Section(
				'Choosing the Right Approach',
				[
					'Evaluate available options.',
				],
			),
		);

		$expected = [
			'outline' => [
				[
					'subheading_text' => 'Understanding Your Child\'s Needs',
					'content_notes'   => [
						'Assess your child\'s developmental stage.',
						'Consider any specific requirements.',
					],
				],
				[
					'subheading_text' => 'Choosing the Right Approach',
					'content_notes'   => [
						'Evaluate available options.',
					],
				],
			],
		];

		$this->assertSame( $expected, $this->instance->to_array() );
	}
}
