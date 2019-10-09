<?php

namespace Yoast\WP\Free\Tests\Presentations\Indexable_Post_Type_Presentation;

use Yoast\WP\Free\Tests\TestCase;

/**
 * Class Title_Test
 *
 * @coversDefaultClass \Yoast\WP\Free\Presentations\Indexable_Post_Type_Presentation
 *
 * @group presentations
 * @group title
 */
class Title_Test extends TestCase {
	use Presentation_Instance_Builder;

	/**
	 * Does the setup for testing.
	 */
	public function setUp() {
		$this->setInstance();

		parent::setUp();
	}

	/**
	 * Tests the situation where the title is given.
	 *
	 * @covers ::generate_title
	 */
	public function test_with_title() {
		$this->indexable->title = 'Title';

		$this->assertEquals( 'Title', $this->instance->generate_title() );
	}

	/**
	 * Tests the situation where the title is not set and we fall back to the template.
	 *
	 * @covers ::generate_title
	 */
	public function test_with_template_fallback() {
		$this->indexable->object_sub_type = 'post';

		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'title-post' )
			->andReturn( 'This is the title' );

		$this->assertEquals( 'This is the title', $this->instance->generate_title() );
	}

}
