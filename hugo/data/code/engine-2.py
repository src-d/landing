# import the source{d} engine
from sourced.engine import Engine
from pyspark.sql import SparkSession
from pyspark.sql.functions import *

# start a new session
spark = SparkSession.builder \
        .master("local[*]").appName("Examples") \
        .getOrCreate()

engine = Engine(spark, "/repositories")

# get all the files of all head commits
head_files = engine.repositories.filter("is_fork = false") \
             .references \
             .head_ref.commits.first_reference_commit \
             .files \
             .classify_languages() \
             .filter("is_binary = false") \
             .select("file_hash", "path", "content", "lang") \
             .filter("lang is not null")

# shows top languages per number of files
top_ten_langs = head_files.distinct() \
                .groupBy("lang").agg(count("*").alias("count")) \
                .orderBy("count").sort(desc("count")).limit(10) \
                .show()
