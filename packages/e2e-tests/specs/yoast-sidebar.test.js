/**
 * WordPress e2e utilities
 */
import {
	createNewPost,
	trashAllPosts,
} from "@wordpress/e2e-test-utils";

describe( "Yoast SEO sidebar", () => {

	it( "shows correctly Yoast SEO sidebar when editing a post", async () => {
		await trashAllPosts();
		await createNewPost();

		await page.waitForSelector( "aria/Yoast SEO" );
		const yoastSeoSidebarButton = await page.$x(
			`//button[contains( @aria-label, "Yoast SEO" )]`
		);
		expect( yoastSeoSidebarButton.length ).toBe( 1 );

		await page.click( "aria/Yoast SEO" );

		const yoastSeoSidebarTitle = await page.$x(
			`//div[contains( @class, "components-panel__header" )][contains( .//strong, "Yoast SEO" )]`
		);
		expect( yoastSeoSidebarTitle.length ).toBe( 1 )
	} );

	it( "shows correctly Yoast SEO sidebar when editing a page", async () => {
		await trashAllPosts( "page" );
   		await createNewPost( { postType: "page" } );

		await page.waitForSelector( "aria/Yoast SEO" );
		const yoastSeoSidebarButton = await page.$x(
			`//button[contains( @aria-label, "Yoast SEO" )]`
		);
		expect( yoastSeoSidebarButton.length ).toBe( 1 );

		await page.click( "aria/Yoast SEO" );

		const yoastSeoSidebarTitle = await page.$x(
			`//div[contains( @class, "components-panel__header" )][contains( .//strong, "Yoast SEO" )]`
		);
		expect( yoastSeoSidebarTitle.length ).toBe( 1 )
	} );

	it( "shows correctly Yoast SEO sidebar when editing a custom post", async () => {
		await trashAllPosts( "yoast_post_type" );
   		await createNewPost( { postType: "yoast_post_type" } );

		await page.waitForSelector( "aria/Yoast SEO" );
		const yoastSeoSidebarButton = await page.$x(
			`//button[contains( @aria-label, "Yoast SEO" )]`
		);
		expect( yoastSeoSidebarButton.length ).toBe( 1 );

		await page.click( "aria/Yoast SEO" );

		const yoastSeoSidebarTitle = await page.$x(
			`//div[contains( @class, "components-panel__header" )][contains( .//strong, "Yoast SEO" )]`
		);
		expect( yoastSeoSidebarTitle.length ).toBe( 1 )
	} );

} );
