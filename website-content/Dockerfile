FROM alpine:3.13
ENV HUGO_VERSION=0.82.0
ENV HUGO_RELEASES=https://github.com/gohugoio/hugo/releases/download/
ENV HUGO_TARBALL=v${HUGO_VERSION}/hugo_${HUGO_VERSION}_Linux-64bit.tar.gz 
ENV HUGO_RELEASE_TARBALL=${HUGO_RELEASES}${HUGO_TARBALL}
RUN wget -O - $HUGO_RELEASE_TARBALL | tar -xz -C /tmp \
    && mkdir -p /usr/local/sbin \
    && mv /tmp/hugo /usr/local/sbin/hugo
