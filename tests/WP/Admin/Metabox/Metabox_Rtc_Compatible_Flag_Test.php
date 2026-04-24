<?php

namespace Yoast\WP\SEO\Tests\WP\Admin\Metabox;

use WPSEO_Metabox;
use WPSEO_Post_Type;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Asserts that the Yoast SEO meta box opts into Gutenberg's Real-Time
 * Collaboration by passing `__rtc_compatible_meta_box => true` through
 * add_meta_box's $callback_args. Without this flag, Gutenberg 23.0+ disables
 * collaboration whenever the Yoast meta box is registered — which is on every
 * post type where Yoast is active.
 */
final class Metabox_Rtc_Compatible_Flag_Test extends TestCase {

	/**
	 * Registers the main Yoast meta box and asserts that, for every accessible
	 * post type, the stored callback args advertise RTC compatibility.
	 *
	 * @covers WPSEO_Metabox::add_meta_box
	 *
	 * @return void
	 */
	public function test_main_metabox_declares_rtc_compatibility() {
		global $wp_meta_boxes;

		$stub = $this
			->getMockBuilder( WPSEO_Metabox::class )
			->setMethods( [ 'is_metabox_hidden' ] )
			->getMock();

		$stub->expects( $this->any() )->method( 'is_metabox_hidden' )->willReturn( false );
		$stub->add_meta_box();

		$post_types = WPSEO_Post_Type::get_accessible_post_types();
		unset( $post_types['attachment'] );

		foreach ( $post_types as $post_type ) {
			$this->assertArrayHasKey(
				'wpseo_meta',
				$wp_meta_boxes[ $post_type ]['normal']['high'],
				"The wpseo_meta box must be registered for post type {$post_type}.",
			);
			$args = $wp_meta_boxes[ $post_type ]['normal']['high']['wpseo_meta']['args'];
			$this->assertIsArray( $args, "The wpseo_meta box on {$post_type} must pass an args array." );
			$this->assertArrayHasKey(
				'__rtc_compatible_meta_box',
				$args,
				"The wpseo_meta box on {$post_type} must declare the __rtc_compatible_meta_box flag.",
			);
			$this->assertTrue(
				$args['__rtc_compatible_meta_box'],
				"The wpseo_meta box on {$post_type} must set __rtc_compatible_meta_box to true.",
			);
		}
	}

	/**
	 * The alternative IE-notice meta box registers via the same `wpseo_meta`
	 * ID and also has to carry the flag, or the notice would disable RTC on
	 * legacy browsers.
	 *
	 * @covers WPSEO_Metabox::internet_explorer_metabox
	 *
	 * @return void
	 */
	public function test_ie_notice_metabox_declares_rtc_compatibility() {
		global $wp_meta_boxes;
		$wp_meta_boxes = [];

		$stub = $this
			->getMockBuilder( WPSEO_Metabox::class )
			->setMethods( [ 'is_metabox_hidden' ] )
			->getMock();

		$stub->expects( $this->any() )->method( 'is_metabox_hidden' )->willReturn( false );
		$stub->internet_explorer_metabox();

		$post_types = WPSEO_Post_Type::get_accessible_post_types();
		unset( $post_types['attachment'] );

		foreach ( $post_types as $post_type ) {
			if ( ! isset( $wp_meta_boxes[ $post_type ]['normal']['high']['wpseo_meta'] ) ) {
				continue;
			}
			$args = $wp_meta_boxes[ $post_type ]['normal']['high']['wpseo_meta']['args'];
			$this->assertArrayHasKey(
				'__rtc_compatible_meta_box',
				$args,
				"The IE-notice meta box on {$post_type} must declare the __rtc_compatible_meta_box flag.",
			);
			$this->assertTrue(
				$args['__rtc_compatible_meta_box'],
				"The IE-notice meta box on {$post_type} must set __rtc_compatible_meta_box to true.",
			);
		}
	}
}
