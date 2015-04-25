ChaptersList = new Mongo.Collection('chapters');
LessonsList = new Mongo.Collection ('lessons');
SetsList = new Mongo.Collection('sets');
GroupsList = new Mongo.Collection('groups');
WordsList = new Mongo.Collection('words');
SentencesList = new Mongo.Collection('sentences');
ScoresList = new Mongo.Collection('scores');
// must have an allow function on server to use batchInsert() on client.
ChaptersList.allow({
  insert: function(){ return true }
});
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
		if (ChaptersList.find().count() === 0) {
			var myjson = JSON.parse(Assets.getText("scripts/loader_chapter.json"));
			ChaptersList.batchInsert(myjson);
		}
		if (LessonsList.find().count() === 0) {
			var myjson = JSON.parse(Assets.getText("scripts/loader_lesson.json"));
			LessonsList.batchInsert(myjson);
		}
		if (SetsList.find().count() === 0) {
			var myjson = JSON.parse(Assets.getText("scripts/loader_set.json"));
			SetsList.batchInsert(myjson);
		}
		if (GroupsList.find().count() === 0) {
			var myjson = JSON.parse(Assets.getText("scripts/loader_group.json"));
			GroupsList.batchInsert(myjson);
		}
		if (WordsList.find().count() === 0) {
			var myjson = JSON.parse(Assets.getText("scripts/loader_word.json"));
			WordsList.batchInsert(myjson);
		}
		if (SentencesList.find().count() === 0) {
			var myjson = JSON.parse(Assets.getText("scripts/loader_sentence.json"));
			SentencesList.batchInsert(myjson);
		}
	});
}