<?php

namespace Yoast\WP\SEO\Services\Health_Check;

use WPSEO_Ryte;
use WPSEO_Ryte_Option;
use WPSEO_Utils;

/**
 * Runs the Ryte health check.
 */
class Ryte_Runner implements Runner_Interface {

	/**
	 * The WPSEO_Ryte object that the health check uses to check the site's indexability.
	 *
	 * @var WPSEO_Ryte
	 */
	private $ryte;

	/**
	 * Factory to create WPSEO_Ryte_Option instances.
	 *
	 * @var Ryte_Option_Factory
	 */
	private $ryte_option_factory;

	/**
	 * Set to true when the health check gets a valid response from Ryte.
	 *
	 * @var bool
	 */
	private $got_valid_response;

	/**
	 * The error that is set when the health check gets a response error from Ryte.
	 *
	 * @var array
	 */
	private $response_error;

	/**
	 * The Ryte option that represents the site's indexability.
	 *
	 * @var WPSEO_Ryte_Option
	 */
	private $ryte_option;

	/**
	 * The WPSEO_Utils class used to determine whether the site is in development mode.
	 *
	 * @var WPSEO_Utils
	 */
	private $utils;

	/**
	 * Constructor.
	 *
	 * @param WPSEO_Ryte          $ryte The WPSEO_Ryte object that the health check uses to check indexability.
	 * @param Ryte_Option_Factory $ryte_option_factory The Ryte_Option_Factory that the health check uses to get the indexability result.
	 * @param WPSEO_Utils         $utils The WPSEO_Utils object used to determine whether the site is in development mode.
	 */
	public function __construct(
		WPSEO_Ryte $ryte,
		Ryte_Option_Factory $ryte_option_factory,
		WPSEO_Utils $utils
	) {
		$this->ryte                = $ryte;
		$this->ryte_option_factory = $ryte_option_factory;
		$this->utils               = $utils;
		$this->got_valid_response  = false;
	}

	/**
	 * Runs the health check. Checks if Ryte is accessible and whether the site is indexable.
	 *
	 * @return void
	 */
	public function run() {
		if ( ! $this->should_run() ) {
			return;
		}

		$this->fetch_from_ryte();

		if ( ! $this->got_valid_response ) {
			return;
		}

		$this->set_ryte_option();
	}

	/**
	 * Attempts to get a new indexability status from Ryte.
	 *
	 * @return void
	 */
	private function fetch_from_ryte() {
		$this->ryte->fetch_from_ryte();
		$response = $this->ryte->get_response();

		if ( is_array( $response ) && isset( $response['is_error'] ) ) {
			$this->got_valid_response = false;
			$this->response_error     = $response;
			return;
		}

		$this->got_valid_response = true;
	}

	/**
	 * Sets the Ryte option based on the response from Ryte.
	 *
	 * @return void
	 */
	private function set_ryte_option() {
		$this->ryte_option = $this->ryte_option_factory->create();
	}

	/**
	 * Checks if the site is a live production site that has Ryte enabled.
	 *
	 * @return bool
	 */
	public function should_run() {
		if ( wp_get_environment_type() !== 'production' ) {
			return false;
		}

		if ( wp_debug_mode() || $this->utils->is_development_mode() ) {
			return false;
		}

		if ( get_option( 'blog_public' ) === '0' ) {
			return false;
		}

		$ryte_option = $this->ryte_option_factory->create();
		if ( ! $ryte_option->is_enabled() ) {
			return false;
		}

		return true;
	}

	/**
	 * Checks if the site is indexable.
	 *
	 * @return bool
	 */
	public function is_successful() {
		if ( ! $this->could_fetch() ) {
			return false;
		}

		$ryte_status = $this->ryte_option->get_status();

		if ( $ryte_status === WPSEO_Ryte_Option::IS_INDEXABLE ) {
			return true;
		}

		return false;
	}

	/**
	 * Checks if the site's indexability is unknown.
	 *
	 * @return bool Returns true if the site indexability is unknown even though getting a response from Ryte was successful.
	 */
	public function has_unknown_indexability() {
		if ( ! $this->could_fetch() ) {
			return true;
		}

		$ryte_status = $this->ryte_option->get_status();

		if ( $ryte_status === WPSEO_Ryte_Option::IS_INDEXABLE ) {
			return false;
		}

		if ( $ryte_status === WPSEO_Ryte_Option::IS_NOT_INDEXABLE ) {
			return false;
		}

		// This return statement should never be reached.
		return true;
	}

	/**
	 * Checks if the health check was able to get a valid response from Ryte.
	 *
	 * @return bool
	 */
	private function could_fetch() {
		if ( ! $this->got_valid_response ) {
			return false;
		}

		$ryte_status = $this->ryte_option->get_status();

		if ( $ryte_status === WPSEO_Ryte_Option::CANNOT_FETCH ) {
			return false;
		}

		return true;
	}

	/**
	 * Checks whether there was a response error when attempting a request to Ryte.
	 *
	 * @return bool True if the health check got a valid error response.
	 */
	public function got_response_error() {
		return isset( $this->response_error );
	}

	/**
	 * Returns the error response is there was one.
	 *
	 * @return array|null
	 */
	public function get_error_response() {
		if ( ! $this->got_response_error() ) {
			return null;
		}

		return $this->response_error;
	}
}
