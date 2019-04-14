from flask import Flask
from flask_socketio import SocketIO, emit
from utils import prob_failure, load_model
from flask import jsonify

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socket = SocketIO(app)


@app.route("/")
def index():
    return "Domovoy Homepage"


@socket.on("device_report", namespace='/house_device')
def getDeviceStats(data):
    machine_id = data['machine_id']
    machine_inputs = data['machine_inputs']
    model = load_model()
    failure_prob = prob_failure(model, machine_inputs)
    if failure_prob >= 0.5:
        emit('device_results', jsonify(
            {
                "machine_id" : machine_id,
                "result" : "Expected to fail",
                "prob" : str(failure_prob)
            }
        ))
    else:
        emit('device_results', jsonify(
            {
                "machine_id": machine_id,
                "result": "Device working properly",
                "prob": str(failure_prob)
            }
        ))


if __name__ == '__main__':
    socket.run(app)
