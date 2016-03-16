FROM nginx

# Adding files
ADD public /var/www
ADD nginx/landing.conf /etc/nginx/conf.d/default.conf

# Define working directory
WORKDIR /var/www
