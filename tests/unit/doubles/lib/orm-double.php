<?php

namespace doubles\lib;

use Yoast\WP\Lib\ORM;

/**
 * Class Orm_Double.
 */
class Orm_Double extends ORM {

	/**
	 * "Public" constructor; shouldn't be called directly.
	 * Use the ORM::for_table factory method instead.
	 *
	 * @param string $table_name Table name.
	 * @param array  $data       Data to populate table.
	 */
	public function __construct( $table_name, $data = [] ) {
		$this->table_name = $table_name;
		$this->data       = $data;
	}
}
