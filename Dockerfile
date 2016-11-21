FROM nginx

ADD bin /bin
ADD api/conf /opt/landing-api
ADD start.sh /start.sh
RUN chmod +x /start.sh
# Adding files
ADD public /var/www
ADD nginx/landing.conf /etc/nginx/conf.d/default.conf

# Define working directory
WORKDIR /var/www

ENTRYPOINT ["/start.sh"]