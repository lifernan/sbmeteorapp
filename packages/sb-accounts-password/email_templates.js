/**
 * @summary Options to customize emails sent from the Accounts system.
 * @locus Server
 */
Accounts.emailTemplates = {
  from: "Speech Banana <speechbanana@cis.jhu.edu>", // need a no-reply@cis.jhu.edu address
  siteName: Meteor.absoluteUrl().replace(/^https?:\/\//, '').replace(/\/$/, ''),

  resetPassword: {
    subject: function(user) {
      return "How to reset your password on Speech Banana" // + Accounts.emailTemplates.siteName;
    },
    text: function(user, url) {
      var greeting = (user.profile && user.profile.name) ?
            ("Hello " + user.profile.name + ",") : "Hello,";
      return greeting + "\n"
        + "\n"
        + "To reset your password, simply click the link below.\n"
        + "\n"
        + url + "\n"
        + "\n"
        + "Thanks,\n"
        + "The Speech Banana Team\n";
    }
  },
  verifyEmail: {
    subject: function(user) {
      return "How to verify your email address on Speech Banana" // + Accounts.emailTemplates.siteName;
    },
    text: function(user, url) {
      var greeting = (user.profile && user.profile.name) ?
            ("Hello " + user.profile.name + ",") : "Hello,";
      return greeting + "\n"
        + "\n"
        + "To verify your account email, simply click the link below.\n"
        + "\n"
        + url + "\n"
        + "\n"
        + "Thanks,\n"
        + "The Speech Banana Team\n";
    }
  },
  enrollAccount: {
    subject: function(user) {
      return "An account has been created for you on Speech Banana" // + Accounts.emailTemplates.siteName;
    },
    text: function(user, url) {
      var greeting = (user.profile && user.profile.name) ?
            ("Hello " + user.profile.name + ",") : "Hello,";
      return greeting + "\n"
        + "\n"
        + "To start using Speech Banana, simply click the link below.\n"
        + "\n"
        + url + "\n"
        + "\n"
        + "Thanks,\n"
        + "The Speech Banana Team\n";
    }
  }
};
