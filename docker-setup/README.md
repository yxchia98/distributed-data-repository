## run docker containers

### react frontend container

docker run -p 50050:3000 -d --name ddr-react-frontend yxchia98/ddr-react-frontend

### data writer api container

docker run -p 50051:8080 -d --name ddr-data-writer yxchia98/ddr-data-writer

### data reader api container

docker run -p 50052:8081 -d --name ddr-data-reader yxchia98/ddr-data-reader
