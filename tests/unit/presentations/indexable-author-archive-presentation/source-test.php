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
class Source_Test extends TestCase {
	use Presentation_Instance_Builder;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$this->set_instance();
	}

	/**
	 * Tests the generation of the source.
	 *
	 * @covers ::generate_source
	 */
	public function test_generate_source() {
		$this->indexable->object_id = 1;

		$this->assertEquals( [ 'post_author' => 1 ], $this->instance->generate_source() );
	}
}
