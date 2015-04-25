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
#
# To do: Update field names for lessons
#

from os import listdir
from os.path import isfile, join
import json

# Sound file path

url = "https://raw.githubusercontent.com/lifernan/sbsound/master/american_english/lesson_words"
path = "/Users/lifernan/Desktop/sbsound/american_english/lesson_words/"
extension = '.wav'

# Load lesson plan

all_chapters = []
all_lessons = []
all_sets = []    # temporary hack!!
all_groups = []  # temporary hack!!
all_words = []

plan_file = 'lesson_plan.txt'
with open(plan_file, 'r') as f:
	content = f.read()

missing_words = open("missing_words.txt", "w")

chapters = content.split("chapter_")[1:]

for chapter in chapters:
	lessons = chapter.split("lesson_")

	chapter_input = lessons.pop(0).split("\n")
	chapter_number = int(chapter_input[0])
	chapter_title = chapter_input[1]
	
	all_chapters.append({'number': chapter_number, 'title': chapter_title})

	for lesson in lessons:
		sets = [s for s in lesson.split("\n\n") if s] # Sets within a lesson are delimited by blank lines

		lesson = sets.pop(0).split("\n") # first 'set' actually describes lesson overall

		lesson_input = lesson[0].split(" ") # input has form: lesson# var1 val1 ... varN valn
		lesson_number = int(lesson_input[0])

		# 0 = word groupings will not be randomized, else = size of each randomly selected lesson set
		random_group = lesson_input[lesson_input.index('random')+1] if 'random' in lesson_input else 0

		lesson_title = lesson[1]
		all_lessons.append({'number': lesson_number, 'title': lesson_title, 'chapter': chapter_number})

		for set_number, set in enumerate(sets):

			set_number = set_number + 1
			lines = set.split("\n")
			set_title = lines.pop(0)
			all_sets.append({'lesson': lesson_number, 'number': set_number, 'title': set_title})

			for group_number, group in enumerate(lines):

				group_number = group_number + 1
				all_groups.append({'lesson': lesson_number, 'set': set_number, 'number': group_number})

				for word in group.split(", "):
					for gender in ['f', 'm']:

						filename = word.replace(" ", "_") + '_' + gender + extension;
						fullpath = join(path, filename)
						if not isfile(fullpath): 
							missing_words.write(fullpath + ' ' + str(lesson_number) + ' ' + str(set_number) + ' ' + str(group_number) + '\n')
							continue
				
						#public_path = filename.split('public/')[1]
						word_url = join(url, filename)
						all_words.append({'lesson': lesson_number, 'set': set_number, 'group': group_number, \
						  'word': word, 'gender': gender, 'url': word_url})    # 'filename': public_path})

missing_words.close()

# Write json to file

with open("loader_chapter.json", "w") as loader:
	json.dump(all_chapters, loader, indent=4)

with open("loader_lesson.json", "w") as loader:
	json.dump(all_lessons, loader, indent=4)

with open("loader_set.json", "w") as loader:
	json.dump(all_sets, loader, indent=4)

with open("loader_group.json", "w") as loader:
	json.dump(all_groups, loader, indent=4)

with open("loader_word.json", "w") as loader:
	json.dump(all_words, loader, indent=4)



