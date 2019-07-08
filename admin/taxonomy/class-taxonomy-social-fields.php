<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * This class parses all the values for the social tab in the Yoast SEO settings metabox.
 */
class WPSEO_Taxonomy_Social_Fields extends WPSEO_Taxonomy_Fields {

	/**
	 * List of social networks.
	 *
	 * @var array
	 */
	protected $networks;

	/**
	 * Setting the class properties.
	 *
	 * @param stdClass|WP_Term $term The current taxonomy.
	 */
	public function __construct( $term ) {
		parent::__construct( $term );

		$this->networks = $this->get_social_networks();
	}

	/**
	 * When this method returns false, the social tab in the meta box will be hidden.
	 *
	 * @return bool
	 */
	public function show_social() {
		return ( WPSEO_Options::get( 'opengraph', false ) || WPSEO_Options::get( 'twitter', false ) );
	}

	/**
	 * Gets the social meta fields by social network for the taxonomy.
	 *
	 * @param string $network The social network for which to fetch the fields.
	 *
	 * @return array
	 */
	public function get_by_network( $network ) {
		$settings = $this->networks[ $network ];

		return array(
			$settings['network'] . '-title'       => $this->get_field_config(
				/* translators: %s expands to the social network name */
				sprintf( __( '%s Title', 'wordpress-seo' ), $settings['label'] ),
				/* translators: %1$s expands to the social network name */
				sprintf( esc_html__( 'If you don\'t want to use the title for sharing on %1$s but instead want another title there, write it here.', 'wordpress-seo' ), $settings['label'] ),
				'text',
				array( 'class' => 'large-text' )
			),
			$settings['network'] . '-description' => $this->get_field_config(
				/* translators: %s expands to the social network name */
				sprintf( __( '%s Description', 'wordpress-seo' ), $settings['label'] ),
				/* translators: %1$s expands to the social network name */
				sprintf( esc_html__( 'If you don\'t want to use the meta description for sharing on %1$s but want another description there, write it here.', 'wordpress-seo' ), $settings['label'] ),
				'textarea'
			),
			$settings['network'] . '-image'       => $this->get_field_config(
				/* translators: %s expands to the social network name */
				sprintf( __( '%s Image', 'wordpress-seo' ), $settings['label'] ),
				/* translators: %1$s expands to the social network name */
				sprintf( esc_html__( 'If you want to use an image for sharing on %1$s, you can upload / choose an image or add the image URL here.', 'wordpress-seo' ), $settings['label'] ) . '<br />' .
				/* translators: %1$s expands to the social network name, %2$s expands to the image size */
				sprintf( __( 'The recommended image size for %1$s is %2$s pixels.', 'wordpress-seo' ), $settings['label'], $settings['size'] ),
				'upload'
			),
			$settings['network'] . '-image-id' => $this->get_field_config(
				'',
				'',
				'hidden'
			),
		);
	}

	/**
	 * Returning the fields for the social media tab.
	 *
	 * @return array
	 */
	public function get() {
		$fields = array();
		foreach ( $this->networks as $option => $settings ) {
			$fields_to_push = $this->get_by_network( $option );

			$fields = array_merge( $fields, $fields_to_push );
		}

		return $this->filter_hidden_fields( $fields );
	}

	/**
	 * Getting array with the social networks.
	 *
	 * @return array
	 */
	private function get_social_networks() {
		// Source: https://developers.facebook.com/docs/sharing/best-practices#images.
		$fb_image_size = sprintf(
			/* translators: %1$s expands to the image recommended width, %2$s to its height. */
			__( '%1$s by %2$s', 'wordpress-seo' ),
			'1200',
			'630'
		);

		$twitter_image_size = sprintf(
			/* translators: %1$s expands to the image recommended width, %2$s to its height. */
			__( '%1$s by %2$s', 'wordpress-seo' ),
			'1024',
			'512'
		);

		$social_networks = array(
			'opengraph' => $this->social_network( 'opengraph', __( 'Facebook', 'wordpress-seo' ), $fb_image_size ),
			'twitter'   => $this->social_network( 'twitter', __( 'Twitter', 'wordpress-seo' ), $twitter_image_size ),
		);

		return $this->filter_social_networks( $social_networks );
	}

	/**
	 * Returns array with the config fields for the social network.
	 *
	 * @param string $network    The name of the social network.
	 * @param string $label      The label for the social network.
	 * @param string $image_size The image dimensions.
	 *
	 * @return array
	 */
	private function social_network( $network, $label, $image_size ) {
		return array(
			'network' => $network,
			'label'   => $label,
			'size'    => $image_size,
		);
	}

	/**
	 * Filter the social networks which are disabled in the configuration.
	 *
	 * @param array $social_networks Array with the social networks that have to be filtered.
	 *
	 * @return array
	 */
	private function filter_social_networks( array $social_networks ) {
		foreach ( $social_networks as $social_network => $settings ) {
			if ( WPSEO_Options::get( $social_network, false ) === false ) {
				unset( $social_networks[ $social_network ] );
			}
		}

		return $social_networks;
	}
}
