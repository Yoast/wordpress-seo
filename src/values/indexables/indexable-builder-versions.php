<?php

namespace Yoast\WP\SEO\Values\Indexables;

/**
 * Class Indexable_Builder_Versions
 */
class Indexable_Builder_Versions {

	const DEFAULT_INDEXABLE_BUILDER_VERSION = 1;

	/**
	 * The list of indexable builder versions defined by Yoast SEO Free.
	 * If the key is not in this list, the indexable type will not be managed.
	 * These numbers should be increased if one of the builders implements a new feature.
	 *
	 * When you change the version of the indexable builder, change the plugin version number of the comment too.
	 * This is to prevent the same builder version to be increased to the same version in multiple PRs across multiple releases.
	 * When 2 PRs change the same builder version for the same release, it won't cause merge conflicts - which is OK, as it is the same release
	 * But if the same version number is used for two separate releases, the later release should use a higher builder version number.
	 *
	 * @var array
	 */
	protected $indexable_builder_versions_by_type = [
		'date-archive'      => 2, // Since 17.9.
		'general'           => 2, // Since 17.9.
		'home-page'         => 3, // Since 17.9.
		'post'              => 3, // Since 17.9.
		'post-type-archive' => 3, // Since 17.9.
		'term'              => 3, // Since 17.9.
		'user'              => 3, // Since 17.9.
		'system-page'       => 2, // Since 17.9.
	];

	/**
	 * Provides the most recent version number for an Indexable's object type.
	 *
	 * @param string $object_type The Indexable type for which you want to know the most recent version.
	 *
	 * @return int The most recent version number for the type, or 1 if the version doesn't exist.
	 */
	public function get_latest_version_for_type( $object_type ) {
		if ( ! \array_key_exists( $object_type, $this->indexable_builder_versions_by_type ) ) {
			return self::DEFAULT_INDEXABLE_BUILDER_VERSION;
		}

		return $this->indexable_builder_versions_by_type[ $object_type ];
	}

	/**
	 * Get a unique key for the current state of all combined indexable versions.
	 *
	 * @return string a unique key for the current state of all combined indexable versions.
	 */
	public function get_combined_version_key() {
		return implode( '-', array_values( $this->indexable_builder_versions_by_type ) );
	}

	/**
	 * Compares two combined indexable builder version strings.
	 *
	 * @param string $version_1 The first version to compare.
	 * @param string $operator The compare operator.  <, lt, >, gt, !=, <>, ne, <=,le, >=, ge, ==, = or eq.
	 * @param string $version_2 The second version to compare.
	 *
	 * @return bool True if the version comparison holds true, false otherwise.
	 */
	public function version_compare( $version_1, $operator, $version_2 ) {
		$version_1_list = explode( '-', $version_1 );
		$version_2_list = explode( '-', $version_2 );

		if ( count( $version_1_list ) !== count( $version_2_list ) ) {
			throw new \InvalidArgumentException( 'Expected both strings to consist of an equal number of versions. "' . $version_1 . '" and "' . $version_2 . '" given' );
		}

		$number_of_versions = count( $version_1_list );

		if ( in_array( $operator, [ '<', 'lt', '>', 'gt', ] ) ) {
			$has_at_least_once_match = false;
			for ( $i = 0; $i < $number_of_versions; $i++ ) {
				// The rest may be equal, as long as one version matches the operator.
				if ( \version_compare( $version_1_list[ $i ], $version_2_list[ $i ], $operator ) ) {
					$has_at_least_once_match = true;
				}
				else if ( ! \version_compare( $version_1_list[ $i ], $version_2_list[ $i ], '==' ) ) {
					return false;
				}
			}

			return $has_at_least_once_match;
		}

		if ( in_array( $operator, [ '!=', '<>', 'ne' ] ) ) {
			for ( $i = 0; $i < $number_of_versions; $i++ ) {
				if ( \version_compare( $version_1_list[ $i ], $version_2_list[ $i ], $operator ) ) {
					return true;
				}
			}

			return false;
		}

		// Remaining cases: <=,le, >=, ge, ==, =, eq.
		for ( $i = 0; $i < $number_of_versions; $i++ ) {
			if ( ! \version_compare( $version_1_list[ $i ], $version_2_list[ $i ], $operator ) ) {
				return false;
			}
		}

		return true;
	}
}
