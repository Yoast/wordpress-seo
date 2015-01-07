<?php

class WPSEO_Admin_User_Profile {
	/**
	 * Class constructor
	 */
	public function __construct() {
		add_action( 'show_user_profile', array( $this, 'user_profile' ) );
		add_action( 'edit_user_profile', array( $this, 'user_profile' ) );
		add_action( 'personal_options_update', array( $this, 'process_user_option_update' ) );
		add_action( 'edit_user_profile_update', array( $this, 'process_user_option_update' ) );
	}

	/**
	 * Filter POST variables.
	 *
	 * @param string $var_name
	 *
	 * @return mixed
	 */
	private function filter_input_post( $var_name ) {
		$val = WPSEO_Admin_Util::filter_input( INPUT_POST, $var_name );
		if ( $val ) {
			return WPSEO_Option::sanitize_text_field( $val );
		} else {
			return '';
		}
	}

	/**
	 * Updates the user metas that (might) have been set on the user profile page.
	 *
	 * @param    int $user_id of the updated user
	 */
	public function process_user_option_update( $user_id ) {

		if ( current_user_can( 'edit_user', $user_id ) ) {
			update_user_meta( $user_id, '_yoast_wpseo_profile_updated', time() );
		}

		if ( $this->filter_input_post( 'wpseo_author_title' ) ) {
			check_admin_referer( 'wpseo_user_profile_update', 'wpseo_nonce' );
			update_user_meta( $user_id, 'wpseo_title', $this->filter_input_post( 'wpseo_author_title' ) );
			update_user_meta( $user_id, 'wpseo_metadesc', $this->filter_input_post( 'wpseo_author_metadesc' ) );
			update_user_meta( $user_id, 'wpseo_metakey', $this->filter_input_post( 'wpseo_author_metakey' ) );
			update_user_meta( $user_id, 'wpseo_excludeauthorsitemap', $this->filter_input_post( 'wpseo_author_exclude' ) );
		}
	}

	/**
	 * Add the inputs needed for SEO values to the User Profile page
	 *
	 * @param    object $user
	 */
	public function user_profile( $user ) {

		if ( ! current_user_can( 'edit_users' ) ) {
			return;
		}

		$options = WPSEO_Options::get_all();

		wp_nonce_field( 'wpseo_user_profile_update', 'wpseo_nonce' );
		?>
		<h3 id="wordpress-seo"><?php _e( 'WordPress SEO settings', 'wordpress-seo' ); ?></h3>
		<table class="form-table">
			<tr>
				<th>
					<label
						for="wpseo_author_title"><?php _e( 'Title to use for Author page', 'wordpress-seo' ); ?></label>
				</th>
				<td><input class="regular-text" type="text" id="wpseo_author_title" name="wpseo_author_title"
				           value="<?php echo esc_attr( get_the_author_meta( 'wpseo_title', $user->ID ) ); ?>"/>
				</td>
			</tr>
			<tr>
				<th>
					<label
						for="wpseo_author_metadesc"><?php _e( 'Meta description to use for Author page', 'wordpress-seo' ); ?></label>
				</th>
				<td>
						<textarea rows="3" cols="30" id="wpseo_author_metadesc"
						          name="wpseo_author_metadesc"><?php echo esc_textarea( get_the_author_meta( 'wpseo_metadesc', $user->ID ) ); ?></textarea>
				</td>
			</tr>
			<?php if ( $options['usemetakeywords'] === true ) { ?>
				<tr>
					<th>
						<label
							for="wpseo_author_metakey"><?php _e( 'Meta keywords to use for Author page', 'wordpress-seo' ); ?></label>
					</th>
					<td>
						<input class="regular-text" type="text" id="wpseo_author_metakey"
						       name="wpseo_author_metakey"
						       value="<?php echo esc_attr( get_the_author_meta( 'wpseo_metakey', $user->ID ) ); ?>"/>
					</td>
				</tr>
			<?php } ?>
			<tr>
				<th>
					<label
						for="wpseo_author_exclude"><?php _e( 'Exclude user from Author-sitemap', 'wordpress-seo' ); ?></label>
				</th>
				<td>
					<input class="checkbox double" type="checkbox" id="wpseo_author_exclude"
					       name="wpseo_author_exclude"
					       value="on" <?php echo( ( esc_attr( get_the_author_meta( 'wpseo_excludeauthorsitemap', $user->ID ) ) == 'on' ) ? 'checked' : '' ); ?> />
				</td>
			</tr>
		</table>
		<br/><br/>
	<?php
	}

}