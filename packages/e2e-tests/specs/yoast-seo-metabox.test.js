/**
 * WordPress e2e utilities
 */
import {
	trashAllPosts,
	createNewPost,
	visitAdminPage,
	pressKeyWithModifier,
	installPlugin,
	activatePlugin
} from "@wordpress/e2e-test-utils";

import { addQueryArgs } from '@wordpress/url';

describe( "Yoast SEO plugin metabox", () => {

	it( "shows correctly the Yoast SEO metabox should be present when editing a post", async () => {
		await trashAllPosts();
		await createNewPost();

		await page.waitForSelector( ".postbox.yoast.wpseo-metabox" );
		const yoastSeoPostMetabox = await page.$x(
			`//div[contains( @class, "wpseo-metabox" )][contains( .//h2, "Yoast SEO" )]`
		);
		expect( yoastSeoPostMetabox.length ).toBe( 1 );
	} );

	it( "shows correctly the Yoast SEO metabox should be present when editing a page", async () => {
		await trashAllPosts( "page" );
   		await createNewPost( { postType: "page" } );

		await page.waitForSelector( ".postbox.yoast.wpseo-metabox" );
		const yoastSeoPostMetabox = await page.$x(
			`//div[contains( @class, "wpseo-metabox" )][contains( .//h2, "Yoast SEO" )]`
		);
		expect( yoastSeoPostMetabox.length ).toBe( 1 );
	} );

	it( "shows correctly the Yoast SEO metabox should be present when editing a post category page", async () => {
		const postCategoryQuery = addQueryArgs( '', {
			taxonomy: 'category',
		} );
	
		await visitAdminPage( 'edit-tags.php', postCategoryQuery );
		await page.waitForSelector( '#the-list tr' );
	
		const [ uncategorizedLink ] = await page.$x(
			`//a[contains( @class, "row-title" )][contains( text(), "Uncategorized" )]`
		);
		await uncategorizedLink.click();
	
		await page.waitForSelector( ".postbox.yoast.wpseo-taxonomy-metabox-postbox" );
		const yoastSeoTaxonomyMetabox = await page.$x(
			`//div[contains( @class, "wpseo-taxonomy-metabox-postbox" )][contains( .//h2, "Yoast SEO" )]`
		);
		expect( yoastSeoTaxonomyMetabox.length ).toBe( 1 );
	} );

	it( "shows correctly the Yoast SEO metabox should be present when editing a post tag page", async () => {
		const postTagQuery = addQueryArgs( '', {
			taxonomy: 'post_tag',
		} );
		const tagTitle = "New Tag";
	
		await visitAdminPage( 'edit-tags.php', postTagQuery );

		// Trash all existing post tags
		await page.waitForSelector( '#the-list tr' );
		const tagsRows = await page.$$( '#the-list tr' );
		if( tagsRows.length !== null ) {
			await page.click( '[id^=cb-select-all-]' );
			await page.select( '#bulk-action-selector-top', 'delete' );
			await page.focus( '#doaction' );
			await page.keyboard.press( 'Enter' );
		}

		// Create a new post tag
		await page.waitForSelector('#tag-name');
		await page.focus( '#tag-name' );
		await pressKeyWithModifier( 'primary', 'a' );
		await page.type( '#tag-name', tagTitle );
		await page.click( '#submit' );

		// Go to the new created post tag page
		const [ newCreatedTag ] = await page.$x(
			`//a[contains( @class, "row-title" )][contains( text(), "${ tagTitle }" )]`
		);
		await newCreatedTag.click();
	
		await page.waitForSelector( ".postbox.yoast.wpseo-taxonomy-metabox-postbox" );
		const yoastSeoTaxonomyMetabox = await page.$x(
			`//div[contains( @class, "wpseo-taxonomy-metabox-postbox" )][contains( .//h2, "Yoast SEO" )]`
		);
		expect( yoastSeoTaxonomyMetabox.length ).toBe( 1 );
	} );

	it( "shows correctly the Yoast SEO metabox should be present when editing a custom post type", async() => {
        const cptPluginSlug = "custom-post-type-ui";
        const cptuiCreatePostType = addQueryArgs('', {
            page: "cptui_manage_post_types",
        });
        const cptuiDeletePostType = addQueryArgs('', {
            page: "cptui_manage_post_types",
            action: "edit"
		});
		const slug = "yoast_post_type";
		const plural_label = "Yoast Simple Posts"
		const singular_label = "Yoast Simple Post"
		
		// If the plugin is already installed but not activated, activate it
		// If the plugin is already installed and activated, move to the CPT management
		// If the plugin is not installed, install and activate it
		await visitAdminPage( "plugins.php" );
		const cptuiPluginRow = await page.$x(
			`//tr[contains( @data-plugin, "custom-post-type-ui/custom-post-type-ui.php" )]`
		);
		if( cptuiPluginRow.length == 1 ) {
			const [ activatePluginLink ] = await page.$x(
				`//a[contains( @id, "activate-custom-post-type-ui" )]`
			);
			if( activatePluginLink.length == 1 ) {
				activatePluginLink.click()
			}
		} else{
			await installPlugin(cptPluginSlug);
			await activatePlugin(cptPluginSlug);
		}

		// When the tests are run multiple times, it is necessary
		// to delete created custom post types before creating them again
		await visitAdminPage( "admin.php", cptuiDeletePostType );
		const selectCptElement = await page.$$( "#post_type" );
		if( selectCptElement.length > 0 ) {
			await page.click( "#cpt_submit_delete" );
			await page.keyboard.press( "Enter" );
		}

		// Create the new custom post type
		await visitAdminPage( "admin.php", cptuiCreatePostType );

		await page.focus( "#name" );
		await pressKeyWithModifier( "primary", "a" );
		await page.type( "#name", slug );

		await page.focus( "#label" );
		await pressKeyWithModifier( "primary", "a" );
		await page.type( "#label", plural_label );

		await page.focus( "#singular_label" );
		await pressKeyWithModifier( "primary", "a" );
		await page.type( "#singular_label", singular_label );

		await page.click( "#auto-populate" )
		await page.click( ".button-primary" );

		// Check if the Yoast SEO metabox is present when editing the custom post type
		await trashAllPosts( slug );
   		await createNewPost( { postType: slug } );

		await page.waitForSelector( ".postbox.yoast.wpseo-metabox" );
		const yoastSeoCustomPostMetabox = await page.$x(
			`//div[contains( @class, "wpseo-metabox" )][contains( .//h2, "Yoast SEO" )]`
		);
		expect( yoastSeoCustomPostMetabox.length ).toBe( 1 );
    });

} );
