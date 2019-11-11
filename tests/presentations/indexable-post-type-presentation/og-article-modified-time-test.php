<?php

namespace Yoast\WP\Free\Tests\Presentations\Indexable_Post_Type_Presentation;

use Yoast\WP\Free\Tests\TestCase;

/**
 * Class OG_Article_Modified_Time_Test
 *
 * @coversDefaultClass \Yoast\WP\Free\Presentations\Indexable_Post_Type_Presentation
 *
 * @group presentations
 * @group opengraph
 */
class OG_Article_Modified_Time_Test extends TestCase {
	use Presentation_Instance_Builder;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$this->set_instance();
	}

	/**
	 * Tests that no modified time is returned if it is the same as the published time
	 *
	 * @covers ::generate_og_article_modified_time
	 */
	public function test_generate_og_article_modified_time_same_as_published_time() {
		$this->context->post = (object) [
			'post_date_gmt'     => '2019-10-08T12:26:31+00:00',
			'post_modified_gmt' => '2019-10-08T12:26:31+00:00',
		];
		$actual = $this->instance->generate_og_article_modified_time();
		$this->assertEmpty( $actual );
	}

	/**
	 * Tests that the modified time is returned if it differs from the published time.
	 *
	 * @covers ::generate_og_article_modified_time
	 */
	public function test_generate_og_article_modified_time_differs_from_published_time() {
		$this->context->post              = (object) [
			'post_date_gmt'     => '2019-10-08T12:26:31+00:00',
			'post_modified_gmt' => '2019-11-09T12:34:56+00:00',
		];

		$this->date_helper
			->expects( 'mysql_date_to_w3c_format' )
			->with( '2019-11-09T12:34:56+00:00' )
			->once()
			->andReturn( '2019-11-09T12:34:56+00:00' );

		$actual              = $this->instance->generate_og_article_modified_time();
		$expected            = '2019-11-09T12:34:56+00:00';
		$this->assertEquals( $expected, $actual );
	}

}
