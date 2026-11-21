<?php

namespace Yoast\WP\SEO\Tests\Unit\Presentations\Indexable_Author_Archive_Presentation;

use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Title_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Author_Archive_Presentation
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
		$this->indexable->title = 'Title';

		$this->assertEquals( 'Title', $this->instance->generate_title() );
	}

	/**
	 * Tests whether the options title is returned when there is no indexable title.
	 *
	 * @covers ::generate_title
	 *
	 * @return void
	 */
	public function test_title_without_indexable() {
		$this->options
			->expects( 'get' )
			->once()
			->with( 'title-author-wpseo' )
			->andReturn( 'Options title' );

		$this->assertEquals( 'Options title', $this->instance->generate_title() );
	}

	/**
	 * Tests whether the default title is returned when there is no options title.
	 *
	 * @covers ::generate_title
	 *
	 * @return void
	 */
	public function test_title_without_options_title() {
		$this->options
			->expects( 'get' )
			->once()
			->with( 'title-author-wpseo' )
			->andReturn( '' );

		$this->options
			->expects( 'get_title_default' )
			->once()
			->with( 'title-author-wpseo' )
			->andReturn( 'Default title' );

		$this->assertEquals( 'Default title', $this->instance->generate_title() );
	}
}
