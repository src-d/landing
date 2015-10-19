FROM tyba/nginx

# Download and install hugo
ENV HUGO_VERSION 0.14
ENV HUGO_BINARY hugo_${HUGO_VERSION}_linux_amd64

ADD https://github.com/spf13/hugo/releases/download/v${HUGO_VERSION}/${HUGO_BINARY}.tar.gz /usr/local/
RUN tar xzf /usr/local/${HUGO_BINARY}.tar.gz -C /usr/local/ \
	&& ln -s /usr/local/${HUGO_BINARY}/${HUGO_BINARY} /usr/local/bin/hugo \
	&& rm /usr/local/${HUGO_BINARY}.tar.gz

WORKDIR /tmp/

RUN git clone git@github.com:src-d/landing.git
RUN cd landing && make build \
  && mv public/* /var/www
RUN cp nginx/landing.conf /etc/nginx/sites-enabled/nginx-site.conf

# Create working directory
WORKDIR /var/www

CMD ["/usr/sbin/nginx"]