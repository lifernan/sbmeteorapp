# Creates json file for loading Speech Banana lessons into the database
# Input: path to directory sound file directory with the format:
#     path/lesson_words/"word_gender.wav"
#   and path to lesson_plan with the format:
#     lesson_1
#     lesson 1 title
#
#     set title
#     group1_word1, ..., group1_wordN
#     ...
#     groupM_word1, ..., groupM_wordP
#
#     set title
#     ...
#
#     lesson_2
#   and so on.
#
# Output: json_lesson_loader.txt
#   [{lesson: #, group: #, word: "word", gender: "Gender", filename: "chapter_#/lesson_#/word_gender.wav"}, ...
#   {sentence: "full space delimited sentence", gender: "Gender", filename: "chapter_#/lesson_#/word_gender.wav"}]

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

missing_words = open("missing_words.txt", "w")

lessons = content.split("lesson_")[1:]
for lesson in lessons:

	sets = [s for s in lesson.split("\n\n") if s] # Sets within a lesson are delimited by blank lines

	lesson = sets.pop(0).split("\n") # first 'set' actually describes lesson overall

	lesson_input = lesson[0].split(" ") # input has form: lesson# var1 val1 ... varN valn
	lesson_number = int(lesson_input[0])

	# 0 = word groupings will not be randomized, else = size of each randomly selected lesson set
	random_group = lesson_input[lesson_input.index('random')+1] if 'random' in lesson_input else 0

	lesson_title = lesson[1]

	for set_number, set in enumerate(sets):

		lines = set.split("\n")
		set_title = lines.pop(0)

		for group_number, group in enumerate(lines):
			for word in group.split(", "):
				for gender in ['f', 'm']:

					filename = join(path, word.replace(" ", "_") + '_' + gender + extension)
					if not isfile(filename): 
						missing_words.write(filename + ' ' + str(lesson_number) + ' ' + str(set_number) + ' ' + str(group_number) + '\n')
						continue
					
					filename = filename.split('public/')[1]
					all_words.append({'lesson': lesson_number, 'set': set_number, 'group': group_number, \
					  'word': word, 'gender': gender, 'filename': filename})

missing_words.close()

# Write json to file

with open("json_lesson_loader.txt", "w") as loader:
	json.dump(all_words, loader, indent=4)



