<?php

namespace Yoast\WP\SEO\Tests\Unit\Admin\Ajax;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests that the AJAX bootstrap no longer exposes the retired bulk editor.
 *
 * @coversNothing
 * @runTestsInSeparateProcesses
 * @preserveGlobalState disabled
 */
final class Legacy_Bulk_Editor_Test extends TestCase {

	/**
	 * Tests that retired save actions and their write helpers are unavailable.
	 *
	 * @return void
	 */
	public function test_retired_bulk_editor_is_unavailable() {
		Mockery::mock( 'overload:WPSEO_Taxonomy_Columns' );

		require \WPSEO_PATH . 'admin/ajax.php';

		$actions = [
			'wp_ajax_wpseo_save_title',
			'wp_ajax_wpseo_save_metadesc',
			'wp_ajax_wpseo_save_all_titles',
			'wp_ajax_wpseo_save_all_descriptions',
		];
		foreach ( $actions as $action ) {
			$this->assertFalse( Monkey\Actions\has( $action ), $action );
		}

		$functions = [
			'wpseo_save_title',
			'wpseo_save_description',
			'wpseo_save_what',
			'wpseo_save_all_titles',
			'wpseo_save_all_descriptions',
			'wpseo_save_all',
			'wpseo_upsert_new',
			'wpseo_upsert_meta',
			'wpseo_ajax_json_echo_die',
		];
		foreach ( $functions as $function ) {
			$this->assertFalse( \function_exists( $function ), $function );
		}

		$this->assertNotFalse( Monkey\Actions\has( 'wp_ajax_get_focus_keyword_usage_and_post_types', 'ajax_get_keyword_usage_and_post_types' ) );
		$this->assertNotFalse( Monkey\Actions\has( 'wp_ajax_get_term_keyword_usage', 'ajax_get_term_keyword_usage' ) );
		$this->assertNotFalse( Monkey\Actions\has( 'wp_ajax_wpseo_filter_shortcodes' ) );
	}
}
