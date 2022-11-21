import { __ } from "@wordpress/i18n";
import { Table, TextareaField } from "@yoast/ui-library";
import { Field } from "formik";
import PropTypes from "prop-types";
import { FieldsetLayout, FormLayout, RouteLayout } from "../components";

/**
 * @param {JSX.node} children The content.
 * @returns {JSX.Element} The element.
 */
const VariableCell = ( { children } ) => <Table.Cell className="yst-whitespace-nowrap yst-font-medium yst-text-slate-800">{ children }</Table.Cell>;

VariableCell.propTypes = {
	children: PropTypes.node.isRequired,
};

/**
 * @returns {JSX.Element} The RSS route.
 */
const Rss = () => {
	return (
		<RouteLayout title={ __( "RSS", "wordpress-seo" ) }>
			<FormLayout>
				<div className="yst-max-w-5xl">
					<FieldsetLayout
						title={ __( "RSS feed", "wordpress-seo" ) }
						description={ __( "Automatically add content to your RSS. This enables you to add links back to your blog and your blog posts, helping search engines identify you as the original source of the content.", "wordpress-seo" ) }
					>
						<Field
							as={ TextareaField }
							type="textarea"
							rows={ 4 }
							name="wpseo_titles.rssbefore"
							id="input-wpseo_titles-rssbefore"
							label={ __( "Content to put before each post in the feed", "wordpress-seo" ) }
						/>
						<Field
							as={ TextareaField }
							type="textarea"
							rows={ 4 }
							name="wpseo_titles.rssafter"
							id="input-wpseo_titles-rssafter"
							label={ __( "Content to put after each post in the feed", "wordpress-seo" ) }
						/>
					</FieldsetLayout>
					<hr className="yst-my-8" />
					<FieldsetLayout
						as="section"
						title={ __( "Available variables", "wordpress-seo" ) }
						description={ __( "You can use the following variables within the content, they will be replaced by the value on the right.", "wordpress-seo" ) }
					>
						<div className="yst-overflow-hidden yst-border yst-border-slate-200 yst-shadow-sm yst-rounded-lg">
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
										<Table.Cell>{ __( "A link to the archive for the post author, with the author's name as anchor text.", "wordpress-seo" ) }</Table.Cell>
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
					</FieldsetLayout>
				</div>
			</FormLayout>
		</RouteLayout>
	);
};

export default Rss;
