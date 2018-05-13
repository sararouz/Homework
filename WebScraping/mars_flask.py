#flask
from flask import Flask, render_template, redirect, Markup
import pymongo
app = Flask(__name__)

conn = "mongodb://localhost:27017"
client = pymongo.MongoClient(conn)
db = client.scrape
collection = db.scrape

@app.route('/scrape')
def call_scrape():
    from scrape_mars import scrape
    myDict = scrape()
    client.drop_database('scrape')
    db = client.scrape
    collection = db.scrape
    db.collection.insert_many([myDict])
    return redirect("http://localhost:5000/", code=302)


@app.route('/')
def myRoot():
    myDict = list(db.collection.find())
    print(myDict[0]['tables'])
    myDict[0]['tables'] = Markup(myDict[0]['tables'])
    return render_template("index.html", scrapeData=myDict[0])


# def echo():
#     return render_template("index.html", text="hurricanes are a comin")

if __name__ == "__main__":
    app.run(debug=True)
