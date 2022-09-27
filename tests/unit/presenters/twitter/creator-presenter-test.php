<?php

namespace Yoast\WP\SEO\Tests\Unit\Presenters\Twitter;

use Brain\Monkey;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Presenters\Twitter\Creator_Presenter;
use Yoast\WP\SEO\Tests\Unit\TestCase;

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
	 * Represents the instance to test.
	 *
	 * @var Creator_Presenter
	 */
	protected $instance;

	/**
	 * Represents the presentation.
	 *
	 * @var Indexable_Presentation
	 */
	protected $presentation;

	/**
	 * Setup of the tests.
	 */
	protected function set_up() {
		parent::set_up();

		$this->presentation = new Indexable_Presentation();
		$this->instance     = new Creator_Presenter();

		$this->instance->presentation = $this->presentation;
	}

	/**
	 * Tests the presentation for a set twitter creator.
	 *
	 * @covers ::present
	 */
	public function test_present() {
		$this->stubEscapeFunctions();

		$this->presentation->twitter_creator = '@TwitterHandle';

		Monkey\Functions\expect( 'is_admin_bar_showing' )->andReturn( false );

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
		$this->presentation->twitter_creator = '';

		$this->assertEmpty( $this->instance->present() );
	}

	/**
	 * Tests the retrieval of the raw value.
	 *
	 * @covers ::get
	 */
	public function test_get() {
		$this->presentation->twitter_creator = '@TwitterHandle';

		$this->assertSame( '@TwitterHandle', $this->instance->get() );
	}

	/**
	 * Tests the presentation for a set twitter creator when the admin bar is showing a class is added.
	 *
	 * @covers ::present
	 */
	public function test_present_with_class() {
		$this->stubEscapeFunctions();

		$this->presentation->twitter_creator = '@TwitterHandle';

		Monkey\Functions\expect( 'is_admin_bar_showing' )->andReturn( true );

		$this->assertEquals(
			'<meta name="twitter:creator" content="@TwitterHandle" class="yoast-seo-meta-tag" />',
			$this->instance->present()
		);
	}
}
