import { ArrowNarrowRightIcon, ExternalLinkIcon } from "@heroicons/react/outline";
import { useSelect } from "@wordpress/data";
import { __, sprintf } from "@wordpress/i18n";
import { Badge, Button, Card, Paper, Title, useSvgAria } from "@yoast/ui-library";
import { STORE_NAME } from "./constants";

/**
 * @returns {JSX.Element} The app component.
 */
export const App = () => {
	const { buyPremiumLink, managePremiumLink, premiumUpsellConfig, buyWooLink, wooUpsellConfig } = useSelect( ( select ) => {
		const plansSelect = select( STORE_NAME );
		return {
			buyPremiumLink: plansSelect.selectLink( "https://yoa.st/zz" ),
			managePremiumLink: plansSelect.selectLink( "https://yoa.st/13k" ),
			premiumUpsellConfig: plansSelect.selectUpsellSettingsAsProps( "premium" ),
			buyWooLink: plansSelect.selectLink( "https://yoa.st/zr" ),
			wooUpsellConfig: plansSelect.selectUpsellSettingsAsProps( "woo" ),
		};
	}, [] );
	const svgAriaProps = useSvgAria();

	return (
		<div className="yst-p-4 min-[783px]:yst-p-8 yst-mb-8 xl:yst-mb-0">
			<Paper as="main" className="yst-max-w-page">
				<header className="yst-p-8 yst-border-b yst-border-slate-200">
					<div className="yst-max-w-screen-sm">
						<Title>{ __( "Plans", "wordpress-seo" ) }</Title>
						<p className="yst-text-tiny yst-mt-3">
							{ __( "Compare plans and find the perfect fit for your site - from essential SEO features to advanced automation.", "wordpress-seo" ) }
						</p>
					</div>
				</header>
				<div className="yst-h-full yst-p-8">
					<div
						className="yst-max-w-6xl yst-grid yst-gap-6 yst-grid-cols-1 sm:yst-grid-cols-2 min-[783px]:yst-grid-cols-1 lg:yst-grid-cols-2 xl:yst-grid-cols-4"
					>
						<div className="yst-relative">
							<Card className="yst-border-green-400 yst-shadow-md">
								<Card.Header className="yst-p-0">
									<svg width="336" height="120" viewBox="0 0 336 120" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M336 120H0C0 120 0 83.7938 0 77.5111V0L336 0V7.77778V120Z" fill="url(#paint0_linear_239_381)" />
										<path opacity="0.35" d="M208.997 0L140.919 120H336V9V0" fill="#6C2548" />
										<path
											d="M139.318 73.968V79.552C142.785 79.408 145.497 78.272 147.792 75.952C150.086 73.632 152.189 69.872 154.195 64.288L169.055 24.608H161.866L149.894 57.76L143.956 39.168H137.377L146.107 61.536C146.949 63.688 146.949 66.072 146.107 68.224C145.224 70.496 143.635 73.168 139.318 73.968Z"
											fill="white"
										/>
										<path
											d="M194.171 26.388C186.66 22.16 177.132 24.8 172.887 32.288C168.643 39.776 171.294 49.276 178.805 53.508C186.315 57.74 195.844 55.096 200.088 47.608C204.329 40.12 201.681 30.62 194.171 26.388Z"
											fill="#9FDA4F"
										/>
										<path
											d="M194.169 26.388L178.804 53.508C186.314 57.74 195.842 55.096 200.087 47.608C204.328 40.12 201.68 30.62 194.169 26.388Z"
											fill="#77B227"
										/>
										<path
											d="M174.684 60.76C174.684 60.76 174.668 60.752 174.66 60.744C174.652 60.744 174.648 60.736 174.64 60.732C169.461 57.876 163.395 59.888 160.735 64.588C157.963 69.484 159.696 75.688 164.602 78.456C164.602 78.456 164.61 78.46 164.614 78.464C164.614 78.464 164.623 78.468 164.627 78.472C169.533 81.22 175.744 79.492 178.512 74.604C181.276 69.724 179.563 63.54 174.688 60.764"
											fill="#FEC228"
										/>
										<path
											d="M174.64 60.732L164.598 78.456C169.505 81.22 175.735 79.492 178.508 74.6C181.28 69.704 179.547 63.496 174.64 60.732Z"
											fill="#F49A00"
										/>
										<path
											d="M163.053 92.012C163.053 89.884 161.933 87.816 159.948 86.692C158.997 86.156 157.962 85.9 156.939 85.9C153.565 85.9 150.804 88.624 150.804 92.004C150.804 95.384 153.536 98.12 156.927 98.12C160.317 98.12 163.061 95.396 163.061 92.016"
											fill="#FF4E47"
										/>
										<path
											d="M159.94 86.688L153.914 97.324C156.859 98.984 160.598 97.948 162.259 95.008C163.924 92.072 162.885 88.344 159.936 86.688"
											fill="#ED261F"
										/>
										<path d="M199.345 92.608H182.403V94.104H199.345V92.608Z" fill="#CD82AB" />
										<path
											d="M194.767 86.708L190.876 79.508V79.512L190.872 79.508L186.98 86.708L180.99 82.432L182.403 92.06H190.876H199.345L200.757 82.432L194.767 86.708Z"
											fill="#CD82AB"
										/>
										<defs>
											<linearGradient
												id="paint0_linear_239_381" x1="-15.288" y1="48.456" x2="295.544" y2="201.94"
												gradientUnits="userSpaceOnUse"
											>
												<stop stopColor="#5D237A" />
												<stop offset="0.08" stopColor="#702175" />
												<stop offset="0.22" stopColor="#872070" />
												<stop offset="0.36" stopColor="#981E6C" />
												<stop offset="0.51" stopColor="#A21E69" />
												<stop offset="0.7" stopColor="#A61E69" />
											</linearGradient>
										</defs>
									</svg>
								</Card.Header>
								<Card.Content className="yst-flex yst-flex-col yst-gap-3">
									<Title as="h3">Yoast SEO Premium</Title>
									<p className="yst-text-tiny yst-text-slate-500">
										{ sprintf(
										/* translators: %s expands to "Yoast SEO Premium". */
											__( "%s gives entrepreneurs and in-house teams real-time SEO guidance, so content meets best practices and drives visibility, no expert knowledge needed.", "wordpress-seo" ),
											"Yoast SEO Premium"
										) }
									</p>
								</Card.Content>
								<Card.Footer>
									<>
										<Button
											as="a"
											id="yst-upsell-premium--link"
											className="yst-gap-2 yst-w-full yst-px-2"
											variant="upsell"
											href={ buyPremiumLink }
											target="_blank"
											rel="noopener"
											{ ...premiumUpsellConfig }
										>
											{ __( "Buy product", "wordpress-seo" ) }
											<ArrowNarrowRightIcon className="yst-w-5 yst-h-5 yst--ms-1 yst-shrink-0" { ...svgAriaProps } />
										</Button>
										<Button
											as="a"
											id="yst-premium-manage--link"
											className="yst-gap-2 yst-w-full yst-px-2 yst-leading-5"
											variant="primary"
											href={ managePremiumLink }
											target="_blank"
											rel="noopener"
										>
											{ sprintf(
											/* translators: %s expands to "MyYoast". */
												__( "Manage in %s", "wordpress-seo" ),
												"MyYoast"
											) }
											<ExternalLinkIcon className="yst--me-1 yst-ms-1 yst-h-5 yst-w-5 yst-text-white rtl:yst-rotate-[270deg]" />
										</Button>
									</>
								</Card.Footer>
							</Card>
							<div className="yst-absolute yst-top-0 yst--translate-y-1/2 yst-w-full yst-text-center">
								<Badge size="small" variant="success" className="yst-border">{ __( "Current active plan", "wordpress-seo" ) }</Badge>
							</div>
						</div>
					</div>
				</div>
			</Paper>
		</div>
	);
};
