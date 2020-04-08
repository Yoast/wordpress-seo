<?php

namespace Yoast\WP\SEO\Tests\Presenters\Twitter;

use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Presenters\Twitter\Site_Presenter;
use Yoast\WP\SEO\Tests\TestCase;
use Brain\Monkey;

/**
 * Class Creator_Presenter_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presenters\Twitter\Site_Presenter
 *
 * @group presenters
 * @group twitter
 * @group twitter-site
 */
class Site_Presenter_Test extends TestCase {

	/**
	 * @var Site_Presenter
	 */
	protected $instance;

	/**
	 * Setup of the tests.
	 */
	public function setUp() {
		$this->instance = new Site_Presenter();

		return parent::setUp();
	}

	/**
	 * Tests the presentation for a set twitter creator.
	 *
	 * @covers ::present
	 * @covers ::filter
	 */
	public function test_present() {
		$this->instance->presentation = new Indexable_Presentation();
		$presentation                 = $this->instance->presentation;
		$presentation->twitter_site   = '@TwitterHandle';

		$this->assertEquals(
			'<meta name="twitter:site" content="@TwitterHandle" />',
			$this->instance->present()
		);
	}

	/**
	 * Tests the presentation of an empty creator.
	 *
	 * @covers ::present
	 */
	public function test_present_with_empty_twitter_site() {
		$this->instance->presentation = new Indexable_Presentation();
		$presentation                 = $this->instance->presentation;
		$presentation->twitter_site   = '';

		$this->assertEmpty( $this->instance->present() );
	}

	/**
	 * Tests the presentation for a set twitter creator.
	 *
	 * @covers ::present
	 * @covers ::filter
	 */
	public function test_present_with_filter() {
		$this->instance->presentation = new Indexable_Presentation();
		$presentation                 = $this->instance->presentation;
		$presentation->twitter_site   = '@TwitterHandle';

		Monkey\Filters\expectApplied( 'wpseo_twitter_site' )
			->once()
			->with( '@TwitterHandle', $presentation )
			->andReturn( '@AlteredTwitterHandle' );

		$this->assertEquals(
			'<meta name="twitter:site" content="@AlteredTwitterHandle" />',
			$this->instance->present()
		);
	}

	/**
	 * Tests the presentation for a set twitter creator.
	 *
	 * @covers ::present
	 * @covers ::get_twitter_id
	 */
	public function test_present_with_get_twitter_id_fixing_url_as_input() {
		$this->instance->presentation = new Indexable_Presentation();
		$presentation                 = $this->instance->presentation;
		$presentation->twitter_site   = 'http://twitter.com/TwitterHandle';

		$this->assertEquals(
			'<meta name="twitter:site" content="@TwitterHandle" />',
			$this->instance->present()
		);
	}

	/**
	 * Tests the presentation for a set twitter creator.
	 *
	 * @covers ::present
	 * @covers ::get_twitter_id
	 */
	public function test_present_with_get_twitter_id() {
		$this->instance->presentation = new Indexable_Presentation();
		$presentation                 = $this->instance->presentation;
		$presentation->twitter_site   = 'http://twitter.com/';

		$this->assertEmpty( $this->instance->present() );
	}
}
