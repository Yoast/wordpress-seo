import { __ } from "@wordpress/i18n";
import { Table, TextareaField, Title } from "@yoast/ui-library";
import { Field } from "formik";
import { FormLayout } from "../components";

/**
 * @param {JSX.node} children The content.
 * @returns {JSX.Element} The element.
 */
const VariableCell = ( { children } ) => <Table.Cell className="yst-whitespace-nowrap yst-font-medium yst-text-gray-800">{ children }</Table.Cell>

/**
 * @returns {JSX.Element} The RSS route.
 */
const Rss = () => {
	return (
		<FormLayout
			title={ __( "RSS", "wordpress-seo" ) }
		>
			<fieldset className="lg:yst-grid lg:yst-grid-cols-3 lg:yst-gap-12">
				<div className="lg:yst-col-span-1">
					<div className="max-w-screen-sm">
						<Title as="legend" size="4" className="yst-mb-2">
							{ __( "RSS feed", "wordpress-seo" ) }
						</Title>
						<p>
							{ __( "Automatically add content to your RSS. This enables you to add links back to your blog and your blog posts, helping search engines identify you as the original source of the content.", "wordpress-seo" ) }
						</p>
					</div>
				</div>
				<div className="yst-mt-8 lg:yst-mt-0 lg:yst-col-span-2 yst-space-y-8">
					<Field
						as={ TextareaField }
						type="textarea"
						rows={ 4 }
						name="wpseo_titles.rssbefore"
						id="input:wpseo_titles.rssbefore"
						label={ __( "Content to put before each post in the feed", "wordpress-seo" ) }
					/>
					<Field
						as={ TextareaField }
						type="textarea"
						rows={ 4 }
						name="wpseo_titles.rssafter"
						id="input:wpseo_titles.rssafter"
						label={ __( "Content to put after each post in the feed", "wordpress-seo" ) }
					/>
				</div>
			</fieldset>
			<hr className="yst-my-8" />
			<div className="lg:yst-grid lg:yst-grid-cols-3 lg:yst-gap-12">
				<div className="lg:yst-col-span-1">
					<div className="max-w-screen-sm">
						<Title as="legend" size="4" className="yst-mb-2">
							{ __( "Available variables", "wordpress-seo" ) }
						</Title>
						<p>
							{ __( "You can use the following variables within the content, they will be replaced by the value on the right.", "wordpress-seo" ) }
						</p>
					</div>

				</div>
				<div className="yst-mt-8 lg:yst-mt-0 lg:yst-col-span-2 yst-space-y-8">
					<div className="yst-overflow-hidden yst-border yst-border-gray-200 yst-shadow-sm yst-rounded-lg">
						<Table>
							<Table.Head>
								<Table.Row>
									<Table.Header>{ __( "Variable", "wordpress-seo" ) }</Table.Header>
									<Table.Header>{ __( "Description", "wordpress-seo" ) }</Table.Header>
								</Table.Row>
							</Table.Head>
							<Table.Body>
								<Table.Row>
									<VariableCell>%%AUTHORLINK%%</VariableCell>
									<Table.Cell>{ __( "A link to the archive for the post author, with the authors name as anchor text.", "wordpress-seo" ) }</Table.Cell>
								</Table.Row>
								<Table.Row>
									<VariableCell>%%POSTLINK%%</VariableCell>
									<Table.Cell>{ __( "A link to the post, with the title as anchor text.", "wordpress-seo" ) }</Table.Cell>
								</Table.Row>
								<Table.Row>
									<VariableCell>%%BLOGLINK%%</VariableCell>
									<Table.Cell>{ __( "A link to your site, with your site's name as anchor text.", "wordpress-seo" ) }</Table.Cell>
								</Table.Row>
								<Table.Row>
									<VariableCell>%%BLOGDESCLINK%%</VariableCell>
									<Table.Cell>{ __( "A link to your site, with your site's name and description as anchor text.", "wordpress-seo" ) }</Table.Cell>
								</Table.Row>
							</Table.Body>
						</Table>
					</div>
				</div>
			</div>
		</FormLayout>
	);
};

export default Rss;
