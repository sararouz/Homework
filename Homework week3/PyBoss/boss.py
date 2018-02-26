import os
import csv
us_state_abbrev = {
    'Alabama': 'AL',
    'Alaska': 'AK',
    'Arizona': 'AZ',
    'Arkansas': 'AR',
    'California': 'CA',
    'Colorado': 'CO',
    'Connecticut': 'CT',
    'Delaware': 'DE',
    'Florida': 'FL',
    'Georgia': 'GA',
    'Hawaii': 'HI',
    'Idaho': 'ID',
    'Illinois': 'IL',
    'Indiana': 'IN',
    'Iowa': 'IA',
    'Kansas': 'KS',
    'Kentucky': 'KY',
    'Louisiana': 'LA',
    'Maine': 'ME',
    'Maryland': 'MD',
    'Massachusetts': 'MA',
    'Michigan': 'MI',
    'Minnesota': 'MN',
    'Mississippi': 'MS',
    'Missouri': 'MO',
    'Montana': 'MT',
    'Nebraska': 'NE',
    'Nevada': 'NV',
    'New Hampshire': 'NH',
    'New Jersey': 'NJ',
    'New Mexico': 'NM',
    'New York': 'NY',
    'North Carolina': 'NC',
    'North Dakota': 'ND',
    'Ohio': 'OH',
    'Oklahoma': 'OK',
    'Oregon': 'OR',
    'Pennsylvania': 'PA',
    'Rhode Island': 'RI',
    'South Carolina': 'SC',
    'South Dakota': 'SD',
    'Tennessee': 'TN',
    'Texas': 'TX',
    'Utah': 'UT',
    'Vermont': 'VT',
    'Virginia': 'VA',
    'Washington': 'WA',
    'West Virginia': 'WV',
    'Wisconsin': 'WI',
    'Wyoming': 'WY',
}

folderName = "raw_data"
myFiles = os.listdir(folderName)
myFiles.sort()
print ( "File Names: " , myFiles)

for f in myFiles:
    if "data" not in f:
        continue
    csvpath=os.path.join(folderName,f)
    tmp = []
    with open (csvpath, newline="") as csvfile:
        with open ('newDataFile.csv','w') as csvWriteFile:
            csvwriter = csv.writer(csvWriteFile, delimiter=',')
            csvreader = csv.reader(csvfile, delimiter=",")
            firstRow = True
            for row in csvreader:
                if firstRow == True:
                    firstRow = False
                    newFirstRow = [row[0],"Name", "Last Name", row[2], row[3], row[4]]
                    csvwriter.writerow(newFirstRow)
                    continue
                # tmp.append([])
                # tmp[-1].append(row[0])
                # tmp[-1].append(row[1].split(' ')[0])
                # tmp[-1].append(row[1].split(' ')[1])
                # tmp[-1].append('{0}/{1}/{2}'.format())
                empID = row[0]
                name = row[1].split(' ')[0]
                lastName = row[1].split(' ')[1]
                dob = row[2].split('-')
                newDOB = '{0}/{1}/{2}'.format(dob[1],dob[2],dob[0])
                ssn = '***-**-{0}'.format(row[3].split('-')[2])
                state = us_state_abbrev[row[4]]
                csvwriter.writerow([empID, name, lastName, newDOB, ssn, state])
