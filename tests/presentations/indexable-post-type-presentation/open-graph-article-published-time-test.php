<?php

namespace Yoast\WP\SEO\Tests\Presentations\Indexable_Post_Type_Presentation;

use Brain\Monkey;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Open_Graph_Article_Published_Time_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Post_Type_Presentation
 *
 * @group presentations
 * @group open-graph
 */
class Open_Graph_Article_Published_Time_Test extends TestCase {
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
	 * @covers ::generate_open_graph_article_published_time
	 */
	public function test_generate_open_graph_article_published_time_post() {
		$this->indexable->object_sub_type = 'post';

		$source = (object) [ 'post_date_gmt' => '2019-10-08T12:26:31+00:00' ];
		$this->instance->expects( 'generate_source' )->once()->andReturn( $source );

		$this->date
			->expects( 'format' )
			->with( '2019-10-08T12:26:31+00:00' )
			->once()
			->andReturn( '2019-10-08T12:26:31+00:00' );

		$actual   = $this->instance->generate_open_graph_article_published_time();
		$expected = '2019-10-08T12:26:31+00:00';

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests that no published time is returned for a page.
	 *
	 * @covers ::generate_open_graph_article_published_time
	 */
	public function test_generate_open_graph_article_published_time_page() {
		$this->indexable->object_sub_type = 'page';

		$this->instance->expects( 'generate_source' )->andReturn( (object) [] );

		$this->post
			->expects( 'get_post_type' )
			->once()
			->andReturn( 'page' );

		$actual = $this->instance->generate_open_graph_article_published_time();
		$this->assertEmpty( $actual );
	}

	/**
	 * Tests that a published time is returned for a page when the publish date is enabled with the wpseo_opengraph_show_publish_date filter.
	 *
	 * @covers ::generate_open_graph_article_published_time
	 */
	public function test_generate_open_graph_article_published_time_page_enabled() {
		$this->indexable->object_sub_type = 'page';

		$source = (object) [ 'post_date_gmt' => '2019-10-08T12:26:31+00:00' ];
		$this->instance->expects( 'generate_source' )->once()->andReturn( $source );

		$this->date
			->expects( 'format' )
			->with( '2019-10-08T12:26:31+00:00' )
			->once()
			->andReturn( '2019-10-08T12:26:31+00:00' );

		$this->post
			->expects( 'get_post_type' )
			->once()
			->andReturn( 'page' );

		Monkey\Filters\expectApplied( 'wpseo_opengraph_show_publish_date' )
			->once()
			->andReturn( true );


		$actual   = $this->instance->generate_open_graph_article_published_time();
		$expected = '2019-10-08T12:26:31+00:00';
		$this->assertEquals( $expected, $actual );
	}
}
