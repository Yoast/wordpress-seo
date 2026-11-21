<?php

namespace Yoast\WP\SEO\Tests\Unit\Presentations\Indexable_Error_Page_Presentation;

use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Title_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Error_Page_Presentation
 *
 * @group presentations
 * @group title
 */
final class Title_Test extends TestCase {

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
	 * Tests whether the title is returned when it is set.
	 *
	 * @covers ::generate_title
	 *
	 * @return void
	 */
	public function test_title() {
		$this->indexable->title = 'Error page title';

		$this->assertEquals( 'Error page title', $this->instance->generate_title() );
	}

	/**
	 * Tests whether the default title is returned when no title is set.
	 *
	 * @covers ::generate_title
	 *
	 * @return void
	 */
	public function test_title_without_set_title() {
		$this->options
			->expects( 'get_title_default' )
			->once()
			->with( 'title-404-wpseo' )
			->andReturn( 'Default error page title' );

		$this->assertEquals( 'Default error page title', $this->instance->generate_title() );
	}
}
