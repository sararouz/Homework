from flask import Flask, render_template, redirect, Markup, request, jsonify
import csv
app= Flask(__name__)

@app.route("/",methods=['GET'])
def myroot():
    return render_template("index.html")

@app.route('/names',methods=['GET'])
def returnListOfSamples():
    with open('DataSets/belly_button_biodiversity_samples.csv', 'r') as csvfile:
        Samples = csv.reader(csvfile, delimiter=',', quotechar='|')
        for row in Samples:
            mySamples=row[1:]
            break
    return jsonify(mySamples)


@app.route('/otu',methods=['GET'])
def otu():
    with open('DataSets/belly_button_biodiversity_otu_id.csv', 'r') as csvfile:
        Samples = csv.reader(csvfile, delimiter=',', quotechar='|')
        # otuDisc = []
        otuDisc = {}
        for i,row in enumerate(Samples):
            if i==0:
                continue
            # otuDisc.append({row[0]:row[1]})
            otuDisc[row[0]] = row[1]
    return jsonify(otuDisc)




@app.route('/<x>/<sample>',methods=['GET'])
def metadata(x,sample):
    myID=sample.split("_")[1]
    with open('DataSets/Belly_Button_Biodiversity_Metadata.csv', 'r') as csvfile:
        Samples = csv.reader(csvfile, delimiter=',', quotechar='|')
        for row in Samples:
            if myID == row[0]:
                if x == 'metadata':
                    myDict = {
                        'AGE': int(row[4]),
                        'BBTYPE': row[6],
                        'ETHNICITY': row[2],
                        'GENDER': row[3],
                        'LOCATION': row[7],
                        'SAMPLEID': int(myID)
                        }
                    return jsonify(myDict)
                elif x == 'wfreq':
                    return jsonify(int(row[5]))




# @app.route('/wfreq/<sample>',methods=['GET'])
# def wfreq(sample):
#     print(sample)






@app.route('/samples/<sample>',methods=['GET'])
def samples(sample):
    myID=sample
    myList = []
    with open('DataSets/belly_button_biodiversity_samples.csv', 'r') as csvfile:
        Samples = csv.reader(csvfile, delimiter=',', quotechar='|')
        for i,row in enumerate(Samples):
            if i==0:
                for j,elem in enumerate(row):
                    if myID == elem:
                        foundIndex = j
                        break
                continue
            if row[foundIndex] == '':
                continue
            myList.append((row[0],int(row[foundIndex])))
    myList = sorted(myList,key=lambda m: m[1],reverse=True)
    myOut = [{'otu_ids':[],'sample_values':[]}]
    for elem in myList:
        myOut[0]['otu_ids'].append(int(elem[0]))
        myOut[0]['sample_values'].append(int(elem[1]))
    return jsonify(myOut)








if __name__ == "__main__":
    app.run(debug=True)
