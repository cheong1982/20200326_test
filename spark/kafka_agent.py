#!/usr/bin/env python
# -*- coding:utf-8 -*-
__author__ = 'sisung'

import json
import os
import sys
import time
import logging
from logging import handlers
import threading
import signal
from datetime import datetime, timedelta
from kafka import KafkaProducer
from kafka.errors import KafkaError
import glob
import json
import codecs
from datetime import datetime, timedelta
version = "1.0.0"

current_dir = os.path.dirname(os.path.realpath(__file__))
up_dir = os.path.dirname(current_dir)
sys.path.append(up_dir + '/lib')

REQ_TIMEOUT = 3

import warnings

warnings.filterwarnings("ignore", category=UnicodeWarning)

class KafkaAgent(object):
    def __init__(self, logger=None):
        print("KafkaAgent init")
        self.p_code = sys.argv[1:2]
        self.err_type = sys.argv[2:3]
        print("p_code : ", self.p_code)
        print("err_type : ", self.err_type)
        self.is_running = True
        if logger is None:
            logging.basicConfig(level=logging.INFO)
            self.logger = logging.getLogger('KafkaAgent')
        else:
            self.logger = logger
        self.log_print_enable = True
        self.data_src_p0001 = []
        self.data_src_p0002 = []
    def Log(self, msg):
        self.logger.info(msg)
        if self.log_print_enable is True:
            print(msg)

    def on_send_success(self,record_metadata):
        print("SUCCESS topic : ", record_metadata.topic, ", partition : ", record_metadata.partition, ", offset :",
              record_metadata.offset)

    def on_send_error(self,excp):
        print("on_send_error :", excp)

    def load_data_source(self):
        file_list = [f for f in sorted(glob.glob("./data/1st_test/*.*"))]
        cur = 0
        for file_ in file_list :
            print(file_)
            if cur <3 :
                f = codecs.open(file_, encoding='utf-8')
                for line in f:
                    data_line = line.replace('\r\n','')
                    self.data_src_p0001.append(data_line)
            if cur >3 and cur <= 6 :
                f = codecs.open(file_, encoding='utf-8')
                for line in f:
                    data_line = line.replace('\r\n','')
                    self.data_src_p0002.append(data_line)


            cur += 1
    def run(self):
        producer = KafkaProducer(bootstrap_servers='localhost:9092')
        topicName = "FirstTopic"

        self.load_data_source()
        print("data len : ", len(self.data_src_p0001))
        print("data len : ", len(self.data_src_p0002))
        cur = 0
        while self.is_running:
            try:
                if self.p_code == 'P0001' :
                    data_array = self.data_src_p0001[cur].split("\t")
                else :
                    data_array = self.data_src_p0002[cur].split("\t")
                offset = 1.0
                if int(self.err_type[0]) == 1 :
                    offset = 1.999
                msg = {
                    "p_code": self.p_code[0],
                    "S_1_1": float(data_array[0]) * offset,
                    "S_1_2": float(data_array[1]) * offset,
                    "S_2_1": float(data_array[2]) * offset,
                    "S_2_2": float(data_array[3]) * offset,
                    "S_3_1": float(data_array[4]) * offset,
                    "S_3_2": float(data_array[5]) * offset,
                    "S_4_1": float(data_array[6]) * offset,
                    "S_4_2": float(data_array[7]) * offset,
                    "time": datetime.now().strftime("%Y%m%d%H%M%S")
                }
                print("msg : ",msg)
                producer.send(topicName, json.dumps(msg).encode('ascii')).add_callback(self.on_send_success).add_errback(self.on_send_error)
                producer.flush()

                sleep_seconds = 1

                for i in range(sleep_seconds):
                    if not self.is_running:
                        break
                    time.sleep(1)
                cur += 1
            except KeyboardInterrupt:
                self.Log('Exception KeyboardInterrupt')
                self.is_running = False

    def stop_process(self):
        self.is_running = False


if __name__ == '__main__':
    file_logger = logging.getLogger("Kafka_Agent")
    file_logger.setLevel(logging.INFO)

    file_handler = handlers.RotatingFileHandler(
        "./log/KafakAgent.log",
        maxBytes=(1024 * 1024 * 1),
        backupCount=5
    )
    formatter = logging.Formatter('%(asctime)s %(name)s %(levelname)s %(message)s')
    file_handler.setFormatter(formatter)
    file_logger.addHandler(file_handler)

    app = KafkaAgent(logger=file_logger)
    app.run()
    app.stop_process()
