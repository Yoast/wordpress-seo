<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Admin;

use Brain\Monkey;
use Mockery;
use stdClass;
use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Conditionals\News_Conditional;
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

		$this->instance = new Fix_News_Dependencies_Integration();
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

		Monkey\Functions\expect( 'get_current_screen' )->never();

		$this->instance->add_news_script_dependency();

		$this->assertSame( [], $scripts->registered );
	}

	/**
	 * Tests dependency selection for block editor, classic editor, and missing screen.
	 *
	 * @dataProvider data_add_news_script_dependency_selects_handle
	 *
	 * @covers ::add_news_script_dependency
	 *
	 * @param bool|null $is_block_editor Whether the current screen is the block editor. Null means no screen.
	 * @param string    $expected_suffix Expected post-edit handle suffix.
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

		if ( $is_block_editor === null ) {
			Monkey\Functions\expect( 'get_current_screen' )
				->once()
				->andReturn( null );
		}
		else {
			$screen = Mockery::mock();
			$screen->expects( 'is_block_editor' )
				->once()
				->andReturn( $is_block_editor );

			Monkey\Functions\expect( 'get_current_screen' )
				->once()
				->andReturn( $screen );
		}

		$this->instance->add_news_script_dependency();

		$this->assertSame(
			[ WPSEO_Admin_Asset_Manager::PREFIX . $expected_suffix ],
			$scripts->registered['wpseo-news-editor']->deps,
		);
	}

	/**
	 * Data provider for test_add_news_script_dependency_selects_handle.
	 *
	 * @return array<string, array<string, bool|string|null>>
	 */
	public static function data_add_news_script_dependency_selects_handle() {
		return [
			'block editor screen' => [
				'is_block_editor' => true,
				'expected_suffix' => 'post-edit',
			],
			'classic editor screen' => [
				'is_block_editor' => false,
				'expected_suffix' => 'post-edit-classic',
			],
			'no current screen' => [
				'is_block_editor' => null,
				'expected_suffix' => 'post-edit-classic',
			],
		];
	}
}
