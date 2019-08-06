<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Customizer
 */

/**
 * Class with functionality to support WP SEO settings in WordPress Customizer.
 */
class WPSEO_Customizer {

	/**
	 * Holds the customize manager.
	 *
	 * @var WP_Customize_Manager
	 */
	protected $wp_customize;

	/**
	 * Template for the setting IDs used for the customizer.
	 *
	 * @var string
	 */
	private $setting_template = 'wpseo_titles[%s]';

	/**
	 * Default arguments for the breadcrumbs customizer settings object.
	 *
	 * @var array
	 */
	private $default_setting_args = array(
		'default'   => '',
		'type'      => 'option',
		'transport' => 'refresh',
	);

	/**
	 * Default arguments for the breadcrumbs customizer control object.
	 *
	 * @var array
	 */
	private $default_control_args = array(
		'label'    => '',
		'type'     => 'text',
		'section'  => 'wpseo_breadcrumbs_customizer_section',
		'settings' => '',
		'context'  => '',
	);

	/**
	 * Construct Method.
	 */
	public function __construct() {
		add_action( 'customize_register', array( $this, 'wpseo_customize_register' ) );
	}

	/**
	 * Function to support WordPress Customizer.
	 *
	 * @param WP_Customize_Manager $wp_customize Manager class instance.
	 */
	public function wpseo_customize_register( $wp_customize ) {
		if ( ! WPSEO_Capability_Utils::current_user_can( 'wpseo_manage_options' ) ) {
			return;
		}

		$this->wp_customize = $wp_customize;

		$this->breadcrumbs_section();
		$this->breadcrumbs_blog_show_setting();
		$this->breadcrumbs_separator_setting();
		$this->breadcrumbs_home_setting();
		$this->breadcrumbs_prefix_setting();
		$this->breadcrumbs_archiveprefix_setting();
		$this->breadcrumbs_searchprefix_setting();
		$this->breadcrumbs_404_setting();
	}

	/**
	 * Add the breadcrumbs section to the customizer.
	 */
	private function breadcrumbs_section() {
		$section_args = array(
			/* translators: %s is the name of the plugin */
			'title'           => sprintf( __( '%s Breadcrumbs', 'wordpress-seo' ), 'Yoast SEO' ),
			'priority'        => 999,
			'active_callback' => array( $this, 'breadcrumbs_active_callback' ),
		);

		$this->wp_customize->add_section( 'wpseo_breadcrumbs_customizer_section', $section_args );
	}

	/**
	 * Returns whether or not the breadcrumbs are active.
	 *
	 * @return bool
	 */
	public function breadcrumbs_active_callback() {
		return true === ( current_theme_supports( 'yoast-seo-breadcrumbs' ) || WPSEO_Options::get( 'breadcrumbs-enable' ) );
	}

	/**
	 * Adds the breadcrumbs show blog checkbox.
	 */
	private function breadcrumbs_blog_show_setting() {
		$index        = 'breadcrumbs-display-blog-page';
		$control_args = array(
			'label'           => __( 'Show blog page in breadcrumbs', 'wordpress-seo' ),
			'type'            => 'checkbox',
			'active_callback' => array( $this, 'breadcrumbs_blog_show_active_cb' ),
		);

		$this->add_setting_and_control( $index, $control_args );
	}

	/**
	 * Returns whether or not to show the breadcrumbs blog show option.
	 *
	 * @return bool
	 */
	public function breadcrumbs_blog_show_active_cb() {
		return 'page' === get_option( 'show_on_front' );
	}

	/**
	 * Adds the breadcrumbs separator text field.
	 */
	private function breadcrumbs_separator_setting() {
		$index        = 'breadcrumbs-sep';
		$control_args = array(
			'label' => __( 'Breadcrumbs separator:', 'wordpress-seo' ),
		);
		$id           = 'wpseo-breadcrumbs-separator';

		$this->add_setting_and_control( $index, $control_args, $id );
	}

	/**
	 * Adds the breadcrumbs home anchor text field.
	 */
	private function breadcrumbs_home_setting() {
		$index        = 'breadcrumbs-home';
		$control_args = array(
			'label' => __( 'Anchor text for the homepage:', 'wordpress-seo' ),
		);

		$this->add_setting_and_control( $index, $control_args );
	}

	/**
	 * Adds the breadcrumbs prefix text field.
	 */
	private function breadcrumbs_prefix_setting() {
		$index        = 'breadcrumbs-prefix';
		$control_args = array(
			'label' => __( 'Prefix for breadcrumbs:', 'wordpress-seo' ),
		);

		$this->add_setting_and_control( $index, $control_args );
	}

	/**
	 * Adds the breadcrumbs archive prefix text field.
	 */
	private function breadcrumbs_archiveprefix_setting() {
		$index        = 'breadcrumbs-archiveprefix';
		$control_args = array(
			'label' => __( 'Prefix for archive pages:', 'wordpress-seo' ),
		);

		$this->add_setting_and_control( $index, $control_args );
	}

	/**
	 * Adds the breadcrumbs search prefix text field.
	 */
	private function breadcrumbs_searchprefix_setting() {
		$index        = 'breadcrumbs-searchprefix';
		$control_args = array(
			'label' => __( 'Prefix for search result pages:', 'wordpress-seo' ),
		);

		$this->add_setting_and_control( $index, $control_args );
	}

	/**
	 * Adds the breadcrumb 404 prefix text field.
	 */
	private function breadcrumbs_404_setting() {
		$index        = 'breadcrumbs-404crumb';
		$control_args = array(
			'label' => __( 'Breadcrumb for 404 pages:', 'wordpress-seo' ),
		);

		$this->add_setting_and_control( $index, $control_args );
	}

	/**
	 * Adds the customizer setting and control.
	 *
	 * @param string $index           Array key index to use for the customizer setting.
	 * @param array  $control_args    Customizer control object arguments.
	 *                                Only those different from the default need to be passed.
	 * @param string $id              Optional. Customizer control object ID.
	 *                                Will default to 'wpseo-' . $index.
	 * @param array  $custom_settings Optional. Customizer setting arguments.
	 *                                Only those different from the default need to be passed.
	 */
	private function add_setting_and_control( $index, $control_args, $id = null, $custom_settings = array() ) {
		$setting                  = sprintf( $this->setting_template, $index );
		$control_args             = array_merge( $this->default_control_args, $control_args );
		$control_args['settings'] = $setting;

		$settings_args = $this->default_setting_args;
		if ( ! empty( $custom_settings ) ) {
			$settings_args = array_merge( $settings_args, $custom_settings );
		}

		if ( ! isset( $id ) ) {
			$id = 'wpseo-' . $index;
		}

		$this->wp_customize->add_setting( $setting, $settings_args );

		$control = new WP_Customize_Control( $this->wp_customize, $id, $control_args );
		$this->wp_customize->add_control( $control );
	}
}
