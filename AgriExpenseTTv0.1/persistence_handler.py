from app import mongo

import hashlib
import uuid


def hash_password(password):
    return password

def chech_password(entered_string, expected_string):
    return entered_string == expected_string

def insert_user(first_name, last_name, location, password):
    hashed_password = hash_password(password)
    user_obj = {'first_name': first_name, 'last_name': last_name, 'location' : location, 'password' : hashed_password}

