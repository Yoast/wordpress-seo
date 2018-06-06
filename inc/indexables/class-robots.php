<?php

/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Internals
 */

class Robots {
	private $noindex;
	private $nofollow;
	private $noarchive;
	private $noimageindex;
	private $nosnippet;

	/**
	 * Robots constructor.
	 *
	 * @param bool|null  $noindex
	 * @param bool 		 $nofollow
	 * @param bool 		 $noarchive
	 * @param bool 		 $noimageindex
	 * @param bool 		 $nosnippet
	 */
	public function __construct( $noindex, $nofollow, $noarchive, $noimageindex, $nosnippet ) {
		$this->noindex 		= $noindex;
		$this->nofollow 	= $nofollow;
		$this->noarchive 	= $noarchive;
		$this->noimageindex = $noimageindex;
		$this->nosnippet 	= $nosnippet;
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
