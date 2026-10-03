<?php

namespace Yoast\WP\SEO\Tests\Unit\Presentations\Indexable_Search_Result_Page_Presentation;

use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Twitter_Title_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Search_Result_Page_Presentation
 *
 * @group presentations
 * @group twitter
 */
final class Twitter_Title_Test extends TestCase {

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
	 * Tests whether the Twitter title is returned when it is set.
	 *
	 * @covers ::generate_twitter_title
	 *
	 * @return void
	 */
	public function test_twitter_title() {
		$this->indexable->title = 'Twitter title';

		$this->assertEquals( 'Twitter title', $this->instance->generate_twitter_title() );
	}
}
