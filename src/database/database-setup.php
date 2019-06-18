<?php
/**
 * Yoast SEO Plugin File.
 *
 * @package Yoast\YoastSEO\Config
 */

namespace Yoast\WP\Free\Database;

use Yoast\WP\Free\Conditionals\No_Conditionals;
use Yoast\WP\Free\WordPress\Initializer;
use Yoast\WP\Free\Yoast_Model;
use YoastSEO_Vendor\ORM;

/**
 * Configures the ORM with the database credentials.
 */
class Database_Setup implements Initializer {
	use No_Conditionals;

	/**
	 * @inheritdoc
	 */
	public function initialize() {
		ORM::configure( 'mysql:host=' . \DB_HOST . ';dbname=' . \DB_NAME );
		ORM::configure( 'username', \DB_USER );
		ORM::configure( 'password', \DB_PASSWORD );

		Yoast_Model::$auto_prefix_models = '\\Yoast\\WP\\Free\\Models\\';
	}
}
