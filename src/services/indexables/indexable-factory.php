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
	 * Ensures we have a valid indexable. Creates an indexable if a falsey value is passed.
	 *
	 * @param Indexable $indexable The indexable.
	 * @param string    $type      The Indexable type.
	 *
	 * @return Indexable The indexable.
	 */
	protected function ensure_indexable( $indexable, $type ) {
		if ( ! $indexable ) {
			$indexable = $this->create( $type );
		}

		return $indexable;
	}

	/**
	 * Creates an Indexable of the specified type
	 *
	 * @param string $object_type The object type to create an indexable for.
	 *
	 * @return Indexable The newly created indexable.
	 */
	public function create ( $object_type = '' ) {
		$defaults = $this->get_defaults( $object_type );
		return $this->indexable_repository->query()->create( $defaults );
	}

	/**
	 * Prepares an array of properties for a given indexable type.
	 *
	 * @param null $type The indexable type to create default properties for.
	 *
	 * @return array
	 */
	protected function get_defaults ( $type = null ) {
		if ( ! $type ) return [];

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

			// System Pages set their type in the subtype.
			case '404':
			case 'search-result':
				return [
					'object_type'     => 'system-page',
					'object_sub_type' => $type,
				];
		}
	}
}
