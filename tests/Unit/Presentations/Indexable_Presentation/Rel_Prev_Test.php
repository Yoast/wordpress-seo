<?php

namespace Yoast\WP\SEO\Tests\Unit\Presentations\Indexable_Presentation;

use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Rel_Next_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Presentation
 *
 * @group presentations
 */
final class Rel_Prev_Test extends TestCase {

	use Presentation_Instance_Builder;

	/**
	 * Sets up the test class.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->set_instance();
	}

	/**
	 * Tests whether an empty string is returned.
	 *
	 * @covers ::generate_rel_prev
	 *
	 * @return void
	 */
	public function test_generate_rel_prev_and_return_empty() {
		$this->assertEmpty( $this->instance->generate_rel_prev() );
	}
}
