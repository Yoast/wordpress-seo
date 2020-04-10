<?php

namespace Yoast\WP\SEO\Tests\Presenters\Twitter;

use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Presenters\Twitter\Creator_Presenter;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Creator_Presenter_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presenters\Twitter\Creator_Presenter
 *
 * @group presenters
 * @group twitter
 * @group twitter-creator
 */
class Creator_Presenter_Test extends TestCase {

	/**
	 * @var Creator_Presenter
	 */
	protected $instance;

	/**
	 * Setup of the tests.
	 */
	public function setUp() {
		parent::setUp();

		$this->instance = new Creator_Presenter();
	}

	/**
	 * Tests the presentation for a set twitter creator.
	 *
	 * @covers ::present
	 */
	public function test_present() {
		$this->instance->presentation  = new Indexable_Presentation();
		$presentation                  = $this->instance->presentation;
		$presentation->twitter_creator = '@TwitterHandle';

		$this->assertEquals(
			'<meta name="twitter:creator" content="@TwitterHandle" />',
			$this->instance->present()
		);
	}

	/**
	 * Tests the presentation of an empty creator.
	 *
	 * @covers ::present
	 */
	public function test_present_with_empty_twitter_creator() {
		$this->instance->presentation  = new Indexable_Presentation();
		$presentation                  = $this->instance->presentation;
		$presentation->twitter_creator = '';

		$this->assertEmpty( $this->instance->present() );
	}
}
