<?php

namespace Yoast\WP\SEO\Actions;

use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * Class Integrations_Action.
 */
class Integrations_Action {

	/**
	 * The Options_Helper instance.
	 *
	 * @var Options_Helper
	 */
	protected $options_helper;

	/**
	 * Integrations_Action constructor.
	 *
	 * @param Options_Helper $options_helper The WPSEO options helper.
	 */
	public function __construct( Options_Helper $options_helper ) {
		$this->options_helper = $options_helper;
	}

	/**
	 * Checks if the current user has the capability a specific user.
	 *
	 * @param int $user_id The id of the user to be edited.
	 *
	 * @return object The response object.
	 */
	public function check_capability( $user_id ) {
		if ( $this->social_profiles_helper->can_edit_profile( $user_id ) ) {
			return (object) [
				'success' => true,
				'status'  => 200,
			];
		}

		return (object) [
			'success' => false,
			'status'  => 403,
		];
	}

	/**
	 * Sets an integration state.
	 *
	 * @param string $integration_name The name of the integration to activate/deactivate.
	 * @param array  $params           The values to store.
	 *
	 * @return object The response object.
	 */
	public function set_integration_active( $integration_name, $params ) {
		$option_name  = $this->get_integration_option_name( $integration_name );
		$success      = true;
		$option_value = $this->options_helper->get( $option_name );

		if ( $option_value !== $params['active'] ) {
			$success = $this->options_helper->set( $option_name, $params['active'] );
		}

		if ( $success ) {
			return (object) [
				'success' => true,
				'status'  => 200,
			];
		}
		return (object) [
			'success' => false,
			'status'  => 500,
			'error'   => 'Could not save the option in the database',
		];
	}

	/**
	 * Returns the option name associated to a plugin activation status.
	 *
	 * @param string $integration_name The name of the integration to activate/deactivate.
	 *
	 * @return string The option name.
	 */
	private function get_integration_option_name( $integration_name ) {
		return ( $integration_name === 'ryte' ) ? 'ryte_indexability' : $integration_name . '_active';
	}
}
