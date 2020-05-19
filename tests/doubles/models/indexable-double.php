<?php
/**
 * Class Indexable.
 *
 * @package Yoast\Tests\Doubles\Models
 */

namespace Yoast\WP\SEO\Tests\Doubles\Models;

use Yoast\WP\SEO\Models\Indexable as Indexable_Model;

/**
 * Class Indexable_Double.
 */
class Indexable_Double extends Indexable_Model {

	/**
	 * Holds the return value for has_one. Making it possible to mock that.
	 *
	 * @var null|\Mockery\MockInterface
	 */
	public $mock_has_one = null;

	/**
	 * @inheritDoc
	 */
	protected $uses_timestamps = false;

	/**
	 * @inheritDoc
	 */
	protected $loaded_extensions = [
		'extension' => 'expected extension',
		'has_one'   => false,
	];

	/**
	 * @inheritDoc
	 */
	public function has_one( $associated_class_name, $foreign_key_name = null, $foreign_key_name_in_current_models_table = null ) {
		return $this->mock_has_one;
	}
}
