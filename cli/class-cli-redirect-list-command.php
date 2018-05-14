<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\CLI
 */

/**
 * Implementation of the 'redirect list' WP-CLI command.
 */
final class WPSEO_CLI_Redirect_List_Command extends WPSEO_CLI_Redirect_Base_Command {

	const ALL_FIELDS = 'origin,target,type,format';

	/**
	 * Lists Yoast SEO redirects.
	 *
	 * ## OPTIONS
	 *
	 * [--<field>=<value>]
	 * : Filter the list to only show specific values for a given field.
	 *
	 * [--field=<field>]
	 * : Prints the value of a single field for each redirect.
	 *
	 * [--fields=<fields>]
	 * : Limit the output to specific object fields.
	 * ---
	 * default: origin,target,type,format
	 * ---
	 *
	 * [--output=<output>]
	 * : Render output in a particular format.
	 * ---
	 * default: table
	 * options:
	 *  - table
	 *  - csv
	 *  - json
	 *  - yaml
	 *  - count
	 * ---
	 *
	 * ## AVAILABLE FIELDS
	 *
	 * These fields will be displayed by default for each redirect:
	 *
	 * * origin
	 * * target
	 * * type
	 * * format
	 *
	 * @param array $args Array of positional arguments.
	 * @param array $assoc_args Associative array of associative arguments.
	 */
	public function __invoke( $args, $assoc_args ) {
		$filter = $this->get_filter( $assoc_args );

		/*
		 * By default, WP-CLI uses `--format=<format>` to define the output
		 * format for lists. As we also have a `format` field here and want to
		 * be able to easily filter the list by a given format, we use
		 * `--output=<output>` to define the format.
		 * We need to rename it back again here to be able to use the default
		 * format handling provided by WP-CLI.
		 */
		$assoc_args['format'] = $assoc_args['output'];

		$formatter = new WP_CLI\Formatter(
			$assoc_args,
			$this->get_fields( $assoc_args )
		);

		$redirects = array_filter(
			$this->get_redirects(),
			function ( $redirect ) use ( $filter ) {
				foreach ( $filter as $key => $value ) {
					// Loose comparison to ignore type.
					if ( $value != $redirect[ $key ] ) {
						return false;
					}
				}

				return true;
			}
		);

		$formatter->display_items( $redirects );
	}

	/**
	 * Gets the filtered list of redirects.
	 *
	 * @return array Associative array of redirects.
	 */
	private function get_redirects() {
		$redirect_objects = $this->redirect_manager->get_all_redirects();

		return array_map(
			array( $this, 'adapt_redirect_data' ),
			$redirect_objects
		);
	}

	/**
	 * Adapts redirect data fetched from the redirect manager to fit WP_CLI
	 * requirements.
	 *
	 * @param WPSEO_Redirect $redirect Redirection value object.
	 *
	 * @return array Associative array of redirects.
	 */
	private function adapt_redirect_data( $redirect ) {
		return array(
			'origin' => $redirect->get_origin(),
			'target' => $redirect->get_target(),
			'type'   => $redirect->get_type(),
			'format' => $redirect->get_format(),
		);
	}

	/**
	 * Gets Formatter object based on supplied parameters.
	 *
	 * @param array $assoc_args Parameters passed to command. Determines
	 *                          formatting.
	 *
	 * @return array Array of fields to use.
	 */
	private function get_fields( $assoc_args ) {
		if ( empty( $assoc_args['fields'] ) ) {
			return explode( ',', self::ALL_FIELDS );
		}

		if ( is_string( $assoc_args['fields'] ) ) {
			return explode( ',', $assoc_args['fields'] );
		}

		return $assoc_args['fields'];
	}

	/**
	 * Gets the filter array to filter values against.
	 *
	 * @param array $assoc_args Parameters passed to command. Determines
	 *                          formatting.
	 *
	 * @return array Associative array of filter values.
	 */
	private function get_filter( $assoc_args ) {
		$filter = array();

		foreach ( array( 'origin', 'target', 'type', 'format' ) as $type ) {
			if ( isset( $assoc_args[ $type ] ) ) {
				$filter[ $type ] = $assoc_args[ $type ];
			}
		}

		return $filter;
	}
}
