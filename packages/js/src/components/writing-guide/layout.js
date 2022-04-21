import { Title } from "@yoast/ui-library";

const Layout = () => {
	return (
		<div>
			<Title className="yst-mb-4">Pick a layout and title</Title>
			<p className="yst-mb-4 yst-text-base">
				Almost there! Based on everything you’ve specified before we’d propose this layout. Do you prefer another layout? Feel free to select it!
			</p>

			<div className="yst-grid yst-grid-cols-4 yst-gap-4">
				<div className="yst-border yst-border-gray-300 yst-shadow yst-rounded-md yst-p-4 yst-max-w-sm yst-w-full yst-mx-auto">
					<div className="yst-animate-pulse yst-flex yst-space-x-4">
						<div className="yst-rounded-full yst-bg-gray-400 yst-h-10 yst-w-10" />
						<div className="yst-flex-1 yst-space-y-6 yst-py-1">
							<div className="yst-h-2 yst-bg-gray-400 yst-rounded" />
							<div className="yst-space-y-3">
								<div className="yst-grid yst-grid-cols-3 yst-gap-4">
									<div className="yst-h-2 yst-bg-gray-400 yst-rounded yst-col-span-2" />
									<div className="yst-h-2 yst-bg-gray-400 yst-rounded yst-col-span-1" />
								</div>
								<div className="yst-h-2 yst-bg-gray-400 yst-rounded" />
							</div>
						</div>
					</div>
				</div>
				<div className="yst-border yst-border-gray-300 yst-shadow yst-rounded-md yst-p-4 yst-max-w-sm yst-w-full yst-mx-auto">
					<div className="yst-animate-pulse yst-flex yst-space-x-4">
						<div className="yst-rounded-full yst-bg-gray-400 yst-h-10 yst-w-10" />
						<div className="yst-flex-1 yst-space-y-6 yst-py-1">
							<div className="yst-h-2 yst-bg-gray-400 yst-rounded" />
							<div className="yst-space-y-3">
								<div className="yst-grid yst-grid-cols-3 yst-gap-4">
									<div className="yst-h-2 yst-bg-gray-400 yst-rounded yst-col-span-2" />
									<div className="yst-h-2 yst-bg-gray-400 yst-rounded yst-col-span-1" />
								</div>
								<div className="yst-h-2 yst-bg-gray-400 yst-rounded" />
							</div>
						</div>
					</div>
				</div>
				<div className="yst-border yst-border-gray-300 yst-shadow yst-rounded-md yst-p-4 yst-max-w-sm yst-w-full yst-mx-auto">
					<div className="yst-animate-pulse yst-flex yst-space-x-4">
						<div className="yst-rounded-full yst-bg-gray-400 yst-h-10 yst-w-10" />
						<div className="yst-flex-1 yst-space-y-6 yst-py-1">
							<div className="yst-h-2 yst-bg-gray-400 yst-rounded" />
							<div className="yst-space-y-3">
								<div className="yst-grid yst-grid-cols-3 yst-gap-4">
									<div className="yst-h-2 yst-bg-gray-400 yst-rounded yst-col-span-2" />
									<div className="yst-h-2 yst-bg-gray-400 yst-rounded yst-col-span-1" />
								</div>
								<div className="yst-h-2 yst-bg-gray-400 yst-rounded" />
							</div>
						</div>
					</div>
				</div>
				<div className="yst-border yst-border-gray-300 yst-shadow yst-rounded-md yst-p-4 yst-max-w-sm yst-w-full yst-mx-auto">
					<div className="yst-animate-pulse yst-flex yst-space-x-4">
						<div className="yst-rounded-full yst-bg-gray-400 yst-h-10 yst-w-10" />
						<div className="yst-flex-1 yst-space-y-6 yst-py-1">
							<div className="yst-h-2 yst-bg-gray-400 yst-rounded" />
							<div className="yst-space-y-3">
								<div className="yst-grid yst-grid-cols-3 yst-gap-4">
									<div className="yst-h-2 yst-bg-gray-400 yst-rounded yst-col-span-2" />
									<div className="yst-h-2 yst-bg-gray-400 yst-rounded yst-col-span-1" />
								</div>
								<div className="yst-h-2 yst-bg-gray-400 yst-rounded" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Layout;
