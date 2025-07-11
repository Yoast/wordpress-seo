import { useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Button, Checkbox, Select, SelectField, Table, TextField } from "@yoast/ui-library";
import {
	RouteLayout,
} from "../components";
import { useSelectRedirects } from "../hooks";
import { safeCreateInterpolateElement } from "../../helpers/i18n";
import { FieldsetLayout } from "../../shared-admin/components";
import { ChevronDownIcon } from "@heroicons/react/solid";

/**
 * Redirects component.
 *
 * This component renders the main interface for managing plain (non-regex) redirects
 * within the WordPress SEO admin panel. It provides a form to add new redirects, displays
 * a description with a help link, and includes filter controls and a list of existing redirects.
 *
 * @component
 *
 * @param {Object} [initialValues={}] - Initial values for the Formik form.
 * @param {Function} [createValidationSchema=() => {}] - A function that returns a Yup validation schema for validating the form.
 * @param {Function} [handleCreateSubmit=() => {}] - A function to handle form submission.
 * @param {JSX.Element} listRedirects - A component to display the list of redirects.
 * @param {JSX.Element} filterControls - A component to render the filter controls.
 *
 * @returns {JSX.Element} The rendered Redirects route.
 */
export const Redirects = () => {
	const redirectsManagedLink = useSelectRedirects( "selectLink", [], "https://yoa.st/redirects-learn-more" );
	const redirectsTypeLink = useSelectRedirects( "selectLink", [], "https://yoa.st/2jb" );
	const redirectsDescription = useMemo( () => safeCreateInterpolateElement(
		sprintf(
			/**
			 * translators: %1$s expands to an opening anchor tag.
			 * %2$s expands to a closing anchor tag.
			 */
			__( "Manage and monitor your redirects with ease. Create and edit plain redirects to ensure visitors and search engines reach the right pages. %1$sLearn more about redirects%2$s.", "wordpress-seo" ),
			"<a>",
			"</a>"
		),
		{
			// eslint-disable-next-line jsx-a11y/anchor-has-content
			a: <a href={ redirectsManagedLink } target="_blank" rel="noopener noreferrer" />,
		}
	), [] );

	const redirectTypeDescription = useMemo( () => safeCreateInterpolateElement(
		sprintf(
			/**
			 * translators: %1$s expands to an opening span tag.
			 * %2$s expands to a closing span tag.
			 */
			__( "The redirect type is the HTTP response code sent to the browser telling the browser what type of redirect is served. %1$sLearn more about redirect types%2$s.", "wordpress-seo" ),
			"<span>",
			"</span>"
		),
		{
			// eslint-disable-next-line jsx-a11y/anchor-has-content
			span: <span className="yst-text-slate-600 yst-underline" />,
		}
	), [] );


	return (
		<RouteLayout
			title={ __( "Redirects", "wordpress-seo" ) }
			description={ redirectsDescription }
		>
			<div className="yst-max-w-5xl yst-p-8 yst-opacity-50">
				<FieldsetLayout
					title={ __( "Plain redirects", "wordpress-seo" ) }
					description={ __( "Plain redirects automatically send visitors from one URL to another. Use them to fix broken links and improve your site's user experience.", "wordpress-seo" ) }
					variant={ "xl" }
				>
					<div className="lg:yst-mt-0 lg:yst-col-span-2 yst-space-y-8">
						<div>
							<SelectField
								name="type"
								id="yst-input-type-redirect"
								label={ __( "Redirect Type", "wordpress-seo" ) }
								className="yst-max-w-sm"
								options={ [ { value: 301, label: __( "301 Moved Permatently", "wordpress-seo" ) } ] }
								disabled={ true }
							/>
							<div className="yst-text-field__description">
								{ redirectTypeDescription }
							</div>
						</div>

						<TextField
							type="text"
							name="origin"
							id="yst-input-origin-redirect"
							label={ __( "Old URL", "wordpress-seo" ) }
							disabled={  true }
						/>
						<TextField
							type="text"
							name="target"
							id="yst-input-target-redirect"
							label={ __( "New URL", "wordpress-seo" ) }
							disabled={  true }
						/>
					</div>
					<Button
						id="yst-button-submit-redirect"
						type="submit"
						disabled={ true }
						className="yst-bg-gray-400"
					>
						{ __( "Add redirect", "wordpress-seo" ) }
					</Button>
				</FieldsetLayout>
			</div>
			<div className="yst-max-w-5xl yst-px-8 yst-pb-8 yst-opacity-50">
				<hr className="yst-mb-8" />
				<>
					<div
						className="yst-flex yst-justify-start yst-items-end yst-flex-row yst-w-full yst-gap-6"
					>
						<div className="yst-flex yst-items-end xl:yst-max-w-[256px] yst-w-full">
							<Select
								id="yst-filter-redirect-type-redirect"
								name="filterRedirectType"
								options={ [ { value: "", label: __( "All", "wordpress-seo" ) } ]  }
								className="yst-w-full"
								label={ __( "Filter Redirect type", "wordpress-seo" ) }
								disabled={ true }
							/>
						</div>
					</div>
					<Table className="yst-mt-4" variant="minimal">
						<Table.Head>
							<Table.Row>
								<Table.Header scope="col" className="yst-flex yst-items-center yst-gap-1">
									<Checkbox
										aria-label={ __( "Select all", "wordpress-seo" ) }
										disabled={ true }
									/>
									{ __( "Type", "wordpress-seo" ) }
									<Button
										aria-label={ __( "Sort by Type", "wordpress-seo" ) }
										as="span"
										variant="tertiary"
										className="yst-p-0 yst-text-slate-400"
										disabled={ true }
									>
										<ChevronDownIcon
											className="yst-w-4 yst-h-4 yst-transition-transform"
										/>
									</Button>
								</Table.Header>
								<Table.Header scope="col">{ __( "Old URL", "wordpress-seo" ) }</Table.Header>
								<Table.Header scope="col">{ __( "New URL", "wordpress-seo" ) }</Table.Header>
							</Table.Row>
						</Table.Head>

						<Table.Body>
							<Table.Row>
								<Table.Cell />
								<Table.Cell className="yst-text-end">{ __( "No items found", "wordpress-seo" ) }</Table.Cell>
								<Table.Cell />
							</Table.Row>
						</Table.Body>
					</Table>
				</>
			</div>
		</RouteLayout>
	);
};
