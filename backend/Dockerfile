FROM golang:1.21.2-alpine
RUN apk update && apk upgrade

WORKDIR /app/backend/

COPY . .
RUN go mod download

RUN GOOS=linux GOARCH=amd64 go build -o /app/backend/serve

CMD [ "/app/backend/serve" ]