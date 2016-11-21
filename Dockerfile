FROM nginx

ADD bin /bin
ADD api/conf /opt/landing-api
# Adding files
ADD public /var/www
ADD nginx/landing.conf /etc/nginx/conf.d/default.conf

# Define working directory
WORKDIR /var/www

CMD ["api", "-config=/opt/landing-api/prod.yml"]
