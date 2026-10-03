<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles\Models;

use Mockery\MockInterface;
use Yoast\WP\SEO\Models\Indexable as Indexable_Model;
use Yoast\WP\SEO\Models\Indexable_Extension;

/**
 * Class Indexable_Double.
 */
final class Indexable_Double extends Indexable_Model {

	/**
	 * Holds the return value for has_one. Making it possible to mock that.
	 *
	 * @var MockInterface|null
	 */
	public $mock_has_one = null;

	/**
	 * Whether nor this model uses timestamps.
	 *
	 * @var bool
	 */
	protected $uses_timestamps = false;

	/**
	 * The loaded indexable extensions.
	 *
	 * @var Indexable_Extension[]
	 */
	protected $loaded_extensions = [
		'extension' => 'expected extension',
		'has_one'   => false,
	];

	/**
	 * Helper method to manage one-to-one relations where the foreign
	 * key is on the associated table.
	 *
	 * @param string      $associated_class_name                    The associated class name.
	 * @param string|null $foreign_key_name                         The foreign key name in the associated table.
	 * @param string|null $foreign_key_name_in_current_models_table The foreign key in the current models table.
	 *
	 * @return MockInterface|null
	 */
	public function has_one( $associated_class_name, $foreign_key_name = null, $foreign_key_name_in_current_models_table = null ) {
		return $this->mock_has_one;
	}
}
