FROM abiosoft/caddy
COPY Caddyfile /etc/Caddyfile
COPY public /var/www/public
COPY bin /bin/
COPY production.yaml /etc/

COPY supervisord.conf /etc/supervisord.conf

RUN apk update && apk add supervisor
ENTRYPOINT ["/usr/bin/supervisord"]
