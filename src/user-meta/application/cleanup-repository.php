<?php

namespace Yoast\WP\SEO\User_Meta\Application;

/**
 * Repository containing all usermeta cleanup queries.
 */
class Cleanup_Repository {

	/**
	 * The additional contactmethods repository.
	 *
	 * @var Additional_Contactmethods_Repository $additional_contactmethods_repository The additional contactmethods repository.
	 */
	private $additional_contactmethods_repository;

	/**
	 * The custom meta repository.
	 *
	 * @var Custom_Meta_Repository $custom_meta_repository The custom meta repository.
	 */
	private $custom_meta_repository;

	/**
	 * The constructor.
	 *
	 * @param Additional_Contactmethods_Repository $additional_contactmethods_repository The additional contactmethods repository.
	 * @param Custom_Meta_Repository               $custom_meta_repository               The custom meta repository.
	 */
	public function __construct(
		Additional_Contactmethods_Repository $additional_contactmethods_repository,
		Custom_Meta_Repository $custom_meta_repository
	) {
		$this->additional_contactmethods_repository = $additional_contactmethods_repository;
		$this->custom_meta_repository               = $custom_meta_repository;
	}

	/**
	 * Deletes selected empty usermeta.
	 *
	 * @param int $limit The limit we'll apply to the cleanups.
	 *
	 * @return int|bool The number of rows that was deleted or false if the query failed.
	 */
	public function cleanup_selected_empty_usermeta( int $limit ) {
		global $wpdb;
		$meta_to_check = $this->get_meta_to_check();

		// phpcs:disable WordPress.DB.PreparedSQLPlaceholders.ReplacementsWrongNumber -- Reason: we're passing an array instead.
		$delete_query = $wpdb->prepare(
			'DELETE FROM %i
			WHERE meta_key IN ( ' . \implode( ', ', \array_fill( 0, \count( $meta_to_check ), '%s' ) ) . ' )
			AND meta_value = ""
			ORDER BY user_id
			LIMIT %d',
			\array_merge( [ $wpdb->usermeta ], $meta_to_check, [ $limit ] )
		);
		// phpcs:enable

		// phpcs:disable WordPress.DB.DirectDatabaseQuery.NoCaching -- Reason: No relevant caches.
		// phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery -- Reason: Most performant way.
		// phpcs:disable WordPress.DB.PreparedSQL.NotPrepared -- Reason: Is it prepared already.
		return $wpdb->query( $delete_query );
		// phpcs:enable
	}

	/**
	 * Gets which meta are going to be checked for emptiness.
	 *
	 * @return array<string> The meta to be checked for emptiness.
	 */
	private function get_meta_to_check() {
		$additional_contactmethods = $this->additional_contactmethods_repository->get_additional_contactmethods_keys();
		$custom_meta               = $this->custom_meta_repository->get_non_empty_custom_meta();

		return \array_merge( $additional_contactmethods, $custom_meta );
	}
}
