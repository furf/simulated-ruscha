FROM node:7.4.0

# Create app user `api`.
RUN useradd --user-group --create-home --shell /bin/false app
ENV HOME=/home/app

# Copy npm configuration for installing dependencies.
COPY package.json $HOME/api/
RUN chown -R app:app $HOME/*

# Install dependencies.
USER app
WORKDIR $HOME/api
RUN npm install

# Copy project contents.
USER root
COPY . $HOME/api
RUN chown -R app:app $HOME/*

# Start the development server
USER app
# CMD ["npm", "start"]
