/* eslint-disable complexity */
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/outline";
import { useCallback, useMemo, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Button, Modal, Title, useSvgAria, useToggleState } from "@yoast/ui-library";
import classNames from "classnames";
import { noop, times } from "lodash";

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
			<div className="yst-modal__panel yst-max-w-[37rem] yst-p-0 yst-rounded-3xl">
				<div>
					<div className="yst-relative">
						<div className="yst-absolute yst-inset-0 yst-bg-gradient-to-b yst-from-primary-200" />
						<div className="yst-relative yst-p-8">
							<div
								className="yst-mx-auto yst-w-[528px] yst-h-[297px] yst-rounded-lg yst-shadow-sm yst-border yst-border-slate-200 yst-bg-slate-500 yst-text-white yst-flex yst-items-center yst-justify-center"
							>
								VIDEO PLACEHOLDER
							</div>
							<div className="yst-absolute yst-inset-0 yst-flex yst-justify-center yst-items-center">
								<button
									type="button"
									className="yst-text-primary-500 yst-rounded-full yst-shadow-none yst-border-none yst-outline-none focus:yst-outline-none focus:yst-ring-2 focus:yst-ring-offset-2 focus:yst-ring-primary-500 hover:yst-text-primary-700 visited:yst-text-primary-700 visited:hover:yst-text-primary-700"
									onClick={ noop }
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 56 56"
										fill="currentColor"
										className="yst-w-14 yst-h-14 yst-drop-shadow-lg"
										{ ...svgAriaProps }
									>
										<path
											d="M42,52.2487111 C33.3367699,57.2504294 22.6632301,57.2504294 14,52.2487111 C5.33676967,47.2469927 0,38.003436 0,28 C0,12.5360266 12.5360272,0 28,0 C43.4639728,0 56,12.5360266 56,28 C56,38.003436 50.6632303,47.2469927 42,52.2487111 Z"
											fill="currentColor"
										/>
										<path
											d="M40.1644444,26.979555 C40.53542,27.1851431 40.7655987,27.5758658 40.7655987,27.9999994 C40.7655987,28.424133 40.53542,28.8148557 40.1644444,29.0204439 L22.7328889,38.7053327 C22.3714678,38.9059548 21.9308686,38.9003478 21.5746699,38.6905935 C21.2184712,38.4808391 20.9999999,38.0982578 20.9999999,37.6848883 L20.9999999,18.3151105 C20.9999999,17.4253327 21.9551111,16.8653327 22.7328889,17.2977772 L40.1644444,26.979555 L40.1644444,26.979555 Z"
											fill="white"
										/>
									</svg>
								</button>
							</div>
						</div>
					</div>
					<div className="yst-relative yst-flex yst-flex-col yst-mx-8 yst-mt-2 yst-mb-8 yst-text-center">
						<Title as="h2" size="2">
							{ steps[ stepIndex ].title }
						</Title>
						<Modal.Description className="yst-max-w-xs yst-mx-auto yst-mt-2">
							{ steps[ stepIndex ].description }
						</Modal.Description>
						<ul className="yst-flex yst-mt-8 yst-gap-5 yst-justify-center yst-items-center">
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
			</div>
		</Modal>
	);
};

Introduction.propTypes = {};

export default Introduction;
