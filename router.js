Router.map(function () {
	this.route('appBody', {
		path: '/',
		template: 'appBody',
		layoutTemplate: 'layout',
		action: function () {
			if (this.ready()) {
				this.render();
			}
		}
	});
	this.route('wordSetShow', {
		path: '/wordSet/',  // :number would be restful
		template: 'wordSetShow',
		layoutTemplate: 'layout',
		action: function () {
			if (this.ready()) {
				this.render();
			}
		}
	});
	this.route('about', {path: '/about/', layoutTemplate: 'layout'});
	this.route('progress', {path: '/progress/', layoutTemplate: 'layout'});
});