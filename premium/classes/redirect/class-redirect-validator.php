<?php
/**
 * @package WPSEO\Premium\Classes\Redirect
 */

/**
 * The validation class.
 */
class WPSEO_Redirect_Validator {

	/**
	 * @var array
	 */
	protected $validation_rules = array(
		'self-redirect' => array(
			'validation_class' => 'WPSEO_Redirect_Self_Redirect_Validation',
			'exclude_types'  => array(),
			'exclude_format' => array( WPSEO_Redirect::FORMAT_REGEX ),
		),
		'uniqueness' => array(
			'validation_class' => 'WPSEO_Redirect_Uniqueness_Validation',
			'exclude_types'  => array(),
			'exclude_format' => array(),
		),
		'presence'     => array(
			'validation_class' => 'WPSEO_Redirect_Presence_Validation',
			'exclude_types'  => array(),
			'exclude_format' => array(),
		),
		'subdirectory-presence'  => array(
			'validation_class' => 'WPSEO_Redirect_Subdirectory_Validation',
			'exclude_types'  => array(),
			'exclude_format' => array(),
		),
		'accessible' => array(
			'validation_class' => 'WPSEO_Redirect_Accessible_Validation',
			'exclude_types'  => array( WPSEO_Redirect::DELETED, WPSEO_Redirect::UNAVAILABLE ),
			'exclude_format' => array(),
		),
		'endpoint'   => array(
			'validation_class' => 'WPSEO_Redirect_Endpoint_Validation',
			'exclude_types'  => array( WPSEO_Redirect::DELETED, WPSEO_Redirect::UNAVAILABLE ),
			'exclude_format' => array( WPSEO_Redirect::FORMAT_REGEX ),
		),
	);

	/**
	 * @var bool|string The validation error.
	 */
	protected $validation_error = false;

	/**
	 * Validates the old and the new URL
	 *
	 * @param WPSEO_Redirect $redirect		   The redirect that will be saved.
	 * @param WPSEO_Redirect $current_redirect Redirect that will be used for comparison.
	 *
	 * @return bool|string
	 */
	public function validate( WPSEO_Redirect $redirect, WPSEO_Redirect $current_redirect = null ) {

		$validators = $this->get_validations( $this->get_filtered_validation_rules( $this->validation_rules, $redirect ) );
		$redirects  = $this->get_redirects( $redirect->get_format() );

		$this->validation_error = '';
		foreach ( $validators as $validator ) {
			if ( ! $validator->run( $redirect, $current_redirect, $redirects ) ) {
				$this->validation_error = $validator->get_error();

				return false;
			}
		}

		return true;
	}

	/**
	 * Returns the validation error
	 *
	 * @return WPSEO_Validation_Result
	 */
	public function get_error() {
		return $this->validation_error;
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
	protected function get_filtered_validation_rules( array $validations, WPSEO_Redirect $redirect ) {
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
	 * Getting the validations based on the set validation rules.
	 *
	 * @param array $validation_rules The rules for the validations that will be run.
	 *
	 * @return WPSEO_Redirect_Validation[]
	 */
	protected function get_validations( $validation_rules ) {
		$validations = array();
		foreach ( $validation_rules as $validation_rule ) {
			$validations[] = new $validation_rule['validation_class']();
		}

		return $validations;
	}

	/**
	 * Fill the redirect property
	 *
	 * @param string $format The format for the redirects.
	 *
	 * @return array
	 */
	protected function get_redirects( $format ) {
		$redirect_manager = new WPSEO_Redirect_Manager( $format );

		// Format the redirects.
		$redirects = array();
		foreach ( $redirect_manager->get_all_redirects() as $redirect ) {
			$redirects[ $redirect->get_origin() ] = $redirect->get_target();
		}

		return $redirects;
	}
}
