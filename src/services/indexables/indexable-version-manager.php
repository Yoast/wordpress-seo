<?php

namespace Yoast\WP\SEO\Services\Indexables;

use Yoast\WP\SEO\Models\Indexable;

/**
 * Handles version control for Indexables.
 */
class Indexable_Version_Manager {

	/**
	 * The list of indexable builder versions defined by Yoast SEO Free.
	 *
	 * @var array
	 */
	protected $indexable_versions_by_type = [
		'post' => 1,
		'term' => 1,
		'link' => 1,
		'general' => 1,
		'post_link' => 1,
		'term_link' => 1,
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
	 * @return int The most recent version number for the type, or 0 if the version doesn't exist.
	 */
	public function get_latest_version_for_type( $object_type ) {
		$versions =  $this->get_version_by_type();

		if ( ! \array_key_exists( $object_type, $versions ) ) {
			return 0;
		}

		return $versions[ $object_type ];
	}

	/**
	 * Determines if an indexable has a lower version than the builder for that indexable's type.
	 *
	 * @param $indexable Indexable The indexable to check.
	 *
	 * @return boolean
	 */
	public function indexable_needs_upgrade( $indexable ) {
		if ( ! $indexable ) {
			return false;
		}

		return $this->needs_upgrade( $indexable->object_type, $indexable->version );
	}

	/**
	 * Determines if an indexable version for the type is lower than the builder for that indexable type.
	 *
	 * @param $object_type string The indexable's object type.
	 * @param $indexable_version int The indexable's version.
	 *
	 * @return boolean
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
