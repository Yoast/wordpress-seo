<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Content_Planner\Domain\Section_List;

use Yoast\WP\SEO\AI\Content_Planner\Domain\Section;

/**
 * Tests the Section_List's add method.
 *
 * @group ai-content-planner
 *
 * @covers \Yoast\WP\SEO\AI\Content_Planner\Domain\Section_List::add
 */
final class Add_Test extends Abstract_Section_List {

	/**
	 * Tests the add method.
	 *
	 * @return void
	 */
	public function test_add() {
		$section = new Section(
			[
				'Assess your child\'s developmental stage.',
				'Consider any specific requirements.',
			],
			'Understanding Your Child\'s Needs',
		);

		$this->instance->add( $section );

		$sections = $this->getPropertyValue( $this->instance, 'sections' );

		$this->assertArrayHasKey( 0, $sections );
		$this->assertInstanceOf( Section::class, $sections[0] );
	}
}
