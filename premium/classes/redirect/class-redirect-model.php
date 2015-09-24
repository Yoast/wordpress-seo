<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * Class WPSEO_Redirect_Model
 */
class WPSEO_Redirect_Model {

	/**
	 * @var string
	 */
	private $option_name;

	/**
	 * @var array
	 */
	private $redirects = array();

	/**
	 * Constructing the model
	 *
	 * @param string $option_name The target option name where the redirects are stored.
	 */
	public function __construct( $option_name ) {
		$this->option_name = $option_name;
		$this->redirects   = $this->get_from_option();
	}

	/**
	 * Getting the array with all the redirects
	 *
	 * @return array
	 */
	public function get() {
		return $this->redirects;
	}

	/**
	 * Setting the redirect property with a new value
	 *
	 * @param array $redirects The array with all the redirects.
	 */
	public function set( array $redirects ) {

	}

	/**
	 * Check if the old redirect doesn't exist already, if not it will be added
	 *
	 * @param string $old_redirect The old redirect value.
	 * @param string $new_redirect The value of the new redirect.
	 * @param string $type		   The redirect type.
	 *
	 * @return bool
	 */
	public function add( $old_redirect, $new_redirect, $type ) {
		if ( ! $this->search( $old_redirect ) ) {
			$this->redirects[$old_redirect] = $this->format( $new_redirect, $type );

			return true;
		}

		return false;
	}

	/**
	 * Check if the $current_redirect exists and remove it if so.
	 *
	 * @param string $current_redirect The current redirect value.
	 * @param string $old_redirect	   The old redirect target.
	 * @param string $new_redirect	   The target where the old redirect will point to.
	 * @param string $type			   Redirect type.
	 *
	 * @return bool
	 */
	public function update( $current_redirect, $old_redirect, $new_redirect, $type ) {
		if ( $this->search( $current_redirect ) ) {
			// First we will delete the current redirect.
			$this->delete( $current_redirect );

			return $this->add($old_redirect, $new_redirect, $type );
		}

		return false;
	}

	/**
	 * Deletes the given redirect from the array
	 *
	 * @param string $redirect The redirect that will be removed.
	 *
	 * @return bool
	 */
	public function delete( $redirect ) {
		if ( $this->search( $redirect ) ) {
			unset( $this->redirects[ $redirect ] );

			return true;
		}

		return false;
	}

	/**
	 * Check if the $redirect already exists as a key in the array
	 *
	 * @param string $redirect
	 *
	 * @return bool|array
	 */
	public function search( $redirect ) {
		if ( array_key_exists( $redirect, $this->redirects ) ) {
			return $this->redirects[ $redirect ];
		}

		return false;
	}

	/**
	 * Saving the redirects
	 */
	public function save() {
		// Update the database option.
		update_option( $this->option_name, apply_filters( 'wpseo_premium_save_redirects', $this->redirects ) );
	}

	/**
	 * Formats the given params to the required array
	 *
	 * @param string $redirect The target redirect.
	 * @param string $type     The redirect type.
	 *
	 * @return array
	 */
	public function format( $redirect, $type ) {
		return array(
			'url' => $redirect,
			'type' => $type
		);
	}

	/**
	 * Setting the redirects property
	 * 
	 * @return array|mixed|void
	 */
	protected function get_from_option() {
		$redirects = apply_filters( 'wpseo_premium_get_redirects', get_option( $this->option_name ) );
		if ( ! is_array( $redirects ) ) {
			$redirects = array();
		}

		return $redirects;
	}

}
