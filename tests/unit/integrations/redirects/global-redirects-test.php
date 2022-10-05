<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Redirects;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Helpers\Redirect_Helper;
use Yoast\WP\SEO\Helpers\Url_Helper;
use Yoast\WP\SEO\Integrations\Front_End\Redirects;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Integrations\Redirects\Global_Redirects;
use Yoast\WP\SEO\Conditionals\No_Conditionals;

/**
 * Class Global_Redirects_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Redirects\Global_Redirects
 *
 * @group redirects
 */
class Global_Redirects_Test extends TestCase {

	/**
	 * The test instance.
	 *
	 * @var Mockery\MockInterface|\Yoast\WP\SEO\Integrations\Redirects\Global_Redirects
	 */
	private $instance;

	/**
	 * The redirect helper mock.
	 *
	 * @var Mockery\MockInterface|Redirect_Helper
	 */
	private $redirect;

	/**
	 * The URL helper mock.
	 *
	 * @var Mockery\MockInterface|Url_Helper
	 */
	private $url;

	/**
	 * Sets an instance for test purposes.
	 */
	protected function set_up() {
		parent::set_up();

		$this->redirect = Mockery::mock( Redirect_Helper::class );
		$this->url      = Mockery::mock( Url_Helper::class );
		$this->instance = new Global_Redirects( $this->redirect, $this->url );
	}

	/**
	 * Tests if the expected conditionals are in place.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[],
			Global_Redirects::get_conditionals()
		);
	}

	/**
	 * Tests if the expected hooks are registered.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertNotFalse( Monkey\Actions\has( 'wp', [ $this->instance, 'category_redirect' ] ) );
	}

	/**
	 * Tests no redirect when GET parameter is not set.
	 *
	 * @covers ::category_redirect
	 */
	public function test_attachment_redirect_no_get() {
		$this->redirect
			->shouldNotReceive( 'do_safe_redirect' );

		$this->instance->category_redirect();
	}

	/**
	 * Tests if there is a redirect when GET parameter is set.
	 *
	 * @covers ::category_redirect
	 */
	public function test_attachment_redirect_with_get() {
		$_GET['cat'] = '-1';

		$this->url
			->expects( 'recreate_current_url' )
			->andReturn('https://example.org')
			->once();
		$this->redirect
			->expects( 'do_safe_redirect' )
			->with( 'https://example.org', 301, 'Stripping cat=-1 from the URL' )
			->once();

		$this->instance->category_redirect();
	}
}
