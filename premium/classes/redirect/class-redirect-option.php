<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * Class handling the redirect options
 */
class WPSEO_Redirect_Option {

	/**
	 * @var string
	 */
	private $option_name;

	/**
	 * @var WPSEO_Redirect[]
	 */
	private $redirects = array();

	/**
	 * @var string The format for the current redirects, can be plain or regex.
	 */
	private $format;

	/**
	 * Getting the array with all the redirects
	 *
	 * @return WPSEO_Redirect[]
	 */
	public function get_all() {
		$redirects = $this->get_from_option();

		array_walk( $redirects, array( $this, 'map_option_to_object' ) );

		// Filter the redirect for the current format.
		$filtered_redirects = array_filter( $redirects, array( $this, 'filter_redirects_by_format' ) );

		return $filtered_redirects;
	}

	/**
	 * Sets the value of redirects with the result of get all
	 */
	public function set_redirects() {
		$this->redirects = $this->get_all();
	}

	/**
	 * Setting the redirect format
	 *
	 * @param string $format The format to set.
	 */
	public function set_format( $format ) {
		$this->format = $format;
	}

	/**
	 * Setting the value of the redirects option with the given value
	 *
	 * @param array $redirects Override the redirect option with a new value.
	 */
	public function set( array $redirects ) {
		$this->redirects = $redirects;
		$this->save();
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
			$this->redirects[] = new WPSEO_Redirect( $old_redirect, $new_redirect, $type, $this->format );

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
		if ( $found = $this->search( $current_redirect ) ) {
			$this->redirects[ $found ] = new WPSEO_Redirect( $old_redirect, $new_redirect, $type, $this->format );

			return true;
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
		if ( $found = $this->search( $redirect ) ) {
			unset( $this->redirects[ $found ] );

			return true;
		}

		return false;
	}

	/**
	 * Check if the $origin already exists as a key in the array
	 *
	 * @param string $origin The redirect to search for.
	 *
	 * @return WPSEO_Redirect|bool
	 */
	public function search( $origin ) {
		foreach ( $this->redirects as $redirect_key => $redirect ) {
			if ( $redirect->get_origin() === $origin ) {
				return $redirect_key;
			}
		}

		return false;
	}

	/**
	 * Saving the redirects
	 */
	public function save() {
		$redirects = $this->redirects;

		array_walk( $redirects, array( $this, 'map_object_to_option' ) );

		// Update the database option.
		update_option( self::OPTION, apply_filters( 'wpseo_premium_save_redirects', $redirects ), false );
	}

	/**
	 * Setting the redirects property
	 *
	 * @param string $option_name The target option name.
	 *
	 * @return array
	 */
	public function get_from_option( $option_name = self::OPTION ) {
		$redirects = apply_filters( 'wpseo_premium_get_redirects', get_option( $option_name ) );
		if ( ! is_array( $redirects ) ) {
			$redirects = array();
		}

		return $redirects;
	}

	/**
	 * Maps the array values to a redirect object.
	 *
	 * @param array $redirect_values The data for the redirect option.
	 */
	private function map_option_to_object( array &$redirect_values ) {
		$redirect_values = new WPSEO_Redirect( $redirect_values['origin'], $redirect_values['url'], $redirect_values['type'], $redirect_values['format'] );
	}

	/**
	 * Maps a redirect object to an array option.
	 *
	 * @param WPSEO_Redirect $redirect The redirect to map.
	 */
	private function map_object_to_option( WPSEO_Redirect &$redirect ) {
		$redirect = array(
			'origin' => $redirect->get_origin(),
			'url'    => $redirect->get_target(),
			'type'   => $redirect->get_type(),
			'format' => $redirect->get_format(),
		);
	}

	/**
	 * Filter the redirects that don't match the needed format
	 *
	 * @param WPSEO_Redirect $redirect The redirect to filter.
	 *
	 * @return bool
	 */
	private function filter_redirects_by_format( WPSEO_Redirect $redirect ) {
		return $redirect->get_format() === $this->format;
	}
}
