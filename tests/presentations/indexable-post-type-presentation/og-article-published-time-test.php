<?php

namespace Yoast\WP\SEO\Tests\Presentations\Indexable_Post_Type_Presentation;

use Yoast\WP\SEO\Tests\TestCase;
use Brain\Monkey;

/**
 * Class OG_Article_Published_Time_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Post_Type_Presentation
 *
 * @group presentations
 * @group opengraph
 */
class OG_Article_Published_Time_Test extends TestCase {
	use Presentation_Instance_Builder;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$this->set_instance();
	}

	/**
	 * Tests that the published time is returned for a post.
	 *
	 * @covers ::generate_og_article_published_time
	 */
	public function test_generate_og_article_published_time_post() {
		$this->indexable->object_sub_type = 'post';
		$this->context->post = (object) [ 'post_date_gmt' => '2019-10-08T12:26:31+00:00' ];

		$this->date_helper
			->expects( 'format' )
			->with( '2019-10-08T12:26:31+00:00' )
			->once()
			->andReturn( '2019-10-08T12:26:31+00:00' );

		$actual = $this->instance->generate_og_article_published_time();
		$expected = '2019-10-08T12:26:31+00:00';

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests that no published time is returned for a page.
	 *
	 * @covers ::generate_og_article_published_time
	 */
	public function test_generate_og_article_published_time_page() {
		$this->indexable->object_sub_type = 'page';

		$this->post_type_helper
			->expects( 'get_post_type' )
			->once()
			->andReturn( 'page' );

		$actual = $this->instance->generate_og_article_published_time();
		$this->assertEmpty( $actual );
	}

	/**
	 * Tests that a published time is returned for a page when the publish date is enabled with the wpseo_opengraph_show_publish_date filter.
	 *
	 * @covers ::generate_og_article_published_time
	 */
	public function test_generate_og_article_published_time_page_enabled() {
		$this->context->post = (object) [ 'post_date_gmt' => '2019-10-08T12:26:31+00:00' ];
		$this->indexable->object_sub_type = 'page';

		$this->date_helper
			->expects( 'format' )
			->with( '2019-10-08T12:26:31+00:00' )
			->once()
			->andReturn( '2019-10-08T12:26:31+00:00' );

		$this->post_type_helper
			->expects( 'get_post_type' )
			->once()
			->andReturn( 'page' );

		Monkey\Filters\expectApplied( 'wpseo_opengraph_show_publish_date' )
			->once()
			->andReturn( true );


		$actual = $this->instance->generate_og_article_published_time();
		$expected = '2019-10-08T12:26:31+00:00';
		$this->assertEquals( $expected, $actual );
	}
}
