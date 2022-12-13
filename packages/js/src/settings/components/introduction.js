/* eslint-disable complexity */
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/outline";
import { useCallback, useMemo, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Button, Modal, Title, useSvgAria, useToggleState } from "@yoast/ui-library";
import classNames from "classnames";
import { times } from "lodash";

/**
 * @returns {JSX.Element} The Introduction modal.
 */
const Introduction = () => {
	const [ isOpen, toggleOpen, setIsOpen, setOpen, setClose ] = useToggleState();
	const [ stepIndex, setStepIndex ] = useState( 0 );
	const svgAriaProps = useSvgAria();

	const steps = useMemo( () => ( [
		{
			title: __( "We gave our settings a new look!", "wordpress-seo" ),
			description: __( "We've updated, and comprehensively improved how our interfaces look, feel, and behave.", "wordpress-seo" ),
		},
		{
			title: __( "Improved discoverability of our features", "wordpress-seo" ),
			description: __( "We've added a new sidebar menu in which we carefully restructured all settings.", "wordpress-seo" ),
		},
		{
			title: __( "Easily find the setting you're looking for", "wordpress-seo" ),
			description: __( "We've added a search function that lets you quickly find all settings and navigate directly to them!", "wordpress-seo" ),
		},
	] ), [] );
	const isOnFirstStep = useMemo( () => stepIndex === 0, [ stepIndex ] );
	const isOnLastStep = useMemo( () => stepIndex === steps.length - 1, [ stepIndex, steps ] );

	const handleNext = useCallback( () => setStepIndex( stepIndex + 1 ), [ stepIndex, setStepIndex ] );
	const handlePrevious = useCallback( () => setStepIndex( stepIndex - 1 ), [ stepIndex, setStepIndex ] );

	return (
		<Modal onClose={ setClose } isOpen={ isOpen }>
			<div className="yst-modal__panel yst-max-w-[37rem] yst-p-0 yst-rounded-2xl sm:yst-rounded-3xl">
				<div className="yst-relative">
					<div className="yst-absolute yst-inset-0 yst-bg-gradient-to-b yst-from-primary-200" />
					<div className="yst-relative yst-pt-6 sm:yst-pt-8 yst-pb-8 yst-px-4 sm:yst-px-8">
						<div className="yst-relative yst-overflow-hidden yst-mx-auto yst-rounded-lg yst-shadow-sm yst-border yst-border-slate-200 yst-bg-slate-500">
							<div className="yst-relative yst-w-full yst-h-0 yst-pt-[56.25%]">
								<div className="yst-absolute yst-w-full yst-h-full yst-top-0 yst-left-0" />
							</div>
						</div>
					</div>
				</div>
				<div className="yst-relative yst-flex yst-flex-col yst-mt-2 yst-mb-8 yst-mx-4 sm:yst-mx-8 yst-text-center">
					<Title as="h2" size="2">
						{ steps[ stepIndex ].title }
					</Title>
					<Modal.Description className="yst-max-w-xs yst-mx-auto yst-mt-2">
						{ steps[ stepIndex ].description }
					</Modal.Description>
					<ul className="yst-flex yst-mt-10 sm:yst-mt-8 yst-gap-5 yst-justify-center yst-items-center">
						{ times( steps.length ).map( ( index ) => (
							<li
								key={ `step-circle-${ index }` }
								className={ classNames(
									"yst-inline-block yst-rounded-full",
									index === stepIndex ? "yst-w-2.5 yst-h-2.5 yst-bg-primary-500" : "yst-w-2 yst-h-2 yst-bg-primary-200"
								) }
							/>
						) ) }
					</ul>
					<div className="yst-flex yst-gap-2 yst-mt-6">
						{ ! isOnFirstStep && <Button type="button" variant="secondary" onClick={ handlePrevious }>
							<ArrowLeftIcon className="yst-w-4 yst-h-4 yst--ml-1 yst-mr-1 yst-text-slate-400" { ...svgAriaProps } />
							{ __( "Back", "wordpress-seo" ) }
						</Button> }
						<div className="yst-flex-grow" />
						{ ! isOnLastStep && <button
							type="button"
							className="yst-button yst-shadow-none yst-text-primary-500 yst-bg-white yst-border-none hover:yst-text-primary-900 visited:yst-text-primary-900 visited:hover:yst-text-primary-900"
							onClick={ setClose }
						>
							{ __( "Skip", "wordpress-seo" ) }
						</button> }
						{ ! isOnLastStep && <Button type="button" variant="primary" onClick={ handleNext }>
							{ __( "Next", "wordpress-seo" ) }
							<ArrowRightIcon className="yst-w-4 yst-h-4 yst-ml-1 yst--mr-1" { ...svgAriaProps } />
						</Button> }
						{ isOnLastStep && <Button type="button" variant="primary" onClick={ setClose }>
							{ __( "Got it!", "wordpress-seo" ) }
						</Button> }
					</div>
				</div>
			</div>
		</Modal>
	);
};

Introduction.propTypes = {};

export default Introduction;
