<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Registers the personal data exporter for author SEO title and meta description.
 */
class Author_Personal_Data_Export_Integration implements Integration_Interface {

	/**
	 * {@inheritDoc}
	 *
	 * @return array<int, string> The conditionals that must be met to load this integration.
	 */
	public static function get_conditionals() {
		return [ Admin_Conditional::class ];
	}

	/**
	 * {@inheritDoc}
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_filter( 'wp_privacy_personal_data_exporters', [ $this, 'register_exporter' ] );
	}

	/**
	 * Adds the author data exporter.
	 *
	 * @param array<string, array<string, string|callable>> $exporters Existing exporters.
	 *
	 * @return array<string, array<string, string|callable>> Exporters, with the Yoast SEO exporter added when the list is an array.
	 */
	public function register_exporter( $exporters ) {
		if ( ! \is_array( $exporters ) ) {
			return $exporters;
		}

		$exporters['wordpress-seo'] = [
			'exporter_friendly_name' => \__( 'Yoast SEO', 'wordpress-seo' ),
			'callback'               => [ $this, 'export_author_data' ],
		];

		return $exporters;
	}

	/**
	 * Exports the author SEO title and meta description for a user.
	 *
	 * There is at most one user for an email, so the export finishes on the first page.
	 *
	 * @param string $email_address Email address of the user.
	 * @param int    $page          Page number. Starts at 1.
	 *
	 * @return array<string, array<int, array<string, string|array<int, array<string, string>>>>|bool> Export data and whether the exporter is done.
	 */
	public function export_author_data( $email_address, $page = 1 ) {
		if ( (int) $page !== 1 || ! \is_string( $email_address ) ) {
			return $this->get_done_response();
		}

		$email_address = \sanitize_email( $email_address );
		if ( $email_address === '' ) {
			return $this->get_done_response();
		}

		$user = \get_user_by( 'email', $email_address );
		if ( ! $user ) {
			return $this->get_done_response();
		}

		$rows = $this->append_field(
			[],
			$user->ID,
			'wpseo_title',
			\__( 'Title to use for Author page', 'wordpress-seo' ),
		);
		$rows = $this->append_field(
			$rows,
			$user->ID,
			'wpseo_metadesc',
			\__( 'Meta description to use for Author page', 'wordpress-seo' ),
		);

		if ( $rows === [] ) {
			return $this->get_done_response();
		}

		return $this->get_done_response(
			[
				[
					'group_id'    => 'yoast-seo',
					'group_label' => \__( 'Yoast SEO', 'wordpress-seo' ),
					'item_id'     => 'yoast-seo-user-' . \absint( $user->ID ),
					'data'        => $rows,
				],
			],
		);
	}

	/**
	 * Adds one author field to the export when it has a value.
	 *
	 * @param array<int, array<string, string>> $rows     Export rows gathered so far.
	 * @param int                               $user_id  User ID.
	 * @param string                            $meta_key User meta key.
	 * @param string                            $label    Field label shown in the export.
	 *
	 * @return array<int, array<string, string>> Export rows, including the field when it is not empty.
	 */
	private function append_field( array $rows, $user_id, $meta_key, $label ) {
		// Stored value only. get_the_author_meta() applies a filter that can change it.
		$value = \get_user_meta( $user_id, $meta_key, true );
		if ( ! \is_string( $value ) || \trim( $value ) === '' ) {
			return $rows;
		}

		$rows[] = [
			'name'  => $label,
			'value' => $value,
		];

		return $rows;
	}

	/**
	 * Builds a finished export response.
	 *
	 * @param array<int, array<string, string|array<int, array<string, string>>>> $data Export items.
	 *
	 * @return array<string, array<int, array<string, string|array<int, array<string, string>>>>|bool> Export data and whether the exporter is done.
	 */
	private function get_done_response( array $data = [] ) {
		return [
			'data' => $data,
			'done' => true,
		];
	}
}
