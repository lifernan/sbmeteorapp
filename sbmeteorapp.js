if (Meteor.isClient) {

  /* Navigation Bar */
  Template.navigationBar.helpers({
    activeNav: function(n) { // need a better way of implementing menu item selectors
      if (Session.get('currentNav') === n) {
        return 'active';
      }
    }
  });
  Template.navigationBar.events({
    'click #brand': function () {
      Session.setAuth('currentNav','brand');
    },
    'click #about': function () {
      Session.setAuth('currentNav','about');
      Router.go('about');
    },
    'click #progress': function () {
      Session.setAuth('currentNav','progress');
      Router.go('progress');
    }
  });

  /* Chapter List */
  Template.chapterList.helpers({
    chapters: function() {
      return ChaptersList.find({});
    },
    isActiveChapter: function() {
      if (Session.get('currentChapter') === ChaptersList.findOne(this._id).number) {
        return 'in';
      }
    }
  });
  Template.chapterList.events({
    'click a.chapter': function () {
      Session.setAuth('currentChapter', this.number);
    }
  });

  /* Lesson list for a chapter */
  Template.lessonList.helpers({
    lessons: function () {
      return LessonsList.find({chapter: Session.get('currentChapter')});
    }
  });
  Template.lessonList.events({
    'click a.btn-lesson': function () {
      Session.setAuth('currentLesson', this.number);
      Session.setAuth('currentSet', 1);
      Session.setAuth('currentGroup', 1);
      Session.setAuth('currentGender',"f");

      Session.setAuth('currentQuiz', 0);
      /*Router.go('showLesson', {number: this.number});*/
    }
  });

  /* Show drills in current lesson */
  Template.showLesson.helpers({
    lesson: function() {
      return LessonsList.findOne({number: Session.get('currentLesson')});
    },
    sets: function() {
      return SetsList.find({lesson: Session.get('currentLesson')});
    },
    words: function() {
      return WordsList.find({lesson: Session.get('currentLesson'), set: Session.get('currentSet'), group: Session.get('currentGroup'), gender: Session.get('currentGender')});
    },
    activeSet: function() {
      if (Session.get('currentSet') === SetsList.findOne(this._id).number) {
        return 'active';
      }
    },
    isActiveSet: function() {
      if (Session.get('currentSet') === SetsList.findOne(this._id).number) {
        return 'in';
      }
    },
    activeGroup: function() {
      if (Session.get('currentGroup') === GroupsList.findOne(this._id).number) {
        return 'active';
      }
    },
    activeQuiz: function() {
      if (Session.get('currentQuiz') !== 0) {
        return 'active';
      }
    }
  });

  Template.showLesson.events({
    'shown.bs.collapse #accordion': function() {
      console.log('hello!');
    },
    'click a.word-set': function() {
      var setID = this._id;
      var setName = SetsList.findOne(setID).set;
      Session.setAuth('currentSet', setName);
      Session.setAuth('currentGroup', 1);
      Session.setAuth('currentQuiz', 0); // hack (uses 0 value to hide content, inefficient and roundabout)
    },
    'click button.btn-word-group': function() {
      var groupID = this._id;
      var groupNumber = GroupsList.findOne(groupID).group;
      Session.setAuth('currentGroup', groupNumber);
    },
    'click a.quiz': function() {
      Session.setAuth('currentSet', 0);  // hack (roundabout way to make sets and groups lists inactive during quiz)
      Session.setAuth('currentGroup', 0);

      Session.setAuth('currentQuiz', Session.get('currentLesson'));
      Session.setAuth('submitted', false);
      Session.setAuth('currentTotalCorrect', 0);
      Session.setAuth('currentTotalTaken', 0);

      var sentences = SentencesList.find({quiz: Session.get('currentQuiz'), gender: Session.get('currentGender')});
      var r = Math.floor(Math.random() * sentences.count()); 
      Session.setAuth('r', r);
    },
    'click button.next-quiz': function() {
      var sentences = SentencesList.find({quiz: Session.get('currentQuiz'), gender: Session.get('currentGender')}); // need to store ids to avoid querying all the time
      var r = Math.floor(Math.random() * sentences.count());
      Session.setAuth('r', r);
      Session.setAuth('submitted', false);
    },
    'click .audio': function() { // hack (the audio object should be created on load of the page, not at event)
      var audio = new Audio(this.url); // error to fix: sentences ending in ? marks cannot play female voice
      audio.play();
    },
    'click button.previous-word-group': function() {
      Session.setAuth('currentGroup', Session.get('currentGroup') - 1);
    },
    'click button.next-word-group': function() {
      Session.setAuth('currentGroup', Session.get('currentGroup') + 1);
    }
  });

  /* Play Menu (open menu, move for/backward through lesson) */
  Template.playMenu.helpers({
    groups: function() {
      return GroupsList.find({lesson: Session.get('currentLesson'), set: Session.get('currentSet')});
    },
    hideGroupMenu: function() {
      if (GroupsList.find({lesson: Session.get('currentLesson'), set: Session.get('currentSet')}).count() === 1) {
        return 'hidden';
      }
    },
    hidePreviousGroupArrow: function() {
      if (Session.get('currentGroup') < 2)  {
        return 'hidden';
      }
    },
    offsetHiddenPreviousArrow: function() {
      if (Session.get('currentGroup') < 2)  {
        return 'col-xs-offset-2'; /* horrible hack */
      }
    },
    hideNextGroupArrow: function() {
      if (Session.get('currentGroup') === GroupsList.find({lesson: Session.get('currentLesson'), set: Session.get('currentSet')}).count()) {
        return 'none';
      }
    },
    hideNextQuizArrow: function() {
      if (Session.get('currentQuiz') === 0) {
        return 'none';
      }
    },
    fixedForMobile: function() {
      if (screen.height < 600) {
        return 'navbar-fixed-bottom';
      }
    }
  });

  /* Settings Menu (change gender of speaker) */
  Template.playModal.helpers({
    checkedGender: function(gender) {
      if (Session.get('currentGender') === gender) {
        return 'checked';
      }
    }
  }); 
  Template.playModal.events({
    'change #male': function() {
      Session.setAuth('currentGender', 'm');
    },
    'change #female': function() {
      Session.setAuth('currentGender', 'f');
    }
  });

  /* Quiz */
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

        Session.setAuth('newScore', newScore);
        Session.setAuth('currentTotalCorrect', Session.get('currentTotalCorrect') + newScore);
        Session.setAuth('currentTotalTaken', Session.get('currentTotalTaken') + 1);

        Session.setAuth('submitted', true); // total hack, need to change
        Session.setAuth('actualSentenceID', sentences.fetch()[Session.get('r')]._id);
      }

      return false; // Prevent default form submit
    }
  });

  /* Progress Page */
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
