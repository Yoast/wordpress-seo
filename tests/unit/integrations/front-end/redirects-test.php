<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Front_End;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Conditionals\Front_End_Conditional;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Meta_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Redirect_Helper;
use Yoast\WP\SEO\Helpers\Url_Helper;
use Yoast\WP\SEO\Integrations\Front_End\Redirects;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Redirects_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Front_End\Redirects
 * @covers ::<!public>
 *
 * @group integrations
 * @group front-end
 */
class Redirects_Test extends TestCase {

	/**
	 * The test instance.
	 *
	 * @var Mockery\MockInterface|Redirects
	 */
	private $instance;

	/**
	 * The options helper mock.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	private $options;

	/**
	 * The meta helper mock.
	 *
	 * @var Mockery\MockInterface|Meta_Helper
	 */
	private $meta;

	/**
	 * The current page helper mock.
	 *
	 * @var Mockery\MockInterface|Current_Page_Helper
	 */
	private $current_page;

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

		$this->options      = Mockery::mock( Options_Helper::class );
		$this->meta         = Mockery::mock( Meta_Helper::class );
		$this->current_page = Mockery::mock( Current_Page_Helper::class );
		$this->redirect     = Mockery::mock( Redirect_Helper::class );
		$this->url          = Mockery::mock( Url_Helper::class );
		$this->instance     = Mockery::mock( Redirects::class, [ $this->options, $this->meta, $this->current_page, $this->redirect, $this->url ] )
			->shouldAllowMockingProtectedMethods()
			->makePartial();
	}

	/**
	 * Tests if the expected conditionals are in place.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[ Front_End_Conditional::class ],
			Redirects::get_conditionals()
		);
	}

	/**
	 * Tests if the expected hooks are registered.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertNotFalse( Monkey\Actions\has( 'wp', [ $this->instance, 'archive_redirect' ] ) );
		$this->assertNotFalse( Monkey\Actions\has( 'wp', [ $this->instance, 'page_redirect' ] ) );
		$this->assertNotFalse( Monkey\Actions\has( 'template_redirect', [ $this->instance, 'attachment_redirect' ] ) );
	}

	/**
	 * Tests the archive redirect when archives are 'enabled'.
	 *
	 * @covers ::archive_redirect
	 */
	public function test_archive_redirect_with_no_redirect_done() {
		$this->instance
			->expects( 'need_archive_redirect' )
			->once()
			->andReturnFalse();

		$this->redirect
			->shouldNotReceive( 'do_safe_redirect' )
			->with( 'https://example.org', 301 );

		$this->instance->archive_redirect();
	}

	/**
	 * Tests the archive redirect when one of the archives is disabled.
	 *
	 * @covers ::archive_redirect
	 */
	public function test_archive_redirect_with_redirect_done() {
		$this->instance
			->expects( 'need_archive_redirect' )
			->once()
			->andReturnTrue();

		$this->redirect
			->expects( 'do_safe_redirect' )
			->once()
			->with( 'url', 301 );

		$this->instance->archive_redirect();
	}

	/**
	 * Tests the page redirect for a non-simple page.
	 *
	 * @covers ::page_redirect
	 */
	public function test_page_redirect_for_a_non_simple_page() {
		$this->current_page
			->expects( 'is_simple_page' )
			->once()
			->andReturnFalse();

		$this->redirect
			->shouldNotReceive( 'do_redirect' );

		$this->instance->page_redirect();
	}

	/**
	 * Tests the page redirect for a simple page, but has an invalid post object.
	 *
	 * @covers ::page_redirect
	 */
	public function test_page_redirect_for_a_simple_page_with_no_post_object() {
		Monkey\Functions\expect( 'get_post' )->once()->andReturn( false );

		$this->current_page
			->expects( 'is_simple_page' )
			->once()
			->andReturnTrue();

		$this->redirect
			->shouldNotReceive( 'do_safe_redirect' );

		$this->instance->page_redirect();
	}

	/**
	 * Tests the page redirect for a simple page that doesn't have a redirect value set.
	 *
	 * @covers ::page_redirect
	 */
	public function test_page_redirect_for_a_simple_page_with_no_redirect_for_post() {
		Monkey\Functions\expect( 'get_post' )
			->once()
			->andReturn( (object) [ 'ID' => 1337 ] );

		$this->current_page
			->expects( 'is_simple_page' )
			->once()
			->andReturnTrue();

		$this->meta
			->expects( 'get_value' )
			->with( 'redirect', 1337 )
			->andReturn( '' );

		$this->redirect
			->shouldNotReceive( 'do_safe_redirect' );

		$this->instance->page_redirect();
	}

	/**
	 * Tests the page redirect for a simple page that has redirect value set.
	 *
	 * @covers ::page_redirect
	 */
	public function test_page_redirect_for_a_simple_page_with_redirect_for_post() {
		Monkey\Functions\expect( 'get_post' )
			->once()
			->andReturn( (object) [ 'ID' => 1337 ] );

		$this->current_page
			->expects( 'is_simple_page' )
			->once()
			->andReturnTrue();

		$this->meta
			->expects( 'get_value' )
			->with( 'redirect', 1337 )
			->andReturn( 'https://example.org/redirect' );

		$this->redirect
			->expects( 'do_safe_redirect' )
			->once()
			->with( 'https://example.org/redirect', 301 );

		$this->instance->page_redirect();
	}

	/**
	 * Tests the attachment redirect on a non-attachment page.
	 *
	 * @covers ::attachment_redirect
	 */
	public function test_attachment_redirect_for_a_non_attachment_page() {
		$this->current_page
			->expects( 'is_attachment' )
			->once()
			->andReturnFalse();

		$this->redirect
			->shouldNotReceive( 'do_unsafe_redirect' );

		$this->instance->attachment_redirect();
	}

	/**
	 * Tests the attachment redirect on an attachment page but with attachments disabled.
	 *
	 * @covers ::attachment_redirect
	 */
	public function test_attachment_redirect_for_an_attachment_page_with_attachments_disabled() {
		$this->current_page
			->expects( 'is_attachment' )
			->once()
			->andReturnTrue();

		$this->options
			->expects( 'get' )
			->with( 'disable-attachment', false )
			->once()
			->andReturnFalse();

		$this->redirect
			->shouldNotReceive( 'do_unsafe_redirect' );

		$this->instance->attachment_redirect();
	}

	/**
	 * Tests the attachment redirect on an attachment page but with attachments disabled.
	 *
	 * @covers ::attachment_redirect
	 */
	public function test_attachment_redirect_for_an_attachment_page_with_no_attachment_url_found() {
		$this->current_page
			->expects( 'is_attachment' )
			->once()
			->andReturnTrue();

		$this->options
			->expects( 'get' )
			->with( 'disable-attachment', false )
			->once()
			->andReturnTrue();

		$this->instance
			->expects( 'get_attachment_url' )
			->once()
			->andReturn( '' );

		$this->redirect
			->shouldNotReceive( 'do_unsafe_redirect' );

		$this->instance->attachment_redirect();
	}

	/**
	 * Tests the attachment redirect, happy path.
	 *
	 * @covers ::attachment_redirect
	 */
	public function test_attachment_redirect() {
		$this->current_page
			->expects( 'is_attachment' )
			->once()
			->andReturnTrue();

		$this->options
			->expects( 'get' )
			->with( 'disable-attachment', false )
			->once()
			->andReturnTrue();

		$this->instance
			->expects( 'get_attachment_url' )
			->once()
			->andReturn( 'https://example.org/redirect' );

		$this->redirect
			->expects( 'do_unsafe_redirect' )
			->once()
			->with( 'https://example.org/redirect', 301 );

		$this->instance->attachment_redirect();
	}
}
