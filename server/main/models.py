from flask import Flask
from flask_sqlalchemy import SQLAlchemy

__author__ = 'sisung'
# -*- coding: utf-8 -*-

db = SQLAlchemy()

DB_NAME = 'itrc_sensor'


class TB_GROUP(db.Model):
    __tablename__ = 'tb_group'
    __table_args__ = {
        'schema': DB_NAME
    }
    pid = db.Column('pid', db.Integer, primary_key=True)
    p_code = db.Column('p_code', db.String(50))
    group_name_1 = db.Column('group_name_1', db.String(50))
    group_name_2 = db.Column('group_name_2', db.String(50))
    group_name_3 = db.Column('group_name_3', db.String(50))
    group_name_4 = db.Column('group_name_4', db.String(100))
    f_election_id= db.Column('f_election_id', db.Integer)
    count = db.Column('count', db.Integer)

class TB_LOGIN_USER(db.Model):
    __tablename__ = 'tb_login_user'
    __table_args__ = {
        'schema': DB_NAME
    }
    id = db.Column('id', db.Integer, primary_key=True)
    user_id = db.Column('user_id', db.String(50))
    user_name = db.Column('user_name', db.String(50))
    user_password = db.Column('user_password', db.String(50))
    user_phone = db.Column('user_phone', db.String(50))
    user_status = db.Column('user_status', db.String(50))
    user_right = db.Column('user_right', db.Integer)
    token = db.Column('token', db.String(256))
    location = db.Column('location', db.String(256))
    f_right_group_id  = db.Column('f_right_group_id', db.Integer)
    f_election_id = db.Column('f_election_id', db.Integer)
    f_area_id = db.Column('f_area_id', db.Integer)


class TB_SENSOR_DATA(db.Model):
    __tablename__ = 'tb_sensor_data'
    __table_args__ = {
        'schema': DB_NAME
    }
    idx = db.Column('idx', db.Integer, primary_key=True)
    bearing_num = db.Column('bearing_num', db.Integer)
    label = db.Column('label', db.Integer)
    value1 = db.Column('value1', db.Float)
    value2 = db.Column('value2', db.Float)
    data_date = db.Column('data_date', db.String(50))
##########################################################################3333

