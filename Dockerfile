# The base image supplies Chromium and Firefox, which is the awkward part of
# running browser tests in a container. Everything else comes from package.json,
# so the container and a local `npm test` resolve identical dependency versions.
FROM testcafe/testcafe:3.7.6


USER root

WORKDIR /tests
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts && npm cache clean --force
COPY . .
RUN npm run build:fixture

USER user

ENTRYPOINT ["npx", "testcafe"]
CMD ["chromium:headless", "theInternet/tests/*.js"]
