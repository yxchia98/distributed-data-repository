import requests
import time
import csv
import os
from datetime import datetime, timedelta

# api-endpoint
URL = "https://dummy.gke.yxchia.me/"
# filename = "./logs.csv"
# if os.path.exists(filename):
#     os.remove(filename)

# header = ["timeStamp", "latency"]
# f = open(filename, "w")
# writer = csv.writer(f)
# writer.writerow(header)

while True:
    # current_time = time.mktime(datetime.now().timetuple())

    # if current_time % 5 == 0:
    #     # sending get request and saving the response as response object
    #     r = requests.get(url=URL)

    #     # extracting data in json format
    #     # data = r.json()

    #     request_duration = r.elapsed.total_seconds()
    #     # output = [str(current_time), str(round(request_duration * 1000, 2))]
    #     print(request_duration)
    #     print(r.status_code)
    #     # writer.writerow(output)
    #     # print(data)
    # sending get request and saving the response as response object
    r = requests.get(url=URL)

    # extracting data in json format
    # data = r.json()

    request_duration = r.elapsed.total_seconds()
    # output = [str(current_time), str(round(request_duration * 1000, 2))]
    print(request_duration)
    print(r.status_code)
    # writer.writerow(output)
    # print(data)
    time.sleep(1)
