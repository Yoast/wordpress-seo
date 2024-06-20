<?php

namespace Yoast\WP\SEO\Indexables\Application\Actions\Migration;

use WP_CLI\Utils;
use WPSEO_Utils;
use Yoast\WP\Lib\Model;
use Yoast\WP\SEO\Helpers\Import_Cursor_Helper;
use Yoast\WP\SEO\Models\Indexable;

use Yoast\WP\SEO\Indexables\Domain\Actions\Migration_Interface;

/**
 * The indexable action class..
 */
class Indexable_Action implements Migration_Interface {

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
	 * @return Indexable[] The created indexables.
	 */
	public function migrate( $old_url, $new_url ): void {
		global $wpdb;

		$last_migrated_id = $this->cursor_helper->get_cursor( $this->get_table(), 0, self::MIGRATION_CURSOR );
		$rows             = $this->get_replace_query( $this->get_limit() );
		$progress         = Utils\make_progress_bar( 'Migrating ' . 'Indexables', \count( $rows ) );
		foreach ( $rows as $indexable_row ) {
			$indexable_row['permalink']      = \str_replace( $old_url, $new_url, $indexable_row['permalink'] );
			$indexable_row['permalink_hash'] = \strlen( $indexable_row['permalink'] ) . ':' . \md5( $indexable_row['permalink'] );
			if ( $indexable_row['twitter_image'] !== null ) {
				$indexable_row['twitter_image'] = \str_replace( $old_url, $new_url, $indexable_row['twitter_image'] );
			}
			if ( $indexable_row['open_graph_image'] !== null ) {
				$indexable_row['open_graph_image'] = \str_replace( $old_url, $new_url, $indexable_row['open_graph_image'] );
			}
			if ( $indexable_row['open_graph_image_meta'] !== null ) {
				$unpacked_open_graph_image_meta = json_decode($indexable_row['open_graph_image_meta']);
				$unpacked_open_graph_image_meta->url = \str_replace( $old_url, $new_url, $unpacked_open_graph_image_meta->url );
				$indexable_row['open_graph_image_meta'] = WPSEO_Utils::format_json_encode($unpacked_open_graph_image_meta);
			}

			$query = $wpdb->prepare(
				"
				UPDATE %i
				SET %i.permalink = %s,
					%i.permalink_hash = %s
				WHERE %i.id = %d",
				[
					$this->get_table(),
					$this->get_table(),
					$indexable_row['permalink'],
					$this->get_table(),
					$indexable_row['permalink_hash'],
					$this->get_table(),
					$indexable_row['id'],
				]
			);
			$progress->tick( 1 );
			$result = $wpdb->query( $query );

			if ( $result ) {
				$last_migrated_id = $indexable_row['id'];
			}
		}
		$progress->finish();
		$this->cursor_helper->set_cursor( $this->get_table(), $last_migrated_id, self::MIGRATION_CURSOR );
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
		$limit = \apply_filters( 'wpseo_indexable_migration_limit', 1 );

		if ( ! \is_int( $limit ) || $limit < 1 ) {
			$limit = 25;
		}

		return $limit;
	}

	public function get_table(): string {
		return Model::get_table_name( 'Indexable' );
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
		$cursor = \apply_filters( 'wpseo_migrate_indexable_cursor', $cursor );

		$replacements = [ $cursor ];

		$limit_statement = '';
		if ( ! empty( $limit ) ) {
			$replacements[]  = $limit;
			$limit_statement = ' LIMIT %d';
		}

		// phpcs:disable WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- Reason: There is no unescaped user input.
		$prepared_query = $wpdb->prepare(
			"SELECT id, permalink, permalink_hash,twitter_image,open_graph_image,open_graph_image_meta FROM {$table_name} WHERE id > %d ORDER BY id{$limit_statement}",
			$replacements
		);

		return $wpdb->get_results( $prepared_query, ARRAY_A );
		// phpcs:enable WordPress.DB.PreparedSQL.InterpolatedNotPrepared
	}
}
