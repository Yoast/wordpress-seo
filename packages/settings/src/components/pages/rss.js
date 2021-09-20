import { __ } from "@wordpress/i18n";
import { Section } from "@yoast/admin-ui-toolkit/components";
import TextArea from "../text-area";
import Page from "../page";

/**
 * Renders the RSS Page component.
 *
 * @returns {Component} The RSS Page.
 */
export default function RSS() {
	return (
		<Page title={ __( "RSS", "admin-ui" ) }>
			<Section
				title={ __( "RSS", "admin-ui" ) }
				description={ __( "Automatically add content to your RSS. This enables you to add links back to your blog and your blog posts, helping search engines identify you as the original source of the content.", "admin-ui" ) }
			>
				<TextArea
					id="content-before-post"
					label={ __( "Content to put before each post in the feed", "admin-ui" ) }
					dataPath="advancedSettings.rss.contentBeforePost"
				/>
				<TextArea
					id="content-after-post"
					label={ __( "Content to put after each post in the feed", "admin-ui" ) }
					dataPath="advancedSettings.rss.contentAfterPost"
				/>
			</Section>
			<Section
				title={ __( "Available variables", "admin-ui" ) }
				description={ __( "You can use the following variables within the content, they will be replaced by the value on the right.", "admin-ui" ) }
			>
				<div className="yst-overflow-hidden yst-border yst-border-gray-200 yst-shadow-sm yst-rounded-lg">
					{ /* When this table is needed twice, let's abstract it with @apply */ }
					<table className="yst-min-w-full yst-divide-y yst-divide-gray-200">
						<thead className="yst-bg-gray-50">
							<tr>
								<th
									scope="col"
									className="yst-px-6 yst-py-3 yst-text-left yst-text-xs yst-font-medium yst-text-gray-500 yst-uppercase yst-tracking-wider"
								>
									{ __( "Variable", "admin-ui" ) }
								</th>
								<th
									scope="col"
									className="yst-px-6 yst-py-3 yst-text-left yst-text-xs yst-font-medium yst-text-gray-500 yst-uppercase yst-tracking-wider"
								>
									{ __( "Description", "admin-ui" ) }
								</th>
							</tr>
						</thead>
						<tbody>
							<tr className="yst-bg-white">
								<td className="yst-px-6 yst-py-4 yst-text-sm yst-font-medium yst-text-gray-800">
									%%AUTHORLINK%%
								</td>
								<td className="yst-px-6 yst-py-4 yst-text-sm">
									{ __( "A link to the archive for the post author, with the authors name as anchor text.", "admin-ui" ) }
								</td>
							</tr>
							<tr className="yst-bg-gray-50">
								<td className="yst-px-6 yst-py-4 yst-text-sm yst-font-medium yst-text-gray-800">
									%%POSTLINK%%
								</td>
								<td className="yst-px-6 yst-py-4 yst-text-sm yst-text-gray-500">
									{ __( "A link to the post, with the title as anchor text.", "admin-ui" ) }
								</td>
							</tr>
							<tr className="yst-bg-white">
								<td className="yst-px-6 yst-py-4 yst-text-sm yst-font-medium yst-text-gray-800">
									%%BLOGLINK%%
								</td>
								<td className="yst-px-6 yst-py-4 yst-text-sm">
									{ __( "A link to your site, with your site's name as anchor text.", "admin-ui" ) }
								</td>
							</tr>
							<tr className="yst-bg-gray-50">
								<td className="yst-px-6 yst-py-4 yst-text-sm yst-font-medium yst-text-gray-800">
									%%BLOGDESCLINK%%
								</td>
								<td className="yst-px-6 yst-py-4 yst-text-sm yst-text-gray-500">
									{ __( "A link to your site, with your site's name and description as anchor text.", "admin-ui" ) }
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</Section>
		</Page>
	);
}
