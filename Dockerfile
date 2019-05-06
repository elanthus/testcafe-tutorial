FROM testcafe/testcafe:1.1.3

USER root
ENV NODE_PATH /opt/testcafe/node_modules
RUN  cd /opt/testcafe && \
  npm install -g testcafe-react-selectors@^3.1.0 && \
  npm install -g axe-testcafe@^1.1.0 && \
  npm install -g minimist@^1.2.0 && \
  npm link axe-testcafe && \
  npm link testcafe-react-selectors && \
  npm link minimist
USER user