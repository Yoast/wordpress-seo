<?php

namespace Yoast\WP\SEO\Services\Health_Check;

use WPSEO_Ryte_Option;
use WPSEO_Utils;
use Yoast\WP\SEO\Integrations\Admin\Ryte_Integration;

/**
 * Runs the Ryte health check.
 *
 * @deprecated 19.6
 * @codeCoverageIgnore
 */
class Ryte_Runner implements Runner_Interface {

	/**
	 * The Ryte_Integration object that the health check uses to check the site's indexability.
	 *
	 * @var Ryte_Integration
	 */
	private $ryte;

	/**
	 * Set to true when the health check gets a valid response from Ryte.
	 *
	 * @var bool
	 */
	private $got_valid_response;

	/**
	 * The error that is set when the health check gets a response error from Ryte.
	 *
	 * @var array|null
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
	 * @deprecated 19.6
	 * @codeCoverageIgnore
	 *
	 * @param Ryte_Integration $ryte The Ryte_Integration object that the health check uses to check indexability.
	 * @param WPSEO_Utils      $utils The WPSEO_Utils object used to determine whether the site is in development mode.
	 */
	public function __construct(
		Ryte_Integration $ryte,
		WPSEO_Utils $utils
	) {
		$this->ryte               = $ryte;
		$this->utils              = $utils;
		$this->got_valid_response = false;
		$this->ryte_option        = $ryte->get_option();
	}

	/**
	 * Runs the health check. Checks if Ryte is accessible and whether the site is indexable.
	 *
	 * @deprecated 19.6
	 * @codeCoverageIgnore
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
	 * @deprecated 19.6
	 * @codeCoverageIgnore
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
	 * @deprecated 19.6
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	private function set_ryte_option() {
		$this->ryte_option = $this->ryte->get_option();
	}

	/**
	 * Checks if the site is a live production site that has Ryte enabled.
	 *
	 * @deprecated 19.6
	 * @codeCoverageIgnore
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

		$ryte_option = $this->ryte->get_option();
		if ( ! $ryte_option->is_enabled() ) {
			return false;
		}

		return true;
	}

	/**
	 * Checks if the site is indexable.
	 *
	 * @deprecated 19.6
	 * @codeCoverageIgnore
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
	 * @deprecated 19.6
	 * @codeCoverageIgnore
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
	 * @deprecated 19.6
	 * @codeCoverageIgnore
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
	 * @deprecated 19.6
	 * @codeCoverageIgnore
	 *
	 * @return bool True if the health check got a valid error response.
	 */
	public function got_response_error() {
		return isset( $this->response_error );
	}

	/**
	 * Returns the error response is there was one.
	 *
	 * @deprecated 19.6
	 * @codeCoverageIgnore
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
