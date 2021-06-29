<?php

namespace Yoast\WP\SEO\Presenters;

use WPSEO_Replace_Vars;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Surfaces\Helpers_Surface;

/**
 * Abstract presenter class for indexable presentations.
 */
abstract class Abstract_Indexable_Presenter extends Abstract_Presenter {

	/**
	 * The WPSEO Replace Vars object.
	 *
	 * @var WPSEO_Replace_Vars
	 */
	public $replace_vars;

	/**
	 * The indexable presentation.
	 *
	 * @var Indexable_Presentation
	 */
	public $presentation;

	/**
	 * The helpers surface
	 *
	 * @var Helpers_Surface
	 */
	public $helpers;

	/**
	 * The tag key name.
	 *
	 * @var string
	 */
	protected $key = 'NO KEY PROVIDED';

	/**
	 * Gets the raw value of a presentation.
	 *
	 * @return string|array The raw value.
	 */
	abstract public function get();

	/**
	 * Returns a tag in the head.
	 *
	 * @return string The tag.
	 *
	 * @throws \InvalidArgumentException When a subclass does not define a key property. This should appear during development.
	 */
	public function present() {
		if ( $this->key === 'NO KEY PROVIDED' ) {
			throw new \InvalidArgumentException( \get_class( $this ) . ' is an Abstract_Indexable_Presenter but does not override the key property.' );
		}

		$value = $this->get();

		if ( \is_string( $value ) && $value !== '' ) {
			return \sprintf( $this->tag_format, $this->escape_value( $value ), $this->key );
		}

		return '';
	}

	/**
	 * Transforms an indexable presenter's key to a json safe key string.
	 *
	 * @return string
	 */
	public function escape_key() {
		if ( $this->key === 'NO KEY PROVIDED' ) {
			return null;
		}
		return \str_replace( [ ':', ' ', '-' ], '_', $this->key );
	}

	/**
	 * Replace replacement variables in a string.
	 *
	 * @param string $string The string.
	 *
	 * @return string The string with replacement variables replaced.
	 */
	protected function replace_vars( $string ) {
		return $this->replace_vars->replace( $string, $this->presentation->source );
	}
}
