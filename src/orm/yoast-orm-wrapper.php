<?php
/**
 * Yoast extension of the ORM class.
 *
 * @package Yoast\YoastSEO
 */

namespace Yoast\WP\SEO\ORM;

use Exception;
use PDO;
use Yoast\WP\Polyfills\PDO\PDO_MySQLi_Polyfill;
use Yoast\WP\SEO\Presenters\Admin\Migration_Error_Presenter;
use YoastSEO_Vendor\ORM;

/**
 * Subclass of Idiorm's ORM class that supports
 * returning instances of a specified class rather
 * than raw instances of the ORM class.
 *
 * You shouldn't need to interact with this class
 * directly. It is used internally by the Model base
 * class.
 *
 * The methods documented below are magic methods that conform to PSR-1.
 * This documentation exposes these methods to doc generators and IDEs.
 *
 * @link http://www.php-fig.org/psr/psr-1/
 *
 * @method void setClassName($class_name)
 * @method static \Yoast\WP\SEO\ORM\ORMWrapper forTable($table_name, $connection_name = parent::DEFAULT_CONNECTION)
 * @method \Yoast\WP\SEO\ORM\\Model findOne($id=null)
 * @method Array|\IdiormResultSet findMany()
 */
class ORMWrapper extends ORM {

	/**
	 * Contains the repositories.
	 *
	 * @var array
	 */
	public static $repositories = [];

	/**
	 * The wrapped find_one and find_many classes will return an instance or
	 * instances of this class.
	 *
	 * @var string
	 */
	protected $class_name;

	/**
	 * Set the name of the class which the wrapped methods should return
	 * instances of.
	 *
	 * @param string $class_name The classname to set.
	 *
	 * @return void
	 */
	public function set_class_name( $class_name ) {
		$this->class_name = $class_name;
	}

	/**
	 * Add a custom filter to the method chain specified on the model class.
	 * This allows custom queries to be added to models. The filter should take
	 * an instance of the ORM wrapper as its first argument and return an
	 * instance of the ORM wrapper. Any arguments passed to this method after
	 * the name of the filter will be passed to the called filter function as
	 * arguments after the ORM class.
	 *
	 * @return \Yoast\WP\SEO\ORM\ORMWrapper Instance of the ORM wrapper.
	 */
	public function filter() {
		$args            = \func_get_args();
		$filter_function = \array_shift( $args );
		\array_unshift( $args, $this );
		if ( \method_exists( $this->class_name, $filter_function ) ) {
			return \call_user_func_array( [ $this->class_name, $filter_function ], $args );
		}

		return null;
	}

	/**
	 * Factory method, return an instance of this class bound to the supplied
	 * table name.
	 *
	 * A repeat of content in parent::for_table, so that created class is
	 * ORMWrapper, not ORM.
	 *
	 * @param string $table_name      The table to create instance for.
	 * @param string $connection_name The connection name.
	 *
	 * @return \Yoast\WP\SEO\ORM\ORMWrapper Instance of the ORM wrapper.
	 */
	public static function for_table( $table_name, $connection_name = parent::DEFAULT_CONNECTION ) {
		static::_setup_db( $connection_name );
		return new static( $table_name, [], $connection_name );
	}

	/**
	 * Method to create an instance of the model class associated with this
	 * wrapper and populate it with the supplied Idiorm instance.
	 *
	 * @param \Yoast\WP\SEO\ORM\ORMWrapper|\YoastSEO_Vendor\ORM $orm The ORM used by model.
	 *
	 * @return bool|\Yoast\WP\SEO\ORM\Yoast_Model Instance of the model class.
	 */
	protected function create_model_instance( $orm ) {
		if ( $orm === false ) {
			return false;
		}

		/**
		 * An instance of Yoast_Model is being made.
		 *
		 * @var \Yoast\WP\SEO\ORM\Yoast_Model $model
		 */
		$model = new $this->class_name();
		$model->set_orm( $orm );

		return $model;
	}

	/**
	 * Wrap Idiorm's find_one method to return an instance of the class
	 * associated with this wrapper instead of the raw ORM class.
	 *
	 * @param null|integer $id The ID to lookup.
	 *
	 * @return \Yoast\WP\SEO\ORM\Yoast_Model Instance of the model.
	 */
	public function find_one( $id = null ) {
		return $this->create_model_instance( parent::find_one( $id ) );
	}

	/**
	 * Wrap Idiorm's find_many method to return an array of instances of the
	 * class associated with this wrapper instead of the raw ORM class.
	 *
	 * @return array The found results.
	 */
	public function find_many() {
		$results = parent::find_many();
		foreach ( $results as $key => $result ) {
			$results[ $key ] = $this->create_model_instance( $result );
		}

		return $results;
	}

	/**
	 * Wrap Idiorm's create method to return an empty instance of the class
	 * associated with this wrapper instead of the raw ORM class.
	 *
	 * @param null|mixed $data The data to pass.
	 *
	 * @return \Yoast\WP\SEO\ORM\Yoast_Model|bool Instance of the ORM.
	 */
	public function create( $data = null ) {
		return $this->create_model_instance( parent::create( $data ) );
	}

	/**
	 * Returns the select query as SQL.
	 *
	 * @return string The select query in SQL.
	 */
	public function get_sql() {
		return $this->_build_select();
	}

	/**
	 * Returns the update query as SQL.
	 *
	 * @return string The update query in SQL.
	 */
	public function get_update_sql() {
		return $this->_build_update();
	}

	/**
	 * Set up the database connection used by the class
	 *
	 * @param string $connection_name Which connection to use.
	 */
	protected static function _setup_db( $connection_name = self::DEFAULT_CONNECTION ) {
		if (
			! array_key_exists( $connection_name, self::$_db ) ||
			! is_object( self::$_db[ $connection_name ] )
		) {
			self::_setup_db_config( $connection_name );

			if ( extension_loaded( 'pdo_mysql' ) ) {
				// @codingStandardsIgnoreStart -- Reason: This is part of a well-tested library.
				$db = new PDO(
					self::$_config[ $connection_name ]['connection_string'],
					self::$_config[ $connection_name ]['username'],
					self::$_config[ $connection_name ]['password'],
					self::$_config[ $connection_name ]['driver_options']
				);
				$db->setAttribute( PDO::ATTR_ERRMODE, self::$_config[ $connection_name ]['error_mode'] );
				// @codingStandardsIgnoreEnd -- Reason: This is part of a well-tested library.
			}
			else {
				$db = new PDO_MySQLi_Polyfill(
					self::$_config[ $connection_name ]['connection_string'],
					self::$_config[ $connection_name ]['username'],
					self::$_config[ $connection_name ]['password'],
					self::$_config[ $connection_name ]['driver_options']
				);
			}

			self::set_db( $db, $connection_name );
		}
	}

	/**
	 * Execute the SELECT query that has been built up by chaining methods
	 * on this class. Return an array of rows as associative arrays.
	 */
	protected function _run() {
		try {
			return parent::_run();
		} catch ( Exception $exception ) {
			// If the query fails run the migrations and try again.
			// Action is intentionally undocumented and should not be used by third-parties.
			\do_action( '_yoast_run_migrations' );
			$this->_reset_idiorm_state();

			try {
				return parent::_run();
			} catch ( Exception $another_exception ) {
				// If the query fails again, show the migration error.
				$this->show_migration_error_once();
			}
		}
	}

	/**
	 * Shows the migration error once and only once.
	 */
	protected function show_migration_error_once() {
		static $already_shown = false;

		if ( ! $already_shown ) {
			$already_shown = true;
			echo new Migration_Error_Presenter();
		}
	}
}
