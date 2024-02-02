<?php

namespace Yoast\WP\SEO\Tests\Unit\Presentations\Indexable_Author_Archive_Presentation;

use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Source_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Author_Archive_Presentation
 *
 * @group presentations
 */
final class Source_Test extends TestCase {

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
	 * Tests the generation of the source.
	 *
	 * @covers ::generate_source
	 *
	 * @return void
	 */
	public function test_generate_source() {
		$this->indexable->object_id = 1;

		$this->assertEquals( [ 'post_author' => 1 ], $this->instance->generate_source() );
	}
}
