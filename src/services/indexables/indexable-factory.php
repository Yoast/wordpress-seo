<?php

namespace Yoast\WP\SEO\Services\Indexables;

use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

class Indexable_Factory
{
	/**
	 * Creates a new Indexable from the ORM layer.
	 *
	 * @var Indexable_Repository
	 */
	protected $indexable_repository;

	/**
	 * Indexable_Factory constructor.
	 *
	 * @param Indexable_Repository $repository Connects indexables to the ORM.
	 */
	public function __construct( Indexable_Repository $repository ) {
		$this->indexable_repository = $repository;
	}

	/**
	 * Ensures we have a valid indexable. Creates one if false is passed.
	 *
	 * @param Indexable|false $indexable The indexable.
	 * @param array           $defaults  The initial properties of the Indexable.
	 *
	 * @return Indexable The indexable.
	 */
	private function ensure_indexable( $indexable, $defaults = [] ) {
		if ( ! $indexable ) {
			return $this->indexable_repository->query()->create( $defaults );
		}

		return $indexable;
	}


	/**
	 * Creates an Indexable of the specified type
	 *
	 * @param string $object_type     The object type to create an indexable for.
	 * @param string $object_sub_type Optional. The object subtype to create an indexable for.
	 */
	public function create ( $object_type = '', $object_sub_type = '' ) {
		$defaults = [];

		if ( \array_key_exists( $object_type, $this->defaults ) ) {
			$defaults = $this->defaults[ $object_type ];
		}
	}

	/**
	 * Prepares an array of properties for a given indexable type.
	 *
	 * @param null $type The indexable type to create default properties for.
	 *
	 * @return array
	 */
	protected function get_defaults ( $type = null ) {
		if ( ! $type )
		switch ( $type ) {
			// Default indexable types.
			case 'date-archive':
			case 'home-page':
			case 'post':
			case 'term':
			case 'user':
			default:
				return [
					'object_type' => $type
				];

			// System Pages.
			case '404':
			case 'search-result':
				return [
					'object_type'     => 'system-page',
					'object_sub_type' => $type,
				];
		}
	}
}
