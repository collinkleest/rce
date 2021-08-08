FROM golang:alpine
RUN mkdir /app
ADD . /app
WORKDIR /app
RUN go build main.go .
CMD ["/app/main"]