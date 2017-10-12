# import the source{d} API
from sourced.spark import API as SparkAPI
from pyspark.sql import SparkSession
from pyspark.sql.functions import *

# start a new session
spark = SparkSession.builder \
.master("local[*]").appName("Examples") \
.getOrCreate()

api = SparkAPI(spark, "/repositories")

# get all the files of all head commits
head_files = api.repositories.filter("is_fork = false").references \
.head_ref.commits.filter("index = 0") \
.files \
.classify_languages() \
.filter("is_binary = false") \
.select("lang","file_hash").filter("lang is not null").cache()
