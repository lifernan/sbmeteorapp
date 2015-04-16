WordsList = new Mongo.Collection('words');
SentencesList = new Mongo.Collection('sentences');
LessonsList = new Mongo.Collection ('lessons');
SetsList = new Mongo.Collection('sets');
GroupsList = new Mongo.Collection('groups');
ScoresList = new Mongo.Collection('scores');
// must have an allow function on server to use batchInsert() on client.
WordsList.allow({
  insert: function(){ return true }
});
SentencesList.allow({
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
ScoresList.allow({
  insert: function(){ return true },
  update: function(){ return true }
});
