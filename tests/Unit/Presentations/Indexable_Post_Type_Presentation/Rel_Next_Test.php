<?php

namespace Yoast\WP\SEO\Tests\Unit\Presentations\Indexable_Post_Type_Presentation;

use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Rel_Next_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Post_Type_Presentation
 *
 * @group presentations
 * @group adjacent
 */
final class Rel_Next_Test extends TestCase {

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
	 * Tests whether an empty string is returned when a post is not paginated.
	 *
	 * @covers ::generate_rel_next
	 *
	 * @return void
	 */
	public function test_not_paginated() {
		$this->indexable->number_of_pages = null;

		$this->assertEmpty( $this->instance->generate_rel_next() );
	}

	/**
	 * Tests whether an empty string is returned when rel and prev links are disabled.
	 *
	 * @covers ::generate_rel_next
	 *
	 * @return void
	 */
	public function test_disabled_by_filter() {
		$this->indexable->number_of_pages = 2;

		$this->pagination
			->expects( 'is_rel_adjacent_disabled' )
			->once()
			->andReturnTrue();

		$this->assertEmpty( $this->instance->generate_rel_next() );
	}

	/**
	 * Tests whether an empty string is returned when there is no next page.
	 *
	 * @covers ::generate_rel_next
	 *
	 * @return void
	 */
	public function test_no_next_page() {
		$this->indexable->number_of_pages = 2;

		$this->pagination
			->expects( 'is_rel_adjacent_disabled' )
			->once()
			->andReturnFalse();

		$this->pagination
			->expects( 'get_current_post_page_number' )
			->once()
			->andReturn( 2 );

		$this->assertEmpty( $this->instance->generate_rel_next() );
	}

	/**
	 * Tests whether the correct url is returned for the next page.
	 *
	 * @covers ::generate_rel_next
	 *
	 * @return void
	 */
	public function test_next_url() {
		$this->indexable->object_id       = 1337;
		$this->indexable->number_of_pages = 2;
		$this->indexable->permalink       = 'https://example.com/my-post';

		$this->pagination
			->expects( 'is_rel_adjacent_disabled' )
			->once()
			->andReturnFalse();

		$this->pagination
			->expects( 'get_current_post_page_number' )
			->once()
			->andReturn( 1 );

		$this->pagination
			->expects( 'get_paginated_url' )
			->with( 'https://example.com/my-post', 2, false )
			->once()
			->andReturn( 'https://example.com/my-post/2/' );

		$expected = 'https://example.com/my-post/2/';
		$actual   = $this->instance->generate_rel_next();

		$this->assertEquals( $expected, $actual );
	}
}
