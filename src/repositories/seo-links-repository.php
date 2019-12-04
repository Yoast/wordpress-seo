<?php
/**
 * Yoast extension of the Model class.
 *
 * @package Yoast\YoastSEO\ORM\Repositories
 */

namespace Yoast\WP\Free\Repositories;

use Yoast\WP\Free\ORM\ORMWrapper;
use Yoast\WP\Free\ORM\Yoast_Model;

/**
 * Class SEO_Links_Repository
 *
 * WARNING: This class merely exists for type hints and dependency injection.
 * Instances of this class will actually be instances of ORMWrapper and any functions and/or methods here will not be represented.
 *
 * @package Yoast\WP\Free\ORM\Repositories
 */
class SEO_Links_Repository extends ORMWrapper {

	/**
	 * Returns the instance of this class constructed through the ORM Wrapper.
	 *
	 * @return \Yoast\WP\Free\Repositories\SEO_Links_Repository
	 */
	public static function get_instance() {
		ORMWrapper::$repositories[ Yoast_Model::get_table_name( 'SEO_Links' ) ] = self::class;

		return Yoast_Model::of_type( 'SEO_Links' );
	}
}
