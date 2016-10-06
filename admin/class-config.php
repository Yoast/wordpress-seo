<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Class WPSEO_Admin_Pages
 *
 * Class with functionality for the Yoast SEO admin pages.
 */
class WPSEO_Admin_Pages {

	/**
	 * @var string $currentoption The option in use for the current admin page.
	 */
	public $currentoption = 'wpseo';

	/**
	 * Holds the asset manager.
	 *
	 * @var WPSEO_Admin_Asset_Manager
	 */
	private $asset_manager;

	/**
	 * Class constructor, which basically only hooks the init function on the init hook
	 */
	function __construct() {
		add_action( 'init', array( $this, 'init' ), 20 );
		$this->asset_manager = new WPSEO_Admin_Asset_Manager();
	}

	/**
	 * Make sure the needed scripts are loaded for admin pages
	 */
	function init() {
		if ( filter_input( INPUT_GET, 'wpseo_reset_defaults' ) && wp_verify_nonce( filter_input( INPUT_GET, 'nonce' ), 'wpseo_reset_defaults' ) && current_user_can( 'manage_options' ) ) {
			WPSEO_Options::reset();
			wp_redirect( admin_url( 'admin.php?page=' . WPSEO_Admin::PAGE_IDENTIFIER ) );
		}

		if ( WPSEO_Utils::grant_access() ) {
			add_action( 'admin_init', array( $this, 'admin_init' ) );
			add_action( 'admin_enqueue_scripts', array( $this, 'config_page_scripts' ) );
			add_action( 'admin_enqueue_scripts', array( $this, 'config_page_styles' ) );
		}
	}

	/**
	 * Run admin-specific actions.
	 */
	public function admin_init() {

		$page         = filter_input( INPUT_GET, 'page' );
		$tool         = filter_input( INPUT_GET, 'tool' );
		$export_nonce = filter_input( INPUT_POST, WPSEO_Export::NONCE_NAME );

		if ( 'wpseo_tools' === $page && 'import-export' === $tool && $export_nonce !== null ) {
			$this->do_yoast_export();
		}
	}

	/**
	 * Loads the required styles for the config page.
	 */
	function config_page_styles() {
		wp_enqueue_style( 'dashboard' );
		wp_enqueue_style( 'thickbox' );
		wp_enqueue_style( 'global' );
		wp_enqueue_style( 'wp-admin' );
		$this->asset_manager->enqueue_style( 'select2' );

		$this->asset_manager->enqueue_style( 'admin-css' );

		$this->asset_manager->enqueue_style( 'kb-search' );
	}

	/**
	 * Loads the required scripts for the config page.
	 */
	function config_page_scripts() {
		$this->asset_manager->enqueue_script( 'admin-script' );

		wp_localize_script( WPSEO_Admin_Asset_Manager::PREFIX . 'admin-script', 'wpseoAdminL10n', WPSEO_Help_Center::get_translated_texts() );

		wp_enqueue_script( 'dashboard' );
		wp_enqueue_script( 'thickbox' );

		$page = filter_input( INPUT_GET, 'page' );

		wp_localize_script( WPSEO_Admin_Asset_Manager::PREFIX . 'admin-script', 'wpseoSelect2Locale', WPSEO_Utils::get_language( get_locale() ) );

		if ( in_array( $page, array( 'wpseo_social', WPSEO_Admin::PAGE_IDENTIFIER ) ) ) {
			wp_enqueue_media();

			$this->asset_manager->enqueue_script( 'admin-media' );
			wp_localize_script( WPSEO_Admin_Asset_Manager::PREFIX . 'admin-media', 'wpseoMediaL10n', $this->localize_media_script() );
		}

		if ( 'wpseo_tools' === $page ) {
			$this->enqueue_tools_scripts();
		}
	}

	/**
	 * Pass some variables to js for upload module.
	 *
	 * @return  array
	 */
	public function localize_media_script() {
		return array(
			'choose_image' => __( 'Use Image', 'wordpress-seo' ),
		);
	}

	/**
	 * Enqueues and handles all the tool dependencies.
	 */
	private function enqueue_tools_scripts() {
		$tool = filter_input( INPUT_GET, 'tool' );

		if ( empty( $tool ) ) {
			$this->asset_manager->enqueue_script( 'yoast-seo' );
		}

		if ( 'bulk-editor' === $tool ) {
			$this->asset_manager->enqueue_script( 'bulk-editor' );
		}
	}

	/**
	 * Runs the yoast exporter class to possibly init the file download.
	 */
	private function do_yoast_export() {
		check_admin_referer( WPSEO_Export::NONCE_ACTION, WPSEO_Export::NONCE_NAME );

		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		$wpseo_post       = filter_input( INPUT_POST, 'wpseo' );
		$include_taxonomy = ! empty( $wpseo_post['include_taxonomy'] );
		$export           = new WPSEO_Export( $include_taxonomy );

		if ( $export->has_error() ) {
			add_action( 'admin_notices', array( $export, 'set_error_hook' ) );

		}
	}

	/********************** DEPRECATED METHODS **********************/

	/**
	 * Exports the current site's Yoast SEO settings.
	 *
	 * @param bool $include_taxonomy Whether to include the taxonomy metadata the plugin creates.
	 *
	 * @return bool|string $return False when failed, the URL to the export file when succeeded.
	 */
	public function export_settings( $include_taxonomy ) {
		_deprecated_function( __METHOD__, 'WPSEO 2.0', 'This method is deprecated, please use the <code>WPSEO_Export</code> class.' );

		$export = new WPSEO_Export( $include_taxonomy );
		if ( $export->success ) {
			return $export->export_zip_url;
		}

		return false;
	}

	/**
	 * Generates the header for admin pages
	 *
	 * @deprecated 2.0
	 *
	 * @param bool   $form             Whether or not the form start tag should be included.
	 * @param mixed  $option_long_name The long name of the option to use for the current page.
	 * @param string $option           The short name of the option to use for the current page.
	 * @param bool   $contains_files   Whether the form should allow for file uploads.
	 */
	public function admin_header( $form = true, $option_long_name = false, $option = 'wpseo', $contains_files = false ) {
		_deprecated_function( __METHOD__, 'WPSEO 2.0', 'This method is deprecated, please use the <code>Yoast_Form</code> class.' );

		Yoast_Form::get_instance()->admin_header( $form, $option, $contains_files, $option_long_name );
	}

	/**
	 * Generates the footer for admin pages
	 *
	 * @deprecated 2.0
	 *
	 * @param bool $submit       Whether or not a submit button and form end tag should be shown.
	 * @param bool $show_sidebar Whether or not to show the banner sidebar - used by premium plugins to disable it.
	 */
	public function admin_footer( $submit = true, $show_sidebar = true ) {
		_deprecated_function( __METHOD__, 'WPSEO 2.0', 'This method is deprecated, please use the <code>Yoast_Form</code> class.' );

		Yoast_Form::get_instance()->admin_footer( $submit, $show_sidebar );
	}

	/**
	 * Generates the sidebar for admin pages.
	 *
	 * @deprecated 2.0
	 */
	public function admin_sidebar() {
		_deprecated_function( __METHOD__, 'WPSEO 2.0', 'This method is deprecated, please use the <code>Yoast_Form</code> class.' );

		Yoast_Form::get_instance()->admin_sidebar();
	}

	/**
	 * Create a Checkbox input field.
	 *
	 * @deprecated 2.0
	 *
	 * @param string $var        The variable within the option to create the checkbox for.
	 * @param string $label      The label to show for the variable.
	 * @param bool   $label_left Whether the label should be left (true) or right (false).
	 * @param string $option     The option the variable belongs to.
	 */
	public function checkbox( $var, $label, $label_left = false, $option = '' ) {
		_deprecated_function( __METHOD__, 'WPSEO 2.0', 'This method is deprecated, please use the <code>Yoast_Form</code> class.' );

		if ( $option !== '' ) {
			Yoast_Form::get_instance()->set_option( $option );
		}

		Yoast_Form::get_instance()->checkbox( $var, $label, $label_left );
	}

	/**
	 * Create a Text input field.
	 *
	 * @deprecated 2.0
	 *
	 * @param string $var    The variable within the option to create the text input field for.
	 * @param string $label  The label to show for the variable.
	 * @param string $option The option the variable belongs to.
	 */
	function textinput( $var, $label, $option = '' ) {
		_deprecated_function( __METHOD__, 'WPSEO 2.0', 'This method is deprecated, please use the <code>Yoast_Form</code> class.' );

		if ( $option !== '' ) {
			Yoast_Form::get_instance()->set_option( $option );
		}
		Yoast_Form::get_instance()->textinput( $var, $label );
	}

	/**
	 * Create a textarea.
	 *
	 * @deprecated 2.0
	 *
	 * @param string $var    The variable within the option to create the textarea for.
	 * @param string $label  The label to show for the variable.
	 * @param string $option The option the variable belongs to.
	 * @param array  $attr   The CSS class to assign to the textarea.
	 */
	function textarea( $var, $label, $option = '', $attr = array() ) {
		_deprecated_function( __METHOD__, 'WPSEO 2.0', 'This method is deprecated, please use the <code>Yoast_Form</code> class.' );

		if ( $option !== '' ) {
			Yoast_Form::get_instance()->set_option( $option );
		}

		Yoast_Form::get_instance()->textarea( $var, $label, $attr );
	}

	/**
	 * Create a hidden input field.
	 *
	 * @deprecated 2.0
	 *
	 * @param string $var    The variable within the option to create the hidden input for.
	 * @param string $option The option the variable belongs to.
	 */
	function hidden( $var, $option = '' ) {
		_deprecated_function( __METHOD__, 'WPSEO 2.0', 'This method is deprecated, please use the <code>Yoast_Form</code> class.' );

		if ( $option !== '' ) {
			Yoast_Form::get_instance()->set_option( $option );
		}

		Yoast_Form::get_instance()->hidden( $var );
	}

	/**
	 * Create a Select Box.
	 *
	 * @deprecated 2.0
	 *
	 * @param string $var    The variable within the option to create the select for.
	 * @param string $label  The label to show for the variable.
	 * @param array  $values The select options to choose from.
	 * @param string $option The option the variable belongs to.
	 */
	function select( $var, $label, $values, $option = '' ) {
		_deprecated_function( __METHOD__, 'WPSEO 2.0', 'This method is deprecated, please use the <code>Yoast_Form</code> class.' );

		if ( $option !== '' ) {
			Yoast_Form::get_instance()->set_option( $option );
		}

		Yoast_Form::get_instance()->select( $var, $label, $values );
	}

	/**
	 * Create a File upload field.
	 *
	 * @deprecated 2.0
	 *
	 * @param string $var    The variable within the option to create the file upload field for.
	 * @param string $label  The label to show for the variable.
	 * @param string $option The option the variable belongs to.
	 */
	function file_upload( $var, $label, $option = '' ) {
		_deprecated_function( __METHOD__, 'WPSEO 2.0', 'This method is deprecated, please use the <code>Yoast_Form</code> class.' );

		if ( $option !== '' ) {
			Yoast_Form::get_instance()->set_option( $option );
		}

		Yoast_Form::get_instance()->file_upload( $var, $label );
	}

	/**
	 * Media input
	 *
	 * @deprecated 2.0
	 *
	 * @param string $var    Option name.
	 * @param string $label  Label message.
	 * @param string $option Optional option key.
	 */
	function media_input( $var, $label, $option = '' ) {
		_deprecated_function( __METHOD__, 'WPSEO 2.0', 'This method is deprecated, please use the <code>Yoast_Form</code> class.' );

		if ( $option !== '' ) {
			Yoast_Form::get_instance()->set_option( $option );
		}

		Yoast_Form::get_instance()->media_input( $var, $label );
	}

	/**
	 * Create a Radio input field.
	 *
	 * @deprecated 2.0
	 *
	 * @param string $var    The variable within the option to create the file upload field for.
	 * @param array  $values The radio options to choose from.
	 * @param string $label  The label to show for the variable.
	 * @param string $option The option the variable belongs to.
	 */
	function radio( $var, $values, $label, $option = '' ) {
		_deprecated_function( __METHOD__, 'WPSEO 2.0', 'This method is deprecated, please use the <code>Yoast_Form</code> class.' );

		if ( $option !== '' ) {
			Yoast_Form::get_instance()->set_option( $option );
		}

		Yoast_Form::get_instance()->radio( $var, $values, $label );
	}

	/**
	 * Create a postbox widget.
	 *
	 * @deprecated 2.0
	 *
	 * @param string $id      ID of the postbox.
	 * @param string $title   Title of the postbox.
	 * @param string $content Content of the postbox.
	 */
	function postbox( $id, $title, $content ) {
		_deprecated_function( __METHOD__, 'WPSEO 2.0', 'This method is deprecated, please re-implement the admin pages.' );

		?>
			<div id="<?php echo esc_attr( $id ); ?>" class="yoastbox">
				<h1><?php echo $title; ?></h1>
				<?php echo $content; ?>
			</div>
		<?php
	}

	/**
	 * Create a form table from an array of rows.
	 *
	 * @deprecated 2.0
	 *
	 * @param array $rows Rows to include in the table.
	 *
	 * @return string
	 */
	function form_table( $rows ) {
		_deprecated_function( __METHOD__, 'WPSEO 2.0', 'This method is deprecated, please re-implement the admin pages.' );

		if ( ! is_array( $rows ) || $rows === array() ) {
			return '';
		}

		$content = '<table class="form-table">';
		foreach ( $rows as $row ) {
			$content .= '<tr><th scope="row">';
			if ( isset( $row['id'] ) && $row['id'] != '' ) {
				$content .= '<label for="' . esc_attr( $row['id'] ) . '">' . esc_html( $row['label'] ) . ':</label>';
			}
			else {
				$content .= esc_html( $row['label'] );
			}
			if ( isset( $row['desc'] ) && $row['desc'] != '' ) {
				$content .= '<br/><small>' . esc_html( $row['desc'] ) . '</small>';
			}
			$content .= '</th><td>';
			$content .= $row['content'];
			$content .= '</td></tr>';
		}
		$content .= '</table>';

		return $content;
	}

	/**
	 * Resets the site to the default Yoast SEO settings and runs a title test to check
	 * whether force rewrite needs to be on.
	 *
	 * @deprecated 1.5.0
	 * @deprecated use WPSEO_Options::reset()
	 * @see        WPSEO_Options::reset()
	 */
	function reset_defaults() {
		_deprecated_function( __METHOD__, 'WPSEO 1.5.0', 'WPSEO_Options::reset()' );
		WPSEO_Options::reset();
	}
} /* End of class */
