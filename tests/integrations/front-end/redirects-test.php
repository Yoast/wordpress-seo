<?php
/**
 * WPSEO plugin test file.
 *
 * @package Yoast\WP\Free\Tests\Integrations\Front_End
 */

namespace Yoast\WP\Free\Tests\Integrations\Front_End;

use Brain\Monkey;
use Mockery;
use Yoast\WP\Free\Helpers\Current_Page_Helper;
use Yoast\WP\Free\Helpers\Meta_Helper;
use Yoast\WP\Free\Helpers\Options_Helper;
use Yoast\WP\Free\Integrations\Front_End\Redirects;
use Yoast\WP\Free\Tests\TestCase;

/**
 * Unit Test Class.
 *
 * @coversDefaultClass \Yoast\WP\Free\Integrations\Front_End\Redirects
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
	 * Sets an instance for test purposes.
	 */
	public function setUp() {
		parent::setUp();

		$this->options      = Mockery::mock( Options_Helper::class );
		$this->meta         = Mockery::mock( Meta_Helper::class );
		$this->current_page = Mockery::mock( Current_Page_Helper::class );
		$this->instance     = Mockery::mock( Redirects::class, [ $this->options, $this->meta, $this->current_page ] )
			->shouldAllowMockingProtectedMethods()
			->makePartial();
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

		$this->instance
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

		$this->instance
			->expects( 'do_safe_redirect' )
			->once()
			->with( 'url', 301 );

		$this->instance->archive_redirect();
	}

	/**
	 * Tests the page redirect for a non simple page.
	 *
	 * @covers ::page_redirect
	 */
	public function test_page_redirect_for_a_non_simple_page() {
		$this->current_page
			->expects( 'is_simple_page' )
			->once()
			->andReturnFalse();

		$this->instance
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

		$this->instance
			->shouldNotReceive( 'do_redirect' );

		$this->instance->page_redirect();
	}

	/**
	 * Tests the page redirect for a simple page that hasn't a redirect value set.
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

		$this->instance
			->shouldNotReceive( 'do_redirect' );

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

		$this->instance
			->expects( 'do_redirect' )
			->once()
			->with( 'https://example.org/redirect' );

		$this->instance->page_redirect();
	}

	/**
	 * Tests the attachment redirect on a non attachment page.
	 *
	 * @covers ::attachment_redirect
	 */
	public function test_attachment_redirect_for_a_non_attachment_page() {
		$this->current_page
			->expects( 'is_attachment' )
			->once()
			->andReturnFalse();

		$this->instance
			->shouldNotReceive( 'do_redirect' );

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

		$this->instance
			->shouldNotReceive( 'do_redirect' );

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

		$this->instance
			->shouldNotReceive( 'do_redirect' );

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

		$this->instance
			->expects( 'do_redirect' )
			->once()
			->with( 'https://example.org/redirect' );

		$this->instance->attachment_redirect();
	}

}
