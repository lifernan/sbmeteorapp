Router.map(function () {
	this.route('appBody', {
		path: '/',
		template: 'appBody',
		layoutTemplate: 'layout'
	});
	this.route('wordSetShow', {
		path: '/wordSet/',
		template: 'wordSetShow',
		layoutTemplate: 'layout',
		action: function () {
			this.render();
		}
	});
	this.route('about', {path: '/about/', layoutTemplate: 'layout'});
	this.route('progress', {path: '/progress/', layoutTemplate: 'layout'});
});