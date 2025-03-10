FROM node:18

# create destination directory
RUN mkdir -p /usr/src/nuxt-app
WORKDIR /usr/src/nuxt-app

# update and install dependency
RUN apt update



# copy the app, note .dockerignore
COPY . /usr/src/nuxt-app/
RUN npm config set "@fortawesome:registry" https://npm.fontawesome.com/
RUN npm config set "//npm.fontawesome.com/:_authToken" E48CE1F5-2BFA-451E-B172-84CE3960200F
RUN npm install --global yarn --force
RUN yarn install
# RUN npm cache clean
RUN npm install -g npm
RUN npm install --force


# it builds
RUN yarn run build
# expose 3000 on container
EXPOSE 3000

# set app serving to permissive / assigned
ENV NUXT_HOST=0.0.0.0
# set app port
ENV NUXT_PORT=3000

# start the app
CMD [ "yarn", "start" ]
