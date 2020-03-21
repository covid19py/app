FROM tiangolo/meinheld-gunicorn-flask:python3.7
COPY . /app/app
WORKDIR /app/app
ARG REACT_APP_GMAPS_API_KEY
ENV REACT_APP_GMAPS_API_KEY=$REACT_APP_GMAPS_API_KEY
RUN /bin/bash -c ./docker/build.sh
RUN /bin/bash -c ./docker/prepare-ui.sh
RUN pip install -r ./requirements.txt
