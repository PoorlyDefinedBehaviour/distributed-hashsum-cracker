## Using a distributed system to solve an embarrassingly parallel problem  

## This is an example of competing consumers

## Using

* RabbitMQ

# Make sure rabbitmq is available

## First Run
```sh
  sudo docker run -d --name amqp.cracker -p 5672:5672 rabbitmq
```

## Other runs
```sh
  sudo docker run -d --name amqp.cracker -p 5672:5672 rabbitmq
```
## Example 
```sh
  yarn start --max-key-length 4 --batch 100 --workers 2 --target 36c4536996ca5615dcf9911f068786dc --algo md5
```

## Options
```sh
  yarn start --max-key-length <int> --batch <int> --workers <int> --target <string> --algo <string>
```

<img src="https://i.imgur.com/Q1uSQDn.jpg"/>