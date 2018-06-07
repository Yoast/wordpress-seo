<?php

/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Internals
 */

class Robots {

	/**
	 * @var bool
	 */
	private $nofollow;

	/**
	 * @var bool
	 */
	private $noarchive;

	/**
	 * @var bool
	 */
	private $noimageindex;

	/**
	 * @var bool
	 */
	private $nosnippet;

	/**
	 * @var bool|null
	 */
	private $noindex;

	/**
	 * Robots constructor.
	 *
	 * @param bool 		 $nofollow		Whether or not to nofollow this indexable.
	 * @param bool 		 $noarchive		Whether or not to noarchive this indexable.
	 * @param bool 		 $noimageindex  Whether or not to noimageindex this indexable.
	 * @param bool 		 $nosnippet		Whether or not to nosnippet this indexable.
	 * @param bool|null  $noindex		Whether or not to noindex this indexable.
	 */
	public function __construct( $nofollow, $noarchive, $noimageindex, $nosnippet, $noindex = null ) {
		if ( ! empty( $nofollow ) && ! WPSEO_Validator::is_boolean( $nofollow ) ) {
			throw WPSEO_Invalid_Type_Exception::invalid_parameter_type( $nofollow, 'is_robots_nofollow', 'boolean' );
		}

		$this->nofollow = $nofollow;

		if ( ! empty( $noarchive ) && ! WPSEO_Validator::is_boolean( $noarchive ) ) {
			throw WPSEO_Invalid_Type_Exception::invalid_parameter_type( $noarchive, 'is_robots_noarchive', 'boolean' );
		}

		$this->noarchive = $noarchive;

		if ( ! empty( $noimageindex ) && ! WPSEO_Validator::is_boolean( $noimageindex ) ) {
			throw WPSEO_Invalid_Type_Exception::invalid_parameter_type( $noimageindex, 'is_robots_noimageindex', 'boolean' );
		}

		$this->noimageindex = $noimageindex;

		if ( ! empty( $nosnippet ) && ! WPSEO_Validator::is_boolean( $nosnippet ) ) {
			throw WPSEO_Invalid_Type_Exception::invalid_parameter_type( $nosnippet, 'is_robots_nosnippet', 'boolean' );
		}

		$this->nosnippet = $nosnippet;

		if ( ! empty( $noindex ) && ! empty( $noindex ) && ! WPSEO_Validator::is_boolean( $noindex ) ) {
			throw WPSEO_Invalid_Type_Exception::invalid_parameter_type( $noindex, 'is_robots_noindex', 'boolean' );
		}

		$this->noindex = $noindex;
	}

	/**
	 * Translates the nofollow value to a database compatible one.
	 *
	 * @param bool $nofollow The current nofollow value.
	 *
	 * @return string The translated value.
	 */
	private function translate_nofollow( $nofollow ) {
		if ( $nofollow === true ) {
			return '1';
		}

		// TODO: This might need to be translated to NULL.
		return '0';
	}

	/**
	 * Translates the noindex value to a database compatible one.
	 *
	 * @param bool $noindex The current noindex value.
	 *
	 * @return string|null The translated value.
	 */
	private function translate_noindex( $noindex ) {
		if ( $noindex === false ) {
			return '2';
		}

		if ( $noindex === true ) {
			return '1';
		}

		return null;
	}

	/**
	 * Translates the noarchive, noimageindex and nosnippet value to a database compatible one.
	 *
	 * @param bool $noarchive 	 The current noarchive value.
	 * @param bool $noimageindex The current noimageindex value.
	 * @param bool $nosnippet 	 The current nosnippet value.
	 *
	 * @return string The translated value.
	 */
	private function translate_advanced( $noarchive, $noimageindex, $nosnippet ) {
		$translated = array();

		if ( $noarchive === true ) {
			$translated[] = 'noarchive';
		}

		if ( $noimageindex === true ) {
			$translated[] = 'noimageindex';
		}

		if ( $nosnippet === true ) {
			$translated[] = 'nosnippet';
		}

		return implode( ',', $translated );
	}

	/**
	 * Returns an array representation of the Robots object.
	 *
	 * @return array The object as an array.
	 */
	public function to_array() {
		return array(
			'meta-robots-noindex'  => $this->translate_noindex( $this->noindex ),
			'meta-robots-nofollow' => $this->translate_nofollow( $this->nofollow ),
			'meta-robots-adv' 	   => $this->translate_advanced(
				$this->noarchive,
				$this->noimageindex,
				$this->nosnippet
			),
		);
	}
}
