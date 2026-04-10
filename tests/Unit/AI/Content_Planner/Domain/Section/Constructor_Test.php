<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Content_Planner\Domain\Section;

use Yoast\WP\SEO\AI\Content_Planner\Domain\Section;

/**
 * Tests the Section constructor.
 *
 * @group ai-content-planner
 *
 * @covers \Yoast\WP\SEO\AI\Content_Planner\Domain\Section::__construct
 */
final class Constructor_Test extends Abstract_Section {

	/**
	 * Tests the constructor.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertSame(
			'Understanding Your Child\'s Needs',
			$this->getPropertyValue( $this->instance, 'subheading_text' ),
		);
		$this->assertSame(
			[
				'Assess your child\'s developmental stage.',
				'Consider any specific requirements.',
			],
			$this->getPropertyValue( $this->instance, 'content_notes' ),
		);
	}

	/**
	 * Tests the constructor with a null subheading text.
	 *
	 * @return void
	 */
	public function test_constructor_with_null_subheading_text() {
		$instance = new Section( null, [] );

		$this->assertNull( $this->getPropertyValue( $instance, 'subheading_text' ) );
		$this->assertSame( [], $this->getPropertyValue( $instance, 'content_notes' ) );
	}
}
