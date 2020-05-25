<?php

namespace Yoast\WP\SEO\Tests\Presenters\Twitter;

use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Presenters\Twitter\Card_Presenter;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Card_Presenter_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presenters\Twitter\Card_Presenter
 *
 * @group presenters
 * @group twitter
 * @group twitter-card
 */
class Card_Presenter_Test extends TestCase {

	/**
	 * @var Card_Presenter
	 */
	protected $instance;

	/**
	 * Setup of the tests.
	 */
	public function setUp() {
		parent::setUp();

		$this->instance = new Card_Presenter();
	}

	/**
	 * Tests the presentation for a set twitter creator.
	 *
	 * @covers ::present
	 * @covers ::get
	 */
	public function test_present() {
		$this->instance->presentation = new Indexable_Presentation();
		$presentation                 = $this->instance->presentation;
		$presentation->twitter_card   = 'summary';

		$this->assertEquals(
			'<meta name="twitter:card" content="summary" />',
			$this->instance->present()
		);
	}

	/**
	 * Tests the presentation of an empty creator.
	 *
	 * @covers ::present
	 * @covers ::get
	 */
	public function test_present_with_empty_twitter_creator() {
		$this->instance->presentation = new Indexable_Presentation();
		$presentation                 = $this->instance->presentation;
		$presentation->twitter_card   = '';

		$this->assertEmpty( $this->instance->present() );
	}
}
