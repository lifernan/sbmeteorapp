Accounts.config({
  sendVerificationEmail: true
});

if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.userSplash.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });

  Template.userSplash.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    process.env.MAIL_URL = 'smtp://postmaster%40sandboxe5c9ba97d33b473eb8ae98d9bf97cb63.mailgun.org:884e569f544b008a9c453d3417f089b3@smtp.mailgun.org:587'
  });
}
