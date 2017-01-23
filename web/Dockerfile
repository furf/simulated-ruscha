FROM node:7.4.0

# Create app user `web`.
RUN useradd --user-group --create-home --shell /bin/false app
ENV HOME=/home/app

# Copy npm configuration for installing dependencies.
COPY package.json $HOME/web/
RUN chown -R app:app $HOME/*

# Install dependencies.
USER app
WORKDIR $HOME/web
RUN npm install

# Copy project contents.
USER root
COPY . $HOME/web
RUN chown -R app:app $HOME/*

# Start the development server
USER app
# CMD ["npm", "start"]
