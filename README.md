# rythmus-assistant [<img src="https://github.com/chevalvert.png?size=100" align="right">](http://chevalvert.fr/)
**[Rythmus](https://github.com/chevalvert?q=rythmus)** mapping and configuration assistant

<br>

## **[Rythmus](https://github.com/chevalvert?q=rythmus)** ecosystem
- [`rythmus`](https://github.com/chevalvert/rythmus) : Rythmus main app
- `stratum-assistant` : Rythmus mapping and configuration assistant
- [`hemisphere-project/stratum-hnode#rythmus`](https://github.com/Hemisphere-Project/stratum-hnode/tree/rythmus) : leds UDP server & client
- [`rythmus-viewer`](https://github.com/chevalvert/rythmus-viewer) : Rythmus `hnode` 3D previewer
- [`rythmus-sensor`](https://github.com/chevalvert/rythmus-sensor) : Rythmus heart sensor firmware

## Installation
```sh
curl https://raw.githubusercontent.com/chevalvert/rythmus-assistant/master/scripts/install.sh | sudo bash
```

## Usage
```
rythmus-assistant

Usage:
  rythmus-assistant --standby --output=<path>
  rythmus-assistant --help
  rythmus-assistant --version

Options:
  -h, --help              Show this screen.
  -v, --version           Print the current version.
  --standby               Run in standby mode.
  --output=<path>         Set the destination of the mapping file.
  --viewer=<path>         Open rythmus-viewer as a previewer.

Standby Mode:
  In standby mode, rythmus-assistant will wait for user input before
  trying to connect to ryhmus.
  This is the preferred mode when run in production, as both rythmus-app
  and rythmus-assistant can run in parallel.

```
<sup>See [`.apprc`](.apprc) and the [`rc` package](https://github.com/dominictarr/rc#standards) for advanced options.</sup>

## Connection
To connect to Rythmus via UDP, use the following IPV4 config:
```
IP Address  : 192.168.0.200
Subnet Mask : 255.255.255.0
Router      : 192.168.0.1
```

## Development
```sh
git clone https://github.com/chevalvert/rythmus.git rythmus-assistant
cd rythmus-assistant
npm run install
```

###### Client
```sh
npm run start
```

###### Server
```sh
node server --standby --viewer=<path to rythmus-viewer applet>
```

## License
[MIT.](https://tldrlegal.com/license/mit-license)
