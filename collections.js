LessonsList = new Mongo.Collection ('lessons');
SetsList = new Mongo.Collection('sets');
GroupsList = new Mongo.Collection('groups');
WordsList = new Mongo.Collection('words');
SentencesList = new Mongo.Collection('sentences');
ScoresList = new Mongo.Collection('scores');
// must have an allow function on server to use batchInsert() on client.
LessonsList.allow({
  insert: function(){ return true }
});
SetsList.allow({
  insert: function(){ return true }
});
GroupsList.allow({
  insert: function(){ return true }
});
WordsList.allow({
  insert: function(){ return true }
});
SentencesList.allow({
  insert: function(){ return true }
});
ScoresList.allow({
  insert: function(){ return true },
  update: function(){ return true }
});


if (Meteor.isServer) {
	Meteor.startup(function () {
		if (LessonsList.find().count() === 0) {
			var myjson = JSON.parse(Assets.getText("scripts/json_lesson_loader.json"));
			console.log(myjson);
			LessonsList.batchInsert(myjson);
		}
		if (SetsList.find().count() === 0) {
			var myjson = JSON.parse(Assets.getText("scripts/json_set_loader.json"));
			console.log(myjson);
			SetsList.batchInsert(myjson);
		}
		if (GroupsList.find().count() === 0) {
			var myjson = JSON.parse(Assets.getText("scripts/json_group_loader.json"));
			console.log(myjson);
			GroupsList.batchInsert(myjson);
		}
		if (WordsList.find().count() === 0) {
			var myjson = JSON.parse(Assets.getText("scripts/json_word_loader.json"));
			console.log(myjson);
			WordsList.batchInsert(myjson);
		}
		if (SentencesList.find().count() === 0) {
			var myjson = JSON.parse(Assets.getText("scripts/json_sentence_loader.json"));
			console.log(myjson);
			SentencesList.batchInsert(myjson);
		}
	});
}