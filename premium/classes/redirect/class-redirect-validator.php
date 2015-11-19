<?php
/**
 * @package WPSEO\Premium\Classes\Redirect
 */

/**
 * Class WPSEO_Redirect_Validate
 */
class WPSEO_Redirect_Validator {

	/**
	 * @var array
	 */
	protected $validation_rules = array(
		'uniqueness' => array(
			'validation_class' => 'WPSEO_Redirect_Validate_Uniqueness',
			'exclude_types'  => array(),
			'exclude_format' => array(),
		),
		'filled'     => array(
			'validation_class' => 'WPSEO_Redirect_Validate_Filled',
			'exclude_types'  => array(),
			'exclude_format' => array(),
		),
		'accessible' => array(
			'validation_class' => 'WPSEO_Redirect_Validate_Accessible',
			'exclude_types'  => array( WPSEO_Redirect::DELETED ),
			'exclude_format' => array(),
		),
		'endpoint'   => array(
			'validation_class' => 'WPSEO_Redirect_Validate_Endpoint',
			'exclude_types'  => array( WPSEO_Redirect::DELETED ),
			'exclude_format' => array( WPSEO_Redirect::FORMAT_REGEX ),
		),
	);

	/**
	 * @var bool|string The validation error.
	 */
	protected $validation_error = false;

	/**
	 * Validates the old and the new url
	 *
	 * @param WPSEO_Redirect $redirect		   The redirect that will be saved.
	 * @param WPSEO_Redirect $current_redirect Redirect that will be used for comparison.
	 *
	 * @return bool|string
	 */
	public function validate( WPSEO_Redirect $redirect, WPSEO_Redirect $current_redirect = null ) {

		$validators = $this->get_validators( $this->get_validations( $redirect, $current_redirect ) );
		$redirects  = $this->get_redirects( $redirect->get_format() );

		$this->validation_error = '';
		foreach ( $validators as $validator ) {
			if ( ! $validator->validate( $redirect, $redirects ) ) {
				$this->validation_error = $validator->get_error();

				return false;
			}
		}

		return true;
	}

	/**
	 * Returns the validation error
	 *
	 * @return bool|string
	 */
	public function get_error() {
		return $this->validation_error;
	}

	/**
	 * Filters the validations_rules based on the passed redirect.
	 *
	 * @param WPSEO_Redirect $redirect		   The redirect that will be saved.
	 * @param WPSEO_Redirect $current_redirect Redirect that will be used for comparison.
	 *
	 * @return array
	 */
	protected function get_validations( WPSEO_Redirect $redirect, WPSEO_Redirect $current_redirect = null ) {

		// Set the validation rules.
		$validations = $this->validation_rules;

		// Remove uniqueness validation when old origin is the same as the current one.
		if ( is_a( $current_redirect, 'WPSEO_Redirect' ) && $redirect->get_origin() === $current_redirect->get_origin() ) {
			$this->remove_rule( $validations, 'uniqueness' );
		}

		return $this->filter_rules( $validations, $redirect );
	}

	/**
	 * Removes a rule from the validations
	 *
	 * @param array  $validations    Array with the validations.
	 * @param string $rule_to_remove The rule that will be removed.
	 */
	protected function remove_rule( & $validations, $rule_to_remove ) {
		if ( array_key_exists( $rule_to_remove, $validations ) ) {
			unset( $validations[ $rule_to_remove ] );
		}
	}

	/**
	 * Filters the validation rules.
	 *
	 * @param array          $validations Array with validation rules.
	 * @param WPSEO_Redirect $redirect    The redirect that will be saved.
	 *
	 * @return array
	 */
	protected function filter_rules( array $validations, WPSEO_Redirect $redirect ) {
		foreach ( $validations as $validation => $validation_rules ) {
			$exclude_format = in_array( $redirect->get_format(), $validation_rules['exclude_format'] );
			$exclude_type   = in_array( $redirect->get_type(), $validation_rules['exclude_types'] );

			if ( $exclude_format || $exclude_type ) {
				$this->remove_rule( $validations, $validation );
			}
		}

		return $validations;
	}

	/**
	 *
	 * Getting the validators based on the set validations.
	 *
	 * @param array $validations The validations that will be run.
	 *
	 * @return WPSEO_Redirect_Validate[]
	 */
	protected function get_validators( $validations ) {
		$validators = array();
		foreach ( $validations as $validation_rules ) {
			$validators[] = new $validation_rules['validation_class']();
		}

		return $validators;
	}

	/**
	 * Fill the redirect property
	 *
	 * @param string $format The format for the redirects.
	 *
	 * @return array
	 */
	protected function get_redirects( $format ) {
		$redirect_option = new WPSEO_Redirect_Option();
		$redirect_option->set_format( $format );
		$redirect_option->set_redirects();

		// Format the redirects.
		$redirects = array();
		foreach ( $redirect_option->get_filtered_redirects() as $redirect ) {
			$redirects[ $redirect->get_origin() ] = $redirect->get_target();
		}

		return $redirects;
	}

}
