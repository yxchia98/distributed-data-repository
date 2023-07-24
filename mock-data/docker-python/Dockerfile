FROM --platform=linux/amd64 python:slim-bullseye

WORKDIR /app

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY . .

EXPOSE 8080/tcp
EXPOSE 8080/udp

CMD ["python3", "-m" , "dummy_requests.py"]
