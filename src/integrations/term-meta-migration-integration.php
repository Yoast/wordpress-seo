<?php

namespace Yoast\WP\SEO\Integrations;

use WPSEO_Taxonomy_Meta;

/**
 * Migrates the legacy taxonomy meta option to WordPress term meta in batches.
 */
class Term_Meta_Migration_Integration implements Integration_Interface {

	/**
	 * Identifier for the migration cron job.
	 */
	public const CRON_HOOK = 'wpseo_migrate_term_meta_batch';

	/**
	 * The number of terms migrated in one batch.
	 */
	public const BATCH_SIZE = 200;

	/**
	 * Returns the conditionals based on which this loadable should be active.
	 *
	 * @return array<string> The array of conditionals.
	 */
	public static function get_conditionals() {
		return [];
	}

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( self::CRON_HOOK, [ $this, 'migrate_batch' ] );
	}

	/**
	 * Migrates one batch of terms from the legacy option to term meta.
	 *
	 * Schedules the next batch if the current batch was filled completely.
	 * Entries which cannot be migrated, for example because their taxonomy is
	 * not registered, remain in the option for a later migration run.
	 *
	 * @return void
	 */
	public function migrate_batch() {
		$migrated = WPSEO_Taxonomy_Meta::migrate_legacy_term_meta( self::BATCH_SIZE );

		if ( $migrated >= self::BATCH_SIZE ) {
			\wp_schedule_single_event( ( \time() + \MINUTE_IN_SECONDS ), self::CRON_HOOK );
		}
	}
}
