<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Admin;

use Brain\Monkey;
use Mockery;
use stdClass;
use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Conditionals\News_Conditional;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Integrations\Admin\Fix_News_Dependencies_Integration;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests Fix_News_Dependencies_Integration.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Admin\Fix_News_Dependencies_Integration
 *
 * @group integrations
 */
final class Fix_News_Dependencies_Integration_Test extends TestCase {

	/**
	 * Holds the Current_Page_Helper.
	 *
	 * @var Mockery\MockInterface|Current_Page_Helper
	 */
	protected $current_page_helper;

	/**
	 * Instance under test.
	 *
	 * @var Fix_News_Dependencies_Integration
	 */
	protected $instance;

	/**
	 * Set up the fixtures for the tests.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->current_page_helper = Mockery::mock( Current_Page_Helper::class );
		$this->instance            = new Fix_News_Dependencies_Integration( $this->current_page_helper );
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
				News_Conditional::class,
			],
			Fix_News_Dependencies_Integration::get_conditionals(),
		);
	}

	/**
	 * Tests that the enqueue hook is registered on the post edit pages.
	 *
	 * @dataProvider data_register_hooks_registers_on_post_edit_pages
	 *
	 * @covers ::register_hooks
	 *
	 * @param string $page The value of the `$pagenow` global.
	 *
	 * @return void
	 */
	public function test_register_hooks_registers_on_post_edit_pages( $page ) {
		global $pagenow;
		$pagenow = $page;

		Monkey\Actions\expectAdded( 'admin_enqueue_scripts' );

		$this->instance->register_hooks();

		$this->assertSame(
			11,
			Monkey\Actions\has( 'admin_enqueue_scripts', [ $this->instance, 'add_news_script_dependency' ] ),
		);
	}

	/**
	 * Data provider for test_register_hooks_registers_on_post_edit_pages.
	 *
	 * @return array<string, array<string, string>>
	 */
	public static function data_register_hooks_registers_on_post_edit_pages() {
		return [
			'edit post page' => [
				'page' => 'post.php',
			],
			'new post page'  => [
				'page' => 'post-new.php',
			],
		];
	}

	/**
	 * Tests that the enqueue hook is not registered outside the post edit pages.
	 *
	 * @covers ::register_hooks
	 *
	 * @return void
	 */
	public function test_register_hooks_does_not_register_elsewhere() {
		global $pagenow;
		$pagenow = 'edit.php';

		Monkey\Actions\expectAdded( 'admin_enqueue_scripts' )->never();

		$this->instance->register_hooks();

		$this->assertFalse(
			Monkey\Actions\has( 'admin_enqueue_scripts', [ $this->instance, 'add_news_script_dependency' ] ),
		);
	}

	/**
	 * Tests that no dependency is added when the news editor script is missing.
	 *
	 * @covers ::add_news_script_dependency
	 *
	 * @return void
	 */
	public function test_add_news_script_dependency_bails_when_script_missing() {
		$scripts             = new stdClass();
		$scripts->registered = [];

		Monkey\Functions\expect( 'wp_scripts' )
			->once()
			->andReturn( $scripts );

		$this->current_page_helper->expects( 'is_block_editor' )
			->never();

		$this->instance->add_news_script_dependency();

		$this->assertSame( [], $scripts->registered );
	}

	/**
	 * Tests dependency selection for block editor and classic editor screens.
	 *
	 * @dataProvider data_add_news_script_dependency_selects_handle
	 *
	 * @covers ::add_news_script_dependency
	 *
	 * @param bool   $is_block_editor Whether the current screen is the block editor.
	 * @param string $expected_suffix Expected post-edit handle suffix.
	 *
	 * @return void
	 */
	public function test_add_news_script_dependency_selects_handle( $is_block_editor, $expected_suffix ) {
		$news_script       = new stdClass();
		$news_script->deps = [];

		$scripts             = new stdClass();
		$scripts->registered = [
			'wpseo-news-editor' => $news_script,
		];

		Monkey\Functions\expect( 'wp_scripts' )
			->once()
			->andReturn( $scripts );

		$this->current_page_helper->expects( 'is_block_editor' )
			->once()
			->andReturn( $is_block_editor );

		$this->instance->add_news_script_dependency();

		$this->assertSame(
			[ WPSEO_Admin_Asset_Manager::PREFIX . $expected_suffix ],
			$scripts->registered['wpseo-news-editor']->deps,
		);
	}

	/**
	 * Data provider for test_add_news_script_dependency_selects_handle.
	 *
	 * @return array<string, array<string, bool|string>>
	 */
	public static function data_add_news_script_dependency_selects_handle() {
		return [
			'block editor screen'   => [
				'is_block_editor' => true,
				'expected_suffix' => 'post-edit',
			],
			'classic editor screen' => [
				'is_block_editor' => false,
				'expected_suffix' => 'post-edit-classic',
			],
		];
	}
}
