import { useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Button, Checkbox, Select, SelectField, Table, TextField } from "@yoast/ui-library";
import {
	RouteLayout,
} from "../components";
import { ModalContent } from "../components/modal-content";
import { useSelectRedirects } from "../hooks";
import { safeCreateInterpolateElement } from "../../helpers/i18n";
import { FieldsetLayout } from "../../shared-admin/components";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { noop } from "lodash";

/**
 * Redirects component.
 *
 * This component renders the main interface for managing plain (non-regex) redirects
 * within the WordPress SEO admin panel. It provides a form to add new redirects, displays
 * a description with a help link, and includes filter controls and a list of existing redirects.
 *
 * @component
 *
 * @returns {JSX.Element} The rendered Redirects route.
 */
export const Redirects = () => {
	const redirectsManagedLink = useSelectRedirects( "selectLink", [], "https://yoa.st/redirects-learn-more" );
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
			span: <span className="yst-text-slate-600 yst-underline" />,
		}
	), [] );


	return (
		<RouteLayout
			title={ __( "Redirects", "wordpress-seo" ) }
			description={ redirectsDescription }
		>

			<div className={ "yst-flex yst-justify-center" }>
				<div className="yst-modal__panel yst-absolute yst-max-w-3xl yst-bg-white yst-z-[1000]">
					<div className="yst-p-0 yst-rounded-3xl yst-introduction-modal-panel ">
						<ModalContent />
					</div>
				</div>
			</div>
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
								options={ [ { value: 301, label: __( "301 Moved Permanently", "wordpress-seo" ) } ] }
								disabled={ true }
								value={ false }
								onChange={ noop }
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
							disabled={ true }
							onChange={ noop }
						/>
						<TextField
							type="text"
							name="target"
							id="yst-input-target-redirect"
							label={ __( "New URL", "wordpress-seo" ) }
							disabled={ true }
							onChange={ noop }
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
								options={ [ { value: "", label: __( "All", "wordpress-seo" ) } ] }
								className="yst-w-full"
								label={ __( "Filter Redirect type", "wordpress-seo" ) }
								disabled={ true }
								value={ false }
								onChange={ noop }
							/>
						</div>
					</div>
					<Table className="yst-mt-4 yst-table-fixed" variant="minimal">
						<Table.Head>
							<Table.Row>
								<Table.Header className="yst-w-4">
									<Checkbox
										id="yst-select-all-redirects"
										name="selectAllRedirects"
										aria-label={ __( "Select all", "wordpress-seo" ) }
										disabled={ true }
										value="dummy-value"
									/>
								</Table.Header>
								<Table.Header className="yst-w-32">
									<div className={ "yst-flex yst-flex-wrap yst-break-all yst-gap-3" }>
										{ __( "Type", "wordpress-seo" ) }
										<ChevronDownIcon
											className="yst-w-4 yst-h-4 yst-text-slate-400"
										/>
									</div>
								</Table.Header>

								<Table.Header>{ __( "Old URL", "wordpress-seo" ) }</Table.Header>
								<Table.Header>{ __( "New URL", "wordpress-seo" ) }</Table.Header>
							</Table.Row>
						</Table.Head>

						<Table.Body>
							<Table.Row>
								<Table.Cell><></>
								</Table.Cell>
								<Table.Cell><></>
								</Table.Cell>
								<Table.Cell className="yst-text-center">{ __( "No items found", "wordpress-seo" ) }</Table.Cell>
								<Table.Cell><></>
								</Table.Cell>
							</Table.Row>
						</Table.Body>
					</Table>
				</>
			</div>
		</RouteLayout>
	);
};
