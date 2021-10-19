<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles;

use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Services\Indexables\Indexable_Factory;

/**
 * Class Main_Double.
 */
class Indexable_Factory_Double extends Indexable_Factory {

	/**
	 * Ensures we have a valid indexable. Creates an indexable if a falsey value is passed.
	 *
	 * @param Indexable $indexable The indexable.
	 * @param string    $type      The Indexable type.
	 *
	 * @codeCoverageIgnore this is a double
	 *
	 * @return Indexable The indexable.
	 */
	public function double_ensure_indexable( $indexable, $type ) {
		return parent::ensure_indexable( $indexable, $type );
	}

	/**
	 * Prepares an array of properties for a given indexable type.
	 *
	 * @param null $type The indexable type to create default properties for.
	 *
	 * @codeCoverageIgnore this is a double
	 *
	 * @return array
	 */
	public function double_get_defaults ( $type = null ) {
		return parent::get_defaults( $type );
	}
}
