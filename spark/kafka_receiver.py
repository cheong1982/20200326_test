# spark-submit --packages org.apache.spark:spark-streaming-kafka-assembly_2.10:1.6.3 kafka_receiver.py localhost:9092 FirstTopic
import sys
from pyspark import SparkContext
from pyspark.streaming import StreamingContext
from pyspark.streaming.kafka import KafkaUtils
from pymongo import MongoClient
import json




if __name__ == "__main__":
    sc = SparkContext(appName="PythonStreamingDirectKafkaWordCount")
    ssc = StreamingContext(sc, 1)
    brokers, topic = sys.argv[1:]
    kvs = KafkaUtils.createDirectStream(ssc, [topic],{"metadata.broker.list": brokers})


    def write_data(message):
        print("message : ", message)
        client = MongoClient('localhost', 27017)
        db = client['itrc_spark']
        collection = db.col_sensor
        obj = {
            "k_data": json.loads(message[1])
        }

        collection.insert(obj)
        print("obj : ",obj)

    def write_mongo(_,rdd):
        rdd.foreach(write_data)

    kvs.foreachRDD(write_mongo)
    # lines = kvs.map(write_mongo("-0.022	-0.039	-0.183	-0.054	-0.105	-0.134	-0.129	-0.142"))
    # lines.pprint()


    # lines.pprint()
    # counts = lines.flatMap(lambda line: line.split(",")) \
    #               .map(lambda word: (word, 1)) \
    #               .reduceByKey(lambda a, b: a+b)
    # counts.pprint()
    ssc.start()
    ssc.awaitTermination()
    client.close()
