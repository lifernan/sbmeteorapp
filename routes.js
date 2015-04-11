// Router.configure({
// 	layoutTemplate: 'appBody'
// });

Router.map(function () {
	this.route('appBody', {path: '/'});
	this.route('wordSetShow', {
		path: '/wordSet/',
		action: function () {
			this.render();
		}
	});
	this.route('about', {path: '/about/'});
	this.route('progress', {path: '/progress/'});
});