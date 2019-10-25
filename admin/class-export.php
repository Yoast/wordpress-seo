<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Export
 */

/**
 * Class WPSEO_Export.
 *
 * Class with functionality to export the WP SEO settings.
 */
class WPSEO_Export {

	/**
	 * Holds the nonce action.
	 *
	 * @var string
	 */
	const NONCE_ACTION = 'wpseo_export';

	/**
	 * Holds the export data.
	 *
	 * @var string
	 */
	private $export = '';

	/**
	 * Holds whether the export was a success.
	 *
	 * @var boolean
	 */
	public $success;

	/**
	 * Handles the export request.
	 */
	public function export() {
		check_admin_referer( self::NONCE_ACTION );
		$this->export_settings();
		$this->output();
	}

	/**
	 * Outputs the export.
	 */
	public function output() {
		if ( ! WPSEO_Capability_Utils::current_user_can( 'wpseo_manage_options' ) ) {
			esc_html_e( 'You do not have the required rights to export settings.', 'wordpress-seo' );
			return;
		}

		echo '<p id="wpseo-settings-export-desc">';
		printf(
			/* translators: %1$s expands to Import settings */
			esc_html__(
				'Copy all these settings to another site\'s %1$s tab and click "%1$s" there.',
				'wordpress-seo'
			),
			esc_html__(
				'Import settings',
				'wordpress-seo'
			)
		);
		echo '</p>';
		/* translators: %1$s expands to Yoast SEO */
		echo '<label for="wpseo-settings-export" class="yoast-inline-label">' . sprintf( __( 'Your %1$s settings:', 'wordpress-seo' ), 'Yoast SEO' ) . '</label><br />';
		echo '<textarea id="wpseo-settings-export" rows="20" cols="100" aria-describedby="wpseo-settings-export-desc">' . esc_textarea( $this->export ) . '</textarea>';
	}

	/**
	 * Exports the current site's WP SEO settings.
	 */
	private function export_settings() {
		$this->export_header();

		foreach ( WPSEO_Options::get_option_names() as $opt_group ) {
			$this->write_opt_group( $opt_group );
		}
	}

	/**
	 * Writes the header of the export.
	 */
	private function export_header() {
		$header = sprintf(
			/* translators: %1$s expands to Yoast SEO, %2$s expands to Yoast.com */
			esc_html__( 'These are settings for the %1$s plugin by %2$s', 'wordpress-seo' ),
			'Yoast SEO',
			'Yoast.com'
		);
		$this->write_line( '; ' . $header );
	}

	/**
	 * Writes a line to the export.
	 *
	 * @param string  $line          Line string.
	 * @param boolean $newline_first Boolean flag whether to prepend with new line.
	 */
	private function write_line( $line, $newline_first = false ) {
		if ( $newline_first ) {
			$this->export .= PHP_EOL;
		}
		$this->export .= $line . PHP_EOL;
	}

	/**
	 * Writes an entire option group to the export.
	 *
	 * @param string $opt_group Option group name.
	 */
	private function write_opt_group( $opt_group ) {

		$this->write_line( '[' . $opt_group . ']', true );

		$options = get_option( $opt_group );

		if ( ! is_array( $options ) ) {
			return;
		}

		foreach ( $options as $key => $elem ) {
			if ( is_array( $elem ) ) {
				$count = count( $elem );
				for ( $i = 0; $i < $count; $i++ ) {
					$this->write_setting( $key . '[]', $elem[ $i ] );
				}
			}
			else {
				$this->write_setting( $key, $elem );
			}
		}
	}

	/**
	 * Writes a settings line to the export.
	 *
	 * @param string $key Key string.
	 * @param string $val Value string.
	 */
	private function write_setting( $key, $val ) {
		if ( is_string( $val ) ) {
			$val = '"' . $val . '"';
		}
		$this->write_line( $key . ' = ' . $val );
	}

	/* ********************* DEPRECATED METHODS ********************* */

	/**
	 * Returns true when the property error has a value.
	 *
	 * @deprecated 11.9 Obsolete since the export setting refactor in 9.2.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return bool
	 */
	public function has_error() {
		_deprecated_function( __METHOD__, 'WPSEO 11.9' );

		return false;
	}

	/**
	 * Sets the error hook, to display the error to the user.
	 *
	 * @deprecated 11.9 Obsolete since the export setting refactor in 9.2.
	 *
	 * @codeCoverageIgnore
	 */
	public function set_error_hook() {
		_deprecated_function( __METHOD__, 'WPSEO 11.9' );
	}
}
