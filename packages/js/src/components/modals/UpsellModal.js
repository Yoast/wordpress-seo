/* eslint-disable complexity */
import { Button, Modal, Title } from "@yoast/ui-library";
import { ReactComponent as YoastLogo } from "../../../images/Yoast_icon_kader.svg";
import { select } from "@wordpress/data";
import { STORE_NAME_EDITOR } from "../../shared-admin/constants";
import { __ } from "@wordpress/i18n";
import { LockOpenIcon, CheckIcon } from "@heroicons/react/outline";
import { ShoppingCartIcon } from "@heroicons/react/solid";
import classNames from "classnames";

/**
 *
 * @param {boolean} isOpen If the modal is open.
 * @param {Function} onClose The callback function to close the modal.
 * @param {string} id The id of the modal.
 * @param {string} upsellLink The upsell link to use.
 * @param {string} title The title of the upsell box.
 * @param {string} description The description of the upsell box.
 * @param {string[]} benefits The benefits of the upsell box.
 * @param {string} note The note to display in the upsell box.
 * @param {string} ctbId The ID of the call-to-action button.
 * @param {string} buttonLabel The label of the call-to-action button.
 * @param {string} modalTitle The title of the modal.
 *
 * @returns {JSX.Element} The rendered upsell modal.
 */
export const UpsellModal = ( {
	isOpen,
	onClose,
	id,
	upsellLink,
	title = "",
	description = "",
	benefits = [],
	note = "",
	ctbId = "",
	buttonLabel,
	modalTitle,
} ) => {
	const isBlackFriday = select( STORE_NAME_EDITOR ).isPromotionActive( "black-friday-promotion" );
	const isWooCommerceActive = select( STORE_NAME_EDITOR ).getIsWooCommerceActive();
	return <Modal
		isOpen={ isOpen }
		onClose={ onClose }
		id={ id }
	>
		<Modal.Panel className="yst-max-w-[26.25rem] yst-p-0" hasCloseButton={ false }>
			<Modal.Container>
				<Modal.Container.Header className="yst-p-6 yst-border-b-slate-200 yst-border-b yst-flex yst-justify-start yst-gap-4 yst-items-center">
					{ isWooCommerceActive ? <ShoppingCartIcon className="yst-text-woo-light yst-w-6 yst-h-6 yst-scale-x-[-1]" />
						: <YoastLogo className="yst-fill-primary-500 yst-w-5 yst-h-5" /> }
					<Modal.Title
						as="h3" className={
							classNames(
								isWooCommerceActive ? "yst-text-woo-light" : "yst-text-primary-500",
								"yst-text-xl"
							) }
					>
						{ modalTitle }
					</Modal.Title>
					<Modal.CloseButton className="yst-top-2" onClick={ onClose } screenReaderText={ __( "Close modal", "wordpress-seo" ) } />
				</Modal.Container.Header>
				<Modal.Container.Content className="yst-p-0">
					{ isBlackFriday &&
					<div className="yst-flex yst-font-semibold yst-items-center yst-text-lg yst-content-between yst-bg-black yst-text-amber-300 yst-h-9 yst-border-amber-300 yst-border-y yst-border-x-0 yst-border-solid yst-px-6">
						<div className="yst-mx-auto">{ __( "BLACK FRIDAY | 30% OFF", "wordpress-seo" ) }</div>
					</div> }
					<div className="yst-py-6 yst-px-12">
						<Title as="h3" className="yst-mb-1 yst-leading-5 yst-text-sm yst-font-normal">{ title }</Title>
						<p className="yst-mb-2">{ description }</p>
						{ benefits.length > 0 &&
						<ul className="yst-my-2">
							{ benefits.map( ( benefit, index ) => {
								return <li key={ `upsell-benefit-${ index }` } className="yst-flex yst-gap-1 yst-mb-2">
									<CheckIcon className="yst-w-5 yst-h-5 yst--ms-1 yst-shrink-0 yst-inline yst-text-green-600" />
									<p className="yst-text-slate-600">{ benefit }</p>
								</li>;
							} ) }
						</ul> }
						<div className="yst-text-center">
							<Button
								as="a"
								variant="upsell"
								className="yst-my-2 yst-gap-1.5"
								href={ upsellLink }
								target="_blank"
								data-action="load-nfd-ctb"
								data-ctb-id={ ctbId }
							>
								<LockOpenIcon className="yst-w-4 yst-h-4 yst--ms-1 yst-shrink-0" />
								{ buttonLabel }
								<span className="yst-sr-only">{ __( "Opens in a new tab", "wordpress-seo" ) }</span>
							</Button>
							<div>{ note }</div>
						</div>
					</div>
				</Modal.Container.Content>
			</Modal.Container>
		</Modal.Panel>
	</Modal>;
};
