<?php

namespace Yoast\WP\SEO\Tests\Unit\Presentations\Indexable_Home_Page_Presentation;

use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Title_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Home_Page_Presentation
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
		$this->indexable->title = 'Homepage title';

		$this->assertEquals( 'Homepage title', $this->instance->generate_title() );
	}

	/**
	 * Tests the situation where the title is not set and we fall back to the options title.
	 *
	 * @covers ::generate_title
	 *
	 * @return void
	 */
	public function test_with_default_fallback() {
		$this->options
			->expects( 'get_title_default' )
			->once()
			->with( 'title-home-wpseo' )
			->andReturn( 'The homepage title' );

		$this->assertEquals( 'The homepage title', $this->instance->generate_title() );
	}
}
