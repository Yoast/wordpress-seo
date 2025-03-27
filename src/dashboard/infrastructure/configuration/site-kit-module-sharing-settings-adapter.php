<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Dashboard\Infrastructure\Configuration;

use Google\Site_Kit\Core\Modules\Module_Sharing_Settings;
use Google\Site_Kit\Core\Storage\Options;
use Google\Site_Kit\Plugin;

/**
 * Adapter class to get modules sharing information from Site Kit.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Site_Kit_Module_Sharing_Settings_Adapter {

	/**
	 * The class from Site kit responsible for the sharing settings of a module.
	 *
	 * @var Module_Sharing_Settings
	 */
	private static $module_sharing_module;

	/**
	 * The class constructor
	 *
	 * @return void
	 */
	public function __construct() {

		if ( \class_exists( 'Google\Site_Kit\Plugin' ) ) {
			$site_kit_plugin             = Plugin::instance();
			$context                     = $site_kit_plugin->context();
			self::$module_sharing_module = new Module_Sharing_Settings( new Options( $context ) );
		}
	}

	/**
	 * The wrapper method to get a module sharing settings.
	 *
	 * @param string $module_slug The module slug.
	 *
	 * @return array<array<string>> The Site Kit module sharing information.
	 */
	public function get_module( string $module_slug ) {
		return self::$module_sharing_module->get_module( $module_slug );
	}

	/**
	 * The wrapper method to get shared roles.
	 *
	 * @param string $module_slug The module slug.
	 *
	 * @return array<string> The Site Kit module shared roles.
	 */
	public function get_shared_roles( string $module_slug ) {
		return self::$module_sharing_module->get_shared_roles( $module_slug );
	}

	/**
	 *  Method to check if a user can see a module.
	 *
	 * @param int    $user_id     The user ID.
	 * @param string $module_slug The module slug.
	 *
	 * @return bool True if the user can see the module, false otherwise.
	 */
	public function can_user_see( int $user_id, string $module_slug ) {
		$user = \get_userdata( $user_id );
		if ( ! $user ) {
			return false;
		}

		$shared_roles = $this->get_shared_roles( $module_slug );
		return ( ! empty( \array_intersect( $user->roles, $shared_roles ) ) );
	}
}
