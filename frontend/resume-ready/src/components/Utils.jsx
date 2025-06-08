export function ScrollToTop() {

	setTimeout(() => {
	  window.scrollTo({
		top: 0,
		left: 0,
		behavior: 'smooth',
	  });
	}, 100);
};