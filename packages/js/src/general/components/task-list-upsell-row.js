import { Button, Table, Title } from "@yoast/ui-library";
import { __, sprintf } from "@wordpress/i18n";
import { LockClosedIcon, LockOpenIcon } from "@heroicons/react/outline";
import { useSelectGeneralPage } from "../hooks";

/**
 * Component rendering an upsell row for the task list.
 *
 * @returns {JSX.Element} The UpsellRow component.
 */
export const TaskListUpsellRow = () => {
	const premiumUpsellLink = useSelectGeneralPage( "selectLink", [], "https://yoa.st/task-list-upsell-table-footer" );
	const wooSeoUpsellLink = useSelectGeneralPage( "selectLink", [], "https://yoa.st/task-list-woo-upsell-table-footer" );
	const isWooCommerceActive = useSelectGeneralPage( "selectPreference", [], "isWooCommerceActive" );
	const taskListUpsellLink = isWooCommerceActive ? wooSeoUpsellLink : premiumUpsellLink;
	return (
		<Table.Row>
			<Table.Cell className="yst-bg-slate-50" colSpan={ 4 }>
				<div className="yst-flex yst-justify-between lg:yst-flex-row yst-flex-col yst-gap-2">
					<div className="yst-flex yst-justify-start yst-gap-4">
						<div className="yst-w-10 yst-h-10 yst-rounded-full yst-bg-amber-300 yst-flex yst-items-center yst-justify-center yst-shrink-0">
							<LockClosedIcon className="yst-w-5 yst-h-5 yst-text-amber-900" />
						</div>
						<div>
							<Title size="5" as="h3" className="yst-text-slate-800 yst-leading-5">
								{ sprintf(
									/* translators: %1$s expands to Yoast SEO Premium or WooCommerce SEO. */
									__( "Unlock all %1$s tasks", "wordpress-seo" ),
									isWooCommerceActive ? "WooCommerce SEO" : "Yoast SEO Premium"
								) }
							</Title>
							<p className="yst-leading-5">{ __( "Get automated technical SEO & optimize content in a breeze", "wordpress-seo" ) }</p>
						</div>
					</div>
					<Button variant="upsell" as="a" href={ taskListUpsellLink } target="_blank" className="yst-flex yst-items-center yst-gap-1.5 yst-pe-2 yst-mt-4 lg:yst-mt-0">
						{ isWooCommerceActive ? __( "Unlock with WooCommerce SEO", "wordpress-seo" ) : __( "Unlock with Premium", "wordpress-seo" ) }
						<LockOpenIcon className="yst-w-4 yst-h-4 yst-text-amber-900" />
					</Button>
				</div>
			</Table.Cell>
		</Table.Row>
	);
};
