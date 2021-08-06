<?php

namespace Yoast\WP\SEO\Services\Indexables;

use Yoast\WP\SEO\Models\Indexable;

/**
 * Handles version control for Indexables.
 */
class Indexable_Upgrader {

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
	 * A cached list of all indexable versions to ensure the list is built only once.
	 *
	 * @var array
	 */
	private $cached_indexable_versions_by_type = [];

	/**
	 * Provides the indexa
	 *
	 * @return array
	 */
	protected function get_version_by_type() {
		if ( \count( $this->cached_indexable_versions_by_type ) > 0 ) {
			return $this->cached_indexable_versions_by_type;
		}

		$versions = $this->indexable_versions_by_type;

		$extended_versions = apply_filters( 'wpseo_register_indexable_versions_by_type', [] );
		if ( is_array( $extended_versions ) ) {
			$versions = \array_combine( $versions, $extended_versions );
		}

		// Save the built list for later.
		$this->cached_indexable_versions_by_type = $versions;

		return $versions;
	}

	/**
	 * Determines if an indexable is up to date.
	 *
	 * @param $indexable Indexable The indexable to check.
	 *
	 * @return boolean
	 */
	public function indexable_needs_upgrade( $indexable ) {
		if ( ! $indexable ) {
			return false;
		}

		$versions =  $this->get_version_by_type();

		if ( ! \array_key_exists( $indexable->object_type, $versions ) ) {
			throw new \InvalidArgumentException( $indexable->object_type . " does not have a current version" );
		}

		return $this->needs_upgrade( $indexable->object_type, $indexable->version );
	}

	/**
	 * Determines if an indexable is up to date.
	 *
	 * @param $object_type string The indexable's object type.
	 * @param $indexable_version int The indexable's version.
	 *
	 * @return boolean
	 */
	public function needs_upgrade( $object_type, $indexable_version ) {
		$versions =  $this->get_version_by_type();

		if ( ! \array_key_exists( $object_type, $versions ) ) {
			throw new \InvalidArgumentException( $object_type . " does not have a current version" );
		}

		// If the indexable's version is below the current version, that indexable needs updating.
		return $indexable_version < $versions[ $object_type ];
	}

}
