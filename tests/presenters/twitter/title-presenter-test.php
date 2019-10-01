<?php
/**
 * WPSEO plugin test file.
 *
 * @package Yoast\YoastSEO\Tests\Twitter\Presenters
 */

namespace Yoast\WP\Free\Tests\Twitter\Presenters;

use Brain\Monkey;
use Yoast\WP\Free\Presentations\Indexable_Presentation;
use Yoast\WP\Free\Presenters\Twitter\Title_Presenter;
use Yoast\WP\Free\Tests\TestCase;

/**
 * Class Title_Presenter_Test
 *
 * @coversDefaultClass \Yoast\WP\Free\Presenters\Twitter\Title_Presenter
 *
 * @group twitter-title
 */
class Title_Presenter_Test extends TestCase {
	/**
	 * @var Indexable_Presentation
	 */
	protected $indexable_presentation;

	/**
	 * @var Title_Presenter
	 */
	protected $instance;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		$this->instance = new Title_Presenter();
		$this->indexable_presentation = new Indexable_Presentation();

		return parent::setUp();
	}

	/**
	 * Tests whether the presenter returns the correct Twitter title.
	 *
	 * @covers ::present
	 */
	public function test_present() {
		$this->indexable_presentation->twitter_title = 'twitter_example_title';

		$expected = '<meta name="twitter:title" content="twitter_example_title" />';
		$actual = $this->instance->present( $this->indexable_presentation );
		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests whether the presenter returns an empty string when the Twitter title is empty.
	 *
	 * @covers ::present
	 */
	public function test_present_twitter_title_is_empty() {
		$this->indexable_presentation->twitter_title = '';

		$actual = $this->instance->present( $this->indexable_presentation );
		$this->assertEmpty( $actual );
	}

	/**
	 * Tests whether the presenter returns the correct Twitter title, when the `wpseo_twitter_title` filter is applied.
	 *
	 * @covers ::present
	 * @covers ::filter
	 */
	public function test_present_filter() {
		$this->indexable_presentation->twitter_title = 'twitter_example_title';

		Monkey\Filters\expectApplied( 'wpseo_twitter_title' )
			->once()
			->with( 'twitter_example_title' )
			->andReturn( 'twitterexampletitle' );

		$expected = '<meta name="twitter:title" content="twitterexampletitle" />';
		$actual = $this->instance->present( $this->indexable_presentation );

		$this->assertEquals( $expected, $actual );
	}
}
