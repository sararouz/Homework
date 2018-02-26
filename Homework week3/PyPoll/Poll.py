import os
import csv

folderName = "raw_data"
myFiles = os.listdir(folderName)
myFiles.sort()
print ( "File Names: " , myFiles)
votes=0
election={}
for f in myFiles:
    if "election" not in f:
        continue
    csvpath=os.path.join(folderName,f)

    with open (csvpath, newline="") as csvfile:
        csvreader = csv.reader(csvfile, delimiter=",")
        firstRow = True
        for row in csvreader:
            if firstRow == True:
                firstRow = False
                continue

            votes += 1
            if row[2] in election:
                election[row[2]] +=1
            else:
                election[row[2]] = 1


print("Total Voters", votes)
# for key in election:
#     print(key, election[key])
winner=0
for key, value in election.items():
    print("{0}: {1:.2f}% ({2})".format(key,100*value/votes,value))
    if value>winner:
        winner=value
        elected=key
print("Winner:" , elected)
