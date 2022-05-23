<?php

namespace Yoast\WP\SEO\Actions\Options;

use Yoast\WP\SEO\Exceptions\Option\Form_Invalid_Exception;
use Yoast\WP\SEO\Exceptions\Option\Save_Failed_Exception;
use Yoast\WP\SEO\Services\Options\Network_Admin_Options_Service;

/**
 * Gets or sets the network admin options.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded -- Action should not count.
 */
class Network_Admin_Options_Action {

	/**
	 * Holds the Network_Admin_Options_Service instance.
	 *
	 * @var Network_Admin_Options_Service
	 */
	protected $network_admin_options_service;

	/**
	 * Constructs a Network_Admin_Options_Action instance.
	 *
	 * @param Network_Admin_Options_Service $network_admin_options_service The Network_Admin_Options_Service instance.
	 */
	public function __construct( Network_Admin_Options_Service $network_admin_options_service ) {
		$this->network_admin_options_service = $network_admin_options_service;
	}

	/**
	 * Retrieves the network admin options.
	 *
	 * @param string[] $keys Optionally request only these options.
	 *
	 * @return array The options.
	 */
	public function get( array $keys ) {
		return $this->network_admin_options_service->get_options( $keys );
	}

	/**
	 * Sets the network admin options.
	 *
	 * @param array $options The options.
	 *
	 * @return array The result, containing `success` and `error` keys.
	 */
	public function set( $options ) {
		$result = $this->set_options( $options );

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

	/**
	 * Sets the network admin options.
	 *
	 * @param array $options The options.
	 *
	 * @return array The result, containing `success` and `error` keys.
	 */
	protected function set_options( array $options = [] ) {
		$result = [ 'success' => false ];

		try {
			$this->network_admin_options_service->set_options( $options );
			$result['success'] = true;
		} catch ( Save_Failed_Exception $exception ) {
			$result['error'] = $exception;
		} catch ( Form_Invalid_Exception $exception ) {
			$result['error'] = $exception;
		}

		return $result;
	}
}
