import os
import csv

folderName = "raw_data"
myFiles = os.listdir(folderName)
myFiles.sort()
print ( "File Names: " , myFiles)
# print(myFiles[0][2])
#
# if myFiles[i][0:6] == 'budget':
#
# if myFiles[i][0] == '.':
totalmonth = 0
totalrevenue = 0
delta = 0
revenue = 0
averagechange = 0
greatestDecrease = 0
greatestIncrease = 0

for f in myFiles:
    if "budget" not in f:
        continue
    csvpath=os.path.join(folderName,f)

    with open (csvpath, newline="") as csvfile:
        csvreader = csv.reader(csvfile, delimiter=",")

        # print(csvreader)
        firstRow = True
        for row in csvreader:
            # if row[0] == 'Date':
            #     continue
            #print(row)
            if firstRow == True:
                firstRow = False
                continue

            totalmonth += 1
            totalrevenue += int(row[1])
            delta = int(row[1]) - revenue
            if delta > greatestIncrease:
                greatestIncrease = delta
                dateofincrease = row[0]
            if delta < greatestDecrease:
                greatestDecrease = delta
                dateofDecrease = row[0]
            averagechange +=  delta
            revenue=int(row[1])


print("Total Months:" , totalmonth)
print("Total Revenue:" , totalrevenue)
print ("Average Change:", averagechange/totalmonth)
print ("Greatest Increase in Revenue:" , greatestIncrease ,dateofincrease)
print ("Greatest Decrease in Revenue:" , greatestDecrease ,dateofDecrease)
