<?php

namespace Yoast\WP\SEO\Tests\Unit\Presentations\Indexable_Post_Type_Presentation;

use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Title_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Post_Type_Presentation
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
	 * Tests the situation where the specific post's SEO title is set.
	 *
	 * @covers ::generate_title
	 *
	 * @return void
	 */
	public function test_with_specific_post_seo_title() {
		$this->indexable->title = 'Specific post SEO title';

		$this->assertEquals( 'Specific post SEO title', $this->instance->generate_title() );
	}

	/**
	 * Tests the situation where the specific post's SEO title is not set,
	 * but the SEO title for posts in general is set.
	 *
	 * @covers ::generate_title
	 *
	 * @return void
	 */
	public function test_with_general_post_seo_title() {
		$this->indexable->object_sub_type = 'post';

		$this->options
			->expects( 'get' )
			->once()
			->with( 'title-post' )
			->andReturn( 'General post SEO title' );

		$this->assertEquals( 'General post SEO title', $this->instance->generate_title() );
	}

	/**
	 * Tests the situation where the specific post's SEO title is not set,
	 * and the SEO title for posts in general is not set,
	 * and therefore we fall back to the installation default title for posts.
	 *
	 * @covers ::generate_title
	 *
	 * @return void
	 */
	public function test_with_post_installation_default_title() {
		$this->indexable->object_sub_type = 'post';

		$this->options
			->expects( 'get' )
			->once()
			->with( 'title-post' )
			->andReturn( '' );

		$this->options
			->expects( 'get_title_default' )
			->once()
			->with( 'title-post' )
			->andReturn( 'Post installation default title' );

		$this->assertEquals( 'Post installation default title', $this->instance->generate_title() );
	}
}
