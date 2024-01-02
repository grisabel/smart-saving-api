# This file is generated by Nx.
#
# Build the docker image with `npx nx docker-build smart-savings-api`.
# Tip: Modify "docker-build" options in project.json to change docker build args.
#
# Run the container with `docker run -p 3000:3000 -t smart-savings-api`.
FROM docker.io/node:lts-alpine

ENV HOST=0.0.0.0
ENV PORT=3000

WORKDIR /app

RUN addgroup --system smart-savings-api && \
          adduser --system -G smart-savings-api smart-savings-api

COPY dist/smart-savings-api smart-savings-api
RUN chown -R smart-savings-api:smart-savings-api .

# You can remove this install step if you build with `--bundle` option.
# The bundled output will include external dependencies.
RUN npm --prefix smart-savings-api --omit=dev -f install

CMD [ "node", "smart-savings-api" ]
