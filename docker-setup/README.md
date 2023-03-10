## run docker containers

### react frontend container

docker run -p 3000:3000 -d --env-file .ddr-react-frontend-env --name ddr-react-frontend yxchia98/ddr-react-frontend

### data writer api container

docker run -p 8080:8080 -d --env-file .ddr-data-writer-env --name ddr-data-writer yxchia98/ddr-data-writer

### data reader api container

docker run -p 8081:8081 -d --env-file .ddr-data-reader-env --name ddr-data-reader yxchia98/ddr-data-reader
