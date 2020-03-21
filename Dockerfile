FROM tiangolo/meinheld-gunicorn-flask:python3.7
COPY . /app/app
WORKDIR /app/app
RUN /bin/bash -c ./docker/build.sh
RUN /bin/bash -c ./docker/prepare-ui.sh
RUN pip install -r ./requirements.txt
