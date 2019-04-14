from keras.models import model_from_json


def load_model():
    json_file = open('./model/HVAC_model.json', 'r')
    loaded_model_json = json_file.read()
    json_file.close()
    loaded_model = model_from_json(loaded_model_json)
    loaded_model.load_weights("./model/HVAC_model.h5")
    print("Loaded model from disk")


def prob_failure(model, machine_inputs):
    m_pred=model.predict(machine_inputs)
    failure_prob=list(m_pred[-1]*100)[0]
    return failure_prob
