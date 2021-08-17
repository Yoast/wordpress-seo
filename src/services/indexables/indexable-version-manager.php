<?php

namespace Yoast\WP\SEO\Services\Indexables;

use Yoast\WP\SEO\Config\Indexable_Builder_Versions;
use Yoast\WP\SEO\Models\Indexable;

/**
 * Handles version control for Indexables.
 */
class Indexable_Version_Manager {

	/**
	 * Stores the version of each Indexable type.
	 *
	 * @var Indexable_Builder_Versions
	 */
	protected $indexable_builder_versions;

	public function __construct( Indexable_Builder_Versions $indexable_builder_versions ) {
		$this->indexable_builder_versions = $indexable_builder_versions;
	}

	/**
	 * Determines if an indexable has a lower version than the builder for that indexable's type.
	 *
	 * @param $indexable Indexable The indexable to check.
	 *
	 * @return boolean True if the given version is older than the current latest version.
	 */
	public function indexable_needs_upgrade( $indexable ) {
		if ( ! $indexable || ! is_subclass_of( $indexable, Indexable::class ) ) {
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
		$version = $this->indexable_builder_versions->get_latest_version_for_type( $object_type );

		// If the indexable's version is below the current version, that indexable needs updating.
		return $indexable_version < $version;
	}
}
