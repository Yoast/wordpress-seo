<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\User_Interface\Abilities;

use WP_Error;
use Yoast\WP\SEO\Abilities\Application\Feature_Status_Updater;
use Yoast\WP\SEO\Helpers\Capability_Helper;

/**
 * Base class for the abilities whose feature is toggled by writing a boolean option and nothing else.
 */
abstract class Abstract_Set_Option_Status_Ability extends Abstract_Set_Feature_Status_Ability {

	/**
	 * The feature status updater.
	 *
	 * @var Feature_Status_Updater
	 */
	private $feature_status_updater;

	/**
	 * Constructor.
	 *
	 * @param Capability_Helper      $capability_helper      The capability helper.
	 * @param Feature_Status_Updater $feature_status_updater The feature status updater.
	 */
	public function __construct( Capability_Helper $capability_helper, Feature_Status_Updater $feature_status_updater ) {
		parent::__construct( $capability_helper );

		$this->feature_status_updater = $feature_status_updater;
	}

	/**
	 * Returns the name of the boolean option that enables the feature.
	 *
	 * @return string The option name.
	 */
	abstract protected function get_option_name(): string;

	/**
	 * Enables or disables the feature by writing its option and returns its new status.
	 *
	 * @param array<string, bool> $input The input holding the desired `enabled` status.
	 *
	 * @return array<string, bool>|WP_Error The new status, or an error when it could not be saved.
	 */
	public function execute( array $input ) {
		return $this->feature_status_updater->set_status( $this->get_option_name(), $input );
	}
}
