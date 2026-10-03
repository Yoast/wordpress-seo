<?php

namespace Yoast\WP\SEO\Tests\Unit\Presentations\Indexable_Post_Type_Presentation;

use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Open_Graph_Article_Modified_Time_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Post_Type_Presentation
 *
 * @group presentations
 * @group open-graph
 */
final class Open_Graph_Article_Modified_Time_Test extends TestCase {

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
	 * Tests that no modified time is returned if it is the same as the published time
	 *
	 * @covers ::generate_open_graph_article_modified_time
	 *
	 * @return void
	 */
	public function test_generate_open_graph_article_modified_time_same_as_published_time() {
		$source = (object) [
			'post_date_gmt'     => '2019-10-08T12:26:31+00:00',
			'post_modified_gmt' => '2019-10-08T12:26:31+00:00',
		];
		$this->instance->expects( 'generate_source' )->once()->andReturn( $source );

		$actual = $this->instance->generate_open_graph_article_modified_time();
		$this->assertEmpty( $actual );
	}

	/**
	 * Tests that the modified time is returned if it differs from the published time.
	 *
	 * @covers ::generate_open_graph_article_modified_time
	 *
	 * @return void
	 */
	public function test_generate_open_graph_article_modified_time_differs_from_published_time() {
		$source = (object) [
			'post_date_gmt'     => '2019-10-08T12:26:31+00:00',
			'post_modified_gmt' => '2019-11-09T12:34:56+00:00',
		];

		$this->instance->expects( 'generate_source' )->once()->andReturn( $source );

		$this->date
			->expects( 'format' )
			->with( '2019-11-09T12:34:56+00:00' )
			->once()
			->andReturn( '2019-11-09T12:34:56+00:00' );

		$actual   = $this->instance->generate_open_graph_article_modified_time();
		$expected = '2019-11-09T12:34:56+00:00';
		$this->assertEquals( $expected, $actual );
	}
}
