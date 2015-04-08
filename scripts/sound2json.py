# Creates json file for loading Speech Banana chapters and lessons 
# into the database
# Input: path to directory with the format
#   path/chapter_#/
#		  lesson_#/"word_gender.wav"
#		  quiz/"full_underscore_delimited_sentence_gender.wav"
# Output: json_loader.txt
#   {chapter: #, lesson: #, word: "word", gender: "Gender", path_to_file: "chapter_#/lesson_#/word_gender.wav"}, ...
#   {chapter: #, sentence: "full space delimited sentence", gender: "Gender", path_to_file: "chapter_#/lesson_#/word_gender.wav"}
# Update: Actually using lesson_plan.txt instead of above directory structure to associate lesson files with words

from os import listdir
from os.path import isfile, join
import json

# Sound file path

path = "/Users/lifernan/Desktop/sbmeteorapp/public/sound/lesson_words/"
extension = '.wav'

# Load lesson plan

all_words = []

plan_file = 'lesson_plan.txt'
with open(plan_file, 'r') as f:
	content = f.read()

lessons = content.split("lesson_")[1:]
for lesson in lessons:
	sets = [s for s in lesson.split("\n\n") if s] # Sets within a lesson are delimited by blank lines

	lesson = sets.pop(0).split("\n") # first 'set' actually describes lesson overall

	lesson_input = lesson[0].split(" ") # input has form: lesson# var1 val1 ... varN valn
	lesson_number = lesson_input[0]

	# 0 = word groupings will not be randomized, else = size of each randomly selected lesson set
	random_group = lesson_input[lesson_input.index('random')+1] if 'random' in lesson_input else 0

	lesson_title = lesson[1]

	for set_number, set in enumerate(sets):
		lines = set.split("\n")
		set_title = lines.pop(0)
		for group_number, group in enumerate(lines):
			for word in group.split(", "):
				for gender in ['f', 'm']:
					all_words.append({'lesson': lesson_number, 'set': set_number, 'group': group_number, \
					  'word': word, 'gender': gender, 'filename': join(path, \
					  word.replace(" ", "_") + '_' + gender + extension)})


# Write json to file

with open("json_loader.txt", "w") as loader:
	json.dump(all_words, loader, indent=4)



