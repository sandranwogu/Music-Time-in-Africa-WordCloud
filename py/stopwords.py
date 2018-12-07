readfile = open("../data/stopwords.txt", 'r')
writefile = open("../data/stopwordstring.txt", 'w')

stopstring = ""

for line in readfile:
    stopstring += line[:-1] + ","

writefile.write(stopstring)

readfile.close()
writefile.close()
