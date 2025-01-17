<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
// phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
namespace Yoast\WP\SEO\Dashboard\Infrastructure\Search_Console;

use WPSEO_Utils;
use Yoast\WP\SEO\Dashboard\Domain\Search_Rankings\Request_Parameters;
use Yoast\WP\SEO\Dashboard\Infrastructure\Site_Kit_Adapter_Interface;

/**
 * An adapter decorator that applies cache.
 */
class Cached_Site_Kit_Search_Console_Adapter implements Site_Kit_Adapter_Interface {

	public const TRANSIENT_KEY = 'wpseo_search_console_data';

	/**
	 * The adapter to decorate.
	 *
	 * @var Site_Kit_Search_Console_Adapter $site_kit_search_console_adapter
	 */
	private $site_kit_search_console_adapter;

	/**
	 * The constructor.
	 *
	 * @param Site_Kit_Search_Console_Adapter $site_kit_search_console_adapter The adapter to decorate.
	 *
	 * @return void
	 */
	public function __construct( Site_Kit_Search_Console_Adapter $site_kit_search_console_adapter ) {
		$this->site_kit_search_console_adapter = $site_kit_search_console_adapter;
	}

	/**
	 * The wrapper method to add our parameters to a Site Kit API request.
	 *
	 * @param Request_Parameters $parameters The parameters.
	 *
	 * @return ApiDataRow[]|WP_Error Data on success, or WP_Error on failure.
	 */
	public function get_data( Request_Parameters $parameters ) {
		$transient_key  = (string) \strtotime( $parameters->get_start_date() ) . '_' . (string) \strtotime( $parameters->get_end_date() ) . '_' . \implode( $parameters->get_dimensions() );
		$transient_name = self::TRANSIENT_KEY . '_' . $transient_key;

		$cached_data = \get_transient( $transient_name );

		if ( $cached_data !== false ) {
			return \json_decode( $cached_data, false );
		}

		$result = $this->site_kit_search_console_adapter->get_data( $parameters );
		if ( ! \is_wp_error( $result ) ) {
			\set_transient( $transient_name, WPSEO_Utils::format_json_encode( $result ), ( \HOUR_IN_SECONDS * 12 ) );
		}

		return $result;
	}
}
