Router.map(function () {
	this.route('appBody', {
		path: '/',
		template: 'appBody',
		layoutTemplate: 'layout',
		action: function () {
			if (this.ready()) {
				this.render();
			}
		},
		onAfterAction: function() {
			$('body').scrollTop(0);
    	$('body').css("min-height", 0);
		}
	});
	this.route('showLesson', {
		path: '/lesson/:number',  // :number would be restful
		template: 'showLesson',
		layoutTemplate: 'layout',
		action: function () {
			Session.setAuth('currentLesson', parseInt(this.params.number));
			if (this.ready()) {
				this.render();
			}
		},
		onAfterAction: function() {
			$('body').scrollTop(0);
    	$('body').css("min-height", 0);
		}
	});
	this.route('about', {path: '/about/', layoutTemplate: 'layout'});
	this.route('progress', {path: '/progress/', layoutTemplate: 'layout'});
});