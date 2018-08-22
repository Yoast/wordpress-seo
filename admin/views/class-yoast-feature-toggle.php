<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * Class representing a feature toggle.
 */
class Yoast_Feature_Toggle {

	/** @var string Feature toggle identifier. */
	protected $name = '';

	/** @var string Name of the setting the feature toggle is associated with. */
	protected $setting = '';

	/** @var string Feature toggle label. */
	protected $label = '';

	/** @var array Additional feature arguments. */
	protected $args = array();

	/** @var array Argument keys that must be specified. */
	protected $required_keys = array();

	/**
	 * Constructor.
	 *
	 * Sets the feature toggle arguments.
	 *
	 * @param array $args {
	 *     Feature toggle arguments.
	 *
	 *     @type string $name            Required. Feature toggle identifier.
	 *     @type string $setting         Required. Name of the setting the feature toggle is associated with.
	 *     @type string $label           Required. Feature toggle label.
	 *     @type string $read_more_url   URL to learn more about the feature. Default empty string.
	 *     @type string $read_more_label Label for the learn more link. Default empty string.
	 *     @type string $extra           Additional help content for the feature. Default empty string.
	 *     @type int    $order           Value to specify the feature toggle order. A lower value indicates
	 *                                   a higher priority. Default 100.
	 * }
	 */
	public function __construct( array $args ) {
		$this->required_keys = array( 'name', 'setting', 'label' );

		foreach ( $this->required_keys as $key ) {
			if ( empty( $args[ $key ] ) ) {
				/* translators: %s: argument name */
				throw new InvalidArgumentException( sprintf( __( '%s is a required feature toggle argument.', 'wordpress-seo' ), $key ) );
			}

			$this->$key = $args[ $key ];
			unset( $args[ $key ] );
		}

		$this->args = wp_parse_args( $args, array(
			'read_more_url'   => '',
			'read_more_label' => '',
			'extra'           => '',
			'order'           => 100,
		) );
	}

	/**
	 * Magic isset-er.
	 *
	 * @param string $key Key to check whether a value for it is set.
	 *
	 * @return bool True if set, false otherwise.
	 */
	public function __isset( $key ) {
		if ( in_array( $key, $this->required_keys, true ) ) {
			return true;
		}

		return isset( $this->args[ $key ] );
	}

	/**
	 * Magic getter.
	 *
	 * @param string $key Key to get the value for.
	 *
	 * @return mixed Value for the key, or null if not set.
	 */
	public function __get( $key ) {
		if ( in_array( $key, $this->required_keys, true ) ) {
			return $this->$key;
		}

		if ( isset( $this->args[ $key ] ) ) {
			return $this->args[ $key ];
		}

		return null;
	}

	/**
	 * Checks whether the feature for this toggle is enabled.
	 *
	 * @return bool True if the feature is enabled, false otherwise.
	 */
	public function is_enabled() {
		return (bool) WPSEO_Options::get( $this->setting );
	}
}
