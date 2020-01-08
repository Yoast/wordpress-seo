<?php

namespace Yoast\WP\SEO\Tests\Presentations\Indexable_Search_Result_Page_Presentation;

use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Twitter_Title_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Search_Result_Page_Presentation
 *
 * @group presentations
 * @group twitter
 *
 * @package Yoast\Tests\Presentations\Indexable_Search_Result_Page_Presentation
 */
class Twitter_Title_Test extends TestCase {
	use Presentation_Instance_Builder;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$this->set_instance();
	}

	/**
	 * Tests whether the Twitter title is returned when it is set.
	 *
	 * @covers ::generate_twitter_title
	 */
	public function test_twitter_title() {
		$this->indexable->title = 'Twitter title';

		$this->assertEquals( 'Twitter title', $this->instance->generate_twitter_title() );
	}
}
