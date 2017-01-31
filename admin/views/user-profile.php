<?php
/**
 * @package WPSEO\Admin
 */

?>

<div class="yoast yoast-settings">

	<h2 id="wordpress-seo"><?php
		/* translators: %1$s expands to Yoast SEO */
		printf( __( '%1$s settings', 'wordpress-seo' ), 'Yoast SEO' );
		?></h2>

	<label for="wpseo_author_title"><?php _e( 'Title to use for Author page', 'wordpress-seo' ); ?></label>
	<input class="yoast-settings__text regular-text" type="text" id="wpseo_author_title" name="wpseo_author_title"
		value="<?php echo esc_attr( get_the_author_meta( 'wpseo_title', $user->ID ) ); ?>"/><br>

	<label for="wpseo_author_metadesc"><?php _e( 'Meta description to use for Author page', 'wordpress-seo' ); ?></label>
	<textarea rows="5" cols="30" id="wpseo_author_metadesc" class="yoast-settings__textarea yoast-settings__textarea--medium"
		name="wpseo_author_metadesc"><?php echo esc_textarea( get_the_author_meta( 'wpseo_metadesc', $user->ID ) ); ?></textarea><br>

	<?php if ( $options['usemetakeywords'] === true ) { ?>
		<label for="wpseo_author_metakey"><?php _e( 'Meta keywords to use for Author page', 'wordpress-seo' ); ?></label>
		<input class="yoast-settings__text regular-text" type="text" id="wpseo_author_metakey"
			name="wpseo_author_metakey"
			value="<?php echo esc_attr( get_the_author_meta( 'wpseo_metakey', $user->ID ) ); ?>"/><br>
	<?php } ?>
		<input class="yoast-settings__checkbox double" type="checkbox" id="wpseo_author_exclude"
			name="wpseo_author_exclude"
			value="on" <?php echo ( get_the_author_meta( 'wpseo_excludeauthorsitemap', $user->ID ) === 'on' ) ? 'checked' : ''; ?> />
		<label class="yoast-label-strong" for="wpseo_author_exclude"><?php _e( 'Exclude user from Author-sitemap', 'wordpress-seo' ); ?></label><br>

	<?php if ( $options['keyword-analysis-active'] === true ) { ?>
		<input class="yoast-settings__checkbox double" type="checkbox" id="wpseo_keyword_analysis_disable"
			name="wpseo_keyword_analysis_disable" aria-describedby="wpseo_keyword_analysis_disable_desc"
			value="on" <?php echo ( get_the_author_meta( 'wpseo_keyword_analysis_disable', $user->ID ) === 'on' ) ? 'checked' : ''; ?> />
		<label class="yoast-label-strong" for="wpseo_keyword_analysis_disable"><?php _e( 'Disable SEO analysis', 'wordpress-seo' ); ?></label><br>
		<p class="description" id="wpseo_keyword_analysis_disable_desc">
			<?php _e( 'Removes the keyword tab from the metabox and disables all SEO-related suggestions.', 'wordpress-seo' ); ?>
		</p>
	<?php } ?>

	<?php if ( $options['content-analysis-active'] === true ) { ?>
		<input class="yoast-settings__checkbox double" type="checkbox" id="wpseo_content_analysis_disable"
			name="wpseo_content_analysis_disable" aria-describedby="wpseo_content_analysis_disable_desc"
			value="on" <?php echo ( get_the_author_meta( 'wpseo_content_analysis_disable', $user->ID ) === 'on' ) ? 'checked' : ''; ?> />
		<label class="yoast-label-strong" for="wpseo_content_analysis_disable"><?php _e( 'Disable readability analysis', 'wordpress-seo' ); ?></label><br>
		<p class="description" id="wpseo_content_analysis_disable_desc">
			<?php _e( 'Removes the readability tab from the metabox and disables all readability-related suggestions.', 'wordpress-seo' ); ?>
		</p>
	<?php } ?>
</div>
