<?php
/**
 * The abstract presentation class.
 *
 * @package Yoast\YoastSEO\Presentations
 */

namespace Yoast\WP\Free\Presentations;

use Exception;

/**
 * Class Abstract_Presentation
 */
class Abstract_Presentation {

	/**
	 * @var mixed
	 */
	protected $model;

	/**
	 * @var bool
	 */
	private $is_prototype = true;

	/**
	 * Creates a model presentation.
	 *
	 * @param mixed $model The model that this is a presentation of.
	 *
	 * @return self A model presentation.
	 *
	 * @throws Exception If attempting to create a model presentation from another model presentation.
	 */
	public function of( $model ) {
		if ( ! $this->is_prototype ) {
			throw new Exception( 'Attempting to create a model presentation from another model presentation. Use the prototype presentation gained from DI instead.' );
		}

		// Clone self to allow stateful services that do benefit from DI.
		$presentation = clone $this;
		$presentation->model = $model;
		$presentation->is_prototype = false;
		return $presentation;
	}

	/**
	 * Magic getter for lazy loading of generate functions.
	 *
	 * @param string $name The property to get.
	 *
	 * @return mixed The value if it could be generated.
	 *
	 * @throws Exception If there is no generator for the property.
	 */
	public function __get( $name ) {
		if ( $this->is_prototype ) {
			throw new Exception( 'Attempting property access on prototype presentation. Use Presentation::of( \$model ) to get a model presentation.' );
		}
		$generator = "generate_$name";
		if ( method_exists( $this, $generator ) ) {
			$this->{$name} = $this->$generator();
			return $this->{$name};
		}
		throw new Exception( "Property $name has no generator. Expected function $generator." );
	}
}
