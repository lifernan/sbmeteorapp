if (Meteor.isClient) {

  Template.navigationBar.helpers({
    activeNav: function(n) { // need a better way of implementing menu item selectors
      if (Session.get('currentNav') === n) {
        return 'active';
      }
    }
  });
  Template.navigationBar.events({
    'click #brand': function () {
      Session.set('currentNav','brand');
    },
    'click #about': function () {
      Session.set('currentNav','about');
      Router.go('about');
    },
    'click #progress': function () {
      Session.set('currentNav','progress');
      Router.go('progress');
    }
  });

  Template.lessonShow.helpers({
    lessons: function() {
      return LessonsList.find({});
    },
    displayName: function() {
      return Accounts._loginButtons.displayName();
    }
  });

  Template.lessonShow.events({
    'click button.lesson': function () {
      Session.set('currentLesson', this.number);
      Session.set('currentSet', 1);
      Session.set('currentGroup', 1);
      Session.set('currentGender',"f");

      Session.set('currentQuiz', 0);
      Router.go('wordSetShow');
    }
  });

  Template.wordSetShow.helpers({
    sets: function() {
      return SetsList.find({lesson: Session.get('currentLesson')});
    },
    groups: function() {
      return GroupsList.find({lesson: Session.get('currentLesson'), set: Session.get('currentSet')});
    },
    words: function() {
      return WordsList.find({lesson: Session.get('currentLesson'), set: Session.get('currentSet'), group: Session.get('currentGroup'), gender: Session.get('currentGender')});
    },
    activeSet: function() {
      if (Session.get('currentSet') === SetsList.find(this._id).fetch()[0].set) {
        return 'active';
      }
    },
    activeGroup: function() {
      if (Session.get('currentGroup') === GroupsList.find(this._id).fetch()[0].group) {
        return 'active';
      }
    },
    activeQuiz: function() {
      if (Session.get('currentQuiz') !== 0) {
        return 'active';
      }
    },
    isChecked: function(gender) {
      if (Session.get('currentGender') === gender) {
        return 'checked';
      }
    }
  });

  Template.wordSetShow.events({
    'change #male': function() {
      Session.set('currentGender', 'm');
    },
    'change #female': function() {
      Session.set('currentGender', 'f');
    },
    'click button.word-set': function() {
      var setID = this._id;
      var setName = SetsList.find(setID).fetch()[0].set;
      Session.set('currentSet', setName);
      Session.set('currentGroup', 1);
      Session.set('currentQuiz', 0); // hack (uses 0 value to hide content, inefficient and roundabout)
    },
    'click button.word-group': function() {
      var groupID = this._id;
      var groupName = GroupsList.find(groupID).fetch()[0].group;
      Session.set('currentGroup', groupName);
    },
    'click button.quiz': function() {
      Session.set('currentSet', 0);  // hack (roundabout way to make sets and groups lists inactive during quiz)
      Session.set('currentGroup', 0);

      Session.set('currentQuiz', Session.get('currentLesson'));
      Session.set('submitted', false);
      Session.set('currentTotalCorrect', 0);
      Session.set('currentTotalTaken', 0);

      var sentences = SentencesList.find({quiz: Session.get('currentQuiz'), gender: Session.get('currentGender')});
      var r = Math.floor(Math.random() * sentences.count()); 
      Session.set('r', r);
    },
    'click button.audio': function() { // hack (the audio object should be created on load of the page, not at event)
      var audio = new Audio(this.filename); // error to fix: sentences ending in ? marks cannot play female voice
      audio.play();
    }
    
  });

  Template.quiz.helpers({
    sentence: function() {
      var sentences = SentencesList.find({quiz: Session.get('currentQuiz'), gender: Session.get('currentGender')});
      return sentences.fetch()[Session.get('r')];
    },
    activeQuizSubmit: function() {
      if (Session.get('submitted')) {
        return 'disabled';
      }
    },
    submitted: function() {
      return Session.get('submitted');
    },
    newScore: function() {
      return Session.get('newScore');
    },
    totalCorrect: function() {
      return Session.get('currentTotalCorrect');
    },
    totalTaken: function() {
      return Session.get('currentTotalTaken');
    }
  });

  Template.quiz.events({
    'click button.quiz-next': function() {
      var sentences = SentencesList.find({quiz: Session.get('currentQuiz'), gender: Session.get('currentGender')}); // need to store ids to avoid querying all the time
      var r = Math.floor(Math.random() * sentences.count());
      Session.set('r', r);
      Session.set('submitted', false);
    },
    'submit .user-guess': function(event) { // to do: Will need to change this to check phonemic spelling
      var guess = event.target.text.value;

      if (guess) { // don't check empty submissions
        var sentences = SentencesList.find({quiz: Session.get('currentQuiz'), gender: Session.get('currentGender')}); // need to store ids to avoid querying all the time
        var actual = sentences.fetch()[Session.get('r')].sentence;
        var isCorrect = guess === actual;
        var newScore = isCorrect ? 1 : 0; // weirdly you can't pass in a ternery operator statement to update

        var currentScore = ScoresList.findOne({user: Meteor.userId(), quiz: Session.get('currentQuiz')});
        if (currentScore) { // hack
          ScoresList.update(currentScore._id, {$inc: {total_correct: newScore, total_taken: 1}}); 
        } else {
          ScoresList.insert({user: Meteor.userId(), quiz: Session.get('currentQuiz'), total_correct: newScore, total_taken: 1});
        }

        Session.set('newScore', newScore);
        Session.set('currentTotalCorrect', Session.get('currentTotalCorrect') + newScore);
        Session.set('currentTotalTaken', Session.get('currentTotalTaken') + 1);

        Session.set('submitted', true); // total hack, need to change
        Session.set('actualSentenceID', sentences.fetch()[Session.get('r')]._id);
      }

      return false; // Prevent default form submit
    }
  });

  Template.progress.helpers({
    scores: function() {
      return ScoresList.find({user: Meteor.userId()}, {sort: {quiz: 1}});
    }
  });
  Template.progress.rendered = function() {
    var seriesData = [];
    var scores = ScoresList.find({user: Meteor.userId()});
    scores.forEach(function(score) {
      var dataPoint = [score.quiz, option.total];
      seriesData.push(dataPoint);
    });
  }
}
