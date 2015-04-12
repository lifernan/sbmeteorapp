Router.configure({
 	layoutTemplate: 'layout'
 });

Router.map(function () {
	this.route('appBody', {
		path: '/',
		template: 'appBody',
		layoutTemplate: 'layout'
	});
	this.route('wordSetShow', {
		path: '/wordSet/',
		action: function () {
			this.render();
		}
	});
	this.route('about', {path: '/about/'});
	this.route('progress', {path: '/progress/'});
});