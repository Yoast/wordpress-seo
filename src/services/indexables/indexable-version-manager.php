<?php

namespace Yoast\WP\SEO\Services\Indexables;

use Yoast\WP\SEO\Models\Indexable;

/**
 * Handles version control for Indexables.
 */
class Indexable_Version_Manager {

	const DEFAULT_INDEXABLE_VERSION = 1;

	/**
	 * The list of indexable builder versions defined by Yoast SEO Free.
	 *
	 * @var array
	 */
	protected $indexable_versions_by_type = [
		'general' => self::DEFAULT_INDEXABLE_VERSION,
		'post' => self::DEFAULT_INDEXABLE_VERSION,
		'post_type_archive' => self::DEFAULT_INDEXABLE_VERSION,
		'term' => self::DEFAULT_INDEXABLE_VERSION,
		'post_link' => self::DEFAULT_INDEXABLE_VERSION,
		'term_link' => self::DEFAULT_INDEXABLE_VERSION,
	];

	/**
	 * Provides the indexable versions
	 *
	 * @return array
	 */
	public function get_version_by_type() {
		return $this->indexable_versions_by_type;
	}

	/**
	 * Provides the most recent version number for an Indexable's object type.
	 *
	 * @param $object_type string The Indexable type for which you want to know the most recent version.
	 *
	 * @return int The most recent version number for the type, or 1 if the version doesn't exist.
	 */
	public function get_latest_version_for_type( $object_type ) {
		$versions = $this->get_version_by_type();

		if ( ! \array_key_exists( $object_type, $versions ) ) {
			return self::DEFAULT_INDEXABLE_VERSION;
		}

		return $versions[ $object_type ];
	}

	/**
	 * Determines if an indexable has a lower version than the builder for that indexable's type.
	 *
	 * @param $indexable Indexable The indexable to check.
	 *
	 * @return boolean True if the given version is older than the current latest version.
	 */
	public function indexable_needs_upgrade( $indexable ) {
		if ( ! $indexable ) {
			return false;
		}

		return $this->needs_upgrade( $indexable->object_type, $indexable->version );
	}

	/**
	 * Determines if an indexable version for the type is lower than the current version for that indexable type.
	 *
	 * @param $object_type string The indexable's object type.
	 * @param $indexable_version int The indexable's version.
	 *
	 * @return boolean True if the given version is older than the current latest version.
	 */
	public function needs_upgrade( $object_type, $indexable_version ) {
		$versions =  $this->get_version_by_type();

		if ( ! \array_key_exists( $object_type, $versions ) ) {
			return 0;
		}

		// If the indexable's version is below the current version, that indexable needs updating.
		return $indexable_version < $versions[ $object_type ];
	}
}
