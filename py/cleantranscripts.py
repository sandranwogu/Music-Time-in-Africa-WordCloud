import csv

ids = []
cleanrows = []
cleanscripts = {}

def cleanTranscript(transcript):
    cleanscript = ''
    word = ''

    for char in transcript:
        # print(char + ":" + str(ord(char)))

        if ord(char) == 32:
            # Clean the word
            for char in word:
                if not ((ord(char) >= 65 and ord(char) <= 90) or     # Upper case letters
                   (ord(char) >= 97 and ord(char) <= 122)):          # Lower case letters

                   word = word.replace(char, '')

            cleanscript += word + ' '
            word = ''
        else:
            if ord(char) < 128:
                word += char

    return cleanscript

with open('../data/mitaData.csv', 'r', encoding='UTF-8') as csvfile:
    reader = csv.reader(csvfile)
    for row in reader:
        id = row[0]

        if id not in ids:
            ids.append(row[0])
            transcript = row[9]
            cleanscripts[id] = cleanTranscript(transcript)

            cleanrow = row[:-2]
            cleanrow.append(cleanTranscript(transcript))

            cleanrows.append(cleanrow)

# Write the cleaned data
with open('../data/cleanData.csv', 'w', encoding='UTF-8', newline='') as csvfile:
    writer = csv.writer(csvfile)

    for row in cleanrows:

        # cleanrow[9] = cleanscripts[row[0]]
        writer.writerow(row)

print(cleanrow)
