# Copyright 2021 The KubeSphere Authors. All rights reserved.
# Use of this source code is governed by an Apache license
# that can be found in the LICENSE file.

# Prepare the build environment
FROM cr.loongnix.cn/library/node:12.19.1 as builder

ARG YARN_VERSION=1.22.4
ARG PROXY_ADDRESS


WORKDIR /kubesphere
ADD . /kubesphere/

#RUN apk add --no-cache --virtual .build-deps ca-certificates python2 python3 py3-pip make openssl g++ bash
RUN apt update && apt install git ca-certificates python2 python3 python3-pip make openssl g++ bash -y
#RUN npm install yarn@${YARN_VERSION}
ENV http_proxy $PROXY_ADDRESS
ENV https_proxy $PROXY_ADDRESS

# If you have trouble downloading the yarn binary, try the following:
# RUN yarn config set registry https://registry.npmmirror.com

RUN yarn config set proxy $PROXY_ADDRESS && yarn config set https-proxy $PROXY_ADDRESS
RUN yarn && yarn build

# Copy compiled files
RUN mkdir -p /out/server
RUN mv /kubesphere/dist/ /out/
RUN mv /kubesphere/server/locales \
       /kubesphere/server/public \
       /kubesphere/server/views \
       /kubesphere/server/sample \
       /kubesphere/server/config.yaml /out/server/
#RUN ["/bin/bash", "-c", "mv /kubesphere/server/{locales,public,sample,views,config.yaml} /out/server/"]
RUN mv /kubesphere/package.json /out/

##############
# Final Image
##############
FROM cr.loongnix.cn/library/alpine:3.11 as base_os_context

RUN apk add --no-cache nodejs npm

RUN adduser -D -g kubesphere -u 1002 kubesphere && \
    mkdir -p /opt/kubesphere/console && \
    chown -R kubesphere:kubesphere /opt/kubesphere/console

WORKDIR /opt/kubesphere/console
COPY --from=builder /out/ /opt/kubesphere/console/

RUN mv dist/server.js server/server.js
USER kubesphere

EXPOSE 8080

CMD ["npm", "run", "serve"]

