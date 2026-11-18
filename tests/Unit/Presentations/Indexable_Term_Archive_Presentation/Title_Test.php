<?php

namespace Yoast\WP\SEO\Tests\Unit\Presentations\Indexable_Term_Archive_Presentation;

use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Title_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Term_Archive_Presentation
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
	 * Tests the situation where the SEO title is not set for the specific category,
	 * but the SEO title for categories in general is set.
	 *
	 * @covers ::generate_title
	 *
	 * @return void
	 */
	public function test_with_general_category_seo_title() {
		$this->instance
			->expects( 'generate_source' )
			->once()
			->andReturn( (object) [ 'taxonomy' => 'category' ] );

		$this->options
			->expects( 'get' )
			->once()
			->with( 'title-tax-category' )
			->andReturn( 'This is the SEO title for categories in general' );

		$this->assertEquals( 'This is the SEO title for categories in general', $this->instance->generate_title() );
	}

	/**
	 * Tests the situation where the title is not set for the specific category,
	 * and neither the SEO title for categories in general is set,
	 * therefore we fall back to the default options title.
	 *
	 * @covers ::generate_title
	 *
	 * @return void
	 */
	public function test_with_default_fallback() {
		$this->instance
			->expects( 'generate_source' )
			->once()
			->andReturn( (object) [ 'taxonomy' => 'category' ] );

		$this->options
			->expects( 'get' )
			->once()
			->with( 'title-tax-category' )
			->andReturn( '' );

		$this->options
			->expects( 'get_title_default' )
			->once()
			->with( 'title-tax-category' )
			->andReturn( 'This is the default options title' );

		$this->assertEquals( 'This is the default options title', $this->instance->generate_title() );
	}
}
