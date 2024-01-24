<?php

namespace Yoast\WP\SEO\Tests\Unit\Presentations\Indexable_Post_Type_Archive_Presentation;

use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Title_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Post_Type_Archive_Presentation
 *
 * @group presentations
 * @group title
 */
final class Title_Test extends TestCase {

	use Presentation_Instance_Builder;

	/**
	 * Does the setup for testing.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->set_instance();
	}

	/**
	 * Tests the situation where the title is set.
	 *
	 * @covers ::generate_title
	 *
	 * @return void
	 */
	public function test_with_title() {
		$this->indexable->title = 'Title';

		$this->assertEquals( 'Title', $this->instance->generate_title() );
	}

	/**
	 * Tests the situation where the title is not set and we fall back to the options title.
	 *
	 * @covers ::generate_title
	 *
	 * @return void
	 */
	public function test_with_default_fallback() {
		$this->indexable->object_sub_type = 'posttype';

		$this->options
			->expects( 'get_title_default' )
			->once()
			->with( 'title-ptarchive-posttype' )
			->andReturn( 'This is the title' );

		$this->assertEquals( 'This is the title', $this->instance->generate_title() );
	}
}
