<?php

namespace Yoast\WP\SEO\Actions\Options;

use Yoast\WP\SEO\Exceptions\Option\Form_Invalid_Exception;
use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * Gets or sets the options.
 */
class Options_Action {

	/**
	 * Holds the Options_Helper instance.
	 *
	 * @var Options_Helper
	 */
	protected $options_helper;

	/**
	 * Constructs an Options_Action instance.
	 *
	 * @param Options_Helper $options_helper The Options_Helper instance.
	 */
	public function __construct( Options_Helper $options_helper ) {
		$this->options_helper = $options_helper;
	}

	/**
	 * Retrieves the options.
	 *
	 * @param string[] $keys Optionally request only these options.
	 *
	 * @return array The options.
	 */
	public function get( array $keys = [] ) {
		return $this->options_helper->get_options( $keys );
	}

	/**
	 * Sets the options.
	 *
	 * @param array $options The options.
	 *
	 * @return array The result, containing `success` and `error` keys.
	 */
	public function set( $options ) {
		$result = $this->options_helper->set_options( $options );

		if ( $result['success'] ) {
			return $result;
		}

		if ( $result['error'] instanceof Form_Invalid_Exception ) {
			foreach ( $result['error']->get_field_exceptions() as $option => $field_exception ) {
				$result['field_errors'][ $option ] = $field_exception->getMessage();
			}
		}
		$result['error'] = $result['error']->getMessage();

		return $result;
	}
}
