<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\License_Manager
 */

/**
 * Class WPSEO_Product
 */
class WPSEO_Product {
	/**
	 * @var string The URL of the shop running the EDD API.
	 */
	protected $api_url;
	/**
	 * @var string The item name in the EDD shop.
	 */
	protected $item_name;
	/**
	 * @var string The theme slug or plugin file
	 */
	protected $slug;
	/**
	 * @var string The version number of the item
	 */
	protected $version;
	/**
	 * @var string The absolute url on which users can purchase a license
	 */
	protected $item_url;
	/**
	 * @var string Absolute admin URL on which users can enter their license key.
	 */
	protected $license_page_url;
	/**
	 * @var string The text domain used for translating strings
	 */
	protected $text_domain;
	/**
	 * @var string The item author
	 */
	protected $author;
	/**
	 * @var string Relative file path to the plugin.
	 */
	protected $file;
	/** @var int Product ID in backend system for quick lookup */
	protected $product_id;
	/** @var string URL referring to the extension page */
	protected $extension_url;

	/**
	 * WPSEO_Product constructor.
	 *
	 * @param string $api_url          The URL of the shop running the EDD API.
	 * @param string $item_name        The item name in the EDD shop.
	 * @param string $slug             The slug of the plugin, for shiny updates this needs to be a valid HTML id.
	 * @param string $version          The version number of the item.
	 * @param string $item_url         The absolute url on which users can purchase a license.
	 * @param string $license_page_url Absolute admin URL on which users can enter their license key.
	 * @param string $text_domain      The text domain used for translating strings.
	 * @param string $author           The item author.
	 * @param string $file             The relative file path to the plugin.
	 * @param int    $product_id       The ID of the product in the backend system.
	 */
	public function __construct( $api_url, $item_name, $slug, $version, $item_url = '', $license_page_url = '#', $text_domain = 'yoast', $author = 'Yoast', $file = '', $product_id = 0 ) {
		$this->set_item_name( $item_name );
		$this->set_slug( $slug );
		$this->set_version( $version );
		$this->set_item_url( $item_url );
		$this->set_text_domain( $text_domain );
		$this->set_author( $author );
		$this->set_file( $file );
		$this->set_product_id( $product_id );
		$this->set_license_page_url( $license_page_url );
	}

	/**
	 * Set the plugin author.
	 *
	 * @param string $author
	 */
	public function set_author( $author ) {
		$this->author = $author;
	}

	/**
	 * Retrieves the plugin author.
	 *
	 * @return string
	 */
	public function get_author() {
		return $this->author;
	}

	/**
	 * Sets the item's name.
	 *
	 * @param string $item_name
	 */
	public function set_item_name( $item_name ) {
		$this->item_name = $item_name;
	}

	/**
	 * Retrieves the item's name.
	 *
	 * @return string
	 */
	public function get_item_name() {
		return $this->item_name;
	}

	/**
	 * Sets the item's URL.
	 *
	 * @param string $item_url
	 */
	public function set_item_url( $item_url ) {
		if ( empty( $item_url ) ) {
			$item_url = $this->api_url;
		}

		$this->item_url = $item_url;
	}

	/**
	 * Gets the item's URL.
	 *
	 * @return string
	 */
	public function get_item_url() {
		return $this->item_url;
	}

	/**
	 * @param string $license_page_url
	 */
	public function set_license_page_url( $license_page_url ) {

		if ( is_admin() && is_multisite() ) {

			if ( ! function_exists( 'is_plugin_active_for_network' ) ) {
				require_once ABSPATH . 'wp-admin/includes/plugin.php';
			}

			if ( is_plugin_active_for_network( $this->get_file() ) ) {
				$this->license_page_url = network_admin_url( $license_page_url );

				return;
			}
		}

		$this->license_page_url = admin_url( $license_page_url );
	}

	/**
	 * @return string
	 */
	public function get_license_page_url() {
		return $this->license_page_url;
	}

	/**
	 * @param string $slug
	 */
	public function set_slug( $slug ) {
		$this->slug = $slug;
	}

	/**
	 * @return string
	 */
	public function get_slug() {
		return $this->slug;
	}

	/**
	 * Returns the dirname of the slug and limits it to 15 chars
	 *
	 * @return string
	 */
	public function get_transient_prefix() {
		return substr( md5( $this->file ), 0, 15 );
	}

	/**
	 * @param string $text_domain
	 */
	public function set_text_domain( $text_domain ) {
		$this->text_domain = $text_domain;
	}

	/**
	 * @return string
	 */
	public function get_text_domain() {
		return $this->text_domain;
	}

	/**
	 * @param string $version
	 */
	public function set_version( $version ) {
		$this->version = $version;
	}

	/**
	 * @return string
	 */
	public function get_version() {
		return $this->version;
	}

	/**
	 * Returns the file path relative to the plugins folder
	 *
	 * @return string
	 */
	public function get_file() {
		/*
		 * Fall back to the slug for BC reasons.
		 *
		 * We used to pass the file to the slug field, but this isn't supported with the shiny updates in WordPress.
		 * WordPress uses the slug in the HTML as an ID and a slash isn't a valid
		 */
		return empty( $this->file ) ? $this->slug : $this->file;
	}

	/**
	 * Sets the file path relative to the plugins folder
	 *
	 * @param string $file Relative file path to the plugin.
	 */
	public function set_file( $file ) {
		$this->file = $file;
	}

	/**
	 * Return the Product ID
	 *
	 * @return int
	 */
	public function get_product_id() {
		return $this->product_id;
	}

	/**
	 * Set the product ID
	 *
	 * @param int $product_id Product ID to set.
	 */
	public function set_product_id( $product_id ) {
		$this->product_id = (int) $product_id;
	}

	/**
	 * Gets a Google Analytics Campaign url for this product
	 *
	 * @param string $link_identifier
	 *
	 * @return string The full URL
	 */
	public function get_tracking_url( $link_identifier = '' ) {
		return $this->add_campaign_attributes( $this->get_item_url(), $link_identifier );
	}

	/**
	 * Returns the extension url if set, otherwise it will be the tracking url.
	 *
	 * @param string $link_identifier
	 *
	 * @return string
	 */
	public function get_extension_url( $link_identifier = '' ) {
		if ( $this->extension_url ) {
			return $this->add_campaign_attributes( $this->extension_url, $link_identifier );
		}

		return $this->get_tracking_url( $link_identifier );
	}

	/**
	 * Sets the extension url.
	 *
	 * @param string $extension_url
	 */
	public function set_extension_url( $extension_url ) {
		$this->extension_url = $extension_url;
	}

	private function add_campaign_attributes( $url, $link_identifier ) {
		$tracking_vars = array(
			'utm_campaign' => $this->get_item_name() . ' licensing',
			'utm_medium'   => 'link',
			'utm_source'   => $this->get_item_name(),
			'utm_content'  => $link_identifier,
		);

		// URL encode tracking vars.
		$tracking_vars = urlencode_deep( $tracking_vars );
		$query_string  = build_query( $tracking_vars );

		return $url . '#' . $query_string;
	}
}