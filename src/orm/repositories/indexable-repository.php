<?php

namespace Yoast\WP\Free\ORM\Repositories;

use Yoast\WP\Free\ORM\ORMWrapper;
use Yoast\WP\Free\ORM\Yoast_Model;

class Indexable_Repository extends ORMWrapper {
	public static function get_instance() {
		return Yoast_Model::of_type( 'Indexable' );
	}
}
