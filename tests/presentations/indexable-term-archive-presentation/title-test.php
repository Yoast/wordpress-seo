<?php

namespace Yoast\WP\Free\Tests\Presentations\Indexable_Term_Archive_Presentation;

use Yoast\WP\Free\Tests\TestCase;

/**
 * Class Title_Test
 *
 * @coversDefaultClass \Yoast\WP\Free\Presentations\Indexable_Term_Archive_Presentation
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
		$this->set_instance();

		parent::setUp();
	}

	/**
	 * Tests the situation where the title is set.
	 *
	 * @covers ::generate_title
	 */
	public function test_with_title() {
		$this->indexable->title = 'Title';

		$this->assertEquals( 'Title', $this->instance->generate_title() );
	}

	/**
	 * Tests the situation where the title is not set and we fall back to the options title.
	 *
	 * @covers ::generate_title
	 */
	public function test_with_default_fallback() {
		$this->instance
			->expects( 'generate_replace_vars_object' )
			->once()
			->andReturn( (object) [
				'taxonomy' => 'category',
			] );

		$this->options_helper
			->expects( 'get_title_default' )
			->once()
			->with( 'title-tax-category' )
			->andReturn( 'This is the title' );

		$this->assertEquals( 'This is the title', $this->instance->generate_title() );
	}

}
