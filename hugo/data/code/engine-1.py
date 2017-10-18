# import the source{d} engine
from sourced.spark import API as Engine
from pyspark.sql import SparkSession
from pyspark.sql.functions import *

# start a new session
spark = SparkSession.builder \
        .master("local[*]").appName("Examples") \
        .getOrCreate()

engine = Engine(spark, "/repositories")

# get identifiers of all Python files
idents = engine.repositories.filter("is_fork = false") \
         .references \
         .head_ref.commits.first_reference_commit \
         .files \
         .classify_languages() \
         .extract_uasts() \
         .query_uast('//*[@roleIdentifier and not(@roleIncomplete)]') \
         .filter("is_binary = false") \
         .filter("lang = 'Python'") \
         .select("file_hash", "result").distinct()

# get and show the tokens from the identifiers
tokens = idents.extract_tokens()
tokens.limit(10).show()
