/**
 * WordPress e2e utilities
 */
import {
    trashAllPosts,
    createNewPost,
    installPlugin,
    activatePlugin,
    visitAdminPage,
    pressKeyWithModifier,
} from "@wordpress/e2e-test-utils";

import { addQueryArgs } from '@wordpress/url';

describe("Yoast SEO plugin metabox", () => {
    it("shows correctly the Yoast SEO metabox should be present when editing a custom post type", async() => {
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
		expect( yoastSeoCustomPostMetabox.length ).toBe( 41 );
    });
});