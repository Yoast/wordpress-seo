<?php

namespace Yoast\WP\SEO\Tests\Unit\Presenters\Twitter;

use Brain\Monkey;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Presenters\Twitter\Card_Presenter;
use Yoast\WP\SEO\Tests\Unit\TestCase;

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
	 * Represents the instance to test.
	 *
	 * @var Card_Presenter
	 */
	protected $instance;

	/**
	 * Setup of the tests.
	 */
	protected function set_up() {
		parent::set_up();

		$this->stubEscapeFunctions();

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

		Monkey\Functions\expect( 'is_admin_bar_showing' )->andReturn( false );

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

	/**
	 * Tests the presentation for a set twitter creator when the admin bar is showing a class is added.
	 *
	 * @covers ::present
	 * @covers ::get
	 */
	public function test_present_with_class() {
		$this->instance->presentation = new Indexable_Presentation();
		$presentation                 = $this->instance->presentation;
		$presentation->twitter_card   = 'summary';

		Monkey\Functions\expect( 'is_admin_bar_showing' )->andReturn( true );

		$this->assertEquals(
			'<meta name="twitter:card" content="summary" class="yoast-seo-meta-tag" />',
			$this->instance->present()
		);
	}
}
