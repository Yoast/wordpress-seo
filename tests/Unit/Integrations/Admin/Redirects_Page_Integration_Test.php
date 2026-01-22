<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Admin;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Conditionals\Premium_Inactive_Conditional;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\Integrations\Admin\Redirects_Page_Integration;
use Yoast\WP\SEO\Introductions\Infrastructure\Wistia_Embed_Permission_Repository;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Redirects_Page_Integration_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Admin\Redirects_Page_Integration
 *
 * @group integrations
 */
final class Redirects_Page_Integration_Test extends TestCase {

	/**
	 * Represents the instance to test.
	 *
	 * @var Redirects_Page_Integration|Mockery\Mock
	 */
	protected $instance;

	/**
	 * Represents the current page helper.
	 *
	 * @var Current_Page_Helper|Mockery\Mock
	 */
	protected $current_page_helper;

	/**
	 * Represents the user helper.
	 *
	 * @var User_Helper|Mockery\Mock
	 */
	protected $user_helper;

	/**
	 * Represents the Wistia embed permission repository.
	 *
	 * @var Wistia_Embed_Permission_Repository|Mockery\Mock
	 */
	protected $wistia_embed_permission_repository;

	/**
	 * Set up the fixtures for the tests.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->current_page_helper                = Mockery::mock( Current_Page_Helper::class );
		$this->user_helper                        = Mockery::mock( User_Helper::class );
		$this->wistia_embed_permission_repository = Mockery::mock( Wistia_Embed_Permission_Repository::class );

		$this->instance = new Redirects_Page_Integration(
			$this->current_page_helper,
			$this->user_helper,
			$this->wistia_embed_permission_repository
		);
	}

	/**
	 * Tests the retrieval of the conditionals.
	 *
	 * @covers ::get_conditionals
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[
				Admin_Conditional::class,
				Premium_Inactive_Conditional::class,
			],
			Redirects_Page_Integration::get_conditionals()
		);
	}

	/**
	 * Tests the registration of the hooks.
	 *
	 * @covers ::register_hooks
	 *
	 * @return void
	 */
	public function test_register_hooks() {
		$this->current_page_helper->expects( 'get_current_yoast_seo_page' )
			->andReturn( Redirects_Page_Integration::PAGE );
		$this->instance->register_hooks();
		$this->assertNotFalse(
			Monkey\Filters\has(
				'wpseo_submenu_pages',
				[
					$this->instance,
					'add_submenu_page',
				]
			),
			'Does not have expected wpseo_submenu_pages filter'
		);
	}

	/**
	 * Tests the addition of a submenu page.
	 *
	 * @covers ::add_submenu_page
	 *
	 * @return void
	 */
	public function test_add_submenu_page() {
		Monkey\Functions\expect( '__' )
			->andReturnFirstArg();

		$submenu_pages = [
			[
				'wpseo_dashboard',
				'',
				'Redirects <span class="yoast-badge yoast-premium-badge"></span>',
				'edit_others_posts',
				'wpseo_redirects',
				[ $this->instance, 'display' ],
			],
		];

		$this->assertSame( $submenu_pages, $this->instance->add_submenu_page( [] ) );
	}
}
