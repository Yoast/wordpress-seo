<?php
/**
 * Yoast extension of the Model class.
 *
 * @package Yoast\YoastSEO\ORM\Repositories
 */

namespace Yoast\WP\Free\ORM\Repositories;

use Yoast\WP\Free\ORM\ORMWrapper;
use Yoast\WP\Free\ORM\Yoast_Model;

/**
 * Class SEO_Meta_Repository
 *
 * WARNING: This class merely exists for type hints and dependency injection.
 * Instances of this class will actually be instances of ORMWrapper and any functions and/or methods here will not be represented.
 *
 * @package Yoast\WP\Free\ORM\Repositories
 */
class SEO_Meta_Repository extends ORMWrapper {
	public static function get_instance() {
		return Yoast_Model::of_type( 'SEO_Meta' );
	}
}
