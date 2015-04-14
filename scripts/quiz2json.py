# Creates json file for loading Speech Banana quizzes into the database
# Input: path to directory sound file directory with the format:
#     path/quiz_sentences/lesson_#/"full_underscore_delimited_sentence_gender.wav"
# Output: json_quiz_loader.txt
#   [{lesson: #, group: #, word: "word", gender: "Gender", filename: "chapter_#/lesson_#/word_gender.wav"}, ...
#   {sentence: "full space delimited sentence", gender: "Gender", filename: "chapter_#/lesson_#/word_gender.wav"}] 

from os import listdir
from os.path import isfile, join
import json

# Sound file path

path = "/Users/lifernan/Desktop/sbmeteorapp/public/sound/quiz_sentences"
extension = '.wav'

# Load sentences

all_sentences = []

lessons = [d for d in listdir(path) if not isfile(d)]
for lesson in lessons:
	lesson_number = int(lesson.split("_")[1])
	lesson_path = join(path, lesson)
	sentences = [s for s in listdir(lesson_path) if extension in s]
	lesson_path = lesson_path.split('public/')[1]
	
	for sentence_filename in sentences:
		sentence = sentence_filename.split(".")[0].replace("_", " ")
		gender = sentence[-1]
		sentence = sentence[:-2]
		sentence = sentence[:-2] + '?' if (sentence[-2:] == ' q') else sentence + '.'

		all_sentences.append({'quiz': lesson_number, 'gender': gender, 'sentence': sentence, \
		  'filename': join(lesson_path, sentence_filename)})

# Write json to file

with open("json_quiz_loader.txt", "w") as loader:
	json.dump(all_sentences, loader, indent=4)

