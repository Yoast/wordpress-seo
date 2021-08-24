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
	 * @var $indexable_builder_versions Indexable_Builder_Versions The current versions of all indexable builders.
	 */
	protected $indexable_builder_versions;

	public function __construct( Indexable_Builder_Versions $indexable_builder_versions ) {
		$this->indexable_builder_versions = $indexable_builder_versions;
	}

	/**
	 * Determines if an Indexable has a lower version than the builder for that Indexable's type.
	 *
	 * @param $indexable Indexable The Indexable to check.
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
	 * Determines if an Indexable version for the type is lower than the current version for that Indexable type.
	 *
	 * @param $object_type       string The Indexable's object type.
	 * @param $indexable_version int    The Indexable's version.
	 *
	 * @return boolean True if the given version is older than the current latest version.
	 */
	public function needs_upgrade( $object_type, $indexable_version ) {
		$current_indexable_builder_version = $this->indexable_builder_versions->get_latest_version_for_type( $object_type );

		// If the Indexable's version is below the current version, that Indexable needs updating.
		return ( $indexable_version ? $indexable_version : 1 ) < $current_indexable_builder_version;
	}

	/**
	 * Sets an Indexable's version to the latest version.
	 *
	 * @param $indexable Indexable The Indexable to update.
	 *
	 * @return Indexable
	 */
	public function set_latest( $indexable ) {
		if ( ! $indexable ) {
			return $indexable;
		}
		$indexable->version = $this->indexable_builder_versions->get_latest_version_for_type( $indexable->object_type );

		return $indexable;
	}
}
