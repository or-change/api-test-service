export default function install(Vue) {
	Vue.filter('dateFormat', (value) => {
		if (value instanceof Date) {
			const year = value.getFullYear();
			const month = value.getMonth() + 1;
			const date = value.getDate();

			const monthString = month < 10 ? `0${month}` : month;
			const dateString = date < 10 ? `0${date}` : date;

			return `${year}-${monthString}-${dateString}`;
		}

		return value;
	});
}