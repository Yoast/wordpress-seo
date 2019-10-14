<?php

namespace Yoast\WP\Free\Tests\Presentations\Indexable_Date_Archive_Presentation;

use Yoast\WP\Free\Tests\TestCase;

/**
 * Class Twitter_Title_Test.
 *
 * @coversDefaultClass \Yoast\WP\Free\Presentations\Indexable_Date_Archive_Presentation
 *
 * @group presentations
 * @group twitter
 *
 * @package Yoast\Tests\Presentations\Indexable_Date_Archive_Presentation
 */
class Twitter_Title_Test extends TestCase {
	use Presentation_Instance_Builder;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$this->setInstance();
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
