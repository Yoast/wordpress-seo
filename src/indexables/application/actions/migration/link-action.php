<?php

namespace Yoast\WP\SEO\Indexables\Application\Actions\Migration;

use Yoast\WP\Lib\Model;
use Yoast\WP\SEO\Helpers\Import_Cursor_Helper;
use Yoast\WP\SEO\Indexables\Domain\Actions\Migration_Interface;
use Yoast\WP\SEO\Models\SEO_Links;


/**
 * The indexable action class.
 */
class Link_Action implements Migration_Interface {

	/**
	 * The transient cache key.
	 *
	 * @var Import_Cursor_Helper
	 */
	private $cursor_helper;

	private const MIGRATION_CURSOR = 'migration_cursors';

	/**
	 * @param Import_Cursor_Helper $cursor_helper
	 */
	public function __construct( Import_Cursor_Helper $cursor_helper ) {
		$this->cursor_helper = $cursor_helper;
	}

	/**
	 * Creates indexables for unindexed posts.
	 *
	 * @param string $old_url The old URL.
	 * @param string $new_url The new URL.
	 *
	 * @return int The number of migrated indexables.
	 */
	public function migrate( $old_url, $new_url ): int {
		global $wpdb;

		$last_migrated_id = $this->cursor_helper->get_cursor( $this->get_table(), 0, self::MIGRATION_CURSOR );
		$rows             = $this->get_replace_query( $this->get_limit() );
		foreach ( $rows as $link_row ) {
			$link_row['url']      = \str_replace( $old_url, $new_url, $link_row['url'] );
			$query = $wpdb->prepare(
				"
				UPDATE %i
				SET %i.url = %s
				WHERE %i.id = %d",
				[
					$this->get_table(),
					$this->get_table(),
					$link_row['url'],
					$this->get_table(),
					$link_row['id'],
				]
			);
			$result = $wpdb->query( $query );

			if ( $result ) {
				$last_migrated_id = $link_row['id'];
			}
		}
		$this->cursor_helper->set_cursor( $this->get_table(), $last_migrated_id, self::MIGRATION_CURSOR );

		return \count( $rows );
	}

	/**
	 * Returns the number of posts that will be indexed in a single indexing pass.
	 *
	 * @return int The limit.
	 */
	public function get_limit(): int {
		/**
		 * Filter 'wpseo_post_indexation_limit' - Allow filtering the amount of posts indexed during each indexing pass.
		 *
		 * @param int $limit The maximum number of posts indexed.
		 */
		$limit = \apply_filters( 'wpseo_link_migration_limit', 25 );

		if ( ! \is_int( $limit ) || $limit < 1 ) {
			$limit = 25;
		}

		return $limit;
	}

	public function get_table(): string {
		return Model::get_table_name( 'SEO_Links' );
	}

	public function get_name(): string
	{
		return 'links';
	}

	/**
	 * Builds a query for selecting the ID's of unindexed posts.
	 *
	 * @param bool $limit The maximum number of post IDs to return.
	 *
	 * @return array<array<string, int>> The prepared query string.
	 */
	protected function get_replace_query( $limit = false ): array {
		global $wpdb;
		$table_name = $this->get_table();
		$cursor     = $this->cursor_helper->get_cursor( $table_name, 0, self::MIGRATION_CURSOR );

		/**
		 * Filter 'wpseo_migrate_indexable_cursor' - Allow filtering the value of the migrate indexable cursor.
		 *
		 * @param int $import_cursor The value of the cursor.
		 */
		$cursor = \apply_filters( 'wpseo_migrate_links_cursor', $cursor );

		$replacements = [ $table_name, $cursor, SEO_Links::TYPE_INTERNAL, SEO_Links::TYPE_INTERNAL_IMAGE ];

		$limit_statement = '';
		if ( ! empty( $limit ) ) {
			$replacements[]  = $limit;
			$limit_statement = ' LIMIT %d';
		}


		// phpcs:disable WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- Reason: There is no unescaped user input.
		$prepared_query = $wpdb->prepare(
			"SELECT id, url FROM  %i WHERE id > %d AND type in (%s, %s) ORDER BY id{$limit_statement}",
			$replacements
		);

		return $wpdb->get_results( $prepared_query, ARRAY_A );
		// phpcs:enable WordPress.DB.PreparedSQL.InterpolatedNotPrepared
	}

	/**
	 * Returns how many rows need to be migrated.
	 *
	 * @return int The number of rows to be migrated.
	 */
	public function get_total_unmigrated(): int {
		global $wpdb;
		$count_query = $wpdb->prepare(
			"SELECT count(*) FROM %i",
			[ $this->get_table() ]
		);
		// phpcs:enable

		// phpcs:disable WordPress.DB.DirectDatabaseQuery.NoCaching -- Reason: No relevant caches.
		// phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery -- Reason: Most performant way.
		// phpcs:disable WordPress.DB.PreparedSQL.NotPrepared -- Reason: Is it prepared already.
		return $wpdb->get_col( $count_query )[0];
		// phpcs:enable WordPress.DB.PreparedSQL.InterpolatedNotPrepared
	}
}
