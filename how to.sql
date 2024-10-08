---------------------------------------------------------------------------
-- Practical SQL: A Beginner's Guide to Storytelling with Data, 2nd Edition
-- by Anthony DeBarros

-- Chapter 18 Code Examples
----------------------------------------------------------------------------


-- Connecting psql to a database on a local server

psql -d [database name] -U [username]
psql -d analysis -U postgres

-- Connecting psql to a database on a remote server

psql -d [database name] -U [username] -h [host name]
psql -d analysis -U postgres -h example.com

-- Changing user and database name

\c [database name] [user name]
\c test
\c test yourname

-- Format for password file (pgpass.conf on Windows; .pgpass on macOS/Linux)
hostname:port:database:username:password


-- Listing 18-1: Entering a single-line query in psql
-- Enter this at the psql prompt:

SELECT county_name FROM us_counties_pop_est_2019 ORDER BY county_name LIMIT 3;

-- Listing 18-2: Entering a multi-line query in psql
-- Type each line separately, followed by Enter

SELECT county_name
FROM us_counties_pop_est_2019
ORDER BY county_name
LIMIT 3;

-- Listing 18-3: Showing open parentheses in the psql prompt

CREATE TABLE wineries (
id bigint,
winery_name text
);

-- Listing 18-4: A query with scrolling results

SELECT county_name FROM us_counties_pop_est_2019 ORDER BY county_name;

-- Listings 18-5 and 18-6: Normal and expanded displays of results
-- Use \x to toggle expanded on/off

SELECT * FROM grades ORDER BY student_id, course_id;

-- Listing 18-7: Importing data using \copy

DELETE FROM state_regions;

\copy state_regions FROM 'C:\YourDirectory\state_regions.csv' WITH (FORMAT CSV, HEADER);


-- Listing 18-8: Importing data using psql with COPY

DELETE FROM state_regions;

psql -d analysis -U postgres -c "COPY state_regions FROM STDIN WITH (FORMAT CSV, HEADER);" < C:\YourDirectory\state_regions.csv


-- Listing 18-9: Saving query output to a file

-- Enter psql settings
\pset format csv

-- This will be the query
SELECT * FROM grades ORDER BY student_id, course_id;

-- Set psql to output results
-- Note that Windows users must supply forward slashes for
-- this command, which is opposite of normal use.
\o 'C:/YourDirectory/query_output.csv'

-- Run the query and output
SELECT * FROM grades ORDER BY student_id, course_id;


-- ADDITIONAL COMMAND LINE UTILITIES


-- createdb: Create a database named box_office

createdb -U postgres -e box_office

-- Loading shapefiles into PostgreSQL

-- For the US Census counties shapefile in Chapter 15:
shp2pgsql -I -s 4269 -W Latin1 tl_2019_us_county.shp us_counties_2019_shp | psql -d analysis -U postgres

-- For the Santa Fe roads and waterways shapfiles in Chapter 15:
shp2pgsql -I -s 4269 tl_2019_35049_roads.shp santafe_roads_2019 | psql -d analysis -U postgres
shp2pgsql -I -s 4269 tl_2019_35049_linearwater.shp santafe_linearwater_2019 | psql -d analysis -U postgres
