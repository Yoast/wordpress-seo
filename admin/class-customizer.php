<?php
/**
 * @package WPSEO\Admin\Customizer
 */

/**
 * Class with functionality to support WP SEO settings in WordPress Customizer.
 */
class WPSEO_Customizer {

	/**
	 * Construct Method.
	 */
	public function __construct() {
		add_action( 'customize_register', array( $this, 'wpseo_customize_register' ) );
	}

	/**
	 * Function to support WordPress Customizer
	 *
	 * @param WP_Customize_Manager $wp_customize
	 */
	public function wpseo_customize_register( $wp_customize ) {

		// Breadcrumbs Section.
		$wp_customize->add_section(
			'wpseo_breadcrumbs_customizer_section', array(
				/* translators: %s is the name of the plugin */
				'title'          => sprintf( __( '%s Breadcrumbs', 'wordpress-seo' ), 'Yoast SEO' ),
				'priority'       => 999,
				'description'    => sprintf( __( 'Usage of this breadcrumbs feature is explained in %1$sour knowledge-base article on breadcrumbs implementation%2$s.', 'wordpress-seo' ), '<a href="http://yoa.st/breadcrumbs" target="_blank">', '</a>' ),
			)
		);

		// Enable or Disable Breadcrumbs Settings.
		$wp_customize->add_setting(
			'wpseo_internallinks[breadcrumbs-enable]', array(
				'default'   => '',
				'type'      => 'option',
				'transport' => 'refresh',
			)
		);

		// Enable or Disable Breadcrumbs Controls.
		$wp_customize->add_control(
			new WP_Customize_Control(
				$wp_customize, 'wpseo-breadcrumbs-enable', array(
					'label'       => __( 'Enable Breadcrumbs', 'wordpress-seo' ),
					'description' => __( 'Check this to enable breadcrumbs for your site.', 'wordpress-seo' ),
					'type'        => 'checkbox',
					'section'     => 'wpseo_breadcrumbs_customizer_section',
					'settings'    => 'wpseo_internallinks[breadcrumbs-enable]',
					'context'     => '',
				)
			)
		);

		// Bold Last Breadcrumb Setting.
		$wp_customize->add_setting(
			'wpseo_internallinks[breadcrumbs-boldlast]', array(
				'default'   => '',
				'type'      => 'option',
				'transport' => 'refresh',
			)
		);

		// Bold Last BreadcrumbControls.
		$wp_customize->add_control(
			new WP_Customize_Control(
				$wp_customize, 'wpseo-breadcrumbs-boldlast', array(
					'label'       => __( 'Bold the last page in the breadcrumb', 'wordpress-seo' ),
					'description' => __( 'Check this to bold the last breadcrumb.', 'wordpress-seo' ),
					'type'        => 'checkbox',
					'section'     => 'wpseo_breadcrumbs_customizer_section',
					'settings'    => 'wpseo_internallinks[breadcrumbs-boldlast]',
					'context'     => '',
				)
			)
		);

		// Remove Blog Breadcrumb Setting.
		$wp_customize->add_setting(
			'wpseo_internallinks[breadcrumbs-blog-remove]', array(
				'default'   => '',
				'type'      => 'option',
				'transport' => 'refresh',
			)
		);

		// Remove Blog Breadcrumb Controls.
		$wp_customize->add_control(
			new WP_Customize_Control(
				$wp_customize, 'wpseo-breadcrumbs-blog-remove', array(
					'label'       => __( 'Remove Blog page from Breadcrumbs', 'wordpress-seo' ),
					'description' => __( 'Check this to remove blog from breadcrumbs.', 'wordpress-seo' ),
					'type'        => 'checkbox',
					'section'     => 'wpseo_breadcrumbs_customizer_section',
					'settings'    => 'wpseo_internallinks[breadcrumbs-blog-remove]',
					'context'     => '',
				)
			)
		);

		// Breadcrumb Separator Setting.
		$wp_customize->add_setting(
			'wpseo_internallinks[breadcrumbs-sep]', array(
				'default'   => '',
				'type'      => 'option',
				'transport' => 'refresh',
			)
		);

		// Breadcrumb Separator Controls.
		$wp_customize->add_control(
			new WP_Customize_Control(
				$wp_customize, 'wpseo-breadcrumbs-separator', array(
					'label'       => __( 'Breadcrumbs Separator:', 'wordpress-seo' ),
					'description' => __( 'Set the separator between breadcrumb links.', 'wordpress-seo' ),
					'type'        => 'text',
					'section'     => 'wpseo_breadcrumbs_customizer_section',
					'settings'    => 'wpseo_internallinks[breadcrumbs-sep]',
					'context'     => '',
				)
			)
		);

		// Breadcrumb Anchor Text Setting.
		$wp_customize->add_setting(
			'wpseo_internallinks[breadcrumbs-home]', array(
				'default'   => '',
				'type'      => 'option',
				'transport' => 'refresh',
			)
		);

		// Breadcrumb Anchor Text Controls.
		$wp_customize->add_control(
			new WP_Customize_Control(
				$wp_customize, 'wpseo-breadcrumbs-home', array(
					'label'       => __( 'Anchor Text for Homepage:', 'wordpress-seo' ),
					'description' => __( 'Set the anchor text to represent your homepage.', 'wordpress-seo' ),
					'type'        => 'text',
					'section'     => 'wpseo_breadcrumbs_customizer_section',
					'settings'    => 'wpseo_internallinks[breadcrumbs-home]',
					'context'     => '',
				)
			)
		);

		// Breadcrumb Prefix for Path Setting.
		$wp_customize->add_setting(
			'wpseo_internallinks[breadcrumbs-prefix]', array(
				'default'   => '',
				'type'      => 'option',
				'transport' => 'refresh',
			)
		);

		// Breadcrumb Prefix for Path Controls.
		$wp_customize->add_control(
			new WP_Customize_Control(
				$wp_customize, 'wpseo-breadcrumbs-prefix', array(
					'label'       => __( 'Prefix for the breadcrumb path:', 'wordpress-seo' ),
					'description' => __( 'Set the prefix to be displayed before breadcrumbs.', 'wordpress-seo' ),
					'type'        => 'text',
					'section'     => 'wpseo_breadcrumbs_customizer_section',
					'settings'    => 'wpseo_internallinks[breadcrumbs-prefix]',
					'context'     => '',
				)
			)
		);

		// Breadcrumb Archive Prefix Setting.
		$wp_customize->add_setting(
			'wpseo_internallinks[breadcrumbs-archiveprefix]', array(
				'default'   => '',
				'type'      => 'option',
				'transport' => 'refresh',
			)
		);

		// Breadcrumb Archive Prefix Controls.
		$wp_customize->add_control(
			new WP_Customize_Control(
				$wp_customize, 'wpseo-breadcrumbs-archiveprefix', array(
					'label'       => __( 'Prefix for Archive breadcrumbs:', 'wordpress-seo' ),
					'description' => __( 'Set the prefix text to be used for archives.', 'wordpress-seo' ),
					'type'        => 'text',
					'section'     => 'wpseo_breadcrumbs_customizer_section',
					'settings'    => 'wpseo_internallinks[breadcrumbs-archiveprefix]',
					'context'     => '',
				)
			)
		);

		// Breadcrumb Search Prefix Setting.
		$wp_customize->add_setting(
			'wpseo_internallinks[breadcrumbs-searchprefix]', array(
				'default'   => '',
				'type'      => 'option',
				'transport' => 'refresh',
			)
		);

		// Breadcrumb Search Prefix Controls.
		$wp_customize->add_control(
			new WP_Customize_Control(
				$wp_customize, 'wpseo-breadcrumbs-searchprefix', array(
					'label'       => __( 'Prefix for Search Page breadcrumbs:', 'wordpress-seo' ),
					'description' => __( 'Set the prefix text to be used for your search page.', 'wordpress-seo' ),
					'type'        => 'text',
					'section'     => 'wpseo_breadcrumbs_customizer_section',
					'settings'    => 'wpseo_internallinks[breadcrumbs-searchprefix]',
					'context'     => '',
				)
			)
		);

		// Breadcrumb 404 Prefix Setting.
		$wp_customize->add_setting(
			'wpseo_internallinks[breadcrumbs-404crumb]', array(
				'default'   => '',
				'type'      => 'option',
				'transport' => 'refresh',
			)
		);

		// Breadcrumb 404 Prefix Controls.
		$wp_customize->add_control(
			new WP_Customize_Control(
				$wp_customize, 'wpseo-breadcrumbs-404crumb', array(
					'label'       => __( 'Breadcrumb for 404 Page:', 'wordpress-seo' ),
					'description' => __( 'Set the breadcrumbs for the 404 page.', 'wordpress-seo' ),
					'type'        => 'text',
					'section'     => 'wpseo_breadcrumbs_customizer_section',
					'settings'    => 'wpseo_internallinks[breadcrumbs-404crumb]',
					'context'     => '',
				)
			)
		);

	}

}
