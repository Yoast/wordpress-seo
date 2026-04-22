<?php

namespace Yoast\WP\SEO\Tests\WP\Admin\Watchers;

use Yoast\WP\SEO\Integrations\Watchers\Logo_Meta_Watcher;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Integration test for Logo_Meta_Watcher.
 *
 * Exercises the `pre_update_option_wpseo_titles` hook through WordPress'
 * real option pipeline to confirm that saving `wpseo_titles` keeps the
 * cached logo meta consistent with the selected attachment id.
 *
 * @group integrations
 * @group watchers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Watchers\Logo_Meta_Watcher
 * @covers \Yoast\WP\SEO\Integrations\Watchers\Logo_Meta_Watcher
 */
final class Logo_Meta_Watcher_Test extends TestCase {

	/**
	 * Ensures the watcher's filter is attached before each test even if the
	 * plugin bootstrap has not wired it up for this test case. The DI
	 * container keeps a single instance, so attaching the hook more than once
	 * is idempotent.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		$watcher = \YoastSEO()->classes->get( Logo_Meta_Watcher::class );
		$watcher->register_hooks();
	}

	/**
	 * Removes the filter so it does not leak into unrelated tests running in
	 * the same process.
	 *
	 * @return void
	 */
	public function tear_down() {
		\remove_all_filters( 'pre_update_option_wpseo_titles' );
		\delete_option( 'wpseo_titles' );

		parent::tear_down();
	}

	/**
	 * Tests that saving `wpseo_titles` with a configured logo id populates
	 * `company_logo_meta` with a variation derived from the attachment, even
	 * when the saved payload arrives with meta cleared (which is what the
	 * Settings UI does — see Settings_Integration::DISALLOWED_SETTINGS).
	 *
	 * @covers ::ensure_logo_meta
	 *
	 * @return void
	 */
	public function test_company_logo_meta_is_populated_when_saving_with_an_id() {
		$attachment = self::factory()->attachment->create();
		\update_post_meta(
			$attachment,
			'_wp_attachment_metadata',
			[
				'width'  => 512,
				'height' => 256,
			],
		);

		\update_option(
			'wpseo_titles',
			[
				'company_logo_id'   => $attachment,
				'company_logo_meta' => false,
			],
		);

		$stored = \get_option( 'wpseo_titles' );

		$this->assertIsArray( $stored['company_logo_meta'] );
		$this->assertSame( 512, $stored['company_logo_meta']['width'] );
		$this->assertSame( 256, $stored['company_logo_meta']['height'] );
		$this->assertSame( $attachment, $stored['company_logo_meta']['id'] );
	}

	/**
	 * Tests that replacing the logo id triggers a meta recompute so the
	 * stored variation matches the new attachment rather than carrying over
	 * the old blob.
	 *
	 * @covers ::ensure_logo_meta
	 *
	 * @return void
	 */
	public function test_company_logo_meta_is_recomputed_when_id_changes() {
		$original = self::factory()->attachment->create();
		\update_post_meta(
			$original,
			'_wp_attachment_metadata',
			[
				'width'  => 100,
				'height' => 100,
			],
		);

		$replacement = self::factory()->attachment->create();
		\update_post_meta(
			$replacement,
			'_wp_attachment_metadata',
			[
				'width'  => 800,
				'height' => 400,
			],
		);

		\update_option(
			'wpseo_titles',
			[
				'company_logo_id'   => $original,
				'company_logo_meta' => false,
			],
		);

		\update_option(
			'wpseo_titles',
			[
				'company_logo_id'   => $replacement,
				'company_logo_meta' => false,
			],
		);

		$stored = \get_option( 'wpseo_titles' );

		$this->assertSame( $replacement, $stored['company_logo_meta']['id'] );
		$this->assertSame( 800, $stored['company_logo_meta']['width'] );
		$this->assertSame( 400, $stored['company_logo_meta']['height'] );
	}

	/**
	 * Tests that clearing the logo id also clears the stored meta, so no
	 * stale variation is left behind when a user removes the company logo.
	 *
	 * @covers ::ensure_logo_meta
	 *
	 * @return void
	 */
	public function test_company_logo_meta_is_cleared_when_id_is_removed() {
		$attachment = self::factory()->attachment->create();
		\update_post_meta(
			$attachment,
			'_wp_attachment_metadata',
			[
				'width'  => 200,
				'height' => 200,
			],
		);

		\update_option(
			'wpseo_titles',
			[
				'company_logo_id'   => $attachment,
				'company_logo_meta' => false,
			],
		);

		\update_option(
			'wpseo_titles',
			[
				'company_logo_id'   => 0,
				'company_logo_meta' => false,
			],
		);

		$stored = \get_option( 'wpseo_titles' );

		$this->assertFalse( $stored['company_logo_meta'] );
	}

	/**
	 * Tests that the watcher applies the same populate-on-save behaviour to
	 * `person_logo_meta`, not only to the company logo. The two keys live in
	 * the same option and follow the same code path, so one representative
	 * save is enough to prove the symmetry at the WP integration level.
	 *
	 * @covers ::ensure_logo_meta
	 *
	 * @return void
	 */
	public function test_person_logo_meta_is_populated_when_saving_with_an_id() {
		$attachment = self::factory()->attachment->create();
		\update_post_meta(
			$attachment,
			'_wp_attachment_metadata',
			[
				'width'  => 300,
				'height' => 300,
			],
		);

		\update_option(
			'wpseo_titles',
			[
				'person_logo_id'   => $attachment,
				'person_logo_meta' => false,
			],
		);

		$stored = \get_option( 'wpseo_titles' );

		$this->assertIsArray( $stored['person_logo_meta'] );
		$this->assertSame( 300, $stored['person_logo_meta']['width'] );
		$this->assertSame( 300, $stored['person_logo_meta']['height'] );
		$this->assertSame( $attachment, $stored['person_logo_meta']['id'] );
	}
}
