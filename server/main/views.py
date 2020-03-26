# -*- coding: utf-8 -*-
from main import app
from flask_restful import reqparse, Resource, Api

from .models import *
import platform
from flask import Flask, request
from flask import Response
import time
import hashlib
import base64
import json
import os
import logging
from logging import handlers
from sqlalchemy import or_, and_,sql
from datetime import datetime, timedelta
import traceback
import numpy as np
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import or_, and_
from sqlalchemy import ext

from configparser import ConfigParser
import csv
from werkzeug import secure_filename
import re
from flask_cors import CORS
import codecs
import glob
import sys
from pymongo import MongoClient

if sys.version_info[0] < 3:
    import urllib
else :
    import urllib.parse
# UPLOAD_FOLDER = '.\\'
ALLOWED_EXTENSIONS = set(['png'])
ALLOWED_EXTENSIONS2 = set(['jpg'])
ALLOWED_EXTENSIONS3 = set(['JPG'])
ALLOWED_EXTENSIONS4 = set(['PNG'])

ALLOWED_EXTENSIONS_EXCEL1 = set(['xlsx'])
ALLOWED_EXTENSIONS_EXCEL2 = set(['XLSX'])
ALLOWED_EXTENSIONS_TEXT = set(['txt'])
ALLOWED_EXTENSIONS_ZIP = set(['zip'])


def _decoding(encoding_string):
    if sys.version_info[0] < 3:
        return urllib.unquote(encoding_string)
    return urllib.parse.unquote(encoding_string)

def read_from_file(filename, section, required_props=None):
    config_parser = ConfigParser()
    print("config_parser : ", config_parser)
    config_parser.optionxform = str
    data = dict()

    try:
        data_set = config_parser.read(filename)
        print("data_set : ",data_set)
        if len(data_set) == 0:
            return None

        if section not in config_parser.sections():
            return dict()

        for k, v in config_parser.items(section):
            data[k] = v

        return data

    except:
        print("read_from_file Open  file failed ")
        return None

config = None
config = read_from_file('./config.ini', 'INFO')
DB_INFO = config['DB_INFO'].replace("\"","")

UPLOAD_FOLDER = config['UPLOAD_FOLDER'].replace("\"","")
UPLOAD_EXCEL_FOLDER = config['UPLOAD_EXCEL_FOLDER'].replace("\"","")
TEMPLATE_EXCEL_FOLDER = config['TEMPLATE_EXCEL_FOLDER'].replace("\"","")

PRINT_LOG = True

print ("DB_INFO : " + DB_INFO)
print ("UPLOAD_FOLDER : " + UPLOAD_FOLDER)

app.config['SQLALCHEMY_DATABASE_URI'] = DB_INFO

db.init_app(app)

var_cros_v1 = {'Content-Type', 'token', 'If-Modified-Since', 'Cache-Control', 'Pragma'}
CORS(app, resources=r'/api/*', headers=var_cros_v1)

# Multilanguages
import sys

#
# reload(sys)
# sys.setdefaultencoding('utf-8')
# --------------------------------------------------------------------------------------------------------------------
#                                            Static Area
# --------------------------------------------------------------------------------------------------------------------
DAEMON_HEADERS = {'Content-type': 'application/json'}

g_platform = platform.system()

if g_platform == "Linux":
    LOG_DEFAULT_DIR = './log'
elif g_platform == "Windows":
    LOG_DEFAULT_DIR = '.'
elif g_platform == "Darwin":
    LOG_DEFAULT_DIR = '.'


# --------------------------------------------------------------------------------------------------------------------
#                                            Function Area
# --------------------------------------------------------------------------------------------------------------------

def result(code, notice, objects, meta, author):
    """
    html status code def
    [ 200 ] - OK
    [ 400 ] - Bad Request
    [ 401 ] - Unauthorized
    [ 404 ] - Not Found
    [ 500 ] - Internal Server Error
    [ 503 ] - Service Unavailable
    - by thingscare
    """
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'

    if author is None:
        author = "by sisung"

    result = {
        "status": code,
        "notice": notice,
        "author": author
    }

    log_bySisung = ''

    # [ Check ] Objects
    if objects is not None:
        result["objects"] = objects

    # [ Check ] Meta
    if meta is not None:
        result["meta"] = meta

    if code == 200:
        result["message"] = "OK"
        log_bySisung = OKBLUE
    elif code == 400:
        result["message"] = "Bad Request"
        log_bySisung = FAIL
    elif code == 401:
        result["message"] = "Unauthorized"
        log_bySisung = WARNING
    elif code == 404:
        result["message"] = "Not Found"
        log_bySisung = FAIL
    elif code == 500:
        result["message"] = "Internal Server Error"
        log_bySisung = FAIL
    elif code == 503:
        result["message"] = "Service Unavailable"
        log_bySisung = WARNING

    # log_bySisung = log_bySisung + 'RES : [' + str(code) + '] ' + str(notice) + ENDC
    # print log_bySisung
    return result


# --------------------------------------------------------------------------------------------------------------------
#                                            Class Area
# --------------------------------------------------------------------------------------------------------------------
class Helper(object):
    @staticmethod
    def get_file_logger(app_name, filename):
        log_dir_path = LOG_DEFAULT_DIR
        try:
            if not os.path.exists(log_dir_path):
                os.mkdir(log_dir_path)

            full_path = '%s/%s' % (log_dir_path, filename)
            file_logger = logging.getLogger(app_name)
            file_logger.setLevel(logging.INFO)

            file_handler = handlers.RotatingFileHandler(
                full_path,
                maxBytes=(1024 * 1024 * 10),
                backupCount=5
            )
            formatter = logging.Formatter('%(asctime)s %(message)s')

            file_handler.setFormatter(formatter)
            file_logger.addHandler(file_handler)

            return file_logger

        except :
            return logging.getLogger(app_name)

exception_logger = Helper.get_file_logger("exception", "exception.log")
service_logger = Helper.get_file_logger("service", "service.log")


def Log(msg) :
    try :
        if PRINT_LOG == True :
            print(msg)
        service_logger.info(msg)
    except :
        print("log exception!!")

@app.errorhandler(500)
def internal_error(exception):
    exception_logger.info(traceback.format_exc())
    return 500


@app.errorhandler(404)
def internal_error(exception):
    exception_logger.info(traceback.format_exc())
    return 404


# Singleton Source from http://stackoverflow.com/questions/42558/python-and-the-singleton-pattern
class Singleton:
    """
    A non-thread-safe helper class to ease implementing singletons.
    This should be used as a decorator -- not a metaclass -- to the
    class that should be a singleton.

    The decorated class can define one `__init__` function that
    takes only the `self` argument. Other than that, there are
    no restrictions that apply to the decorated class.

    To get the singleton instance, use the `Instance` method. Trying
    to use `__call__` will result in a `TypeError` being raised.

    Limitations: The decorated class cannot be inherited from.
    """

    def __init__(self, decorated):
        self._decorated = decorated

    def instance(self):
        """
        Returns the singleton instance. Upon its first call, it creates a
        new instance of the decorated class and calls its `__init__` method.
        On all subsequent calls, the already created instance is returned.

        """
        try:
            return self._instance
        except AttributeError:
            self._instance = self._decorated()
            return self._instance

    def __call__(self):
        raise TypeError('Singletons must be accessed through `Instance()`.')

    def __instancecheck__(self, inst):
        return isinstance(inst, self._decorated)


@Singleton
class TokenManager(object):
    def generate_token(self, user_id):
        m = hashlib.sha1()
        print("user_id : ", user_id)
        m.update(user_id.encode('utf-8'))
        m.update(datetime.now().isoformat().encode('utf-8'))
        return m.hexdigest()

    def validate_token(self, token):
        token_result = TB_LOGIN_USER.query.filter_by(token=token).first()

        if token_result is None:
            return ""
        return token_result.user_id

@app.route('/')
class Login(Resource):
    """
    [ Login ]
    For Mobile Auth
    @ GET : Returns Result
    by sisung
    """

    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument("userID", type=str, location="json")
        self.parser.add_argument("userPW", type=str, location="json")

        self.token_manager = TokenManager.instance()

        self.user_id = self.parser.parse_args()["userID"]
        self.user_password = self.parser.parse_args()["userPW"]
        super(Login, self).__init__()

    def get(self):
        user = TB_LOGIN_USER.query.filter_by(user_id=self.user_id).first()
        if user is not None :
            obj= {
                'user_name' :user.user_name,
                'user_phone': user.user_phone
            }
            return result(200, "Login successful.", obj, None, "by sisung ")
        return result(402, "get user failed.", None, None, "by sisung ")

    def post(self):
        # try:
        objects = []
        Log("[LOGIN START...]")
        query = "SELECT id FROM %(table_name)s WHERE user_id='%(ID)s' AND user_password=password('%(PW)s')" % {
            "table_name": TB_LOGIN_USER.__tablename__,
            "ID": self.user_id,
            "PW": self.user_password
        }
        print("query : " + str(query))
        login_user = TB_LOGIN_USER.query.from_statement(sql.text(query))

        if login_user is not None:
            update_token = self.token_manager.generate_token(self.user_id)
            print("update_token : ",update_token)
            token_input = {
                "token":update_token
            }
            print("token obj : ",token_input)
            db.session.query(TB_LOGIN_USER).filter_by(user_id=self.user_id).update(token_input)
            print("token updated..")
            db.session.commit()


            user = TB_LOGIN_USER.query.filter_by(user_id=self.user_id).first()

            # new_access = TB_ACCESS_HISTORY()
            # new_access.user_id = user.user_id
            # new_access.user_name = user.user_name
            # new_access.f_election_id = user.f_election_id
            # new_access.access_type = 1
            # new_access.last_updated_date = datetime.now()
            # db.session.add(new_access)
            # db.session.commit()

            #
            election_name = ''
            election_code = ''
            election_id = -1
            # if user.user_right == 1 :
            #     election = TB_ELECTION.query.filter_by(active=1).first()
            # else :
            #     election = TB_ELECTION.query.filter_by(id=user.f_election_id).first()
            # if election is not None :
            #     election_name = election.election_name
            #     election_code = election.election_code
            #     election_id = election.id
            right_codes = ''
            # right_group = TB_RIGHT_GROUP.query.filter_by(id=user.f_right_group_id).first()
            # if right_group is not None :
            #     right_codes = right_group.right_codes
            #     print("right_codes :",right_codes)
            #     if datetime.now() < election.election_start_date or datetime.now() > election.election_end_date :
            #         print("election date invalid")
            #         if user.user_right != 1 and str(right_codes).find('RIGHT_ELECTION_DATE') == -1 :
            #             print("access deny(election date)")
            #             objects.append({
            #                 'login': False,
            #                 'err_code':101
            #             })
            #             return result(402, "Login failed.", objects, None, "by sisung")
            objects.append({
                'id':user.id,
                'login': True,
                'user_id': self.user_id,
                'user_name': user.user_name,
                'user_phone': user.user_phone,
                'userOTP': False,
                'token': update_token,
                'user_right':user.user_right,
                'f_election_id':user.f_election_id,
                'election_name':election_name,
                'election_id': election_id,
                'election_code': election_code,
                'right_codes':right_codes,
                'election_group_type':''
            })
            Log("[Login SUCCESS]")
            return result(200, "Login successful.", objects, None, "by sisung ")
        else:
            objects.append({
                'login': False,
                'err_code': 100
            })
        # except :
        #     Log("[Login exception]")
        #     return result(400, "Login exception ", None, None, "by sisung ")
        return result(400, "Login failed.", objects, None, "by sisung")

def json_encoder(thing):
    list_date = str(thing).split(":")

    if hasattr(thing, 'isoformat'):
        if len(list_date[0]) == 1:
            return "0" + thing.isoformat()
        return thing.isoformat()
    else:
        if len(list_date[0]) == 1:
            return "0" + str(thing)
        return str(thing)


class GroupTree(Resource):
    """
    [ RequestLGroupTree ]
    For Mobile Auth
    @ GET : Returns Result
    by sisung
    """

    def __init__(self):

        self.parser = reqparse.RequestParser()
        self.token_manager = TokenManager.instance()
        self.parser.add_argument("token", type=str, location="headers")
        self.userID = self.token_manager.validate_token(self.parser.parse_args()["token"])
        if self.userID == '':
            self.isValidToken = False
            return;
        super(GroupTree, self).__init__()

    def get(self):
        level =  int(request.args.get('level'))
        f_election_id = request.args.get('f_election_id')
        group_name_1 = request.args.get('group_name_1')
        group_name_2 = request.args.get('group_name_2')
        group_name_3 = request.args.get('group_name_3')
        print("f_election_id ",f_election_id,"level : ", str(level), ",group_name_1 : ", group_name_1,",group_name_2 : ",group_name_2, ",group_name_3 : ", group_name_3)
        try:
            if level == 0 :
                print("level is 0")
                group_results = TB_GROUP.query.group_by(TB_GROUP.group_name_1).order_by(TB_GROUP.pid).all()
                print("111 :" + self.userID)
                login_user = TB_LOGIN_USER.query.filter_by(user_id=self.userID).first()
                objects = [{
                               "group_name": group.group_name_1,
                               "level":level
                           } for group in group_results]
                objects = [{
                                   "group_name": group.group_name_1,
                                   "level":level
                               } for group in group_results]
            elif level == 1 :
                group_results = TB_GROUP.query.filter_by(group_name_1=group_name_1).group_by(TB_GROUP.group_name_2).order_by(TB_GROUP.pid).all()
                objects = [{
                               "group_name": group.group_name_2,
                               "level": level
                           } for group in group_results]
            elif level == 2:
                group_results = TB_GROUP.query.filter_by(group_name_1=group_name_1).filter_by(group_name_2=group_name_2).group_by(TB_GROUP.group_name_3).order_by(
                    TB_GROUP.pid).all()
                objects = [{
                    "group_name": group.group_name_4,
                    "level": level,
                    "p_code": group.p_code,
                    "select":False
                } for group in group_results]
            elif level == 3:
                group_results = TB_GROUP.query.filter_by(group_name_1=group_name_1).filter_by(group_name_2=group_name_2).filter_by(group_name_3=group_name_3).group_by(TB_GROUP.group_name_4).order_by(
                    TB_GROUP.pid).all()
                objects = [{
                    "group_name": group.group_name_4,
                    "level": level,
                    "p_code" : group.p_code
                } for group in group_results]
                # print("objects : " + str(objects))
        except:
            Log("GroupTree db Error!!! exception")
            return result(200, "GroupTree db Error!!!", None, None, "by sisung ")
        return result(200, "GroupTree successful!!!", objects, None, "by sisung ")

class ReportGraph(Resource):
    """
    [ Config ]
    For Mobile Auth
    @ GET : Returns Result
    by sisung
    """

    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.token_manager = TokenManager.instance()
        self.parser.add_argument("token", type=str, location="headers")
        print("init")
        super(ReportGraph, self).__init__()

    def get(self):
        first_check = int(request.args.get('first'))
        p_code =request.args.get('p_code')
        print("first : ", first_check,", p_code : ",p_code)
        client = MongoClient('mongodb://localhost:27017/')
        db = client.itrc_spark
        collection = db.col_sensor
        if first_check == 1 :
            result_list = collection.find({"k_data.p_code":p_code}).sort("k_data.time",-1).limit(100)
        else :
            result_list = collection.find({"k_data.p_code":p_code}).sort("k_data.time", -1).limit(1)
        sensor_1_1 = []
        sensor_1_2 = []
        sensor_2_1 = []
        sensor_2_2 = []
        sensor_3_1 = []
        sensor_3_2 = []
        sensor_4_1 = []
        sensor_4_2 = []
        for data in result_list :
            sensor_1_1.append(float(data['k_data']['S_1_1']))
            sensor_1_2.append(float(data['k_data']['S_1_2']))
            sensor_2_1.append(float(data['k_data']['S_2_1']))
            sensor_2_2.append(float(data['k_data']['S_2_2']))
            sensor_3_1.append(float(data['k_data']['S_3_1']))
            sensor_3_2.append(float(data['k_data']['S_3_2']))
            sensor_4_1.append(float(data['k_data']['S_4_1']))
            sensor_4_2.append(float(data['k_data']['S_4_2']))
        object = {
            "sensor_1_1": sensor_1_1,
            "sensor_1_2": sensor_1_2,
            "sensor_2_1": sensor_2_1,
            "sensor_2_2": sensor_2_2,
            "sensor_3_1": sensor_3_1,
            "sensor_3_2": sensor_3_2,
            "sensor_4_1": sensor_4_1,
            "sensor_4_2": sensor_4_2,
        }
        # print("object :", object)
        client.close()
        return result(200, "ReportGraph successful", [object], None, "by sisung ")


class SensorDataToDb(Resource):
    """
    [ SensorDataToDb ]
    For Mobile Auth
    @ GET : Returns Result
    by sisung
    """

    def __init__(self):
        self.parser = reqparse.RequestParser()
        print("SensorDataToDb init")
        self.parser.add_argument("id", type=str, location="json")
        self.parser.add_argument("fail_code", type=str, location="json")
        self.parser.add_argument("fail_type", type=str, location="json")
        self.parser.add_argument("fail_name", type=str, location="json")

        self.token_manager = TokenManager.instance()
        self.id = self.parser.parse_args()["id"]
        self.fail_code = self.parser.parse_args()["fail_code"]
        self.fail_type = self.parser.parse_args()["fail_type"]
        self.fail_name = self.parser.parse_args()["fail_name"]
        super(SensorDataToDb, self).__init__()

    def put(self):
        print("SensorDataToDb start")
        input = self.parser.parse_args()
        print("input : ",input)
        return result(400, "SensorDataToDb update failed.", None, None, "by sisung ")

    def add_sensor_data(self,bearing_num,label,path):
        file_list = [f for f in glob.glob(path)]
        for file_ in sorted(file_list):
            print("file_ :",file_)
            f = codecs.open(file_, encoding='utf-8')

            for line in f:
                line_array = line.replace('\r\n','').split('\t')
                # print("line_array[0] : ",line_array[0])
                # print("line_array[1] : ", line_array[1])
                # print("bearing_num * 2-2 :",bearing_num * 2-2)
                # print("bearing_num * 2-1 :", bearing_num * 2 - 1)
                new_data = TB_SENSOR_DATA()
                new_data.bearing_num = bearing_num
                new_data.label = label
                new_data.value1 = float(line_array[bearing_num * 2-2])
                new_data.value2 = float(line_array[bearing_num * 2-1])
                new_data.data_date = os.path.basename(file_)
                db.session.add(new_data)
            db.session.commit()
    def post(self):
        print("SensorDataToDb post start")
        input = self.parser.parse_args()
        print("input : ",input)
        self.add_sensor_data(1,0,"D:\\project\\snorkel\\data\\1st_fail\\bearing1\\*")
        self.add_sensor_data(1,1, "D:\\project\\snorkel\\data\\1st_succ\\bearing1\\*")
        self.add_sensor_data(2,0,"D:\\project\\snorkel\\data\\1st_fail\\bearing2\\*")
        self.add_sensor_data(2,1, "D:\\project\\snorkel\\data\\1st_succ\\bearing2\\*")
        self.add_sensor_data(3,0,"D:\\project\\snorkel\\data\\1st_fail\\bearing3\\*")
        self.add_sensor_data(3,1, "D:\\project\\snorkel\\data\\1st_succ\\bearing3\\*")
        self.add_sensor_data(4,0,"D:\\project\\snorkel\\data\\1st_fail\\bearing4\\*")
        self.add_sensor_data(4,1, "D:\\project\\snorkel\\data\\1st_succ\\bearing4\\*")
        return result(200, "SensorDataToDb type Add successful.", None, None, "by sisung ")

    def delete(self):

        return result(400, "SensorDataToDb type delete failed", None, None, "by sisung ")

    def get(self):
        print("SensorDataToDb type get start")
        input = self.parser.parse_args()
        return result(200, "SensorDataToDb successful.", None, None, "by sisung ")

api = Api(app)

# Basic URI
# 서버 alive 체크
# 로그인

api.add_resource(Login, '/api/Login')
api.add_resource(ReportGraph, '/api/ReportGraph')
api.add_resource(GroupTree, '/api/GroupTree')
api.add_resource(SensorDataToDb, '/api/SensorDataToDb')

#깃허브 테스트