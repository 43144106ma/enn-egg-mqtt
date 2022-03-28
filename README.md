# enn-egg-mqtt

mqtt client based on mqtt for egg framework for ENN company

## Install

```bash
$ npm i enn-egg-mqtt --save
```

## Configuration

Change `${app_root}/config/plugin.js` to enable mqtt plugin:

```js
exports.emqtt = {
  enable: true,
  package: 'enn-egg-mqtt',
};
```

Configure mqtt information in `${app_root}/config/config.default.js`:

**Single Client**

```javascript
config.emqtt = {
  client: {
    host: 'mqtt://xxx.xxx.xxx.xxx',
    password: 'xxxxx',
    username: 'xxxxx',
    clientId: 'xxxxx',
    options: {
      keepalive: 60,
      protocolId: 'MQTT',
      protocolVersion: 4,
      clean: true,
      reconnectPeriod: 1000,
      connectTimeout: 30 * 1000,
      rejectUnauthorized: false,
      ...
    },
    msgMiddleware: [ 'xxxx' ],
  },
}
```

**Multi Clients**

```javascript
config.emqtt = {
  clients: {
    foo: {
      host: 'mqtt://xxx.xxx.xxx.xxx',
      password: 'xxxxx',
      username: 'xxxxx',
      clientId: 'xxxxx',
      options: {
        keepalive: 60,
        protocolId: 'MQTT',
        protocolVersion: 4,
        clean: true,
        reconnectPeriod: 1000,
        connectTimeout: 30 * 1000,
        rejectUnauthorized: false,
        ...
      },
      msgMiddleware: [ 'xxxx' ],
    },
    bar: {
      ...
    },
  }
}
```

See [mqtt API Documentation](https://github.com/mqttjs/MQTT.js) for all available options.

## Usage

In controller, you can use `app.emqtt` to get the mqtt instance, check [mqtt](https://github.com/mqttjs/MQTT.js) to see how to use.

```js
// app/router.js

module.exports = app => {
    const { router } = app;
    router.get('/', app.emqtt.controller.home.index);

    // mqtt_client,subscribe topic: a
    app.emqtt.route('a', app.mqtt.controller.home.index);
};

// app/mqtt/controller/home.js

module.exports = app => {
  return class HomeController extends app.Controller {
    async index() {
      /**
       * ctx.req = {
       *    topic: 'a',
       *    msg: 'xxxxxxxxxxxx',
       * }
       */ 
      // publish
      await this.app.emqtt.publish('topic1', 'msg123456', { qos: 0 });
    }
  };
};

// app/mqtt/middleware/msg2json.js
module.exports = () => {
  return async (ctx, next) => {
    try {
      console.log(
        ctx.helper.timeFormat(new Date()),
        `[MQTT-Topic: ${ctx.req.topic}] recieved`
      );
      ctx.req.message = JSON.parse(ctx.req.msg);
    } catch (err) {
      ctx.logger.error(err);
    }
    await next();
    console.log(
      ctx.helper.timeFormat(new Date()),
      `[MQTT-Topic: ${ctx.req.topic}] Response_Time: ${
        ctx.starttime ? Date.now() - ctx.starttime : 0
      }ms`
    );
  };
};

```

### Multi Clients

If your Configure with multi clients, you can use `app.emqtt.get(instanceName)` to get the specific mqtt instance and use it like above.

## Questions & Suggestions

Please open an issue [here](https://github.com/43144106ma/enn-egg-mqtt/issues).

## License

[MIT](LICENSE)
