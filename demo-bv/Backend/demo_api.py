import os
import fastText # 0.1.0
from flask_restful import Resource
from flask import Flask
from flask_restful import reqparse, Api
import spacy
from flask_cors import CORS
from flask import jsonify

# fastText == https://github.com/salestock/fastText.py 
# tested on Python 3.6.5
# flask_restful == 0.3.6
# flask == 0.12.2

# https://www.fullstackpython.com/blog/develop-flask-web-apps-docker-containers-macos.html : after coding
# https://hub.docker.com/_/postgres/ export database
# how to connect a postgresql docker with a flask app



# classification model

bin =  "./Golem_100_whole_test.bin"

def loading_fasttext_model(bin_model):
    print("loading fasttext model..")
    model = fastText.load_model(bin_model)
    print("loading complete..")
    return (model)

def get_prediction(string):
    prediction = model.predict(string, k=1)
    return (prediction)

model = loading_fasttext_model(bin)



# NER model

nlp = spacy.load('de_core_news_sm')

def get_named_entity(text):
	doc = nlp(text)
	return [[ent.text, ent.label_] for ent in doc.ents]



# flask server

app = Flask(__name__)
#api = Api(app)
#APP_ROOT = os.path.dirname(os.path.abspath(__file__))
CORS(app)

getparser = reqparse.RequestParser()
getparser.add_argument('predict')

@app.route("/")
def prediction():
	args = getparser.parse_args()
	user_query = args['predict']
	ouput = {}	

	try:
		res = get_prediction(user_query)

		output = {
			'label' : res[0][0],
			'precentage' : res[1][0],
			'entities' : get_named_entity(user_query)
		}
	except:
		output = {
			error : "something is wrong"
		}
		print(output.error)

	return jsonify(output) 

if __name__ == '__main__':
    app.run("0.0.0.0", port=9011) #debug=True)


