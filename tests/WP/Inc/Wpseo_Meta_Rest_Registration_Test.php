<?php

namespace Yoast\WP\SEO\Tests\WP\Inc;

use WPSEO_Meta;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Ensures Yoast post meta is registered for REST so that Gutenberg's
 * core-data CRDT pipe can synchronize Yoast meta between concurrent editors
 * when Real-Time Collaboration is active (WordPress 7.0+).
 */
final class Wpseo_Meta_Rest_Registration_Test extends TestCase {

	/**
	 * Every internal key in WPSEO_Meta::$meta_fields should be registered for
	 * the 'post' object type with show_in_rest, a sanitize_callback, an
	 * auth_callback, type=string and single=true.
	 *
	 * @covers WPSEO_Meta::init
	 *
	 * @return void
	 */
	public function test_every_meta_field_is_registered_for_rest() {
		$registered = \get_registered_meta_keys( 'post' );

		foreach ( WPSEO_Meta::$meta_fields as $field_group ) {
			foreach ( \array_keys( $field_group ) as $internal_key ) {
				$meta_key = WPSEO_Meta::$meta_prefix . $internal_key;
				$this->assertArrayHasKey(
					$meta_key,
					$registered,
					"Yoast meta key {$meta_key} is not registered for the 'post' object type.",
				);

				$definition = $registered[ $meta_key ];
				$this->assertTrue(
					! empty( $definition['show_in_rest'] ),
					"Yoast meta key {$meta_key} must be registered with show_in_rest=true so it participates in core-data's CRDT pipe.",
				);
				$this->assertSame( 'string', $definition['type'], "Yoast meta key {$meta_key} should declare type=string." );
				$this->assertTrue( $definition['single'], "Yoast meta key {$meta_key} should be registered as single=true." );
				$this->assertSame(
					[ WPSEO_Meta::class, 'sanitize_post_meta' ],
					$definition['sanitize_callback'],
					"Yoast meta key {$meta_key} must reuse WPSEO_Meta::sanitize_post_meta for REST writes.",
				);
				$this->assertSame(
					[ WPSEO_Meta::class, 'can_edit_post_meta' ],
					$definition['auth_callback'],
					"Yoast meta key {$meta_key} must declare an explicit auth_callback — the default for protected meta would deny all REST writes.",
				);
			}
		}
	}

	/**
	 * The auth callback should delegate to edit_post on the specific post, so
	 * editors can update meta via REST exactly when they can edit the post.
	 *
	 * @covers WPSEO_Meta::can_edit_post_meta
	 *
	 * @return void
	 */
	public function test_can_edit_post_meta_allows_users_with_edit_post_capability() {
		$author_id = $this->factory->user->create( [ 'role' => 'editor' ] );
		$post_id   = $this->factory->post->create( [ 'post_author' => $author_id ] );

		$this->assertTrue(
			WPSEO_Meta::can_edit_post_meta( false, WPSEO_Meta::$meta_prefix . 'focuskw', $post_id, $author_id ),
			'An editor should be authorized to write Yoast post meta for their own post.',
		);
	}

	/**
	 * Subscribers must not be able to write Yoast post meta, even though the
	 * default auth callback for protected meta returns false — an explicit
	 * check guards against someone accidentally loosening the default later.
	 *
	 * @covers WPSEO_Meta::can_edit_post_meta
	 *
	 * @return void
	 */
	public function test_can_edit_post_meta_rejects_users_without_edit_post_capability() {
		$subscriber_id = $this->factory->user->create( [ 'role' => 'subscriber' ] );
		$post_id       = $this->factory->post->create();

		$this->assertFalse(
			WPSEO_Meta::can_edit_post_meta( true, WPSEO_Meta::$meta_prefix . 'focuskw', $post_id, $subscriber_id ),
			'A subscriber should not be authorized to write Yoast post meta via REST.',
		);
	}
}
