/*made from fitie.init.js (NK)*/
this.fitie.apply = function () {
	if(!/MSIE|Trident/.test(navigator.userAgent)) return;
	if (document.body) {
		var all = document.querySelectorAll('img,video');
		var index = -1;
		while (all[++index]) {
			fitie(all[index]);
		}
	} else {
		setTimeout(fitie.init);
	}
};
