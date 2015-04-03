# Creates json file for loading Speech Banana chapters and lessons 
# into the database
# Input: path to directory with the format
#   path/chapter_#/
#		  lesson_#/"word_gender.wav"
#		  quiz/"full_underscore_delimited_sentence_gender.wav"
# Output: json_loader.txt
#   {chapter: #, lesson: #, word: "word", gender: "Gender", path_to_file: "chapter_#/lesson_#/word_gender.wav"}, ...
#   {chapter: #, sentence: "full space delimited sentence", gender: "Gender", path_to_file: "chapter_#/lesson_#/word_gender.wav"}

from os import listdir
from os.path import isfile, join

# Get path to Speech Banana chapter and lesson files

path = "~/Desktop/sbmeteorapp/public/sound/"
chapters = [c for c in listdir(path) if ~isfile(path)]
print chapters


file = open("json_loader.txt", "w")
file.write("This is a text\n")
file.write("Another line\n")
file.close()