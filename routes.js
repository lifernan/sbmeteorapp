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
});