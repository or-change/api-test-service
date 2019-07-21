export const installerList = [];

window.product = {
	use(installer) {
		installerList.push(installer);
	}
};