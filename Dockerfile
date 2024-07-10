# taken _mostly_ from the bun containerization guide
# https://bun.sh/guides/ecosystem/docker

# use alpine for small image footprint
FROM oven/bun:alpine AS base
WORKDIR /usr/src/app

# cache dependencies to speed up future builds
FROM base AS install
RUN mkdir -p /tmp/dev
COPY package.json bun.lockb /tmp/dev/
RUN cd /tmp/dev && bun install --frozen-lockfile

# build with --production flag to exclude dev deps
RUN mkdir -p /tmp/prod
COPY package.json bun.lockb /tmp/prod/
RUN cd /tmp/prod && bun install --frozen-lockfile --production

# copy node modules and non-ignored project files
# into our image
FROM base AS prerelease
COPY --from=install /tmp/dev/node_modules node_modules
COPY . .

# set production env (mostly a just-in-case for future mistakes)
# and run build cmd
ENV NODE_ENV=production
RUN bun run build

# copy production dependencies and source into image
FROM base AS release
COPY --from=install /tmp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/app .

# expose tcp port and start the app process
USER bun
EXPOSE 3000/tcp
ENTRYPOINT ["bun", "run", "build/index.js"]
