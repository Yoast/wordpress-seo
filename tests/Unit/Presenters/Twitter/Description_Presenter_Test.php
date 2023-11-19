<?php

namespace Yoast\WP\SEO\Tests\Unit\Presenters\Twitter;

use Brain\Monkey;
use Mockery;
use WPSEO_Replace_Vars;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Presenters\Twitter\Description_Presenter;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Description_Presenter_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presenters\Twitter\Description_Presenter
 *
 * @group presenters
 * @group twitter
 * @group twitter-description
 */
class Description_Presenter_Test extends TestCase {

	/**
	 * The WPSEO Replace Vars object.
	 *
	 * @var WPSEO_Replace_Vars|Mockery\MockInterface
	 */
	protected $replace_vars;

	/**
	 * Represents the instance to test.
	 *
	 * @var Description_Presenter
	 */
	protected $instance;

	/**
	 * Setup of the tests.
	 */
	protected function set_up() {
		parent::set_up();

		$this->stubEscapeFunctions();

		$this->replace_vars = Mockery::mock( WPSEO_Replace_Vars::class );

		$this->instance               = new Description_Presenter();
		$this->instance->replace_vars = $this->replace_vars;
	}

	/**
	 * Tests the presenter for a set twitter description.
	 *
	 * @covers ::present
	 * @covers ::get
	 */
	public function test_present() {
		$this->instance->presentation      = new Indexable_Presentation();
		$presentation                      = $this->instance->presentation;
		$presentation->source              = [];
		$presentation->twitter_description = 'This is the twitter description';

		$this->replace_vars
			->expects( 'replace' )
			->andReturn( 'This is the twitter description' );
		Monkey\Functions\expect( 'is_admin_bar_showing' )->andReturn( false );

		$this->assertEquals(
			'<meta name="twitter:description" content="This is the twitter description" />',
			$this->instance->present()
		);
	}

	/**
	 * Tests the presenter of an empty description.
	 *
	 * @covers ::present
	 * @covers ::get
	 */
	public function test_present_with_empty_twitter_description() {
		$this->instance->presentation      = new Indexable_Presentation();
		$presentation                      = $this->instance->presentation;
		$presentation->source              = [];
		$presentation->twitter_description = '';

		$this->replace_vars
			->expects( 'replace' )
			->andReturn( '' );

		$this->assertEmpty( $this->instance->present() );
	}

	/**
	 * Tests the presenter for a set twitter description when the admin bar is showing a class is added.
	 *
	 * @covers ::present
	 * @covers ::get
	 */
	public function test_present_with_class() {
		$this->instance->presentation      = new Indexable_Presentation();
		$presentation                      = $this->instance->presentation;
		$presentation->source              = [];
		$presentation->twitter_description = 'This is the twitter description';

		$this->replace_vars
			->expects( 'replace' )
			->andReturn( 'This is the twitter description' );
		Monkey\Functions\expect( 'is_admin_bar_showing' )->andReturn( true );

		$this->assertEquals(
			'<meta name="twitter:description" content="This is the twitter description" class="yoast-seo-meta-tag" />',
			$this->instance->present()
		);
	}
}
