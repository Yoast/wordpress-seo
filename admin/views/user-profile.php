<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/* translators: %1$s expands to Yoast SEO */
$wpseo_up_settings_header    = sprintf( __( '%1$s settings', 'wordpress-seo' ), 'Yoast SEO' );
$wpseo_no_index_author_label = sprintf(
	/* translators: %s expands to "this author's archives". */
	__( 'Do not allow search engines to show %s in search results.', 'wordpress-seo' ),
	__( 'this author\'s archives', 'wordpress-seo' )
);
?>

<div class="yoast yoast-settings">

	<h2 id="wordpress-seo"><?php echo esc_html( $wpseo_up_settings_header ); ?></h2>

	<label for="wpseo_author_title"><?php esc_html_e( 'Title to use for Author page', 'wordpress-seo' ); ?></label>
	<input class="yoast-settings__text regular-text" type="text" id="wpseo_author_title" name="wpseo_author_title"
		value="<?php echo esc_attr( get_the_author_meta( 'wpseo_title', $user->ID ) ); ?>"/><br>

	<label for="wpseo_author_metadesc"><?php esc_html_e( 'Meta description to use for Author page', 'wordpress-seo' ); ?></label>
	<textarea rows="5" cols="30" id="wpseo_author_metadesc"
		class="yoast-settings__textarea yoast-settings__textarea--medium"
		name="wpseo_author_metadesc"><?php echo esc_textarea( get_the_author_meta( 'wpseo_metadesc', $user->ID ) ); ?></textarea><br>

	<input class="yoast-settings__checkbox double" type="checkbox" id="wpseo_noindex_author"
		name="wpseo_noindex_author"
		value="on" <?php echo ( get_the_author_meta( 'wpseo_noindex_author', $user->ID ) === 'on' ) ? 'checked' : ''; ?> />
	<label class="yoast-label-strong"
		for="wpseo_noindex_author"><?php echo esc_html( $wpseo_no_index_author_label ); ?></label><br>

	<?php if ( WPSEO_Options::get( 'keyword_analysis_active', false ) ) : ?>
		<input class="yoast-settings__checkbox double" type="checkbox" id="wpseo_keyword_analysis_disable"
			name="wpseo_keyword_analysis_disable" aria-describedby="wpseo_keyword_analysis_disable_desc"
			value="on" <?php echo ( get_the_author_meta( 'wpseo_keyword_analysis_disable', $user->ID ) === 'on' ) ? 'checked' : ''; ?> />
		<label class="yoast-label-strong"
			for="wpseo_keyword_analysis_disable"><?php esc_html_e( 'Disable SEO analysis', 'wordpress-seo' ); ?></label>
		<br>
		<p class="description" id="wpseo_keyword_analysis_disable_desc">
			<?php esc_html_e( 'Removes the focus keyphrase section from the metabox and disables all SEO-related suggestions.', 'wordpress-seo' ); ?>
		</p>
	<?php endif; ?>

	<?php if ( WPSEO_Options::get( 'content_analysis_active', false ) ) : ?>
		<input class="yoast-settings__checkbox double" type="checkbox" id="wpseo_content_analysis_disable"
			name="wpseo_content_analysis_disable" aria-describedby="wpseo_content_analysis_disable_desc"
			value="on" <?php echo ( get_the_author_meta( 'wpseo_content_analysis_disable', $user->ID ) === 'on' ) ? 'checked' : ''; ?> />
		<label class="yoast-label-strong"
			for="wpseo_content_analysis_disable"><?php esc_html_e( 'Disable readability analysis', 'wordpress-seo' ); ?></label>
		<br>
		<p class="description" id="wpseo_content_analysis_disable_desc">
			<?php esc_html_e( 'Removes the readability analysis section from the metabox and disables all readability-related suggestions.', 'wordpress-seo' ); ?>
		</p>
	<?php endif; ?>
</div>
