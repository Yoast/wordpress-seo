<?php
/**
 * Yoast extension of the Model class.
 *
 * @package Yoast\WP\SEO\Repositories
 */

namespace Yoast\WP\SEO\Repositories;

use Yoast\WP\Lib\Model;
use Yoast\WP\Lib\ORM;

/**
 * Class SEO_Meta_Repository
 */
class SEO_Meta_Repository {

	/**
	 * SEO_Meta_Repository constructor.
	 *
	 * @deprecated 14.8
	 */
	public function __construct() {
		\_deprecated_function( __METHOD__, '14.8' );
	}

	/**
	 * Starts a query for this repository.
	 *
	 * @deprecated 14.8
	 *
	 * @return ORM
	 */
	public function query() {
		\_deprecated_function( __METHOD__, '14.8' );
		return Model::of_type( 'SEO_Meta' );
	}
}
