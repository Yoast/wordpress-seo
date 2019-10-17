<?php

namespace Yoast\WP\Free\Tests\Presenters\Twitter;

use Yoast\WP\Free\Presentations\Indexable_Presentation;
use Yoast\WP\Free\Presenters\Twitter\Creator_Presenter;
use Yoast\WP\Free\Tests\TestCase;

/**
 * Class Creator_Presenter_Test.
 *
 * @coversDefaultClass \Yoast\WP\Free\Presenters\Twitter\Creator_Presenter
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
		$presentation = new Indexable_Presentation();
		$presentation->twitter_creator = '@TwitterHandle';

		$this->assertEquals(
			'<meta name="twitter:creator" content="@TwitterHandle" />',
			$this->instance->present( $presentation )
		);
	}

	/**
	 * Tests the presentation of an empty creator.
	 *
	 * @covers ::present
	 */
	public function test_present_with_empty_twitter_creator() {
		$presentation = new Indexable_Presentation();
		$presentation->twitter_creator = '';

		$this->assertEmpty( $this->instance->present( $presentation ) );
	}

}
