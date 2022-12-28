/* eslint-disable complexity */
import { ArrowLeftIcon as PureArrowLeftIcon, ArrowRightIcon as PureArrowRightIcon } from "@heroicons/react/outline";
import { useCallback, useEffect, useMemo, useState } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Button, Modal, Spinner, Title, useRootContext, useSvgAria, useToggleState } from "@yoast/ui-library";
import classNames from "classnames";
import { times } from "lodash";
import { Helmet } from "react-helmet";
import { ASYNC_ACTION_STATUS, INTRODUCTION_VIDEO_FLOW } from "../constants";
import { useDispatchSettings, useSelectSettings } from "../hooks";

/**
 * @returns {JSX.Element} The Introduction modal.
 */
const Introduction = () => {
	const videoFlow = useSelectSettings( "selectIntroductionVideoFlow" );
	const showIntroduction = useSelectSettings( "selectIntroductionShowValue" );
	const wistiaEmbedPermission = useSelectSettings( "selectIntroductionWistiaEmbedPermission" );
	const pluginUrl = useSelectSettings( "selectPreference", [], "pluginUrl", "" );
	const { setIntroductionVideoFlow, setIntroductionWistiaEmbedPermission, setIntroductionShow } = useDispatchSettings();
	const [ isOpen, , , , setClose ] = useToggleState( showIntroduction );
	const [ stepIndex, setStepIndex ] = useState( 0 );
	const [ video, setVideo ] = useState( null );
	const svgAriaProps = useSvgAria();
	const { isRtl } = useRootContext();
	const ArrowLeftIcon = useMemo( () => isRtl ? PureArrowRightIcon : PureArrowLeftIcon, [ isRtl ] );
	const ArrowRightIcon = useMemo( () => isRtl ? PureArrowLeftIcon : PureArrowRightIcon, [ isRtl ] );

	// set the steps with the videos and thumbnails and memoize them for pluginUrl changes
	const steps = useMemo( () => ( [
		{
			title: __( "We gave our settings a new look!", "wordpress-seo" ),
			description: __( "We've updated and comprehensively improved how our settings interface looks, feels, and behaves.", "wordpress-seo" ),
			videoId: "c1fpikf45l",
			thumbnail: {
				src: `${ pluginUrl }/images/settings-intro_thumb0.jpg`,
				width: "960",
				height: "540",
			},
		},
		{
			title: __( "All your settings intuitively reorganized!", "wordpress-seo" ),
			description: __( "We've added a new sidebar menu in which we carefully reorganized all settings.", "wordpress-seo" ),
			videoId: "cxojwh5z3w",
			thumbnail: {
				src: `${ pluginUrl }/images/settings-intro_thumb1.jpg`,
				width: "960",
				height: "540",
			},
		},
		{
			title: __( "Easily find the setting you're looking for!", "wordpress-seo" ),
			description: __( "We've added search functionality that lets you quickly find all settings and navigate directly to them.", "wordpress-seo" ),
			videoId: "cq3yge9yjb",
			thumbnail: {
				src: `${ pluginUrl }/images/settings-intro_thumb2.jpg`,
				width: "960",
				height: "540",
			},
		},
	] ), [ pluginUrl ] );

	// check if is on first step and memoize it for stepIndex changes
	const isOnFirstStep = useMemo( () => stepIndex === 0, [ stepIndex ] );

	// check if is on last step and memoize it for stepIndex and steps changes
	const isOnLastStep = useMemo( () => stepIndex === steps.length - 1, [ stepIndex, steps ] );


	const playVideo = useCallback( () => setIntroductionVideoFlow( INTRODUCTION_VIDEO_FLOW.playing ), [ setIntroductionVideoFlow ] );

	// move to next step and memoize it for stepIndex and steps changes
	const handleNext = useCallback( () => setStepIndex( stepIndex + 1 ), [ stepIndex, setStepIndex ] );

	// move to previous step and memoize it for stepIndex changes
	const handlePrevious = useCallback( () => setStepIndex( stepIndex - 1 ), [ stepIndex, setStepIndex ] );

	// handle the play button click and check permission from wistia else ask for permission
	// memoize it for wistiaEmbedPermission, setIntroductionVideoFlow changes
	const handleRequestPlay = useCallback( () => {
		if ( wistiaEmbedPermission.value ) {
			playVideo();
		} else {
			setIntroductionVideoFlow( INTRODUCTION_VIDEO_FLOW.askPermission );
		}
	}, [ wistiaEmbedPermission.value, setIntroductionVideoFlow ] );


	 // if the videoFlow stage is equal to INTRODUCTION_VIDEO_FLOW.askPermission then show the permission modal
	 // the next two handel functions are for the permission modal:

	// handle the deny embed button click and memoize it for setIntroductionVideoFlow changes
	// INTRODUCTION_VIDEO_FLOW.showPlay shows play button
	const handleDenyEmbed = useCallback( () => setIntroductionVideoFlow( INTRODUCTION_VIDEO_FLOW.showPlay ), [ setIntroductionVideoFlow ] );

	// when the user allows the embed:
	// handle the allow embed button click and memoize it for setIntroductionVideoFlow, setIntroductionWistiaEmbedPermission changes
	// gets permission to play video from wistia and plays the video
	const handleAllowEmbed = useCallback( () => {
		// setting in data base user meta: "wistia_embed_permission" = true
		setIntroductionWistiaEmbedPermission( true );
		playVideo();
	}, [ setIntroductionWistiaEmbedPermission, playVideo ] );

	// handle the close button click, setClose is a function for the model to close
	// setIntroductionShow is a function from redux to update user meta to not show introduction again
	const handleClose = useCallback( () => {
		setIntroductionShow( false );
		setClose();
	}, [ setIntroductionShow, setClose ] );


	useEffect( () => {
		// exception-1: early return, if the videoFlow is not in the stage of playing then this useEffect should not run
		if ( videoFlow !== INTRODUCTION_VIDEO_FLOW.playing ) {
			return;
		}

		// exception-2: if we are getting videos from the wistia api, we are selecting the one according to the stepIndex
		if ( video === null ) {
			window._wq = window._wq || [];
			window._wq.push( {
				id: steps[ stepIndex ].videoId,
				onReady: newVideo => setVideo( newVideo ),
			} );
			return;
		}

		// default behavior, update the current video according to the stepIndex
		video.replaceWith( steps[ stepIndex ].videoId );
	}, [ videoFlow, stepIndex, steps, setVideo ] );

	return (

		// handleClose function is closing the modal and setting the user meta to not show introduction again
		<Modal onClose={ handleClose } isOpen={ isOpen }>
			<div className="yst-modal__panel yst-max-w-[37rem] yst-p-0 yst-rounded-2xl sm:yst-rounded-3xl">

				{ /* //checks ther is permission from wista to add video and add js script, Helmet component adds the script tp the head */ }
				{ wistiaEmbedPermission.value && <Helmet>
					<script src={ "https://fast.wistia.com/assets/external/E-v1.js" } async={ true } />
				</Helmet> }
				<div className="yst-relative">
					<div className="yst-absolute yst-inset-0 yst-bg-gradient-to-b yst-from-primary-200" />
					<div className="yst-relative yst-pt-6 sm:yst-pt-8 yst-pb-8 yst-px-4 sm:yst-px-8">
						<div
							className="yst-relative yst-w-full yst-h-0 yst-pt-[56.25%] yst-overflow-hidden yst-rounded-lg yst-shadow-md yst-bg-black"
						>
							{ /* // -------------------- Play button section, presents a thumbnail of the video enclosed in a button -------------*/ }
							{ videoFlow === INTRODUCTION_VIDEO_FLOW.showPlay && steps.map( ( step, index ) => (
								<button
									key={ `step-thumbnail-${ step.videoId }` }
									className={ classNames(
										"yst-absolute yst-inset-0 yst-button yst-p-0 yst-border-none yst-bg-white",
										"yst-transition-opacity yst-duration-1000",
										index === stepIndex ? "yst-opacity-100" : "yst-opacity-0"
									) }
									onClick={ handleRequestPlay }
								>
									{ /* eslint-disable-next-line jsx-a11y/alt-text */ }
									<img className="yst-w-full yst-h-auto" { ...step.thumbnail } />
								</button>
							) ) }

							{ /* --------------- The ask permission section ------------------ */ }
							{ /* // the first time you click on the play button it opens a message that asks for embed permission */ }
							{ videoFlow === INTRODUCTION_VIDEO_FLOW.askPermission && (
								<div className="yst-absolute yst-inset-0 yst-flex yst-flex-col yst-items-center yst-justify-center yst-bg-white">
									<p className="yst-max-w-xs yst-mx-auto yst-text-center">
										{ /* // waiting for permission stage */ }
										{ wistiaEmbedPermission.status === ASYNC_ACTION_STATUS.loading && <Spinner /> }
										{ wistiaEmbedPermission.status !== ASYNC_ACTION_STATUS.loading && sprintf(
											/* translators: %1$s expands to Yoast SEO. %2$s expands to Wistia. */
											__( "To see this video, you need to allow %1$s to load embedded videos from %2$s.", "wordpress-seo" ),
											"Yoast SEO",
											"Wistia"
										) }
									</p>
									<div className="yst-flex yst-mt-6 yst-gap-x-4">
										<Button
											type="button"
											variant="secondary"
											onClick={ handleDenyEmbed }
											disabled={ wistiaEmbedPermission.status === ASYNC_ACTION_STATUS.loading }
										>
											{ __( "Deny", "wordpress-seo" ) }
										</Button>
										<Button
											type="button"
											variant="primary"
											onClick={ handleAllowEmbed }
											disabled={ wistiaEmbedPermission.status === ASYNC_ACTION_STATUS.loading }
										>
											{ __( "Allow", "wordpress-seo" ) }
										</Button>
									</div>
								</div>
							) }

							{ /* // --------------------- the video playing section ---------------------*/ }
							{ wistiaEmbedPermission.value && videoFlow === INTRODUCTION_VIDEO_FLOW.playing && (
								<div className="yst-absolute yst-w-full yst-h-full yst-top-0 yst-left-0">
									{ video === null && <Spinner className="yst-h-full yst-mx-auto" /> }

									{ /* // the video is rendered here according to className */ }
									<div
										className={ `wistia_embed wistia_async_${ steps[ stepIndex ].videoId } videoFoam=true` }
									/>
								</div>
							) }
						</div>
					</div>
				</div>
				<div className="yst-relative yst-flex yst-flex-col yst-mt-2 yst-mb-8 yst-mx-4 sm:yst-mx-8 yst-text-center">

					{ /* // ----------------- Title and description section of each step -----------------*/ }
					<div
						className={ classNames(
							"yst-grid yst-transition-transform yst-duration-1000",
							// Arrange a grid of 100% for each step.
							"yst-grid-cols-[repeat(3,100%)]",
							// Tailwind purge requires written out classes: don't interpolate the stepIndex (nor the step length above).
							stepIndex === 0 && "yst--translate-x-0",
							stepIndex === 1 && "yst--translate-x-full rtl:yst-translate-x-full",
							stepIndex === 2 && "yst--translate-x-[200%] rtl:yst-translate-x-[200%]"
						) }
					>
						{ steps.map( ( step, index ) => (
							<div
								key={ `step-copy-${ step.videoId }` }
								className={ classNames(
									"yst-transition-opacity yst-duration-1000 yst-delay-200",
									index === stepIndex ? "yst-opacity-100" : "yst-opacity-0"
								) }
							>
								<Modal.Title as="h2" className="yst-text-lg">
									{ step.title }
								</Modal.Title>
								<Modal.Description className="yst-max-w-xs yst-mx-auto yst-mt-2">
									{ step.description }
								</Modal.Description>
							</div>
						) ) }
					</div>


					{ /* // -------------------- The navigation section ----------------*/ }
					<ul className="yst-flex yst-mt-10 sm:yst-mt-8 yst-gap-5 yst-justify-center yst-items-center">
						{ times( steps.length ).map( ( index ) => (
							<li
								key={ `step-circle-${ index }` }
								className={ classNames(
									"yst-inline-block yst-rounded-full yst-transition yst-duration-700",
									index === stepIndex ? "yst-w-2.5 yst-h-2.5 yst-bg-primary-500" : "yst-w-2 yst-h-2 yst-bg-primary-200"
								) }
							/>
						) ) }
					</ul>

					{ /* // ---------------- skip, next, back and got it! section ------------ */ }
					<div className="yst-flex yst-gap-2 yst-mt-6">

						{ /* // Back: if it's not the first step, show the back button that updates the stepIndex state */ }
						{ ! isOnFirstStep && <Button type="button" variant="secondary" onClick={ handlePrevious }>
							<ArrowLeftIcon className="yst-w-4 yst-h-4 yst--ml-1 yst-mr-1 yst-text-slate-400" { ...svgAriaProps } />
							{ __( "Back", "wordpress-seo" ) }
						</Button> }
						<div className="yst-flex-grow" />

						{ /* // Skip: skip if it's not the last step. Closes the modal and register on user meta not to repeat introduction */ }
						{ ! isOnLastStep && <button
							type="button"
							className="yst-button yst-shadow-none yst-text-primary-500 yst-bg-white yst-border-none hover:yst-text-primary-900 visited:yst-text-primary-900 visited:hover:yst-text-primary-900"
							onClick={ handleClose }
						>
							{ __( "Skip", "wordpress-seo" ) }
						</button> }

						{ /* // Next: button, if it's not on last step, we render next button, which update the stepindex state */ }
						{ ! isOnLastStep && <Button type="button" variant="primary" onClick={ handleNext }>
							{ __( "Next", "wordpress-seo" ) }
							<ArrowRightIcon className="yst-w-4 yst-h-4 yst-ml-1 yst--mr-1" { ...svgAriaProps } />
						</Button> }

						{ /* // Got it!: If it's on last step, we render got it button, which closes the modal. */ }
						{ isOnLastStep && <Button type="button" variant="primary" onClick={ handleClose }>
							{ __( "Got it!", "wordpress-seo" ) }
						</Button> }
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default Introduction;
