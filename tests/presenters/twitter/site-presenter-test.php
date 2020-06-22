<?php

namespace Yoast\WP\SEO\Tests\Presenters\Twitter;

use Brain\Monkey;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Presenters\Twitter\Site_Presenter;
use Yoast\WP\SEO\Tests\TestCase;

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
	 * Represents the site presenter.
	 *
	 * @var Site_Presenter
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
	public function setUp() {
		parent::setUp();

		$this->presentation = new Indexable_Presentation();
		$this->instance     = new Site_Presenter();

		$this->instance->presentation = $this->presentation;
	}

	/**
	 * Tests the presentation for a set twitter creator.
	 *
	 * @covers ::present
	 * @covers ::get
	 */
	public function test_present() {
		$this->presentation->twitter_site = '@TwitterHandle';

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
		$this->presentation->twitter_site = '';

		$this->assertEmpty( $this->instance->present() );
	}

	/**
	 * Tests the presentation for a set twitter creator.
	 *
	 * @covers ::present
	 * @covers ::get
	 */
	public function test_present_with_filter() {
		$this->presentation->twitter_site = '@TwitterHandle';

		Monkey\Filters\expectApplied( 'wpseo_twitter_site' )
			->once()
			->with( '@TwitterHandle', $this->presentation )
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
		$this->presentation->twitter_site = 'http://twitter.com/TwitterHandle';

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
		$this->presentation->twitter_site = 'http://twitter.com/';

		$this->assertEmpty( $this->instance->present() );
	}

	/**
	 * Tests the retrieval of the raw twitter site.
	 *
	 * @covers ::get
	 * @covers ::get_twitter_id
	 */
	public function test_get() {
		$this->presentation->twitter_site = 'https://twitter.com/TwitterHandle';

		Monkey\Filters\expectApplied( 'wpseo_twitter_site' )
			->once()
			->with( 'https://twitter.com/TwitterHandle', $this->presentation )
			->andReturn( 'https://twitter.com/TwitterHandle' );

		$this->assertSame( '@TwitterHandle', $this->instance->get() );
	}

	/**
	 * Tests the retrieval of the raw twitter site.
	 *
	 * @covers ::get
	 * @covers ::get_twitter_id
	 */
	public function test_get_with_no_handle_returned() {
		$this->presentation->twitter_site = '';

		Monkey\Filters\expectApplied( 'wpseo_twitter_site' )
			->once()
			->with( '', $this->presentation )
			->andReturn( '' );

		$this->assertSame( '', $this->instance->get() );
	}
}
